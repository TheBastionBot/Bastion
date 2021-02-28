/*!
 * @author TRACTION (iamtraction)
 * @copyright 2020 - Sankarsan Kampa
 */

export enum BASTION_ERROR_TYPE {
    ERROR = "Error",
    INVALID_COMMAND_SYNTAX = "Invalid Command Syntax",
    PREMIUM_MEMBERSHIP_REQUIRED = "Premium Membership Required",
    LIMITED_PREMIUM_MEMBERSHIP = "Limited Premium Membership",
    ROLE_NOT_FOUND = "Role Not Found",
}

export class BastionError extends Error {
    constructor(title: string, message: string) {
        super(message);
        this.name = title;
    }
}

export class ConsoleError extends BastionError {
    constructor(title: string, message: string) {
        super(title, message);
    }
}

export class DiscordError extends BastionError {
    constructor(title: string, message: string) {
        super(title, message);
    }
}
