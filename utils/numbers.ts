/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

const abbreviate = (number: number): string => {
    const SI_PREFIX_SYMBOL = [ "", "k", "M", "G", "T", "P", "E", "Z", "Y" ];

    // determine SI symbol
    const symbolIndex = Math.log10(Math.abs(number)) / 3 | 0;

    if (symbolIndex === 0) return number.toString();

    // scale the number
    const scaled = number / Math.pow(10, symbolIndex * 3);

    // format number and add si symbol as suffix
    return scaled.toFixed(3).replace(/(?:\.0+|0+)$/, "") + SI_PREFIX_SYMBOL[symbolIndex];
};

type ClampFunction = {
    (number: number, upper: number): number;
    (number: number, lower: number, upper: number): number;
}
const clamp: ClampFunction = (number: number, lower: number, upper?: number): number => {
    if (typeof upper !== "number") {
        [ lower, upper ] = [ -Infinity, lower ];
    } else {
        [ lower, upper ] = [ Math.min(lower, upper), Math.max(lower, upper) ];
    }
    return Math.max(lower, Math.min(number, upper));
};

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

type InRangeFunction = {
    (number: number, upper: number): boolean;
    (number: number, lower: number, upper: number): boolean;
}
const inRange: InRangeFunction = (number: number, lower: number, upper?: number): boolean => {
    if (typeof upper !== "number") {
        [ lower, upper ] = [ -Infinity, lower ];
    }
    return number >= Math.min(lower, upper) && number <= Math.max(lower, upper);
};


export {
    abbreviate,
    clamp,
    getRandomInt,
    inRange,
};
