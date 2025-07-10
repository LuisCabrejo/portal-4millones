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

// ===== 🚀 FUNCIONES CRÍTICAS CORREGIDAS - WHATSAPP API FIX =====

/**
 * 🎯 NUEVO: Generar slug amigable desde nombre completo
 * @param {string} fullName - Nombre completo del usuario
 * @returns {string} Slug amigable (ej: "luis-cabrejo")
 */
export const generateDistributorSlug = (fullName) => {
    if (!fullName || typeof fullName !== 'string') {
        console.error('❌ generateDistributorSlug: fullName inválido:', fullName);
        return null;
    }

    try {
        // Extraer primer nombre + primer apellido
        const parts = fullName.trim().split(' ');
        const nombreApellido = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0];

        // Convertir a slug amigable
        const slug = nombreApellido
            .toLowerCase()
            .normalize('NFD') // Descomponer caracteres acentuados
            .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos
            .replace(/[^a-z0-9\s]/g, '') // Solo letras, números y espacios
            .replace(/\s+/g, '-') // Espacios a guiones
            .replace(/-+/g, '-') // Múltiples guiones a uno
            .replace(/^-|-$/g, ''); // Remover guiones al inicio/final

        console.log('🎯 Slug generado exitosamente:', `"${fullName}" → "${slug}"`);
        return slug;
    } catch (error) {
        console.error('❌ Error al generar slug:', error);
        return null;
    }
};

/**
 * 🚨 FIX CRÍTICO: Generar URL personalizada con debugging extensivo
 * @param {string} baseUrl - URL base de la herramienta
 * @param {Object} userProfile - Perfil completo del usuario
 * @returns {string} URL con parámetro distribuidor amigable
 */
export const generatePersonalizedUrl = (baseUrl, userProfile) => {
    console.log('🔍 DEBUG generatePersonalizedUrl llamada con:', {
        baseUrl: baseUrl,
        userProfile: userProfile,
        tipo_userProfile: typeof userProfile,
        userProfile_keys: userProfile ? Object.keys(userProfile) : 'null'
    });

    // Validar parámetros básicos
    if (!baseUrl || typeof baseUrl !== 'string') {
        console.error('❌ URL base inválida:', baseUrl);
        return '#';
    }

    if (!userProfile || typeof userProfile !== 'object') {
        console.error('❌ userProfile inválido:', userProfile);
        return baseUrl;
    }

    try {
        const url = new URL(baseUrl);

        // 🚨 FIX CRÍTICO: Debugging extensivo del perfil
        console.log('🔍 Analizando perfil del usuario:', {
            id: userProfile.id,
            full_name: userProfile.full_name,
            email: userProfile.email,
            whatsapp: userProfile.whatsapp
        });

        // Intentar generar slug amigable
        const slug = generateDistributorSlug(userProfile.full_name);

        if (slug && slug.length > 0) {
            // ✅ Usar parámetro distribuidor amigable
            url.searchParams.set('distribuidor', slug);
            console.log('✅ URL amigable generada exitosamente:', {
                usuario: userProfile.full_name,
                slug: slug,
                url_final: url.toString()
            });
        } else {
            // 🚨 FIX: Fallback más robusto
            const userId = userProfile.id || userProfile.user_id || userProfile.uuid;
            if (userId) {
                url.searchParams.set('socio', userId);
                console.log('⚠️ Fallback a UUID usado:', {
                    usuario: userProfile.full_name || 'Sin nombre',
                    userId: userId,
                    url_final: url.toString()
                });
            } else {
                console.error('❌ No se encontró ID del usuario válido:', userProfile);
                // Último fallback: usar timestamp
                url.searchParams.set('ref', Date.now().toString());
                console.log('🆘 Último fallback con timestamp usado');
            }
        }

        const finalUrl = url.toString();
        console.log('🔗 URL personalizada FINAL:', finalUrl);
        return finalUrl;

    } catch (error) {
        console.error('❌ Error crítico al generar URL personalizada:', error);
        return baseUrl;
    }
};

/**
 * 🚨 FIX CRÍTICO WHATSAPP: Generar enlace de WhatsApp con debugging
 * @param {string} message - Mensaje a enviar
 * @param {string} toolUrl - URL de la herramienta personalizada
 * @returns {string} URL de WhatsApp API
 */
