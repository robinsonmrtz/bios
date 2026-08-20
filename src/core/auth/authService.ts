// src/core/auth/authService.ts

export const authService = {
  // Verificar si ya está "configurada" (como laquemamos en env, siempre está lista)
  isPasswordSet(): boolean {
    return true; 
  },

  // Verificar si la contraseña ingresada es la correcta
  verifyPassword(password: string): boolean {
    const masterPassword = import.meta.env.VITE_MASTER_PASSWORD;
    return password === masterPassword;
  },

  // Mantener la sesión activa de forma simple en sessionStorage
  isAuthenticated(): boolean {
    return sessionStorage.getItem('bios_authenticated') === 'true';
  },

  setAuthenticated(status: boolean) {
    if (status) {
      sessionStorage.setItem('bios_authenticated', 'true');
    } else {
      sessionStorage.removeItem('bios_authenticated');
    }
  }
};