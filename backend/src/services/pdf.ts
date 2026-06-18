import pdf from 'pdf-parse';

export const extractTextFromPdf = async (pdfBuffer: Buffer): Promise<string> => {
  try {
    const parsed = await pdf(pdfBuffer);
    return parsed.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Ensure it is a valid document.');
  }
};
