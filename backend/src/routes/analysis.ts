import { Router, Response } from 'express';
import multer from 'multer';
import { z } from 'zod';
import prisma from '../db';
import { extractTextFromPdf } from '../services/pdf';
import { analyzeResume } from '../services/ai';
import { optionalAuthenticateToken, authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported.') as any, false);
    }
  },
});

// Zod schema for input validation
const analyzeBodySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Job role is required'),
  description: z.string().min(1, 'Job description is required'),
  salary: z.string().optional(),
});

// POST /api/analyze
// Accepts multipart form-data: file (PDF resume) and companyName, role, description, salary fields
router.post(
  '/analyze',
  optionalAuthenticateToken as any,
  upload.single('resume'),
  async (req: AuthRequest, res: Response) => {
    try {
      // Validate file existence
      if (!req.file) {
        return res.status(400).json({ error: 'Please upload a resume in PDF format.' });
      }

      // Validate other fields
      const data = analyzeBodySchema.parse(req.body);
      const salary = data.salary && data.salary.trim() !== '' ? data.salary : 'Negotiable';

      // 1. Extract text from PDF in-memory
      const resumeText = await extractTextFromPdf(req.file.buffer);

      if (!resumeText.trim()) {
        return res.status(400).json({ error: 'Could not extract text from the PDF. Ensure it contains selectable text.' });
      }

      // 2. Cross-validate and generate AI Analysis (OpenAI or mock fallback)
      const analysisData = await analyzeResume(
        resumeText,
        data.companyName,
        data.role,
        data.description,
        salary
      );

      let savedRecordId: string | null = null;

      // 3. Store data in database if the user is logged in
      if (req.user) {
        const userId = req.user.id;

        // Perform transactional write to maintain normalized schema
        const junction = await prisma.$transaction(async (tx) => {
          // Create job description
          const jobDescription = await tx.jobDescription.create({
            data: {
              companyName: data.companyName,
              role: data.role,
              description: data.description,
              salary,
            },
          });

          // Create analysis
          const analysis = await tx.analysis.create({
            data: {
              overallScore: analysisData.overallScore,
              atsScore: analysisData.atsScore,
              skillsScore: analysisData.skillsScore,
              structureScore: analysisData.structureScore,
              styleScore: analysisData.styleScore,
              analysisResult: analysisData.analysisResult as any,
            },
          });

          // Create junction relation
          return tx.userJobAnalysis.create({
            data: {
              userId,
              jobDescriptionId: jobDescription.id,
              analysisId: analysis.id,
            },
          });
        });

        savedRecordId = junction.id;
      }

      // 4. Return results
      return res.json({
        ...analysisData,
        savedRecordId,
        isGuest: !req.user,
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      console.error('Analysis endpoint error:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
  }
);

// GET /api/analyses
// Returns history list for the logged-in user
router.get(
  '/analyses',
  authenticateToken as any,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = req.user.id;

      const userAnalyses = await prisma.userJobAnalysis.findMany({
        where: { userId },
        include: {
          jobDescription: true,
          analysis: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.json({
        history: userAnalyses.map((item) => ({
          id: item.id,
          createdAt: item.createdAt,
          jobDescription: {
            company: item.jobDescription.companyName,
            role: item.jobDescription.role,
            salary: item.jobDescription.salary,
          },
          analysis: {
            overallScore: item.analysis.overallScore,
            atsScore: item.analysis.atsScore,
            skillsScore: item.analysis.skillsScore,
            structureScore: item.analysis.structureScore,
            styleScore: item.analysis.styleScore,
          },
        })),
      });

    } catch (error) {
      console.error('Get history error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/analyses/:id
// Returns detailed data of a single past analysis
router.get(
  '/analyses/:id',
  authenticateToken as any,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const userId = req.user.id;

      const record = await prisma.userJobAnalysis.findUnique({
        where: { id },
        include: {
          jobDescription: true,
          analysis: true,
        },
      });

      if (!record) {
        return res.status(404).json({ error: 'Analysis record not found' });
      }

      // Check ownership
      if (record.userId !== userId) {
        return res.status(403).json({ error: 'Access denied to this record' });
      }

      return res.json({
        id: record.id,
        createdAt: record.createdAt,
        jobDescription: {
          company: record.jobDescription.companyName,
          role: record.jobDescription.role,
          description: record.jobDescription.description,
          salary: record.jobDescription.salary,
        },
        analysis: {
          overallScore: record.analysis.overallScore,
          atsScore: record.analysis.atsScore,
          skillsScore: record.analysis.skillsScore,
          structureScore: record.analysis.structureScore,
          styleScore: record.analysis.styleScore,
          analysisResult: record.analysis.analysisResult,
        },
      });

    } catch (error) {
      console.error('Get single analysis error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
