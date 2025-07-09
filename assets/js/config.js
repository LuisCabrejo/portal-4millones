// Configuración global de Supabase
export const SUPABASE_CONFIG = {
    url: 'https://ovsvocjvjnqfaaugwnxg.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92c3ZvY2p2am5xZmFhdWd3bnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODEyMzcsImV4cCI6MjA2NzM1NzIzN30.ZErzsooaSXnS-NdmMYD0JcZFupFgrXfMLH-nOvU1NTE',
    options: {
        auth: {
            persistSession: true,
            autoRefreshToken: true
        }
    }
};

// Configuración de la aplicación - RUTAS CORREGIDAS
export const APP_CONFIG = {
    name: 'Organización 4 Millones',
    version: '1.0.0',
    routes: {
        // FIX CRÍTICO: Rutas corregidas sin /pages/
        login: '/auth/login.html',
        register: '/auth/register.html',
        resetPassword: '/auth/reset-password.html',
        portal: '/index.html',
        profile: '/pages/profile.html'
    },
    tools: {
        catalog: {
            name: 'Catálogo Premium',
            url: 'https://catalogo.4millones.com/',
            description: 'Explora nuestro catálogo completo de productos Gano Excel'
        },
        business: {
            name: 'Modelo de Negocio',
            url: 'https://oportunidad.4millones.com/',
            description: 'Descubre la oportunidad de negocio con Gano Excel'
        }
    },
    whatsapp: {
        // Configuración para mensajes de WhatsApp
        defaultMessage: '¡Hola! Me interesa conocer más sobre Gano Excel y su oportunidad de negocio. ',
        catalogMessage: 'Vi el catálogo de productos y me gustaría más información: ',
        businessMessage: 'Me interesa el modelo de negocio de Gano Excel: '
    }
};

// Mensajes de la aplicación
export const MESSAGES = {
    loading: 'Verificando autenticación...',
    loginSuccess: '¡Inicio de sesión exitoso! Redirigiendo al portal...',
    registerSuccess: '¡Registro exitoso! Revisa tu correo electrónico para confirmar tu cuenta.',
    profileUpdated: '✓ Perfil actualizado correctamente',
    authRequired: 'No se pudo cargar el sistema de autenticación',
    sessionActive: 'Ya tienes una sesión activa.',
    logoutSuccess: 'Sesión cerrada correctamente',
    errors: {
        invalidCredentials: 'Credenciales inválidas. Verifica tu email y contraseña.',
        userExists: 'Ya existe una cuenta con este correo electrónico.',
        emailNotConfirmed: 'Tu cuenta no ha sido confirmada. Revisa tu correo electrónico.',
        networkError: 'Error de conexión. Verifica tu internet e intenta de nuevo.',
        invalidEmail: 'Por favor, ingresa un correo electrónico válido.',
        shortPassword: 'La contraseña debe tener al menos 6 caracteres.',
        shortName: 'El nombre debe tener al menos 2 caracteres.',
        profileLoadError: 'Error al cargar el perfil del usuario.',
        profileUpdateError: 'Error al actualizar el perfil.'
    }
};

// Utilidades para URLs y enlaces personalizados
export const URL_UTILS = {
    /**
     * Genera URL personalizada con ID de socio
     * @param {string} baseUrl - URL base de la herramienta
     * @param {string} userId - ID del usuario/socio
     * @returns {string} URL con parámetro socio
     */
    generatePersonalizedUrl(baseUrl, userId) {
        if (!baseUrl || !userId) {
            console.error('URL base o ID de usuario faltante');
            return baseUrl || '#';
        }

        const url = new URL(baseUrl);
        url.searchParams.set('socio', userId);
        return url.toString();
    },

    /**
     * Genera enlace de WhatsApp con mensaje personalizado
     * @param {string} phoneNumber - Número de WhatsApp (con código de país)
     * @param {string} message - Mensaje a enviar
     * @param {string} toolUrl - URL de la herramienta compartida
     * @returns {string} URL de WhatsApp
     */
    generateWhatsAppUrl(phoneNumber, message, toolUrl = null) {
        if (!phoneNumber) {
            console.error('Número de WhatsApp requerido');
            return '#';
        }

        // Limpiar número de teléfono (remover espacios, guiones, etc.)
        const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');

        // Construir mensaje
        let fullMessage = message || APP_CONFIG.whatsapp.defaultMessage;
        if (toolUrl) {
            fullMessage += toolUrl;
        }

        // Codificar mensaje para URL
        const encodedMessage = encodeURIComponent(fullMessage);

        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    },

    /**
     * Obtiene la ruta correcta basada en la ubicación actual
     * @param {string} routeName - Nombre de la ruta del APP_CONFIG
     * @returns {string} Ruta relativa correcta
     */
    getCorrectRoute(routeName) {
        const route = APP_CONFIG.routes[routeName];
        if (!route) {
            console.error(`Ruta '${routeName}' no encontrada`);
            return '/';
        }

        // Determinar la ruta correcta basada en la ubicación actual
        const currentPath = window.location.pathname;

        // Si estamos en una subcarpeta (auth/, pages/), ajustar la ruta
        if (currentPath.includes('/auth/')) {
            return route.startsWith('/') ? '..' + route : '../' + route;
        } else if (currentPath.includes('/pages/')) {
            return route.startsWith('/') ? '..' + route : '../' + route;
        } else {
            // Estamos en la raíz
            return route.startsWith('/') ? '.' + route : './' + route;
        }
    }
};

// Configuración de validaciones
export const VALIDATION_CONFIG = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Ingresa un email válido'
    },
    password: {
        minLength: 6,
        message: 'La contraseña debe tener al menos 6 caracteres'
    },
    name: {
        minLength: 2,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        message: 'El nombre debe tener al menos 2 caracteres y solo letras'
    },
    phone: {
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        message: 'Ingresa un número de teléfono válido'
    }
};

// Configuración de características del portal
export const PORTAL_FEATURES = {
    // Herramientas disponibles para cada usuario
    userTools: [
        {
            id: 'catalog',
            name: 'Catálogo Premium',
            description: 'Catálogo completo de productos Gano Excel',
            icon: '📋',
            url: APP_CONFIG.tools.catalog.url,
            buttonText: 'Ver Catálogo',
            whatsappMessage: APP_CONFIG.whatsapp.catalogMessage
        },
        {
            id: 'business',
            name: 'Modelo de Negocio',
            description: 'Oportunidad de negocio con Gano Excel',
            icon: '💼',
            url: APP_CONFIG.tools.business.url,
            buttonText: 'Ver Oportunidad',
            whatsappMessage: APP_CONFIG.whatsapp.businessMessage
        }
    ],

    // Configuración del perfil de usuario
    profileFields: [
        {
            name: 'first_name',
            label: 'Nombre',
            type: 'text',
            required: true,
            placeholder: 'Tu nombre'
        },
        {
            name: 'last_name',
            label: 'Apellido',
            type: 'text',
            required: true,
            placeholder: 'Tu apellido'
        },
        {
            name: 'whatsapp',
            label: 'WhatsApp',
            type: 'tel',
            required: true,
            placeholder: '+57 300 123 4567'
        },
        {
            name: 'affiliate_link',
            label: 'Enlace de Afiliación',
            type: 'url',
            required: false,
            placeholder: 'https://tu-enlace-gano.com'
        }
    ]
};

// Exportar configuración global para uso en otros módulos
export default {
    SUPABASE_CONFIG,
    APP_CONFIG,
    MESSAGES,
    URL_UTILS,
    VALIDATION_CONFIG,
    PORTAL_FEATURES
};
