import { MESSAGES } from './config.js';

// Funciones de UI compartidas
export const showMessage = (message, type, containerId = 'message') => {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="${type}-message">${message}</div>`;
    }
};

export const clearMessage = (containerId = 'message') => {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
};

export const updateButton = (button, loading, text) => {
    if (!button) return;

    button.disabled = loading;
    if (loading) {
        button.innerHTML = `<span class="loading-spinner"></span>${text}`;
    } else {
        button.innerHTML = text;
    }
};

// Validaciones comunes
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

export const validateName = (name) => {
    return name.trim().length >= 2;
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validateWhatsApp = (whatsapp) => {
    // Validar que sea un número de teléfono válido (opcional)
    if (!whatsapp.trim()) return true; // Campo opcional
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(whatsapp.replace(/\s/g, ''));
};

export const validateURL = (url) => {
    if (!url.trim()) return true; // Campo opcional
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Función para validar campo en tiempo real
export const validateField = (input, validationDiv, isValid, successMessage, errorMessage) => {
    const validationElement = document.getElementById(validationDiv);
    if (!validationElement) return;

    if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        validationElement.textContent = successMessage;
        validationElement.className = 'validation-message success';
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        validationElement.textContent = errorMessage;
        validationElement.className = 'validation-message error';
    }
};

// Manejo centralizado de errores de autenticación
export const handleAuthError = (error) => {
    let errorMessage = MESSAGES.errors.networkError;

    if (error?.message) {
        switch (error.message) {
            case 'Invalid login credentials':
                errorMessage = MESSAGES.errors.invalidCredentials;
                break;
            case 'User already registered':
                errorMessage = MESSAGES.errors.userExists;
                break;
            case 'Email not confirmed':
                errorMessage = MESSAGES.errors.emailNotConfirmed;
                break;
            case 'Invalid email':
                errorMessage = MESSAGES.errors.invalidEmail;
                break;
            case 'Password should be at least 6 characters':
                errorMessage = MESSAGES.errors.shortPassword;
                break;
            case 'Too many requests':
                errorMessage = 'Demasiados intentos. Intenta de nuevo en unos minutos.';
                break;
            case 'User not found':
                errorMessage = 'No existe una cuenta con este correo electrónico.';
                break;
            case 'Signup is disabled':
                errorMessage = 'El registro está temporalmente deshabilitado.';
                break;
            default:
                errorMessage = `Error: ${error.message}`;
        }
    }

    return errorMessage;
};

// Función para mostrar estado de carga
export const showLoading = (show = true, containerId = 'loading') => {
    const loadingElement = document.getElementById(containerId);
    const mainContent = document.getElementById('main-content');

    if (loadingElement) {
        loadingElement.style.display = show ? 'flex' : 'none';
    }

    if (mainContent) {
        mainContent.style.display = show ? 'none' : 'block';
    }
};

// Función para mostrar contenido principal
export const showMainContent = () => {
    showLoading(false);
    const errorContent = document.getElementById('error-content');
    if (errorContent) {
        errorContent.style.display = 'none';
    }
};

// Función para mostrar error
export const showError = (message = 'Error de autenticación') => {
    showLoading(false);
    const mainContent = document.getElementById('main-content');
    const errorContent = document.getElementById('error-content');

    if (mainContent) {
        mainContent.style.display = 'none';
    }

    if (errorContent) {
        errorContent.style.display = 'flex';
        const errorText = errorContent.querySelector('p');
        if (errorText) {
            errorText.textContent = message;
        }
    }
};

// Función para formatear texto
export const formatUserName = (name) => {
    if (!name) return 'Usuario';

    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

// Función para formatear número de WhatsApp
export const formatWhatsApp = (phone) => {
    if (!phone) return '';

    // Remover todos los caracteres no numéricos excepto el +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // Si no tiene +, agregar +57 (Colombia) por defecto
    if (!cleaned.startsWith('+')) {
        cleaned = '+57' + cleaned;
    }

    return cleaned;
};

// Función para crear elementos de partículas
export const createParticles = (container, count = 9) => {
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${(i + 1) * (100 / (count + 1))}%`;
        particle.style.animationDelay = `${i * 0.8}s`;
        container.appendChild(particle);
    }
};

// Función para inicializar validaciones en tiempo real
export const initializeFormValidation = (formConfig) => {
    formConfig.forEach(({ inputId, validationId, validator, successMsg, errorMsg }) => {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('input', () => {
            const value = input.value;
            const isValid = validator(value);

            if (value.length > 0) {
                validateField(input, validationId, isValid, successMsg, errorMsg);
            } else {
                input.classList.remove('valid', 'invalid');
                const validationElement = document.getElementById(validationId);
                if (validationElement) {
                    validationElement.textContent = '';
                }
            }
        });
    });
};

// Función para limpiar validaciones
export const clearValidations = (inputIds) => {
    inputIds.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.classList.remove('valid', 'invalid');
        }
    });

    document.querySelectorAll('.validation-message').forEach(el => {
        el.textContent = '';
    });
};

