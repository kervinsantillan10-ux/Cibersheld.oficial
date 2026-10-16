// carrito.js - Lógica completa del Carrito y Pasarela de Pagos para CiberShield
document.addEventListener("DOMContentLoaded", () => {
    // 0. Asegurar que FontAwesome esté cargado para que aparezcan los iconos
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fa);
    }

    // 1. Inyectar los estilos CSS dinámicamente
    const estilos = document.createElement('style');
    estilos.innerHTML = `
        #carrito-flotante-js {
            position: fixed; 
            bottom: 30px; 
            right: 30px;
            width: 60px;
            height: 60px;
            background-color: #121e3b; 
            color: #ffd644;
            border: 2px solid #ffd644;
            border-radius: 50%;
            cursor: pointer; 
            font-weight: bold; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.5); 
            z-index: 9999;
            display: flex; 
            justify-content: center; 
            align-items: center;
            transition: transform 0.2s;
        }
        #carrito-flotante-js:hover { transform: scale(1.1); }
        
        #carrito-flotante-js i {
            color: #ffd644 !important;
            font-size: 1.4rem !important;
        }

        #contador-c {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #ff4c4c;
            color: #fff;
            font-size: 0.75rem;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px solid #0b1224;
            font-weight: bold;
        }

        #panel-carrito-js {
            position: fixed; top: 0; right: -400px; 
            width: 350px; height: 100vh;
            background-color: #121e3b; color: #ffffff;
            box-shadow: -5px 0 15px rgba(0,0,0,0.5);
            display: flex; flex-direction: column;
            transition: right 0.3s ease-in-out; z-index: 10000;
            font-family: Arial, sans-serif;
        }
        #panel-carrito-js.abierto { right: 0; }
        
        .cabecera-c {
            display: flex; justify-content: space-between; align-items: center; 
            padding: 20px; background-color: #0b1224; border-bottom: 2px solid #ffd644;
        }
        .cabecera-c h2 { margin: 0; color: #ffd644; font-size: 1.3rem; }
        .btn-cerrar-c { background: none; border: none; color: #ffffff; font-size: 1.5rem; cursor: pointer; }
        
        #lista-productos-c { 
            flex-grow: 1; overflow-y: auto; padding: 20px; 
            display: flex; flex-direction: column; gap: 10px; 
        }
        
        .item-c { 
            background-color: #1a294c; padding: 15px; border-radius: 8px; 
            display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem;
        }
        .item-der-c {
            display: flex; align-items: center; gap: 12px;
        }
        .btn-eliminar-c {
            background: none; border: none; color: #ff4c4c; cursor: pointer;
            font-size: 1rem; transition: transform 0.2s;
        }
        .btn-eliminar-c:hover { transform: scale(1.2); }
        
        .pie-c { padding: 20px; background-color: #0b1224; border-top: 1px solid #1a294c; }
        .total-c { display: flex; justify-content: space-between; font-size: 1.2rem; margin-bottom: 15px; }
        .total-c strong { color: #ffd644; }
        
        .btn-pagar-c {
            width: 100%; padding: 15px; background-color: #ffd644;
            color: #121e3b; border: none; border-radius: 8px;
            font-weight: bold; font-size: 1.1rem; cursor: pointer;
            transition: background-color 0.2s;
        }
        .btn-pagar-c:hover { background-color: #e6c03d; }
        
        .metodos-pago-c { 
            text-align: center; color: #a0aabf; font-size: 0.85rem; margin-bottom: 15px; 
        }
        .logos-pago {
            display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 8px;
        }
        .icono-pago {
            height: 20px;
            vertical-align: middle;
            border-radius: 4px;
        }
        .metodo-item {
            display: flex; align-items: center; gap: 5px;
        }
    `;
    document.head.appendChild(estilos);

    // 2. Construir e inyectar la estructura HTML del carrito circular
    const contenedorCarrito = document.createElement('div');
    contenedorCarrito.innerHTML = `
        <div id="carrito-flotante-js" title="Ver Carrito de Compras">
            <i class="fa-solid fa-cart-shopping"></i>
            <span id="contador-c">0</span>
        </div>
        
        <aside id="panel-carrito-js">
            <div class="cabecera-c">
                <h2>Carrito CiberShield</h2>
                <button class="btn-cerrar-c" id="cerrar-panel-c">✕</button>
            </div>
            
            <div id="lista-productos-c"></div>
            
            <div class="pie-c">
                <div class="total-c">
                    <span>Total:</span>
                    <strong>S/ <span id="total-precio-c">0.00</span></strong>
                </div>
                
                <div class="metodos-pago-c">
                    Paga de forma segura con:<br>
                    <div class="logos-pago">
                        <span class="metodo-item">💳 Tarjetas</span> | 
                        <span class="metodo-item"><img src="img/yape.png" class="icono-pago" alt="Yape"> Yape</span> | 
                        <span class="metodo-item"><img src="img/plin.png" class="icono-pago" alt="Plin"> Plin</span>
                    </div>
                </div>
                
                <button class="btn-pagar-c" id="btn-procesar-pago">Proceder al Pago</button>
            </div>
        </aside>
    `;
    document.body.appendChild(contenedorCarrito);

    // 3. Variables de estado y referencias del DOM
    let carrito = [];
    let total = 0;

    const panel = document.getElementById('panel-carrito-js');
    const btnFlotante = document.getElementById('carrito-flotante-js');
    const btnCerrar = document.getElementById('cerrar-panel-c');
    const listaDOM = document.getElementById('lista-productos-c');
    const contadorDOM = document.getElementById('contador-c');
    const totalDOM = document.getElementById('total-precio-c');
    const btnPago = document.getElementById('btn-procesar-pago');

    // 4. Lógica de Interfaz del Carrito
    btnFlotante.addEventListener('click', () => panel.classList.add('abierto'));
    btnCerrar.addEventListener('click', () => panel.classList.remove('abierto'));

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-agregar')) {
            const nombre = e.target.getAttribute('data-nombre');
            const precio = parseFloat(e.target.getAttribute('data-precio'));

            carrito.push({ nombre, precio });
            actualizarCarrito(); 
            panel.classList.add('abierto');
        }
    });

    listaDOM.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar-c')) {
            const index = e.target.getAttribute('data-index');
            carrito.splice(index, 1); 
            actualizarCarrito(); 
        }
    });

    function actualizarCarrito() {
        listaDOM.innerHTML = ''; 
        total = 0; 
        
        carrito.forEach((item, index) => {
            total += item.precio; 
            
            const div = document.createElement('div');
            div.classList.add('item-c');
            div.innerHTML = `
                <span>${item.nombre}</span> 
                <div class="item-der-c">
                    <span>S/ ${item.precio.toFixed(2)}</span>
                    <button class="btn-eliminar-c" data-index="${index}">❌</button>
                </div>
            `;
            listaDOM.appendChild(div);
        });
        
        contadorDOM.innerText = carrito.length;
        totalDOM.innerText = total.toFixed(2);
    }

    // 5. Lógica para abrir el simulador de pagos
    btnPago.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert("Tu carrito de CiberShield está vacío.");
            return;
        }
        
        panel.classList.remove('abierto');
        abrirPasarelaPago(total);
    });

    // 6. Generador del Simulador de Pasarela de Pagos
    function abrirPasarelaPago(montoTotal) {
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'modal-pago-overlay';
        Object.assign(modalOverlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: '20000',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        });

        const modalBox = document.createElement('div');
        modalBox.id = 'modal-pago-box';
        Object.assign(modalBox.style, {
            backgroundColor: '#121e3b', color: '#fff', padding: '30px',
            borderRadius: '12px', width: '400px', maxWidth: '90%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)', fontFamily: 'Arial, sans-serif'
        });

        modalBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #ffd644;">Checkout CiberShield</h3>
                <button id="btn-cerrar-pasarela" style="background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer;">✕</button>
            </div>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 0.9rem; color: #a0aabf;">Total a Pagar</p>
                <h2 style="margin: 5px 0 0 0; font-size: 2rem; color: #fff;">S/ ${montoTotal.toFixed(2)}</h2>
            </div>

            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button id="tab-tarjeta" style="flex: 1; padding: 10px; background-color: #ffd644; color: #121e3b; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">💳 Tarjeta</button>
                <button id="tab-billetera" style="flex: 1; padding: 10px; background-color: #1a294c; color: #fff; border: 1px solid #333; border-radius: 6px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 5px;">
                    <img src="./img/yape.png" style="height: 16px; border-radius: 3px;" alt="Yape"> / 
                    <img src="./img/plin.png" style="height: 16px; border-radius: 3px;" alt="Plin">
                </button>
            </div>

            <div id="form-tarjeta">
                <input type="text" placeholder="Número de Tarjeta" style="width: 100%; padding: 12px; margin-bottom: 10px; border-radius: 6px; border: 1px solid #333; background-color: #0b1224; color: #fff; box-sizing: border-box;">
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="text" placeholder="MM/AA" style="flex: 1; padding: 12px; border-radius: 6px; border: 1px solid #333; background-color: #0b1224; color: #fff; box-sizing: border-box;">
                    <input type="text" placeholder="CVC" style="flex: 1; padding: 12px; border-radius: 6px; border: 1px solid #333; background-color: #0b1224; color: #fff; box-sizing: border-box;">
                </div>
                <input type="text" placeholder="Titular de la tarjeta" style="width: 100%; padding: 12px; margin-bottom: 20px; border-radius: 6px; border: 1px solid #333; background-color: #0b1224; color: #fff; box-sizing: border-box;">
            </div>

            <div id="form-billetera" style="display: none; text-align: center; padding: 20px 0;">
                <p style="color: #a0aabf; margin-bottom: 15px;">Escanea el código QR para pagar</p>
                <div style="width: 180px; height: 180px; margin: 0 auto 15px auto; border-radius: 12px; overflow: hidden; display: flex; justify-content: center; align-items: center; background-color: #fff; border: 3px solid #ffd644; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
                    <img src="./img/qr.jpeg" alt="Código QR" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                <p style="font-size: 1.1rem; font-weight: bold; color: #ffd644;">Número: 951 108 456</p>
            </div>

            <button id="btn-procesar-final" style="width: 100%; padding: 15px; background-color: #28a745; color: #fff; border: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; cursor: pointer;">Procesar Pago</button>
        `;

        modalOverlay.appendChild(modalBox);
        document.body.appendChild(modalOverlay);

        const tabTarjeta = document.getElementById('tab-tarjeta');
        const tabBilletera = document.getElementById('tab-billetera');
        const formTarjeta = document.getElementById('form-tarjeta');
        const formBilletera = document.getElementById('form-billetera');

        tabTarjeta.addEventListener('click', () => {
            tabTarjeta.style.backgroundColor = '#ffd644';
            tabTarjeta.style.color = '#121e3b';
            tabBilletera.style.backgroundColor = '#1a294c';
            tabBilletera.style.color = '#fff';
            formTarjeta.style.display = 'block';
            formBilletera.style.display = 'none';
        });

        tabBilletera.addEventListener('click', () => {
            tabBilletera.style.backgroundColor = '#ffd644';
            tabBilletera.style.color = '#121e3b';
            tabTarjeta.style.backgroundColor = '#1a294c';
            tabTarjeta.style.color = '#fff';
            formBilletera.style.display = 'block';
            formTarjeta.style.display = 'none';
        });

        document.getElementById('btn-cerrar-pasarela').addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });

        const btnProcesarFinal = document.getElementById('btn-procesar-final');
        btnProcesarFinal.addEventListener('click', () => {
            btnProcesarFinal.innerText = "Procesando...";
            btnProcesarFinal.style.backgroundColor = "#ffca28";
            btnProcesarFinal.disabled = true;

            setTimeout(() => {
                modalBox.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
                        <h2 style="color: #28a745; margin-bottom: 10px;">¡Pago Exitoso!</h2>
                        <p style="color: #fff;">Tu compra por S/ ${montoTotal.toFixed(2)} se ha completado. Recibirás tus credenciales en breve.</p>
                        <button id="btn-finalizar-ok" style="margin-top: 20px; padding: 10px 20px; background-color: #ffd644; color: #121e3b; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Cerrar</button>
                    </div>
                `;

                carrito = [];
                actualizarCarrito();

                document.getElementById('btn-finalizar-ok').addEventListener('click', () => {
                    document.body.removeChild(modalOverlay);
                });
            }, 2000);
        });
    }
});