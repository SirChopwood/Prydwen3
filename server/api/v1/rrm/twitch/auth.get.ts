import {createChannel, isChannelRegistered} from "~/server/utils/rrm/twitch";

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
        if (!await isChannelRegistered({name: user.name, id: user.id})) {
            await createChannel({name: user.name, id: user.id}, "#ffffff")
        }
        return sendRedirect(event, '/rrm')
    }
})