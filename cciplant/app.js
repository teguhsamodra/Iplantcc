require('@google-cloud/debug-agent').start()

const express = require('express')
const app = express()
// const bodyParser = require('body-parser')
let Multer = require('multer')
const apiRouter = require('./routes/api')

Multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

// app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(Multer.any())
app.use(apiRouter)

app.get("/", async (req, res) => {
    console.log("Response success")
    res.send("Response Success!")
})

const PORT = process.env.PORT || 7001
app.listen(PORT, () => {
    console.log("Server is up and listening on " + PORT)
})