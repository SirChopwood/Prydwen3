import express from "express";

export const get = async (req: express.Request, res: express.Response) => {
    console.log("auth code:", req.query.code)
    const tokenRequest = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            "client_id": process.env.TWITCH_CLIENTID!,
            "client_secret": process.env.TWITCH_SECRET!,
            "code": req.query.code as string,
            "grant_type": "authorization_code",
            "redirect_uri": process.env.TWITCH_CALLBACK!
        })
    })

    const token = await tokenRequest.json()
    console.log("auth token:", token)
    let tokenString = `${token.token_type} ${token.access_token}`
    console.log("tokenString:", tokenString)

    const userDataRequest = await fetch('https://api.twitch.tv/helix/channels', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": tokenString,
            "Client-Id": process.env.TWITCH_CLIENTID!
        }
    })

    let userData = await userDataRequest.json()

    console.log("User Data:", userData)

    return res.json(userData)
}