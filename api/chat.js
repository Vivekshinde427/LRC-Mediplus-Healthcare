export default async function handler(req, res) {
    // Only allow POST requests for the chat
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message } = req.body;
    
    // Vercel will securely inject this from its Environment Variables dashboard!
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ 
            error: "Server Error: Missing GEMINI_API_KEY in Vercel Environment Variables. Please add it in your Vercel Dashboard -> Project Settings -> Environment Variables." 
        });
    }

    try {
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
            throw new Error(data.error.message || "API Error from Gemini");
        }
        
        const botReply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ text: botReply });
        
    } catch (error) {
        console.error("Vercel API Chat Error:", error);
        res.status(500).json({ error: error.message });
    }
}
