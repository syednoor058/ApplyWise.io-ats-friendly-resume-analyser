"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const verifyEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
// Helper to generate JWT token
const generateToken = (userId, email) => {
    const secret = process.env.JWT_SECRET || 'applywise_super_secret_key_12345';
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d');
    return jsonwebtoken_1.default.sign({ id: userId, email }, secret, { expiresIn });
};
// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const data = registerSchema.parse(req.body);
        const existingUser = await db_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(data.password, salt);
        const user = await db_1.default.user.create({
            data: {
                email: data.email,
                passwordHash,
                name: data.name,
                isVerified: false, // Default is false as requested
            },
        });
        const token = generateToken(user.id, user.email);
        return res.status(201).json({
            message: 'Registration successful. Verification pending.',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isVerified: user.isVerified,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const data = loginSchema.parse(req.body);
        const user = await db_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = generateToken(user.id, user.email);
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isVerified: user.isVerified,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /api/auth/me
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = await db_1.default.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isVerified: user.isVerified,
            },
        });
    }
    catch (error) {
        console.error('Fetch me error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /api/auth/verify-email
// This endpoint simulates verification by setting isVerified to true.
router.post('/verify-email', async (req, res) => {
    try {
        const data = verifyEmailSchema.parse(req.body);
        const user = await db_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const updatedUser = await db_1.default.user.update({
            where: { email: data.email },
            data: { isVerified: true },
        });
        return res.json({
            message: 'Email successfully verified',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                isVerified: updatedUser.isVerified,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        console.error('Verify email error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
