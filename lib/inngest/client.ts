import { Inngest} from "inngest";
import {serve} from "inngest/next";
import { helloWorld } from "./functions";

export const inngest = new Inngest({
    id: 'signalist',
    ai: { gemini: { apiKey: process.env.GEMINI_API_KEY! }}
})

