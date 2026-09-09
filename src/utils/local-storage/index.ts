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

export const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
  }
};
