const botonStart = document.getElementById('btn-start');
const barraProgreso = document.getElementById('barra-progreso');
const audioCarga = document.getElementById('audio-carga');

const overlaySombra = document.getElementById('overlay-sombra');
const cookieBanner = document.getElementById('cookie-banner');
const btnAceptar = document.getElementById('btn-aceptar');
const btnDenegar = document.getElementById('btn-denegar');
const audioFondo = document.getElementById('audio-fondo');

// --- 1. LÓGICA DEL BANNER DE COOKIES Y AUDIO DE FONDO ---

function iniciarMusicaFondo() {
    audioFondo.volume = 0.3; // Volumen al 30%
    audioFondo.play().catch(e => console.log("Autoplay bloqueado hasta interacción", e));
}

function gestionarCookies() {
    // Al quitar el localStorage, las cookies saldrán CADA VEZ que recargues la web
    cookieBanner.style.display = 'none';
    overlaySombra.style.display = 'none';

    // Inicia el temazo de fondo
    iniciarMusicaFondo();
}

// Los dos botones hacen lo mismo: quitan el cartel y ponen la música
btnAceptar.addEventListener('click', gestionarCookies);
btnDenegar.addEventListener('click', gestionarCookies);


// --- 2. LÓGICA DEL BOTÓN START ---

let intervalo = null;
let intervaloVaciar = null;
let progreso = 0;

// Aquí le decimos que empiece a reproducir exactamente en el segundo 1.5
const inicioAudio = 1.5; 

function empezarPresion(e) {
    if (e.cancelable) e.preventDefault();
    if (intervalo) return; 

    if (intervaloVaciar) {
        clearInterval(intervaloVaciar);
        intervaloVaciar = null;
    }
    
    audioCarga.currentTime = inicioAudio; 
    audioCarga.play();
    
    intervalo = setInterval(() => {
        // Tu velocidad de carga a 1.2
        progreso += 1.2; 
        if (progreso >= 100) {
            progreso = 100;
            barraProgreso.style.width = progreso + '%';
            detenerPresion();
            accionCompletada();
        } else {
            barraProgreso.style.width = progreso + '%';
        }
    }, 20);
}

function detenerPresion() {
    if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
    }

    if (progreso < 100) {
        audioCarga.pause();
    }

    if (progreso > 0 && progreso < 100 && !intervaloVaciar) {
        intervaloVaciar = setInterval(() => {
            progreso -= 5;
            if (progreso <= 0) {
                progreso = 0;
                clearInterval(intervaloVaciar);
                intervaloVaciar = null;
                audioCarga.currentTime = inicioAudio;
            }
            barraProgreso.style.width = progreso + '%';
        }, 15);
    }
}

function accionCompletada() {
    console.log("Carga completada");
    
    audioCarga.pause();
    audioCarga.currentTime = inicioAudio;

    alert("¡START completado con éxito, choripan!"); 
    
    setTimeout(() => {
        progreso = 0;
        barraProgreso.style.width = '0%';
    }, 1000);
}

// PC
botonStart.addEventListener('mousedown', empezarPresion);
window.addEventListener('mouseup', detenerPresion);
botonStart.addEventListener('mouseleave', detenerPresion);

// Móvil
botonStart.addEventListener('touchstart', empezarPresion, { passive: false });
window.addEventListener('touchend', detenerPresion);
botonStart.addEventListener('touchcancel', detenerPresion);