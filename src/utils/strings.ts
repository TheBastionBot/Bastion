/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
// eslint-disable-next-line no-constant-binary-expression
const frequency = (string: string): { [key: string]: number } => [ ...string ].reduce((a: { [key: string]: number }, c) => (a[c] = a[c] + 1 || 1) && a, {});

const toTitleCase = (string: string, splitSeparator = " ", joinSeprator = " "): string => {
    return string.split(splitSeparator).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(joinSeprator);
};

const toSnakeCase = (string: string, upperCase?: boolean): string => {
    const snakeString = string.split(" ").join("_");
    return upperCase ? snakeString.toUpperCase() : snakeString.toLowerCase();
};

const camelToTitleCase = (string: string, separator = " "): string => {
    return toTitleCase(string.replace(/([A-Z])/g, " $1"), " ", separator).trim();
};

const snakeToTitleCase = (string: string, separator = " "): string => {
    return toTitleCase(string, "_", separator);
};

export {
    frequency,
    toTitleCase,
    toSnakeCase,
    camelToTitleCase,
    snakeToTitleCase,
};
