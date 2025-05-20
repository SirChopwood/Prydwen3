import {z} from "zod";

export const setListener = z.strictObject({
    "channelName": z.string(),
})