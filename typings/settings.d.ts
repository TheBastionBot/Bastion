import { TesseractCredentials } from "tesseract/typings/utils/settings";

interface BastionCredentials extends TesseractCredentials {
    bastion: {
        webhookID: string;
        webhookToken: string;
    };
    twitch: {
        clientId: string;
        clientSecret: string;
        accessToken: string;
    };
}
