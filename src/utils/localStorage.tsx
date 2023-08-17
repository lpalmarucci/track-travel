export const saveValueToLocalStorage = (key: string, value: unknown) => {
  if (localStorage.getItem(key)) localStorage.removeItem(key);
  localStorage.setItem(key, JSON.stringify(value));
};

export const getValueFromLocalStorage = (key: string): unknown | undefined => {
  const value = localStorage.getItem(key);
  return value && JSON.parse(value);
};
