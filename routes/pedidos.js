import express from "express"
import { readFile } from "fs"
const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName))
        res.send(data)
    } catch (err){
        next(err)
    }
})

router.use ((err, req, res, next) => {
    `${req.method} ${req.baseUrl} - ${err.message}`
    res.status(400).send({error: err.message})
})

export default router