/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

import { XMLParser, XMLValidator } from "fast-xml-parser";

const parser = new XMLParser({
    numberParseOptions: {
        hex: true,
        leadingZeros: false,
    },
});

export const parse = (xml: string): unknown => {
    if (XMLValidator.validate(xml) === true) return parser.parse(xml);
    return {};
};
