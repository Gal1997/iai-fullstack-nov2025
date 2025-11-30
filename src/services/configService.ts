import type { ConfigType } from '../types/config';
import defaultConfig from '../utils/defaultConfig';

const KEY = 'config';

/* Will return config from local storage or default config if doesn't exist */
export const getConfig = (): ConfigType => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : defaultConfig;
};

/* Saves given config to local storage*/
export const saveConfig = (config: ConfigType): void => {
    localStorage.setItem(KEY, JSON.stringify(config));
};

/* Deletes given config from local storage*/
export const removeConfig = (): void => {
    localStorage.removeItem(KEY);
};


