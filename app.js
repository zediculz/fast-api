import Fastify from 'fastify'
import fs from 'fs'

const port = process.env.PORT || 3000;
const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;

const app = Fastify({
    logger: true
})

const dataUrl = "./bin/data.json"

//crud
//read
app.get("/api/", (request, reply) => {
    const query = request.query
    const id = parseInt(query.id)

    fs.readFile(dataUrl, "utf8", (err, file) => {
        const datas = JSON.parse(file)
        if (query.id === undefined) {
            reply.send({ data: datas, status: true })
        } else {
            const datas = JSON.parse(file)

            const data = datas?.filter((d, i) => d?.id === id)[0]
            if (data === undefined) {
                reply.send({ status: false, message: "not found" })
            }

            reply.send({ status: true, data })
        }
    }) 
})


//create
app.post("/api/", (request, reply) => {
    const { name, age } = request.body

    fs.readFile(dataUrl, "utf8", (err, file) => {
        const datas = JSON.parse(file)
        const randId = Math.floor(Math.random() * 9999999)
        const data = {
            id: randId,
            name,
            age
        }

        const darr = [data]
        const newDatas = [...darr, ...datas]

        const ds = JSON.stringify(newDatas, null, 2)

        fs.writeFile(dataUrl, ds, "utf8", (err, _) => {
            if (err) {
                throw err
            }

            reply.send({ status: true, message: "data added successfully", data: newDatas })
        })
    })
})


//delete
app.post("/api/delete/:id", (request, reply) => {
    const params = request.params
    const id = parseInt(params?.id)

    fs.readFile(dataUrl, (err, file) => {
        const datas = JSON.parse(file)

        const exist = datas?.filter((d, i) => {
            console.log(d)
            return d?.id === id
        })
        console.log(exist)

        if (exist?.length === 1) {
            const newDatas = datas?.filter((d, i) => d?.id !== id)
            const ds = JSON.stringify(newDatas, null, 2)

            fs.writeFile(dataUrl, ds, "utf8", (err, _) => {
                if (err) {
                    throw err
                }

                reply.send({ status: true, message: "data removed", id: id })
            })
        } else {
            reply.send({ status: false, message: "data not found" })
        }
    })
})


//update
app.post("/update/:id", (request, reply) => {
    const params = request.params
    const id = parseInt(params.id)
    const body = request.body

    const { name, age } = body

    fs.readFile(dataUrl, (err, file) => {
        const datas = JSON.parse(file)
        const existData = datas?.filter((d, i) => d?.id === id)[0]
        const nd = { id, name, age }
        const updateData = { ...existData, ...nd }

        const filterData = datas?.filter((d, i) => d?.id !== id)
        const newDatas  = [updateData, ...filterData]
        
        const ds = JSON.stringify(newDatas, null, 2)
        
        fs.writeFile(dataUrl, ds, "utf8", (err, _) => {
            if (err) {
                throw err
            }

            reply.send({ status: true, message: "data updated", id })
        })
    })
})



// Run the server!
app.listen({ port: port, host: host }, function (err, address) {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }

    console.log(address)
    // Server is now listening on ${address}
})