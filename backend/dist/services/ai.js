"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeResume = exports.analysisResponseSchema = void 0;
const openai_1 = __importDefault(require("openai"));
const zod_1 = require("zod");
// Zod schema for response validation
exports.analysisResponseSchema = zod_1.z.object({
    overallScore: zod_1.z.number().min(0).max(100),
    atsScore: zod_1.z.number().min(0).max(100),
    skillsScore: zod_1.z.number().min(0).max(100),
    structureScore: zod_1.z.number().min(0).max(100),
    styleScore: zod_1.z.number().min(0).max(100),
    analysisResult: zod_1.z.object({
        overall: zod_1.z.object({
            summary: zod_1.z.string(),
            features: zod_1.z.array(zod_1.z.object({
                name: zod_1.z.string(),
                status: zod_1.z.enum(['met', 'needs_improvement']),
                feedback: zod_1.z.string()
            }))
        }),
        ats: zod_1.z.object({
            summary: zod_1.z.string(),
            features: zod_1.z.array(zod_1.z.object({
                name: zod_1.z.string(),
                status: zod_1.z.enum(['met', 'needs_improvement']),
                feedback: zod_1.z.string()
            }))
        }),
        skills: zod_1.z.object({
            summary: zod_1.z.string(),
            features: zod_1.z.array(zod_1.z.object({
                name: zod_1.z.string(),
                status: zod_1.z.enum(['met', 'needs_improvement']),
                feedback: zod_1.z.string()
            }))
        }),
        structure: zod_1.z.object({
            summary: zod_1.z.string(),
            features: zod_1.z.array(zod_1.z.object({
                name: zod_1.z.string(),
                status: zod_1.z.enum(['met', 'needs_improvement']),
                feedback: zod_1.z.string()
            }))
        }),
        style: zod_1.z.object({
            summary: zod_1.z.string(),
            features: zod_1.z.array(zod_1.z.object({
                name: zod_1.z.string(),
                status: zod_1.z.enum(['met', 'needs_improvement']),
                feedback: zod_1.z.string()
            }))
        })
    })
});
// Initialize OpenAI client configured for OpenRouter
const getOpenAIClient = () => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your-openrouter-api-key-here' || apiKey.startsWith('your-')) {
        throw new Error('OPENROUTER_API_KEY is not configured or is a placeholder in backend/.env.');
    }
    return new openai_1.default({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey,
    });
};
// Robust helper to clean and parse JSON, handling potential markdown markers
function cleanAndParseJson(text) {
    let cleaned = text.trim();
    // Try to find a JSON block wrapped in triple backticks: ```json ... ```
    const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
    const match = cleaned.match(markdownRegex);
    if (match && match[1]) {
        cleaned = match[1].trim();
    }
    // Fallback: search for first '{' and last '}' to extract raw JSON object
    try {
        return JSON.parse(cleaned);
    }
    catch (err) {
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const jsonCandidate = cleaned.substring(firstBrace, lastBrace + 1);
            return JSON.parse(jsonCandidate);
        }
        throw err;
    }
}
const analyzeResume = async (resumeText, company, role, description, salary) => {
    const client = getOpenAIClient();
    const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free';
    const systemPrompt = `You are an expert recruitment consultant and ATS (Applicant Tracking System) optimizer.
Your goal is to cross-validate a candidate's resume/CV text against a specific job role and description.
Give a rigorous evaluation of how relevant their profile is, what are their strong points, what are their lackings (skills or work experience the job requires but their profile is missing), and how to improve.

Provide detailed score breakdown and analysis for these 5 categories:
1. Overall: overall fit, experience duration, educational alignment, role relevance, activity.
2. ATS Score: ATS friendliness (repeating words/verbs, grammatical correctness, irrelevant keywords, column layout issues, etc.).
3. Skills: core technologies matching, language proficiency, database operations, styling frameworks, backend/frontend capabilities.
4. Structure: section headings, chronological ordering, margins/grid, contact detail prominence.
5. Style: action-oriented verbs, professional tone, conciseness, quantifiable results/metrics, consistent formatting.

For each of these 5 categories, you MUST check exactly 5 to 6 specific core features/goals to match, and provide their status (met or needs_improvement) and feedback.

You MUST respond strictly in the following JSON format with NO other text or markdown:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "skillsScore": number (0-100),
  "structureScore": number (0-100),
  "styleScore": number (0-100),
  "analysisResult": {
    "overall": {
      "summary": "overall category summary text",
      "features": [
        { "name": "Feature Name (e.g. Role Relevance)", "status": "met" or "needs_improvement", "feedback": "detailed advice" }
      ]
    },
    "ats": {
      "summary": "ats category summary text",
      "features": [
        { "name": "Feature Name (e.g. Keyword Optimization)", "status": "met" or "needs_improvement", "feedback": "detailed advice" }
      ]
    },
    "skills": {
      "summary": "skills category summary text",
      "features": [
        { "name": "Feature Name (e.g. TypeScript)", "status": "met" or "needs_improvement", "feedback": "detailed advice" }
      ]
    },
    "structure": {
      "summary": "structure category summary text",
      "features": [
        { "name": "Feature Name (e.g. Clear Section Headings)", "status": "met" or "needs_improvement", "feedback": "detailed advice" }
      ]
    },
    "style": {
      "summary": "style category summary text",
      "features": [
        { "name": "Feature Name (e.g. Action-Oriented Verbs)", "status": "met" or "needs_improvement", "feedback": "detailed advice" }
      ]
    }
  }
}`;
    const userPrompt = `
COMPANY NAME: ${company}
JOB ROLE/TITLE: ${role}
SALARY SPECIFICATION: ${salary || 'Negotiable'}
JOB DESCRIPTION:
${description}

---
CANDIDATE RESUME TEXT:
${resumeText}
`;
    // Helper: sleep for ms milliseconds
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    // Attempt with retry logic (max 2 retries, exponential backoff)
    const MAX_RETRIES = 1;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const apiResponse = await client.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.3,
            });
            // Verify choice
            const choice = apiResponse.choices?.[0];
            if (!choice) {
                throw new Error('OpenRouter response choices array is empty.');
            }
            if (choice.finish_reason === 'error') {
                const errDetail = choice.error || choice.message || {};
                const errMsg = errDetail.message || errDetail.description || 'The OpenRouter model generated an execution error.';
                throw new Error(`OpenRouter model execution failed (finish_reason: error): ${errMsg}`);
            }
            const response = apiResponse.choices[0].message;
            const content = response.content;
            if (!content) {
                throw new Error('No content returned from the OpenRouter model completions.');
            }
            let jsonParsed;
            try {
                jsonParsed = cleanAndParseJson(content);
            }
            catch (parseErr) {
                console.error('[AI] Raw content failed to parse as JSON:', content);
                throw new Error(`OpenRouter model did not return a valid JSON format: ${parseErr.message}`);
            }
            try {
                return exports.analysisResponseSchema.parse(jsonParsed);
            }
            catch (zodErr) {
                console.error('[AI] Zod validation failed for content:', jsonParsed, zodErr);
                throw new Error(`OpenRouter model response did not match the expected analysis schema structure: ${zodErr.message}`);
            }
        }
        catch (error) {
            const isRateLimit = error?.status === 429 || error?.error?.code === 429;
            const isLastAttempt = attempt === MAX_RETRIES;
            if (isRateLimit) {
                if (isLastAttempt) {
                    throw new Error(`OpenRouter API: ${model} rate limit exceeded. Please try again later or check your API key limits.`);
                }
                // Exponential backoff: 3s, then 6s
                const waitMs = 3000 * (attempt + 1);
                console.warn(`[AI] ${model} Rate limited (429). Retrying in ${waitMs / 1000}s... (attempt ${attempt + 1}/${MAX_RETRIES})`);
                await sleep(waitMs);
                continue;
            }
            // Non-rate-limit error or custom error thrown above — don't retry, throw immediately
            console.error(`[AI] ${model} OpenRouter request failed:`, error);
            throw new Error(`OpenRouter API: ${model} request failed: ${error.message || error.toString()}`);
        }
    }
    throw new Error('OpenRouter request failed after multiple retry attempts.');
};
exports.analyzeResume = analyzeResume;
