export default defineOAuthTwitchEventHandler({
    config: {
        scope: ['user:read:follows', 'user:read:email', 'user:read:moderated_channels']
    },
    async onSuccess(event, {user, tokens}) {
        user.moderated_channels = [] // add modded channel fetch here later
        await setUserSession(event, {
            user: user,
            secure: tokens
        })
        return sendRedirect(event, '/rrm')
    }
})