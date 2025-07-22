const TOKEN_KEY = 'token';

export const setToken = (token: string) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};