import { User } from "../types";

export const clientStorage = {
  setUser(key: string, user: User) {
    localStorage.setItem(key, JSON.stringify(user));
  },
  getUser(key: string): User | null {
    const user = localStorage.getItem(key);
    return user ? JSON.parse(user) : null;
  },
  clearUser(key: string) {
    localStorage.removeItem(key);
  },
  setRememberMe(key: string, value: boolean) {
    localStorage.setItem(key, String(value));
  },
  getRememberMe(key: string) {
    const value = localStorage.getItem(key);
    return value ? true : false;
  },
  clearRememberMe(key: string) {
    localStorage.removeItem(key);
  },
};

export const sessionStore = {
  setUser(key: string, user: User) {
    sessionStorage.setItem(key, JSON.stringify(user));
  },
  clearUser(key: string) {
    sessionStorage.removeItem(key);
  },
};

/** Generic JSON persistence for learner profile and similar local state */
export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string) {
    localStorage.removeItem(key);
  },
};
