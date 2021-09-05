import { TesseractConfigurations, TesseractCredentials } from "@bastion/tesseract/typings/utils/settings";

interface BastionConfigurations extends TesseractConfigurations {
    port?: number;
    music?: {
        activity?: boolean;
    };
}

interface BastionCredentials extends TesseractCredentials {
    bastion: {
        webhookID: string;
        webhookToken: string;
    };
    google: {
        apiKey: string;
    };
    twitch: {
        clientId: string;
        clientSecret: string;
        accessToken: string;
    };
    nasaApiKey: string;
    wordnikApiKey: string;
    tmdbApiKey: string;
    openWeatherMapApiKey: string;
    coinMarketCapApiKey: string;
    rocketLeagueApiKey: string;
    trackerNetworkApiKey: string;
}
