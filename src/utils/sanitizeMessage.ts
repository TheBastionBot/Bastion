/*!
 * @author TRACTION (iamtraction)
 * @copyright 2022
 */
const sanitizeMessage = (message: string, limit = 2000): string => {
    return message.length > limit ? message.slice(0, (limit - 3)) + "..." : message;
};

export default sanitizeMessage;