// ===== FUNCIONES CRÍTICAS CORREGIDAS =====

/**
 * FIX CRÍTICO: Generar URL personalizada con parámetro socio
 * @param {string} baseUrl - URL base de la herramienta
 * @param {string} userId - ID del usuario/socio (UUID de Supabase)
 * @returns {string} URL con parámetro socio
 */
export const generatePersonalizedUrl = (baseUrl, userId) => {
    // FIX: Validar que baseUrl sea string
    if (!baseUrl || typeof baseUrl !== 'string' || !userId) {
        console.error('URL base debe ser string y userId requerido:', { baseUrl, userId });
        return baseUrl || '#';
    }

    try {
        const url = new URL(baseUrl);
        url.searchParams.set('socio', userId);
        const finalUrl = url.toString();
        console.log('🔗 URL personalizada generada:', finalUrl);
        return finalUrl;
    } catch (error) {
        console.error('❌ Error al generar URL personalizada:', error);
        return baseUrl;
    }
};

/**
 * FIX CRÍTICO: Generar enlace de WhatsApp SIN DESTINATARIO
 * Solo con el mensaje y enlace personalizado
 * @param {string} message - Mensaje a enviar
 * @param {string} toolUrl - URL de la herramienta personalizada
 * @returns {string} URL de WhatsApp web sin destinatario
 */
export const generateWhatsAppShareUrl = (message, toolUrl) => {
    try {
        // Construir mensaje completo
        let fullMessage = message || '¡Hola! Te comparto información sobre Gano Excel: ';
        if (toolUrl && typeof toolUrl === 'string') {
            fullMessage += toolUrl;
        }

        // Codificar mensaje para URL
        const encodedMessage = encodeURIComponent(fullMessage);

        // FIX CRÍTICO: WhatsApp Web SIN destinatario
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;

        console.log('📱 URL WhatsApp generada (sin destinatario):', whatsappUrl);
        return whatsappUrl;
    } catch (error) {
        console.error('❌ Error al generar URL de WhatsApp:', error);
        return '#';
    }
};

/**
 * FIX CRÍTICO: Compartir herramienta via WhatsApp SIN DESTINATARIO
 * El usuario elige a quién enviar el enlace
 * @param {string} toolType - Tipo de herramienta ('catalog' o 'business')
 * @param {Object} userProfile - Perfil del usuario con ID
 * @param {string} baseUrl - URL base de la herramienta
 */
export const shareToolWithWhatsApp = (toolType, userProfile, baseUrl) => {
    try {
        console.log('📱 shareToolWithWhatsApp llamada con:', { toolType, userProfile, baseUrl });

        // Validar datos requeridos
        if (!userProfile || !userProfile.id) {
            showMessage('❌ Error: Información de usuario no disponible', 'error');
            return;
        }

        // FIX: Verificar que baseUrl sea string válida
        if (!baseUrl || typeof baseUrl !== 'string') {
            console.error('❌ Error: URL base no válida:', baseUrl);
            showMessage('❌ Error: URL de herramienta no disponible', 'error');
            return;
        }

        // FIX CRÍTICO: Generar URL personalizada con parámetro socio
        const personalizedUrl = generatePersonalizedUrl(baseUrl, userProfile.id);
        console.log('🔗 URL personalizada:', personalizedUrl);

        // Generar mensaje apropiado según el tipo de herramienta
        let whatsappMessage;
        if (toolType === 'catalog') {
            whatsappMessage = '¡Hola! Te comparto nuestro catálogo completo de productos Gano Excel: ';
        } else if (toolType === 'business') {
            whatsappMessage = '¡Hola! Te comparto información sobre la oportunidad de negocio con Gano Excel: ';
        } else {
            whatsappMessage = '¡Hola! Te comparto información sobre Gano Excel: ';
        }

        // FIX CRÍTICO: Crear enlace de WhatsApp SIN DESTINATARIO
        const whatsappUrl = generateWhatsAppShareUrl(whatsappMessage, personalizedUrl);

        if (whatsappUrl === '#') {
            showMessage('❌ Error al generar enlace de WhatsApp', 'error');
            return;
        }

        // Abrir WhatsApp Web (sin destinatario)
        console.log('🚀 Abriendo WhatsApp Web:', whatsappUrl);
        window.open(whatsappUrl, '_blank');

        // Mostrar confirmación
        const toolName = toolType === 'catalog' ? 'Catálogo' : 'Modelo de Negocio';
        showMessage(`✅ ${toolName} listo para compartir via WhatsApp`, 'success');

    } catch (error) {
        console.error('❌ Error al compartir herramienta:', error);
        showMessage('❌ Error al generar enlace de WhatsApp', 'error');
    }
};

/**
 * FIX CRÍTICO: Obtener la ruta correcta para navegación
 * @param {string} targetPage - Página destino ('login', 'register', 'profile', 'portal')
 * @returns {string} Ruta relativa correcta
 */
