// authService.js

const API_URL = 'http://localhost:3000'; // 🔹 apunta a tu backend

/**
 * Genera un UUID v4
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Obtiene el UUID del usuario o genera uno nuevo
 */
export const getUserUUID = () => {
  let uuid = localStorage.getItem('userUUID'); // 👈 usamos sessionStorage

  if (!uuid) {
    uuid = generateUUID();
    localStorage.setItem('userUUID', uuid); // 👈 guardamos en sessionStorage
  }

  return uuid;
};

// Aseguramos que exista UUID en sessionStorage
getUserUUID();

/**
 * Inicia sesión en el backend
 */
export const loginUser = async (username, password) => {
  try {
    const devUuid = getUserUUID();

    console.log("📤 Enviando al backend:", {
      usr_name: username,
      usr_passwd: password,
      devUuid
    });

    const response = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usr_name: username,
        usr_passwd: password,
        devUuid
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error en la autenticación');
    }

    const data = await response.json();

    // Guardamos usuario en sessionStorage
    sessionStorage.setItem('user', JSON.stringify(data));

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cierra sesión
 */
export const logoutUser = () => {
  sessionStorage.removeItem('user');
};

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = () => {
  const userStr = sessionStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};
