import express from "express"
import { promises as fs } from "fs"
const { readFile, writeFile, appendFile } = fs

global.fileName = "pedidos.json"
global.dateTime = new Date()

const app = express()
app.use(express.json())

app.listen(3000, async () => {
    try {
        await readFile(global.fileName)
        console.log("API em execução")
    } catch (err) {
        console.log(err)
    }
})

app.get("/pedidos", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName))
        res.send(data)
    } catch (err) {
        next(err)
    }
})

app.post("/pedidos", async (req, res, next) => {
    try {
        let pedido = req.body
        const data = JSON.parse(await readFile(global.fileName))
        pedido = {
            id: data.nextId++, cliente: pedido.cliente, produto: pedido.produto,
            valor: pedido.valor, entregue: new Boolean(false), timestamp: global.dateTime
        }
        data.pedidos.push(pedido)
        await writeFile(global.fileName, JSON.stringify(data, null, 2))
        res.send(pedido)
    } catch (err) {
        next(err)
    }
})

app.put("/pedidos", async (req, res, next) => {
    try {
        let pedido = req.body
        const data = JSON.parse(await readFile(global.fileName))
        const index = data.pedidos.findIndex(i => i.id === pedido.id)

        if (data.pedidos[index].cliente == null && pedido.id == null) {
            throw new Error("Registro não encontrado")
        } else {
            data.pedidos[index].cliente = pedido.cliente
            data.pedidos[index].produto = pedido.produto
            data.pedidos[index].valor = pedido.valor
            data.pedidos[index].entregue = pedido.entregue
            data.pedidos[index].timestamp = global.dateTime
        }
        await writeFile(global.fileName, JSON.stringify(data, null, 2))
        res.send(pedido)
    } catch (err) {
        next(err)
    }
})

app.patch("/pedidos", async (req, res, next) => {
    try {
        let pedido = req.body
        const data = JSON.parse(await readFile(global.fileName))
        const index = data.pedidos.findIndex(i => i.id === pedido.id)
        if (data.pedidos[index].entregue === true || false) {
            data.pedidos[index].entregue = pedido.entregue
        } else {
            res.send("O valor do campo entregue não é valido")
        }
        await writeFile(global.fileName, JSON.stringify(data, null, 2))
        res.send(pedido)
    } catch (err) {
        next(err)
    }
})

app.use((err, req, res, next) => {
    `${req.method} ${req.baseUrl} - ${err.message}`
    res.status(400).send({ error: err.message })
})
