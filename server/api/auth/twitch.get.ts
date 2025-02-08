export default defineOAuthTwitchEventHandler({
    config: {
        scope: ['user:read:follows', 'user:read:email', 'user:read:moderated_channels']
    },
    async onSuccess(event, {user, tokens}) {
        await setUserSession(event, {
            user: user as {
                "id": string,
                "login": string,
                "display_name": string,
                "type": string,
                "broadcaster_type": string,
                "description": string,
                "profile_image_url": string,
                "offline_image_url": string,
                "view_count": number,
                "email": string,
                "created_at": string
            },
            secure: tokens as {
                "access_token": string,
                "expires_in": number,
                "refresh_token": string,
                "scope": Array<string>,
                "token_type": string
            }
        })
        console.log("Success User: ", user)
        console.log("Tokens: ", tokens)
        console.log(event)
        return sendRedirect(event, '/rrm')
    }
})