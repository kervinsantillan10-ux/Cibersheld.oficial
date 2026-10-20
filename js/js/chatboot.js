// chatboot.js - Soporte flotante ubicado a la izquierda para CiberShield
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inyectar estilos CSS dinámicamente para fijarlo a la IZQUIERDA
    const estilosChat = document.createElement('style');
    estilosChat.innerHTML = `
       #chat-btn {
            position: fixed;
            bottom: 30px;
            left: 30px;
            z-index: 9999;
            background-color: transparent !important; /* Fuerza a quitar el cuadro azul */
            border: none !important;                  /* Quita cualquier marco global */
            padding: 0 !important;                    /* Evita espacios blancos extra */
            outline: none !important;
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.2s;
        }
        #chat-btn:hover { transform: scale(1.05); }
        .chat-logo-img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 2px solid #ffd644;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            object-fit: cover;
        }
        #chat-container {
            position: fixed;
            bottom: 100px;
            left: 30px;
            width: 350px;
            max-width: 90vw;
            background-color: #121e3b;
            color: #fff;
            border-radius: 12px;
            border: 2px solid #ffd644;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            font-family: Arial, sans-serif;
            overflow: hidden;
        }
        .chat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background-color: #0b1224;
            border-bottom: 2px solid #ffd644;
        }
        .chat-header h3 { margin: 0; color: #ffd644; font-size: 1.1rem; }
        .header-actions { display: flex; gap: 8px; }
        .action-btn { background: none; border: none; color: #fff; font-size: 1rem; cursor: pointer; }
        .chat-box {
            height: 300px;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background-color: #0b1224;
        }
        .message { padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; max-width: 80%; }
        .bot-message { background-color: #1a294c; color: #fff; align-self: flex-start; }
        .user-message { background-color: #ffd644; color: #121e3b; align-self: flex-end; font-weight: bold; }
        .suggestions { display: flex; flex-direction: column; gap: 6px; margin-top: 5px; }
        .sugg-btn {
            background-color: #121e3b;
            color: #ffd644;
            border: 1px solid #ffd644;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            text-align: left;
            font-size: 0.85rem;
            transition: background 0.2s;
        }
        .sugg-btn:hover { background-color: #ffd644; color: #121e3b; }
        .chat-input-area {
            display: flex;
            padding: 10px;
            background-color: #121e3b;
            border-top: 1px solid #1a294c;
        }
        #chat-input {
            flex-grow: 1;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #333;
            background-color: #0b1224;
            color: #fff;
            outline: none;
        }
        #send-btn {
            background-color: #ffd644;
            color: #121e3b;
            border: none;
            padding: 0 15px;
            margin-left: 8px;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
        }
    `;
    document.head.appendChild(estilosChat);

    // 2. Estructura HTML del Chatbot
    const chatbotHTML = `
    <button id="chat-btn" title="Soporte CiberShield">
        <img src="./img/chatboot.jpg" alt="Botón de soporte CiberShield" class="chat-logo-img">
    </button>
    <div id="chat-container" style="display: none;">
        <div class="chat-header">
            <h3>Soporte CiberShield</h3>
            <div class="header-actions">
                <button class="action-btn" id="minimize-btn" title="Minimizar">_</button>
                <button class="action-btn" id="close-btn" title="Cerrar chat">✖</button>
            </div>
        </div>
        <div class="chat-box" id="chat-box">
            <div class="message bot-message">
                ¡Hola! Bienvenido a CiberShield. ¿En qué podemos ayudarte a proteger tu mundo digital hoy?
            </div>
            <div class="suggestions" id="suggestions">
                <button class="sugg-btn" data-q="servicios">¿Qué servicios ofrecen?</button>
                <button class="sugg-btn" data-q="precios">Ver planes y precios</button>
                <button class="sugg-btn" data-q="contacto">Hablar con un asesor</button>
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Escribe tu mensaje...">
            <button id="send-btn">Enviar</button>
        </div>
    </div>
    `;

    // 3. Inyectar directamente al body para que aparezca en todas partes
    const chatbotDiv = document.createElement('div');
    chatbotDiv.innerHTML = chatbotHTML;
    document.body.appendChild(chatbotDiv);

    inicializarChatbot();
});

// Lógica interna del bot (idéntica a tu versión optimizada)[cite: 23]
function inicializarChatbot() {
    const chatBtn = document.getElementById('chat-btn');
    const minimizeBtn = document.getElementById('minimize-btn');
    const closeBtn = document.getElementById('close-btn');
    const chatContainer = document.getElementById('chat-container');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');

    const botResponses = {
        "servicios": "Ofrecemos protección antivirus, firewall, VPN y configuración de llaves de seguridad. Contamos con soluciones tanto para personas como para empresas.",
        "precios": "Nuestros planes de protección básica empiezan desde S/50 mensuales. Para empresas, diseñamos cotizaciones de red a medida.",
        "contacto": "Puedes escribirnos al correo soporte@cibershield.com o llamarnos al +51 999 888 777.",
        "default": "Hemos recibido tu consulta. Un técnico especialista en ciberseguridad revisará tu caso y se contactará contigo a la brevedad."
    };

    const initialChatContent = chatBox.innerHTML;

    chatBtn.addEventListener('click', () => {
        chatContainer.style.display = (chatContainer.style.display === 'none' || chatContainer.style.display === '') ? 'block' : 'none';
    });

    minimizeBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
        chatBox.innerHTML = initialChatContent;
        activarSugerencias();
    });

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message');
        div.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        div.textContent = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function activarSugerencias() {
        const suggBtns = document.querySelectorAll('.sugg-btn');
        suggBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.textContent;
                const key = e.target.getAttribute('data-q');
                
                appendMessage(question, 'user');
                const currentSuggestions = document.getElementById('suggestions');
                if(currentSuggestions) currentSuggestions.style.display = 'none';

                setTimeout(() => {
                    appendMessage(botResponses[key], 'bot');
                }, 600);
            });
        });
    }
    
    activarSugerencias();

    function sendMessage() {
        const text = chatInput.value.trim();
        if (text !== "") {
            appendMessage(text, 'user');
            chatInput.value = '';
            
            const currentSuggestions = document.getElementById('suggestions');
            if(currentSuggestions) currentSuggestions.style.display = 'none';

            setTimeout(() => {
                appendMessage(botResponses["default"], 'bot');
            }, 1000); 
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}