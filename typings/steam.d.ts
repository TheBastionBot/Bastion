interface SteamProfile {
    profile?: {
        steamID64?: string | null;
        steamID?: string | null;
        onlineStatus?: string | null;
        statusMessage?: string | null;
        privacyState?: string | null;
        visibilityState?: string | null;
        avatarIcon?: string | null;
        avatarMedium?: string | null;
        avatarFull?: string | null;
        vacBanned?: string | null;
        tradeBanState?: string | null;
        isLimitedAccount?: string | null;
        customURL?: string | null;
        memberSince?: string | null;
        steamRating?: string | null;
        hoursPlayed2Wk?: string | null;
        headline?: string | null;
        location?: string | null;
        realname?: string | null;
        summary?: string | null;
    };
}