export const generateWhatsAppShareUrl = (message, toolUrl) => {
    console.log('📱 DEBUG generateWhatsAppShareUrl llamada con:', {
        message: message,
        toolUrl: toolUrl,
        tipo_toolUrl: typeof toolUrl
    });

    try {
        // Construir mensaje completo
        let fullMessage = message || '¡Hola! Te comparto información sobre Gano Excel: ';

        if (toolUrl && typeof toolUrl === 'string' && toolUrl !== '#') {
            fullMessage += toolUrl;
        } else {
            console.warn('⚠️ toolUrl no válida, usando mensaje sin enlace:', toolUrl);
        }

        // Codificar mensaje para URL
        const encodedMessage = encodeURIComponent(fullMessage);

        // 🚨 FIX CRÍTICO: api.whatsapp.com sin destinatario
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

        console.log('✅ URL WhatsApp generada correctamente:', {
            mensaje_completo: fullMessage,
            url_whatsapp: whatsappUrl
        });

        return whatsappUrl;
    } catch (error) {
        console.error('❌ Error al generar URL de WhatsApp:', error);
        return '#';
    }
};

/**
 * 🚨 FIX CRÍTICO WHATSAPP: Compartir herramienta con debugging extensivo
 * @param {string} toolType - Tipo de herramienta ('catalog' o 'business')
 * @param {Object} userProfile - Perfil COMPLETO del usuario
 * @param {string} baseUrl - URL base de la herramienta
 */
