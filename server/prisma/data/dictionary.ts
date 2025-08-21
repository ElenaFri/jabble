import raw from './dictionary.json';

export const DICTIONARY = new Set<string>(
    (raw as string[]).map(w => w.toUpperCase())
);
