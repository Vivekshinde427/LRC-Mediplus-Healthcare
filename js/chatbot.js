/* ============================================
   LRC MEDI+ HEALTHCARE - AI Chatbot
   ============================================ */

// Read config from api-keys.js, default to none
const GEMINI_API_KEY = window.APP_CONFIG?.GEMINI_API_KEY || "";


function getChatbotHTML() {
    return `
    <div id="chatbotWindow" class="chatbot-window hidden">
        <div class="chatbot-header">
            <div>
                <i class="fa-solid fa-robot"></i> LRC Medi+ AI
            </div>
            <button class="chatbot-close" onclick="toggleChatbot()">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
        <div id="chatbotMessages" class="chatbot-messages">
            <div class="message bot">
                Hello there! I'm your LRC Medi+ assistant. How can I help you with our medical equipment today?
            </div>
        </div>
        <div class="chatbot-input">
            <input type="text" id="chatbotInput" placeholder="Type your message..." onkeypress="handleChatInput(event)">
            <button onclick="sendChatMessage()">
                <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>
    </div>
    `;
}

// Inject chatbot HTML when script is loaded into the DOM
(function initChatbot() {
    const div = document.createElement('div');
    div.innerHTML = getChatbotHTML();
    document.body.appendChild(div);
})();

window.toggleChatbot = function() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    if (chatbotWindow) {
        if (chatbotWindow.classList.contains('hidden')) {
            chatbotWindow.classList.remove('hidden');
            setTimeout(() => document.getElementById('chatbotInput').focus(), 100);
            
            // If user logged in, greet them personally if we haven't already
            if (window.auth && window.auth.currentUser && !window.chatbotGreeted) {
                // Try fetching user name from our db
                if (window.getUserData) {
                    window.getUserData(window.auth.currentUser.uid).then(data => {
                        const name = data && data.name ? data.name.split(' ')[0] : window.auth.currentUser.email.split('@')[0];
                        appendMessage('bot', `Welcome back, ${name}! Looking for anything specific today?`);
                        window.chatbotGreeted = true;
                    });
                }
            }
        } else {
            chatbotWindow.classList.add('hidden');
        }
    }
};

window.handleChatInput = function(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
};

window.sendChatMessage = async function() {
    const inputField = document.getElementById('chatbotInput');
    const message = inputField.value.trim();
    
    if (!message) return;
    
    // Add user message to UI
    appendMessage('user', message);
    inputField.value = '';
    
    // Show typing indicator
    const typingId = 'typing-' + Date.now();
    appendMessage('bot', '<span class="typing-dots">...</span>', typingId);
    
    // Auto scroll down
    const msgContainer = document.getElementById('chatbotMessages');
    msgContainer.scrollTop = msgContainer.scrollHeight;
    
    try {
        let botReply = '';

        // Try Vercel Serverless API first (Secure, no exposed keys)
        // Note: Using a relative path so it correctly hits Vercel's backend
        const vercelResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        }).catch(err => ({ ok: false, status: -1 })); // Catch network errs if API not hosted

        if (vercelResponse.ok) {
            // Vercel Serverless Function Success
            const data = await vercelResponse.json();
            botReply = data.text;
        } else if (vercelResponse.status === 500) {
            // Vercel returned a hard error (e.g. missing environment variables in Vercel dashboard)
            const errData = await vercelResponse.json().catch(() => ({}));
            throw new Error(errData.error || "Vercel Server Error");
        } else {
            // Fallback: Local Development (e.g. using Live Server without an API route)
            if (!GEMINI_API_KEY || GEMINI_API_KEY === "INSERT_YOUR_GEMINI_API_KEY_HERE") {
                 throw new Error("Local fallback failed: API Key not configured. Please add your Gemini API Key in 'js/api-keys.js'.");
            }

            // Direct local call
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
                throw new Error(data.error.message || "API Error");
            }
            
            botReply = data.candidates[0].content.parts[0].text;
        }

        removeMessage(typingId);
        appendMessage('bot', formatChatText(botReply));
        
    } catch (error) {
        removeMessage(typingId);
        appendMessage('bot', '<span style="color:var(--color-danger)">Error: ' + error.message + '</span>');
    }
    
    msgContainer.scrollTop = msgContainer.scrollHeight;
};

function appendMessage(sender, text, id = null) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    if (id) div.id = id;
    div.innerHTML = text;
    
    messagesContainer.appendChild(div);
}

function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function formatChatText(text) {
    return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
