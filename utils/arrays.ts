/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

const toBulletList = (array: unknown[], bullet = "•"): string => {
    const string: string[] = [];

    for (const element of array) {
        string.push(bullet + " " + element.toString());
    }

    return string.join("\n") + "\n";
};


export {
    toBulletList,
};
