// auth.d.ts
declare module '#auth-utils' {
    interface User {
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
        "created_at": string,
    }

    interface UserSession {
    }

    interface SecureSessionData {
        "access_token": string,
        "expires_in": number,
        "refresh_token": string,
        "scope": Array<string>,
        "token_type": string
    }
}

export {}