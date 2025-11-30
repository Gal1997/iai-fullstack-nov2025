// src/utils/formatData.ts
import type { ConfigType } from '../types/config';

/* This function does
1) removes vdd from JSON if disabled
2) Transform recentFixes into string array instead of 1 big string
3) Format releaseDate to dd/mm/yyyy (Israel standard)
*/

export const formatData = (data: ConfigType, VDDenabled: boolean): ConfigType => {
    const formatted: ConfigType = structuredClone(data);
    // Clone data so we don’t mutate the original form state !!
    // Otherwise we will push an unsupported format to our date picker because we changed data.vdd.releaseDate


    if (!VDDenabled) {
        delete formatted.vdd;
    } else if (formatted.vdd) {
        if (formatted.vdd.recentFixes && typeof formatted.vdd.recentFixes === 'string') {
            formatted.vdd.recentFixes = formatted.vdd.recentFixes
                .split(',') // split to array 
                .map((s: string) => s.trim()) // map to trimmed version (no spaces)
                .filter((s: string) => s.length > 0); // filter empty (example, if input is : 'hey ,, hello' then we don't want ["hey ", "", " hello"])
        }
        if (formatted.vdd.releaseDate && typeof formatted.vdd.releaseDate === 'string') {
            const parts = formatted.vdd.releaseDate.split('-');
            if (parts.length === 3) {
                const [year, month, day] = parts;
                formatted.vdd.releaseDate = `${day}/${month}/${year}`;
            } else {
                formatted.vdd.releaseDate = "";
            }
        }
    }

    return formatted;
};

export default formatData;
