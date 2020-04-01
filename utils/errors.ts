/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

enum BASTION_ERRORS {
    COMMAND_SYNTAX_ERROR = "CommandSyntaxError",
}

class CommandSyntaxError extends Error {
    constructor(message: string) {
        super(message);
        this.name = BASTION_ERRORS.COMMAND_SYNTAX_ERROR;
    }
}


export {
    CommandSyntaxError,
};
