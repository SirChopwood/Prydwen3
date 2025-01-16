import express from "express";

export const get = async (req: express.Request, res: express.Response) => {
    return res.json({"Hello": "World"})
}