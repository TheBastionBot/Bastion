/*!
 * @author TRACTION (iamtraction)
 * @copyright 2021 - Sankarsan Kampa
 */

import * as requests from "./requests";

interface RedditPost {
    data: {
        children: {
            data: {
                title: string;
                permalink: string;
                url: string;
                selftext?: string;
                thumbnail?: string;
            };
        }[];
    };
}

export const getRandomPost = async (subreddit: string): Promise<RedditPost[]> => {
    const response = await requests.get("https://reddit.com/r/" + subreddit + "/random.json", {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0",
    });

    const data = await response.json();

    return data;
};
