import {z} from "zod"
import {H3Event} from "h3";
import {getUserSession} from "#imports";
import type {User, SecureSessionData} from "#auth-utils";

// Ensures the body of the request meets the given schema, optionally enforcing Twitch OAuth too. If it fails to validate, a 400 response will be sent with the reasoning.
export async function validateRequest<schema extends z.ZodTypeAny> (event: H3Event<Request>, bodySchema: schema, twitchAuth: boolean) {
    let context = {
        body: {} as z.infer<schema>,
        userSession: {} as {id: any, user?: User, secure?: SecureSessionData}
    }

    context.body = await readValidatedBody(event, (body) => {
        return bodySchema.parse(body)
    })

    if (twitchAuth) {
        context.userSession = await fetchUserSession(event)
    }

    return context
}

// Ensures the request is made with a valid Twitch OAuth session. If it fails to find a UserSession, a 401 response will be sent with the reasoning.
export async function fetchUserSession(event: H3Event<Request>) {
    let userSession = await getUserSession(event)

    if (userSession.user && userSession.secure) {
        return userSession
    } else {
        throw createError({statusCode: 401, statusMessage: "User is not authenticated."})
    }
}

// fetchUserSession but will simply return undefined if not found.
export async function fetchUserSessionSafe(event: H3Event<Request>) {
    try {
        return await fetchUserSession(event)
    } catch (e) {
        return
    }
}