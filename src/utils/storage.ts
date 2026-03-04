export const getStorage = <T>(key: string, defaultValue: T): T => {
const raw = localStorage.getItem(key);
return raw ? JSON.parse(raw) : defaultValue;
};


export const setStorage = (key: string, value: any) => {
localStorage.setItem(key, JSON.stringify(value));
};