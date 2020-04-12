import { TesseractCredentials } from "tesseract/typings/utils/settings";

interface BastionCredentials extends TesseractCredentials {
    twitch: {
        clientId: string;
        clientSecret: string;
        accessToken: string;
    };
}
