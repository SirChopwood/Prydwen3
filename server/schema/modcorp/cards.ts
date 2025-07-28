import {z} from "zod"

export const cardRarity: Record<number, { name: string, colour: string, chances: number }> = {
    0: {name: "Common", colour: "#e3e3e3", chances: 1000},
    1: {name: "Uncommon", colour: "#2946bb", chances: 500},
    2: {name: "Rare", colour: "#29bba3", chances: 200},
    3: {name: "Very Rare", colour: "#44bb29", chances: 50},
    4: {name: "Epic", colour: "#e5bd0b", chances: 20},
    5: {name: "Legendary", colour: "#e5620b", chances: 5},
    6: {name: "Unique", colour: "#cc1919", chances: 1},
}

export type card = {
    "name": string,
    "description": string,
    "file": string,
    "rarity": number
}

// CARD REQUESTS
export const addCard = z.strictObject({
    "token": z.string(),
    "user_name": z.string(),
    "user_id": z.string(),

    "name": z.string(),
    "description": z.string(),
    "file": z.string(),
    "rarity": z.number().min(0).max((Object.keys(cardRarity).length-1))
})

export const fetchCards = z.strictObject({
    "card_ids": z.array(z.number().min(0)).min(1)
})

// USER REQUESTS
export const addUser = z.strictObject({
    "token": z.string(),
    "user_name": z.string(),
    "user_id": z.string()
})

export const fetchUser = z.strictObject({
    "user_id": z.string(),
})

// ROLL REQUESTS
export const redeemRoll = z.strictObject({
    "token": z.string(),
    "user_name": z.string(),
    "user_id": z.string(),
    "banner_id": z.number().min(0)
})

export const awardRoll = z.strictObject({
    "token": z.string(),
    "user_name": z.string(),
    "user_id": z.string(),
    "amount": z.number().min(0),
    "reason": z.number().min(0),
})

// BANNER REQUESTS
export const addBanner = z.strictObject({
    "token": z.string(),
    "user_name": z.string(),
    "user_id": z.string(),

    "name": z.string(),
    "description": z.string(),
    "file": z.string(),
    "contents": z.array(z.number().min(0)),
    "active": z.boolean()
})

export const fetchBanner = z.strictObject({
    "banner_id": z.array(z.number().min(0)).min(1)
})