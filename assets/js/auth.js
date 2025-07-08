import { SUPABASE_CONFIG, APP_CONFIG, MESSAGES } from './config.js';
import { showMessage, updateButton, handleAuthError } from './utils.js';

// Cliente de Supabase
let supabaseClient;

// Inicializar Supabase
export const initializeSupabase = () => {
    if (typeof supabase === 'undefined') {
        throw new Error(MESSAGES.authRequired);
    }
    supabaseClient = supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey,
        SUPABASE_CONFIG.options
    );
    return supabaseClient;
};

// Obtener cliente de Supabase
export const getSupabaseClient = () => {
    if (!supabaseClient) {
        return initializeSupabase();
    }
    return supabaseClient;
};

// Guardia de seguridad mejorado - SIN bucles infinitos
export const authGuard = async (redirectOnFail = true) => {
    try {
        const client = getSupabaseClient();
        const { data: { session }, error } = await client.auth.getSession();

        if (error) {
            console.error('Error al verificar sesión:', error);
            if (redirectOnFail) {
                window.location.href = APP_CONFIG.routes.login;
            }
            return null;
        }

        if (!session) {
            if (redirectOnFail) {
                window.location.href = APP_CONFIG.routes.login;
            }
            return null;
        }

        return session;
    } catch (error) {
        console.error('Error inesperado en authGuard:', error);
        if (redirectOnFail) {
            window.location.href = APP_CONFIG.routes.login;
        }
        return null;
    }
};

// Verificar sesión existente (para páginas de login/register)
export const checkExistingSession = async (showLink = false) => {
    try {
        const client = getSupabaseClient();
        const { data: { session }, error } = await client.auth.getSession();

        if (error) {
            console.error('Error al verificar sesión:', error);
            return false;
        }

        if (session) {
            if (showLink) {
                showMessage(`${MESSAGES.sessionActive} <a href="${APP_CONFIG.routes.portal}" style="color: inherit; text-decoration: underline;">Ir al Portal</a>`, 'success');
            } else {
                showMessage(`${MESSAGES.sessionActive} Redirigiendo...`, 'success');
                setTimeout(() => {
                    window.location.href = APP_CONFIG.routes.portal;
                }, 1000);
            }
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error al verificar sesión existente:', error);
        return false;
    }
};

// Obtener perfil completo del usuario
export const getUserProfile = async () => {
    try {
        const session = await authGuard(false);
        if (!session) return null;

        const client = getSupabaseClient();

        // Intentar obtener perfil de la tabla profiles
        const { data: profile, error } = await client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error('Error al obtener perfil:', error);
        }

        // Combinar datos de auth con perfil
        return {
            id: session.user.id,
            email: session.user.email,
            full_name: profile?.full_name || session.user.user_metadata?.full_name || '',
            whatsapp: profile?.whatsapp || '',
            affiliate_link: profile?.affiliate_link || '',
            created_at: session.user.created_at,
            ...profile
        };
    } catch (error) {
        console.error('Error inesperado al obtener perfil:', error);
        return null;
    }
};

// Actualizar perfil del usuario
export const updateUserProfile = async (profileData) => {
    try {
        const session = await authGuard(false);
        if (!session) throw new Error('No hay sesión activa');

        const client = getSupabaseClient();

        // Preparar datos para actualizar
        const updateData = {
            id: session.user.id,
            email: session.user.email,
            full_name: profileData.full_name || session.user.user_metadata?.full_name || '',
            whatsapp: profileData.whatsapp || '',
            affiliate_link: profileData.affiliate_link || '',
            updated_at: new Date().toISOString()
        };

        // Usar upsert para crear o actualizar
        const { data, error } = await client
            .from('profiles')
            .upsert(updateData, { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        throw error;
    }
};

// Función de login
export const loginUser = async (email, password) => {
    try {
        const client = getSupabaseClient();
        const { data, error } = await client.auth.signInWithPassword({
            email: email.trim(),
            password: password
        });

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Función de registro
export const registerUser = async (fullName, email, password) => {
    try {
        const client = getSupabaseClient();
        const { data, error } = await client.auth.signUp({
            email: email.trim(),
            password: password,
            options: {
                data: {
                    full_name: fullName.trim()
                }
            }
        });

        if (error) {
            throw error;
        }

        // Intentar crear perfil si el registro fue exitoso
        if (data.user) {
            try {
                await updateUserProfile({
                    full_name: fullName.trim(),
                    whatsapp: '',
                    affiliate_link: ''
                });
            } catch (profileError) {
                console.warn('No se pudo crear el perfil inicial:', profileError);
                // No interrumpir el flujo de registro por esto
            }
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Función de logout
export const logoutUser = async () => {
    try {
        const client = getSupabaseClient();
        const { error } = await client.auth.signOut();
        if (error) {
            console.error('Error al cerrar sesión:', error);
        }
        window.location.href = APP_CONFIG.routes.login;
    } catch (error) {
        console.error('Error inesperado al cerrar sesión:', error);
        window.location.href = APP_CONFIG.routes.login;
    }
};

// Generar enlaces personalizados
export const getPersonalizedLinks = (userId) => {
    return {
        catalog: `${APP_CONFIG.tools.catalog}?socio=${userId}`,
        business: `${APP_CONFIG.tools.business}?socio=${userId}`
    };
};
