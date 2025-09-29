export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY,
};

// Add validation
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
} else {
  console.log('Environment variables loaded successfully');
}