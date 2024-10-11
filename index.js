import Fastify from 'fastify'
import fs from 'fs'

const app = Fastify()

//crud
app.get("/", (request, reply) => {
    fs.readFile("./bin/data.json", "utf8", (err, file) => {
        const datas = JSON.parse(file)
        reply.send(datas)
    })
})


app.post("/:id", (request, reply) => {
    const params = request.params
    const id = parseInt(params.id)

    fs.readFile("./bin/data.json", "utf8", (err, file) => {

        const datas = JSON.parse(file)

        const data = datas?.filter((d, i) => d?.id === id)[0]
        if (data === undefined) {
            reply.send({ status: false, message: "not found" })
        }

        reply.send({status: true, data})
    })
})


app.put("/:id", (request, reply) => {
    const params = request.params
    const id = parseInt(params.id)
    const body = request.body

    fs.readFile("./bin/data.json", "utf8", (err, file) => {

        const datas = JSON.parse(file)
        const filteredDatas = datas?.filter((d, i) => d?.id !== id)[0]

        const newData = [{ id, name: body?.name, age: body?.age }]
        const newDatas = [...newData, filteredDatas]

        const ds = JSON.stringify(newDatas, null, 2)
        fs.writeFile("./bin/data.json", ds, "utf8", (err, _) => {
            if (err) {
                throw err
            }

            reply.send({ status: true, message: "data updated successfully", data: { id, name: body?.name, age: body?.age } })
        })
       
    })
})

// Run the server!
app.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})