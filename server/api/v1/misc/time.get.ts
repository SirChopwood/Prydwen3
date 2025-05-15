export default defineEventHandler(async (event) => {
    return {"timestamp": Date.now()};
})