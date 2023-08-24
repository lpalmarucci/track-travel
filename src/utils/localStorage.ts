export const saveValueToLocalStorage = (key: string, value: unknown) => {
  if (localStorage.getItem(key)) localStorage.removeItem(key);
  localStorage.setItem(key, JSON.stringify(value));
};

export const getValueFromLocalStorage = <T>(key: string): T | undefined => {
  const value = localStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : undefined;
};
