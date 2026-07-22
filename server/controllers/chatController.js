export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message content is required.' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            // Intelligent fallback reply if API key is not configured yet
            return res.json({
                text: `Hello! I am LRC Medi+ Healthcare AI assistant. We offer sales and monthly rentals for wheelchairs, hospital beds, oxygen concentrators, and surgical supplies in Navi Mumbai and Mumbai metro area. How can I help you today?`
            });
        }

        const payload = {
            contents: [{
                parts: [{
                    text: `You are an AI assistant for "LRC Medi+ Healthcare", a business renting and selling medical equipment like wheelchairs, hospital beds, oxygen concentrators, and surgical items based in Navi Mumbai. Be polite, concise, and helpful. Suggest relevant equipment if asked. Address the user's query: ${message}`
                }]
            }]
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message || 'Gemini API response error');
        }

        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Thank you for reaching out to LRC Medi+ Healthcare! How else can I assist you?";
        res.json({ text: botReply });
    } catch (error) {
        console.error('Chat AI Error:', error);
        res.status(500).json({
            text: 'I am currently experiencing technical difficulties. Please contact our support team directly at +91 9876543210.'
        });
    }
};
