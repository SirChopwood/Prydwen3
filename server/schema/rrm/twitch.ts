import {z} from "zod"

// Authorization code grant flow
// User Authorization
export const AuthResponse = z.strictObject({
    "code": z.string(),
    "scope": z.string(),
    "state": z.string().optional(),
}).or(z.strictObject({
        "error": z.string(),
        "error_description": z.string(),
        "state": z.string().optional(),
    })
)

// Token Request Responses
export const TokenResponseValid = z.strictObject({
    "access_token": z.string(),
    "expires_in": z.number(),
    "refresh_token": z.string(),
    "scope": z.array(z.string()),
    "token_type": z.string(),
})
export const TokenResponseInvalid = z.strictObject({
    "status": z.number(),
    "message": z.string(),
})
export const TokenResponse = TokenResponseValid.or(TokenResponseInvalid)

// User Token Credentials
export const UserCredentials = z.strictObject({
    "code": z.string(),
    "scope": z.array(z.string()),
    "token": z.string(),
})

export const TwitchChannel = z.strictObject({
    "id": z.string(),
    "name": z.string(),
})