export const shareToolWithWhatsApp = (toolType, userProfile, baseUrl) => {
    console.log('🚀 DEBUG shareToolWithWhatsApp - INICIO:', {
        toolType: toolType,
        userProfile: userProfile,
        baseUrl: baseUrl
    });

    try {
        // 🚨 FIX: Validar datos de entrada más robustamente
        if (!userProfile || typeof userProfile !== 'object') {
            console.error('❌ userProfile inválido:', userProfile);
            showMessage('❌ Error: Información de usuario no disponible', 'error');
            return;
        }

        if (!baseUrl || typeof baseUrl !== 'string') {
            console.error('❌ baseUrl inválida:', baseUrl);
            showMessage('❌ Error: URL de herramienta no disponible', 'error');
            return;
        }

        // 🚨 FIX CRÍTICO: Generar URL personalizada con perfil COMPLETO
        console.log('🔗 Generando URL personalizada...');
        const personalizedUrl = generatePersonalizedUrl(baseUrl, userProfile);

        if (!personalizedUrl || personalizedUrl === '#') {
            console.error('❌ No se pudo generar URL personalizada');
            showMessage('❌ Error al generar enlace personalizado', 'error');
            return;
        }

        // Generar mensaje apropiado según el tipo de herramienta
        let whatsappMessage;
        if (toolType === 'catalog') {
            whatsappMessage = '¡Hola! Te comparto nuestro catálogo completo de productos Gano Excel: ';
        } else if (toolType === 'business') {
            whatsappMessage = '¡Hola! Te comparto información sobre la oportunidad de negocio con Gano Excel: ';
        } else {
            whatsappMessage = '¡Hola! Te comparto información sobre Gano Excel: ';
        }

        // 🚨 FIX CRÍTICO: Crear enlace de WhatsApp
        console.log('📱 Generando enlace de WhatsApp...');
        const whatsappUrl = generateWhatsAppShareUrl(whatsappMessage, personalizedUrl);

        if (whatsappUrl === '#') {
            console.error('❌ No se pudo generar enlace de WhatsApp');
            showMessage('❌ Error al generar enlace de WhatsApp', 'error');
            return;
        }

        // ✅ Abrir WhatsApp API
        console.log('🚀 Abriendo WhatsApp con URL:', whatsappUrl);
        window.open(whatsappUrl, '_blank');

        // Mostrar confirmación
        const toolName = toolType === 'catalog' ? 'Catálogo' : 'Modelo de Negocio';
        showMessage(`✅ ${toolName} listo para compartir`, 'success');

        console.log('✅ shareToolWithWhatsApp completado exitosamente');

    } catch (error) {
        console.error('❌ Error crítico en shareToolWithWhatsApp:', error);
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
    console.log('🔗 DEBUG openTool llamada con:', {
        baseUrl: baseUrl,
        userProfile: userProfile
    });

    try {
        // FIX: Verificar que baseUrl sea string
        if (!baseUrl || typeof baseUrl !== 'string') {
            console.error('❌ Error: URL base no válida:', baseUrl);
            showMessage('❌ Error: URL de herramienta no disponible', 'error');
            return;
        }

        // Generar URL personalizada si hay perfil de usuario
        let toolUrl = baseUrl;
        if (userProfile && typeof userProfile === 'object') {
            toolUrl = generatePersonalizedUrl(baseUrl, userProfile);
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

/**
 * 🎯 FUNCIÓN PARA ENLACES EN PERFIL: Generar enlaces personalizados
 * @param {Object} userProfile - Perfil completo del usuario
 * @returns {Object} Objeto con enlaces personalizados
 */
export const getPersonalizedLinks = (userProfile) => {
    console.log('🔗 DEBUG getPersonalizedLinks llamada con:', userProfile);

    if (!userProfile || typeof userProfile !== 'object') {
        console.warn('⚠️ userProfile no válido, devolviendo enlaces por defecto');
        return {
            catalog: 'https://catalogo.4millones.com/',
            business: 'https://oportunidad.4millones.com/'
        };
    }

    try {
        // Generar enlaces usando las URLs del TOOL_CONFIG
        const catalogUrl = generatePersonalizedUrl(TOOL_CONFIG.catalog.url, userProfile);
        const businessUrl = generatePersonalizedUrl(TOOL_CONFIG.business.url, userProfile);

        console.log('🔗 Enlaces personalizados generados exitosamente:', {
            catalog: catalogUrl,
            business: businessUrl
        });

        return {
            catalog: catalogUrl,
            business: businessUrl
        };
    } catch (error) {
        console.error('❌ Error generando enlaces personalizados:', error);
        return {
            catalog: TOOL_CONFIG.catalog.url,
            business: TOOL_CONFIG.business.url
        };
    }
};

// Configuración de herramientas
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

// ===== 📱 FIX CRÍTICO HEADER MOBILE AUTH PAGES =====

/**
 * 📱 FIX CRÍTICO: Detectar si estamos en página de autenticación
 * Para evitar mostrar header mobile en auth pages
 * @returns {boolean} true si estamos en página de auth
 */
export const isAuthPage = () => {
    const currentPath = window.location.pathname;
    return currentPath.includes('/auth/') ||
           currentPath.includes('login.html') ||
           currentPath.includes('register.html') ||
           currentPath.includes('reset-password.html');
};

/**
 * 📱 FIX CRÍTICO: Controlar visibilidad del header mobile
 * Ocultar en páginas de auth, mostrar en portal
 */
export const controlMobileHeader = () => {
    const mobileHeader = document.querySelector('.mobile-header');

    if (mobileHeader) {
        if (isAuthPage()) {
            // Ocultar en páginas de auth
            mobileHeader.style.display = 'none';
            document.body.style.paddingTop = '0';
            console.log('📱 Header mobile oculto en página de auth');
        } else {
            // Mostrar en otras páginas
            if (window.innerWidth <= 768) {
                mobileHeader.style.display = 'block';
                document.body.style.paddingTop = '70px';
                console.log('📱 Header mobile mostrado en portal');
            }
        }
    }
};

/**
 * 📱 FIX CRÍTICO: Inicializar control de header mobile
 * Llamar en todas las páginas para control automático
 */
export const initializeMobileHeaderControl = () => {
    // Control inicial
    controlMobileHeader();

    // Control en cambio de orientación
    window.addEventListener('orientationchange', () => {
        setTimeout(controlMobileHeader, 100);
    });

    // Control en redimensión
    window.addEventListener('resize', controlMobileHeader);

    console.log('📱 Control de header mobile inicializado');
};

/**
 * 📱 FIX CRÍTICO ADICIONAL: Función para ocultar header en páginas de auth
 * Se ejecuta automáticamente en cada página
 */
export const forceHideHeaderInAuth = () => {
    if (isAuthPage()) {
        const mobileHeader = document.querySelector('.mobile-header');
        if (mobileHeader) {
            mobileHeader.style.display = 'none';
            mobileHeader.style.visibility = 'hidden';
            mobileHeader.style.opacity = '0';
            mobileHeader.style.pointerEvents = 'none';
        }

        // Asegurar que body no tenga padding-top
        document.body.style.paddingTop = '0';
        console.log('📱 Header mobile forzadamente oculto en página auth');
    }
};
