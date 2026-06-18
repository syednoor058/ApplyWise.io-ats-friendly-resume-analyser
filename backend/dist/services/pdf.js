"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromPdf = void 0;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const extractTextFromPdf = async (pdfBuffer) => {
    try {
        const parsed = await (0, pdf_parse_1.default)(pdfBuffer);
        return parsed.text;
    }
    catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to parse PDF file. Ensure it is a valid document.');
    }
};
exports.extractTextFromPdf = extractTextFromPdf;
