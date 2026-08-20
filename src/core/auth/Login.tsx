// src/core/auth/authService.ts

export const authService = {
  verifyPassword(password: string): boolean {
    const masterPassword = import.meta.env.VITE_MASTER_PASSWORD || '123456';
    return password === masterPassword;
  },

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

// --- Funciones de compatibilidad para que Login.tsx no falle ---
export function isSessionAuthenticated(): boolean {
  return sessionStorage.getItem('bios_authenticated') === 'true';
}

export function markSessionAuthenticated(): void {
  sessionStorage.setItem('bios_authenticated', 'true');
}

export async function hasPassword(): Promise<boolean> {
  return true;
}