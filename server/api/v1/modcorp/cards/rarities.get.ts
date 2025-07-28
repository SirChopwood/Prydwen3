import {cardRarity} from "~/server/schema/modcorp/cards";

export default defineEventHandler(async (event) => {
    return cardRarity
})