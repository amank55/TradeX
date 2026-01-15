import { Inngest} from "inngest";
import {serve} from "inngest/next";


export const inngest = new Inngest({
    id: 'signalist',
    ai: { gemini: { apiKey: process.env.GEMINI_API_KEY! }}
})

