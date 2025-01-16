import express from "express";

export const get = async (req: express.Request, res: express.Response) => {
    const scope = encodeURI("user:read:follows user:read:email")
    return res.redirect(`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.TWITCH_CLIENTID}&redirect_uri=${process.env.TWITCH_CALLBACK}&scope=${scope}`)
}