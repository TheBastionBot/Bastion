/*!
 * @author Sankarsan Kampa (iamtraction)
 * @copyright 2020 - The Bastion Bot Project
 */

import * as numbers from "./numbers";

export default (percentage = 0, steps = 10): string => {
    percentage = numbers.clamp(percentage, 0, 100);

    const markers = {
        filled: "#",
        unfilled: "-",
    };

    const progress = Math.round((percentage / 100) * steps);

    return "[" + markers.filled.repeat(progress) + markers.unfilled.repeat(steps - progress) + "]";
};
