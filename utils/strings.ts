/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

const snakeToTitleCase = (string: string, separator = " "): string => {
    return string.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(separator);
};


export {
    snakeToTitleCase,
};
