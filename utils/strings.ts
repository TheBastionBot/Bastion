/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

const toTitleCase = (string: string, splitSeparator: string = " ", joinSeprator: string = " "): string => {
    return string.split(splitSeparator).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(joinSeprator);
};

const toSnakeCase = (string: string, upperCase?: boolean): string => {
    const snakeString = string.split(" ").join("_");
    return upperCase ? snakeString.toUpperCase() : snakeString.toLowerCase();
};

const snakeToTitleCase = (string: string, separator = " "): string => {
    return toTitleCase(string, "_", separator);
    // return string.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(separator);
};


export {
    toTitleCase,
    toSnakeCase,
    snakeToTitleCase,
};
