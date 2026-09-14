export const getLocalStorageItem = (itemKey: string): string => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(itemKey) ?? '';
  }
  return '';
};

export const setLocalStorageItem = (itemKey: string, itemValue: string): boolean => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(itemKey, itemValue);
    return true;
  }
  return false;
};

export const removeLocalStorageItem = (itemKey: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(itemKey);
    return;
  }
  return '';
};

// Only the signed-in session's own keys - a blanket `localStorage.clear()` would also
// wipe unrelated persisted data (e.g. the mock backend's work-plan store), which must
// survive sign-out so a team lead can still see/approve what an employee submitted
// after that employee has logged out.
const AUTH_STORAGE_KEYS = ['token', 'ref_token', 'last_login_time', 'remeber_me'];

export const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    AUTH_STORAGE_KEYS.forEach((key) => {
      window.localStorage.removeItem(key);
    });
  }
};
