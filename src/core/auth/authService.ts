export const authService = {
  verifyPassword(password: string): boolean {
    const storedPassword = localStorage.getItem('bios_master_password');
    const masterPassword = storedPassword || import.meta.env.VITE_MASTER_PASSWORD || '123456';
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
  },

  setPassword(password: string): void {
    localStorage.setItem('bios_master_password', password);
  },

  clearSession() {
    sessionStorage.removeItem('bios_authenticated');
  }
};

export function isSessionAuthenticated(): boolean {
  return sessionStorage.getItem('bios_authenticated') === 'true';
}

export function markSessionAuthenticated(): void {
  sessionStorage.setItem('bios_authenticated', 'true');
}

export function clearSession(): void {
  sessionStorage.removeItem('bios_authenticated');
}

export async function hasPassword(): Promise<boolean> {
  return Boolean(localStorage.getItem('bios_master_password') || import.meta.env.VITE_MASTER_PASSWORD || '123456');
}

export function setPassword(password: string): void {
  authService.setPassword(password);
}