export const getCorrectRoute = (targetPage) => {
    const currentPath = window.location.pathname;

    // Definir rutas base
    const routes = {
        login: 'auth/login.html',
        register: 'auth/register.html',
        profile: 'pages/profile.html',
        portal: 'index.html'
    };

    if (!routes[targetPage]) {
        console.error(`❌ Ruta '${targetPage}' no encontrada`);
        return '/';
    }

    // Determinar la ruta correcta basada en la ubicación actual
    if (currentPath.includes('/auth/')) {
        // Estamos en carpeta auth
        if (targetPage === 'login' || targetPage === 'register') {
            return routes[targetPage].split('/')[1]; // Solo el archivo
        } else {
            return '../' + routes[targetPage]; // Subir un nivel
        }
    } else if (currentPath.includes('/pages/')) {
        // Estamos en carpeta pages
        if (targetPage === 'profile') {
            return routes[targetPage].split('/')[1]; // Solo el archivo
        } else {
            return '../' + routes[targetPage]; // Subir un nivel
        }
    } else {
        // Estamos en la raíz
        return routes[targetPage];
    }
};

/**
 * FIX CRÍTICO: Función de logout con rutas corregidas y Supabase verificado
 */
export const logout = async () => {
    try {
        console.log('🚪 Iniciando logout...');

        // FIX CRÍTICO: Verificar que Supabase esté disponible
        if (typeof window.supabase === 'undefined') {
            console.error('❌ Supabase no está disponible');
            // Intentar limpiar localStorage al menos
            try {
                localStorage.removeItem('supabase.auth.token');
                sessionStorage.clear();
            } catch (e) {
                console.error('❌ Error al limpiar storage:', e);
            }
        } else {
            // Usar Supabase para cerrar sesión
            const { error } = await window.supabase.auth.signOut();
            if (error) {
                console.error('❌ Error al cerrar sesión en Supabase:', error);
            }
        }

        // Limpiar datos adicionales
        try {
            localStorage.removeItem('supabase.auth.token');
            sessionStorage.clear();
        } catch (e) {
            console.error('❌ Error al limpiar storage:', e);
        }

        // Mostrar mensaje de éxito
        showMessage('✅ Sesión cerrada correctamente', 'success');

        // FIX CRÍTICO: Redirección con ruta correcta después de delay
        setTimeout(() => {
            const loginPath = getCorrectRoute('login');
            console.log('🔄 Redirigiendo a:', loginPath);
            window.location.href = loginPath;
        }, 1500);

    } catch (error) {
        console.error('❌ Error durante logout:', error);

        // Aún así intentar redirigir
        setTimeout(() => {
            const loginPath = getCorrectRoute('login');
            window.location.href = loginPath;
        }, 1000);
    }
};

/**
 * Abrir herramienta directamente en nueva pestaña
 * @param {string} baseUrl - URL base de la herramienta
 * @param {Object} userProfile - Perfil del usuario (opcional)
 */
export const openTool = (baseUrl, userProfile = null) => {
    try {
        // FIX: Verificar que baseUrl sea string
        if (!baseUrl || typeof baseUrl !== 'string') {
            console.error('❌ Error: URL base no válida:', baseUrl);
            showMessage('❌ Error: URL de herramienta no disponible', 'error');
            return;
        }

        // Generar URL personalizada si hay ID de usuario
        let toolUrl = baseUrl;
        if (userProfile && userProfile.id) {
            toolUrl = generatePersonalizedUrl(baseUrl, userProfile.id);
        }

        // Abrir en nueva pestaña
        console.log('🔗 Abriendo herramienta:', toolUrl);
        window.open(toolUrl, '_blank');
        showMessage('✅ Abriendo herramienta', 'success');

    } catch (error) {
        console.error('❌ Error al abrir herramienta:', error);
        showMessage('❌ Error al abrir herramienta', 'error');
    }
};

// Configuración de herramientas - FIX: Asegurar que sean strings
export const TOOL_CONFIG = {
    catalog: {
        name: 'Catálogo Premium',
        url: 'https://catalogo.4millones.com/',
        description: 'Catálogo completo de productos Gano Excel'
    },
    business: {
        name: 'Modelo de Negocio',
        url: 'https://oportunidad.4millones.com/',
        description: 'Oportunidad de negocio con Gano Excel'
    }
};

// ===== EXPLICACIÓN DE CÓDIGOS UUID =====

/**
 * EXPLICACIÓN: El código que ves (5460d8d0-f3d4-4db0-99ca-48650a41ef57)
 * es el UUID (Universally Unique Identifier) del usuario en Supabase.
 *
 * - Cada usuario registrado tiene un UUID único
 * - Este UUID es diferente para cada cuenta
 * - Se usa como parámetro ?socio=UUID para tracking
 * - Es lo correcto y esperado para identificar al distribuidor
 *
 * No necesitas cambiarlo - es el sistema funcionando correctamente.
 */
