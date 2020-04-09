/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as numbers from "./numbers";


const shuffle = (array: unknown[]): unknown[] => {
    const shuffledArray: unknown[] = [];

    for (let i = 0; i < array.length; i++) {
        const j = numbers.getRandomInt(0, i);
        if (i !== j) shuffledArray[i] = shuffledArray[j];
        shuffledArray[j] = array[i];
    }
    return shuffledArray;
};

const toBulletList = (array: unknown[], bullet = "•"): string => {
    const string: string[] = [];

    for (const element of array) {
        string.push(bullet + " " + element.toString());
    }

    return string.join("\n") + "\n";
};

const wrap = (array: unknown[], separator: string): unknown[] => {
    return array.map(e => separator + e + separator);
};


export {
    shuffle,
    toBulletList,
    wrap,
};
