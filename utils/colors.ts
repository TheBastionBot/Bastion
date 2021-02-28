/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { REGEX_CMYK, REGEX_HEX, REGEX_RGB } from "./regex";

export interface Color {
    hex: string;
    rgb: [ number, number, number ];
    cmyk: [ number, number, number, number ];
    integer: number;
}

export type colorResolvable = Color[keyof Color];

export const cmykToRgb = (cmyk: Color["cmyk"]): Color["rgb"] => {
    const c = cmyk[0] / 100;
    const m = cmyk[1] / 100;
    const y = cmyk[2] / 100;
    const k = cmyk[3] / 100;

    const r = 1 - Math.min(1, c * (1 - k) + k);
    const g = 1 - Math.min(1, m * (1 - k) + k);
    const b = 1 - Math.min(1, y * (1 - k) + k);

    return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
};

export const rgbToCmyk = (rgb: Color["rgb"]): Color["cmyk"] => {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const k = Math.min(1 - r, 1 - g, 1 - b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return [ c * 100, m * 100, y * 100, k * 100 ];
};

export const rgbToInt = (rgb: Color["rgb"]): number => {
    return ((Math.round(rgb[0]) & 0xFF) << 16) + ((Math.round(rgb[1]) & 0xFF) << 8) + (Math.round(rgb[2]) & 0xFF);
};

export const intToHex = (int: Color["integer"]): Color["hex"] => {
    const string = int.toString(16).toUpperCase();
    return "000000".substring(string.length) + string;
};

export const intToRgb = (int: Color["integer"]): Color["rgb"] => {
    return [ (int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF ];
};

export const hexToInt = (hex: Color["hex"]): number => {
    return Number.parseInt(hex, 16);
};

export const parse = (colorString: string): Color => {
    let cmyk: Color["cmyk"], rgb: Color["rgb"], hex: Color["hex"], integer: Color["integer"];

    if (REGEX_CMYK.test(colorString)) {
        const cmykString = colorString.split(" ");

        const c = Number.parseInt(cmykString[0]);
        const m = Number.parseInt(cmykString[1]);
        const y = Number.parseInt(cmykString[2]);
        const k = Number.parseInt(cmykString[3]);

        cmyk = [ c, m, y, k ];
        rgb = cmykToRgb([ c, m, y, k ]);
        integer = rgbToInt(rgb);
        hex = intToHex(integer);
    } else if (REGEX_RGB.test(colorString)) {
        const rgbString = colorString.split(" ");

        const r = Number.parseInt(rgbString[0]);
        const g = Number.parseInt(rgbString[1]);
        const b = Number.parseInt(rgbString[2]);

        rgb = [ r, g, b ];
        cmyk = rgbToCmyk(rgb);
        integer = rgbToInt(rgb);
        hex = intToHex(integer);
    } else if (REGEX_HEX.test(colorString)) {
        let hexString = colorString.includes("#") ? colorString.split("#")[1] : colorString;
        if (hexString.length === 3) {
            hexString = hexString.split("").map(c => c + c).join("");
        }

        integer = hexToInt(hexString);
        rgb = intToRgb(integer);
        cmyk = rgbToCmyk(rgb);
        hex = hexString;
    } else return null;

    return { cmyk, rgb, hex, integer };
};
