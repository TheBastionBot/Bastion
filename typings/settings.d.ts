import { TesseractConfigurations, TesseractCredentials } from "tesseract/typings/utils/settings";

interface BastionConfigurations extends TesseractConfigurations {
    port?: number;
}

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
