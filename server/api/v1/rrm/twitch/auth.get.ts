export default defineOAuthTwitchEventHandler({
    config: {
        scope: ['user:read:follows', 'user:read:email', 'user:read:moderated_channels']
    },
    async onSuccess(event, {user, tokens}) {
        await setUserSession(event, {
            user: user,
            secure: tokens
        })
        return sendRedirect(event, '/rrm')
    }
})