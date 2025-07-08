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
