// assets/js/main.js - JavaScript Principal para todas las páginas
import { initializeSupabase, authGuard, getUserProfile, logoutUser } from './auth.js';
import { showLoading, showMainContent, showError, createParticles } from './utils.js';
import { APP_CONFIG } from './config.js';

// Variables globales
let currentUser = null;
let supabaseClient = null;

// Inicialización principal
export const initializeApp = async () => {
    try {
        // Verificar que Supabase esté disponible
        if (typeof supabase === 'undefined') {
            throw new Error('Supabase no está disponible');
        }

        // Inicializar cliente de Supabase
        supabaseClient = initializeSupabase();

        // Cargar componentes comunes
        await loadCommonComponents();

        // Inicializar partículas si existe el contenedor
        initializeParticles();

        // Configurar eventos globales
        setupGlobalEvents();

        console.log('Aplicación inicializada correctamente');
        return true;

    } catch (error) {
        console.error('Error al inicializar aplicación:', error);
        showError('Error al cargar la aplicación');
        return false;
    }
};

// Cargar componentes HTML compartidos
const loadCommonComponents = async () => {
    try {
        // Cargar header si existe el contenedor
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            const headerResponse = await fetch('./components/header.html');
            if (headerResponse.ok) {
                headerContainer.innerHTML = await headerResponse.text();
            }
        }

        // Cargar sidebar si existe el contenedor
        const sidebarContainer = document.getElementById('sidebar-container');
        if (sidebarContainer) {
            const sidebarResponse = await fetch('./components/sidebar.html');
            if (sidebarResponse.ok) {
                sidebarContainer.innerHTML = await sidebarResponse.text();
                // Configurar eventos del sidebar después de cargarlo
                setupSidebarEvents();
            }
        }

        // Cargar partículas si existe el contenedor
        const particlesContainer = document.getElementById('particles-container');
        if (particlesContainer) {
            const particlesResponse = await fetch('./components/particles.html');
            if (particlesResponse.ok) {
                particlesContainer.innerHTML = await particlesResponse.text();
            }
        }

    } catch (error) {
        console.warn('Error al cargar componentes:', error);
        // No es crítico, continuar sin componentes
    }
};

// Configurar eventos del sidebar
const setupSidebarEvents = () => {
    // Evento de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                logoutUser();
            }
        });
    }

    // Eventos de navegación
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remover clase active de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            // Agregar clase active al enlace clickeado
            e.target.closest('a').classList.add('active');
        });
    });
};

// Inicializar partículas flotantes
const initializeParticles = () => {
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        createParticles(particlesContainer, 9);
    }
};

// Configurar eventos globales
const setupGlobalEvents = () => {
    // Interceptar formularios para mostrar estados de carga
    document.addEventListener('submit', (e) => {
        const form = e.target;
        if (form.tagName === 'FORM') {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                // El manejo específico se hace en cada página
                console.log('Formulario enviado:', form.id);
            }
        }
    });

    // Manejar errores globales
    window.addEventListener('error', (e) => {
        console.error('Error global:', e.error);
        // No mostrar al usuario errores técnicos, solo loguearlos
    });

    // Manejar errores de promesas no capturadas
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Promesa rechazada:', e.reason);
        e.preventDefault(); // Evitar que aparezca en la consola
    });
};

// Función para páginas protegidas (que requieren autenticación)
export const initializeProtectedPage = async () => {
    try {
        showLoading(true);

        // Inicializar aplicación
        const appInitialized = await initializeApp();
        if (!appInitialized) {
            throw new Error('No se pudo inicializar la aplicación');
        }

        // Verificar autenticación
        const session = await authGuard(true);
        if (!session) {
            return; // authGuard ya maneja la redirección
        }

        // Obtener perfil del usuario
        currentUser = await getUserProfile();
        if (!currentUser) {
            throw new Error('No se pudo obtener el perfil del usuario');
        }

        // Actualizar UI con información del usuario
        updateUserInfo(currentUser);

        showMainContent();
        return currentUser;

    } catch (error) {
        console.error('Error al inicializar página protegida:', error);
        showError('Error al cargar la página');
        return null;
    }
};

// Función para páginas públicas (login, register)
export const initializePublicPage = async () => {
    try {
        // Inicializar aplicación (sin verificar autenticación)
        const appInitialized = await initializeApp();
        if (!appInitialized) {
            throw new Error('No se pudo inicializar la aplicación');
        }

        // Para páginas públicas, no verificar autenticación
        return true;

    } catch (error) {
        console.error('Error al inicializar página pública:', error);
        showError('Error al cargar la página');
        return false;
    }
};

// Actualizar información del usuario en la UI
const updateUserInfo = (user) => {
    // Actualizar nombre de usuario
    const userNameElements = document.querySelectorAll('#user-name, .user-name');
    userNameElements.forEach(el => {
        if (el) el.textContent = user.full_name || 'Usuario';
    });

    // Actualizar email de usuario
    const userEmailElements = document.querySelectorAll('#user-email, .user-email');
    userEmailElements.forEach(el => {
        if (el) el.textContent = user.email;
    });

    // Actualizar avatar con iniciales
    const avatarElements = document.querySelectorAll('#profile-avatar, .profile-avatar');
    avatarElements.forEach(el => {
        if (el && user.full_name) {
            const initials = user.full_name
                .split(' ')
                .map(name => name[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
            el.textContent = initials;
        }
    });
};

// Función para personalizar enlaces de herramientas
export const personalizeToolLinks = (userId) => {
    const toolLinks = {
        catalog: document.getElementById('catalog-btn'),
        business: document.getElementById('business-btn')
    };

    Object.entries(toolLinks).forEach(([tool, element]) => {
        if (element && element.dataset.default) {
            const baseUrl = element.dataset.default;
            const personalizedUrl = `${baseUrl}?socio=${userId}`;
            element.href = personalizedUrl;

            console.log(`Enlace personalizado ${tool}:`, personalizedUrl);
        }
    });
};

// Obtener usuario actual
export const getCurrentUser = () => currentUser;

// Obtener cliente de Supabase
export const getSupabaseClient = () => supabaseClient;

// Función de utilidad para logging
export const log = (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`, data || '');
};

// Exportar para uso global si es necesario
if (typeof window !== 'undefined') {
    window.App = {
        initializeApp,
        initializeProtectedPage,
        initializePublicPage,
        getCurrentUser,
        getSupabaseClient,
        log
    };
}
