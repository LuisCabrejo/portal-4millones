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

// Configuración de la aplicación
export const APP_CONFIG = {
    name: 'Organización 4 Millones',
    version: '1.0.0',
    routes: {
        login: '/auth/login.html',
        register: '/auth/register.html',
        portal: '/index.html',
        profile: '/pages/profile.html'
    },
    tools: {
        catalog: 'https://catalogo.4millones.com/',
        business: 'https://oportunidad.4millones.com/'
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
    errors: {
        invalidCredentials: 'Credenciales inválidas. Verifica tu email y contraseña.',
        userExists: 'Ya existe una cuenta con este correo electrónico.',
        emailNotConfirmed: 'Tu cuenta no ha sido confirmada. Revisa tu correo electrónico.',
        networkError: 'Error de conexión. Verifica tu internet e intenta de nuevo.',
        invalidEmail: 'Por favor, ingresa un correo electrónico válido.',
        shortPassword: 'La contraseña debe tener al menos 6 caracteres.',
        shortName: 'El nombre debe tener al menos 2 caracteres.'
    }
};
