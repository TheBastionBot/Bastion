/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import * as parser from "fast-xml-parser";

export const parse = (xml: string): unknown => {
    if (parser.validate(xml) === true) {
        return parser.parse(xml, {
            parseTrueNumberOnly: true,
        });
    }
    return {};
};
