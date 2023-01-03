/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */

/**
 * Returns an array of elements split into groups of the specified size.
 * If array can't be split evenly, the final chunk will be the remaining elements.
 * @param array The array you want to split into chunks.
 * @param size The chunk size.
 */
export const chunks = <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

/**
 * Shuffles the array of elements in-place using the Fisher–Yates shuffle.
 * @param array The array you want to shuffle.
 */
export const shuffle = <T>(array: T[]) => {
    let currentIndex = array.length;
    while (currentIndex) {
        const randomIndex = Math.floor(Math.random() * currentIndex--);
        [ array[currentIndex], array[randomIndex] ] = [ array[randomIndex], array[currentIndex] ];
    }
};
