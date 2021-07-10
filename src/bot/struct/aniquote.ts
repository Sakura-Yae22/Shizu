/* eslint-disable @typescript-eslint/no-var-requires */
// const text = require(`${process.cwd()}/assets/animequote`);
const text = require(`./animequotes`);

interface animequote {
    quotenumber: number;
    quotesentence: string;
    quotecharacter: string;
    quoteanime: string;
}
export default async function getAnimeQuote(): Promise<animequote> {
    return text.default[Math.floor(Math.random() * text.default.length)];
}
