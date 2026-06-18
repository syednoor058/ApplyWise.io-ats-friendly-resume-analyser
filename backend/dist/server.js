"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const analysis_1 = __importDefault(require("./routes/analysis"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Enable Cross-Origin Resource Sharing
app.use((0, cors_1.default)({
    origin: '*', // We can restrict this to frontend URL later if needed
    credentials: true,
}));
// Express middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routing API mounts
app.use('/api/auth', auth_1.default);
app.use('/api/analysis', analysis_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        error: err.message || 'Internal server error occurred',
    });
});
// Start listening
app.listen(PORT, () => {
    console.log(`ApplyWise.io Backend is running on port ${PORT}`);
});
