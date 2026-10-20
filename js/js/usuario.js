// LÓGICA DE PESTAÑAS (Compras, Facturación, Licencias)
function switchTab(tabId) {
    const tabs = ['compras', 'facturacion', 'licencias'];
    
    tabs.forEach(tab => {
        const btn = document.getElementById(`tab-${tab}`);
        const content = document.getElementById(`content-${tab}`);
        
        if (tab === tabId) {
            btn.className = "px-4 py-2 border-b-2 border-[#ffd644] text-white font-bold whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors";
            btn.querySelector('i').classList.add('text-[#ffd644]');
            content.classList.remove('hidden');
        } else {
            btn.className = "px-4 py-2 border-b-2 border-transparent text-[#a0aabf] hover:text-white whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors";
            btn.querySelector('i').classList.remove('text-[#ffd644]');
            content.classList.add('hidden');
        }
    });
}

// Cargar datos reales al iniciar
function loadProfile() {
    const elProfileName = document.getElementById('profile-name');
    const elProfileImage = document.getElementById('profile-image');
    
    // Capturamos el nombre registrado
    const storedName = localStorage.getItem('userName') || localStorage.getItem('cs_username');
    const storedEmail = localStorage.getItem('userEmail') || localStorage.getItem('cs_email');
    const savedPhoto = localStorage.getItem('cs_userphoto');

    if (storedName && elProfileName) {
        elProfileName.innerText = storedName;
        
        // Generar iniciales dinámicas para el avatar
        const partes = storedName.trim().split(' ');
        let iniciales = partes[0][0];
        if (partes.length > 1) {
            iniciales += partes[partes.length - 1][0];
        }
        iniciales = iniciales.toUpperCase();

        if (!savedPhoto || savedPhoto.includes('placehold.co')) {
            elProfileImage.src = `https://placehold.co/400x400/121e3b/ffd644?text=${iniciales}`;
        }
    } else if (elProfileName) {
        elProfileName.innerText = "Usuario CiberShield";
    }

    if (storedEmail) {
        const usernameTag = document.querySelector('aside p.text-\\[\\#a0aabf\\]');
        if (usernameTag) {
            const nick = storedEmail.split('@')[0];
            usernameTag.innerHTML = `@<span class="font-mono">${nick}</span>`;
        }
    }

    if (savedPhoto && !savedPhoto.includes('placehold.co')) {
        elProfileImage.src = savedPhoto;
    }
    
    renderPurchases();
}

// Funciones del Modal de Edición
function openEditModal() {
    const elProfileName = document.getElementById('profile-name');
    const elProfileImage = document.getElementById('profile-image');
    document.getElementById('edit-name-input').value = elProfileName.innerText;
    const currentImg = elProfileImage.src;
    document.getElementById('edit-photo-input').value = currentImg.includes('placehold.co') ? '' : currentImg;
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

function saveProfile() {
    const elProfileName = document.getElementById('profile-name');
    const elProfileImage = document.getElementById('profile-image');
    const newName = document.getElementById('edit-name-input').value.trim();
    const newPhoto = document.getElementById('edit-photo-input').value.trim();
    
    if(newName) {
        localStorage.setItem('userName', newName);
        elProfileName.innerText = newName;
        
        const partes = newName.trim().split(' ');
        let iniciales = partes[0][0];
        if (partes.length > 1) iniciales += partes[partes.length - 1][0];
        elProfileImage.src = `https://placehold.co/400x400/121e3b/ffd644?text=${iniciales.toUpperCase()}`;
    }
    if(newPhoto) {
        localStorage.setItem('cs_userphoto', newPhoto);
        elProfileImage.src = newPhoto;
    }
    closeEditModal();
}

// Render historial de compras
function renderPurchases() {
    const elPurchasesContainer = document.getElementById('content-compras');
    const mockData = [
        { name: 'CiberShield Endpoint Security', desc: 'Protección integral contra malware y ransomware.', date: '15 Nov 2026', status: 'Activo', type: 'pro', icon: 'fa-solid fa-shield-virus' },
        { name: 'Auditoría de Red', desc: 'Análisis automatizado de vulnerabilidades en red.', date: '20 Oct 2026', status: 'Activo', type: 'enterprise', icon: 'fa-solid fa-network-wired' },
        { name: 'Configuración de Firewall', desc: 'Endurecimiento de reglas ACL y políticas.', date: '10 Sep 2026', status: 'Completado', type: 'personal', icon: 'fa-solid fa-bug-slash' }
    ];

    if (!elPurchasesContainer) return;
    
    elPurchasesContainer.innerHTML = ''; 
    mockData.forEach(purchase => {
        const isPro = purchase.type === 'pro' || purchase.type === 'enterprise';
        const html = `
            <div class="bg-[#121e3b] border border-[#1a294c] rounded-lg p-5 hover:border-[#ffd644] transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between h-full group">
                <div>
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-white font-bold text-lg group-hover:text-[#ffd644] transition-colors flex items-center gap-2">
                            <i class="${purchase.icon} text-[#ffd644] text-sm"></i> ${purchase.name}
                        </h3>
                        <span class="text-xs px-2 py-0.5 rounded-full border font-bold ${isPro ? 'border-[#ffd644] text-[#ffd644] bg-[#ffd644]/10' : 'border-[#a0aabf] text-[#a0aabf]'}">
                            ${purchase.type.charAt(0).toUpperCase() + purchase.type.slice(1)}
                        </span>
                    </div>
                    <p class="text-sm text-[#a0aabf] mb-4">${purchase.desc}</p>
                </div>
                <div class="flex items-center gap-4 text-xs text-[#a0aabf] mt-auto pt-3 border-t border-[#1a294c]">
                    <span class="flex items-center gap-1 font-semibold text-white">
                        <span class="w-2 h-2 rounded-full ${purchase.status === 'Activo' ? 'bg-[#ffd644] shadow-[0_0_8px_#ffd644]' : 'bg-green-500'} inline-block"></span>
                        ${purchase.status}
                    </span>
                    <span class="flex items-center gap-1"><i class="fa-regular fa-calendar"></i> Adquirido: ${purchase.date}</span>
                </div>
            </div>
        `;
        elPurchasesContainer.innerHTML += html;
    });
}

// Ejecutar al cargar la página
window.onload = loadProfile;