export const handleChat = async (req, res) => {
    const { message } = req.body || {};
    if (!message) {
        return res.status(400).json({ error: 'Message content is required.' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
        try {
            const payload = {
                contents: [{
                    parts: [{
                        text: `You are an AI assistant for "LRC Medi+ Healthcare", a business renting and selling medical equipment like wheelchairs, hospital beds, oxygen concentrators, and surgical items based in Navi Mumbai. Be polite, concise, and helpful. Suggest relevant equipment if asked. Address the user's query: ${message}`
                    }]
                }]
            };

            // 5 second timeout controller
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (botReply) {
                    return res.json({ text: botReply });
                }
            }
        } catch (error) {
            console.log('Gemini API call skipped/failed, using intelligent local response:', error.message);
        }
    }

    // Always fallback smoothly to keyword matching if API key fails, times out, or is missing
    const reply = getLocalFallbackReply(message);
    return res.json({ text: reply });
};

// Keyword-based local fallback replies
function getLocalFallbackReply(message) {
    const msg = message.toLowerCase();

    const responses = [
        {
            keywords: ['wheelchair', 'wheel chair'],
            reply: 'We offer a range of wheelchairs:\n\n• **Manual Wheelchair** — Buy ₹5,999 | Rent ₹150/month\n• **Electric Wheelchair** — Buy ₹45,000 | Rent ₹800/month\n• **Lightweight Folding Wheelchair** — Buy ₹8,500 | Rent ₹200/month\n\nAll wheelchairs are sanitized and delivered to your doorstep. Would you like to place an order?'
        },
        {
            keywords: ['hospital bed', 'icu bed', 'bed'],
            reply: 'We have several hospital beds available:\n\n• **Standard Hospital Bed** — Buy ₹18,000 | Rent ₹500/month\n• **ICU Bed with Side Rails** — Buy ₹35,000 | Rent ₹900/month\n• **Semi-Electric Hospital Bed** — Buy ₹26,000 | Rent ₹700/month\n\nAll beds include free delivery and installation in Navi Mumbai area.'
        },
        {
            keywords: ['oxygen', 'concentrator', 'o2'],
            reply: 'We offer oxygen concentrators:\n\n• **5L Oxygen Concentrator** — Buy ₹32,000 | Rent ₹750/month\n\nFeatures >93% purity, quiet operation, and built-in nebulizer option. Available for immediate delivery.'
        },
        {
            keywords: ['medicine', 'tablet', 'pill', 'paracetamol', 'vitamin'],
            reply: 'We stock essential medicines and supplements:\n\n• **Paracetamol 650mg (Pack of 15)** — ₹35\n• **Multivitamin Capsules (30s)** — ₹249\n• **First Aid Emergency Kit** — ₹650\n\nBrowse our full Medicines section for more options!'
        },
        {
            keywords: ['rent', 'rental', 'monthly'],
            reply: 'Yes! We offer flexible monthly rentals on medical equipment:\n\n• Wheelchairs from ₹150/month\n• Hospital Beds from ₹500/month\n• Oxygen Concentrators from ₹750/month\n\nNo long-term commitments required. All equipment is thoroughly sanitized before delivery.'
        },
        {
            keywords: ['price', 'cost', 'rate', 'how much', 'kitna'],
            reply: 'Our pricing varies by product:\n\n**Equipment (Buy | Rent/month):**\n• Wheelchairs: ₹5,999–₹45,000 | ₹150–₹800\n• Hospital Beds: ₹18,000–₹35,000 | ₹500–₹900\n• Oxygen Concentrators: ₹32,000 | ₹750\n\n**Medicines:** Starting from ₹35\n\nVisit our Store or Medicines page for detailed pricing!'
        },
        {
            keywords: ['delivery', 'deliver', 'shipping', 'ship'],
            reply: 'We provide **FREE doorstep delivery and installation** across Navi Mumbai and Mumbai metro area. Equipment is typically delivered within 24-48 hours of order confirmation.'
        },
        {
            keywords: ['contact', 'phone', 'call', 'number', 'reach'],
            reply: 'You can reach us at:\n\n📞 **Phone:** +91 98765 43210\n📧 **Email:** mediiplus.healthcare@gmail.com\n📍 **Address:** Sector 15, Vashi, Navi Mumbai, MH 400703\n\nWe are available 24/7 for emergencies!'
        },
        {
            keywords: ['address', 'location', 'where', 'office', 'visit'],
            reply: 'Our office is located at:\n\n📍 **Sector 15, Vashi, Navi Mumbai, Maharashtra 400703**\n\nFeel free to visit us during business hours (9 AM – 8 PM) or call +91 98765 43210.'
        },
        {
            keywords: ['prescription', 'rx', 'doctor'],
            reply: 'Some medical equipment and medicines require a valid doctor\'s prescription. You can upload your prescription during checkout. We accept images, PDFs, or Google Drive links.'
        },
        {
            keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'namaste'],
            reply: 'Hello! 👋 Welcome to LRC Medi+ Healthcare. I can help you with:\n\n• Medical equipment (wheelchairs, beds, oxygen concentrators)\n• Monthly rental plans\n• Medicines & supplements\n• Pricing & delivery info\n\nWhat would you like to know?'
        },
        {
            keywords: ['thank', 'thanks', 'dhanyawad'],
            reply: 'You\'re welcome! 😊 If you need any more help with medical equipment or medicines, feel free to ask. We\'re here for you 24/7!'
        },
        {
            keywords: ['surgical', 'suction', 'instrument'],
            reply: 'We offer surgical equipment:\n\n• **Surgical Instrument Kit** — ₹2,499 (Buy only)\n• **Portable Suction Machine** — Buy ₹7,999 | Rent ₹250/month\n\nAll instruments are medical-grade stainless steel and sterilized.'
        },
        {
            keywords: ['bp', 'blood pressure', 'oximeter', 'monitor', 'pulse'],
            reply: 'We have health monitoring devices:\n\n• **Digital BP Monitor** — ₹1,899\n• **Fingertip Pulse Oximeter** — ₹899\n\nBoth are available for purchase (buy only, no rental).'
        }
    ];

    for (const entry of responses) {
        if (entry.keywords.some(kw => msg.includes(kw))) {
            return entry.reply;
        }
    }

    return 'Thank you for contacting LRC Medi+ Healthcare! We offer sales and monthly rentals for wheelchairs, hospital beds, oxygen concentrators, and surgical supplies in Navi Mumbai.\n\nYou can ask me about:\n• Equipment types & pricing\n• Rental plans\n• Medicines\n• Delivery & contact info\n\nHow can I help you today?';
}
