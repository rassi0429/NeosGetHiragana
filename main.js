const axios = require("axios")
const express = require("express")
const app = express()

const goo_api = "https://labs.goo.ne.jp/api/hiragana"

app.get("/",async (req,res) => {
    if(!req.query.text) {
        res.status(400).send("BAD_REQUEST")
        return
    }

    try {
        const { data } = await axios.post(goo_api,getBody(req.query.text))
        res.send(data.converted.replace(" ",""))
    } catch {
        res.status(500).send("BAD_RESPONCE")
    }

})

const api = app.listen(3000, () => {
    if(!process.env.GOO_API_KEY) {
        throw new Error("APIKEY NOT PROVIDED")
    }
    console.log("OK")
})

function getBody(text) {
    return {
        app_id: process.env.GOO_API_KEY,
        sentence: text,
        output_type: "hiragana"
    }
}