/*!
 * @author Sankarsan Kampa (k3rn31p4nic)
 * @copyright 2020 - The Bastion Bot Project
 */

enum BASTION_ERRORS {
    COMMAND_SYNTAX_ERROR = "Command Syntax Error",
    PREMIUM_MEMBERSHIP_ERROR = "Premium Membership Error",
    ROLE_NOT_FOUND = "Role Not Found",
}

class CommandSyntaxError extends Error {
    constructor(message: string) {
        super(message);
        this.name = BASTION_ERRORS.COMMAND_SYNTAX_ERROR;
    }
}

class PremiumMembershipError extends Error {
    constructor(message: string) {
        super(message);
        this.name = BASTION_ERRORS.PREMIUM_MEMBERSHIP_ERROR;
    }
}

class RoleNotFound extends Error {
    constructor(message: string) {
        super(message);
        this.name = BASTION_ERRORS.ROLE_NOT_FOUND;
    }
}


export {
    CommandSyntaxError,
    PremiumMembershipError,
    RoleNotFound,
};
