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

app.get("/G59",async(req,res) => {
    if(!req.query.text) {
        res.status(400).send("BAD_REQUEST")
        return
    }

    try {
        const { data } = await axios.post(goo_api,getBody(req.query.text))
        res.send(getG59Index(data.converted.replace(" ","")))
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


const hiragana = ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"]

const special = ["きゃ", "きゅ", "きょ", "くぁ", "くぃ", "くぇ", "くぉ", "しゃ", "しゅ", "しょ", "じゃ", "じゅ", "じょ", "ちゃ", "ちゅ", "ちょ", "ぢゃ", "ぢゅ", "ぢょ", "りゃ", "りゅ", "りょ", "ひゃ", "ひゅ", "ひょ", "びゃ", "びゅ", "びょ", "ぴゃ", "ぴゅ", "ぴょ", "みゃ", "みゅ", "みょ", "りゃ", "りゅ", "りょ"]

const komoji = ["ぁ", 0, "ぃ", 1, "ぅ", 2, "ぇ", 3, "ぉ", 4, "っ", 17, "ゃ", 35, "ゅ", 36, "ょ", 37, "ゎ", 43, "ゕ", 5, "ゖ", 8]


function getG59Index(text) {
    let result = []
    
    for (let i = 0; i < text.length; i++) {
      if (i != text.length - 1) {
        if (isKomoji(text[i + 1])) {
          if (isCanKomoji(text[i] + text[i + 1])) {
            result.push(special.indexOf(text[i] + text[i + 1]) + 71)
          } else {
            result.push(hiragana.indexOf(text[i]))
            result.push(komoji[komoji.indexOf(text[i + 1]) + 1])
          }
          i++
          continue
        } else if (isKomoji(text[i])) {
          result.push(komoji[komoji.indexOf(text[i]) + 1])
          continue
        }
      }
      result.push(hiragana.indexOf(text[i]))
    }

    return result.toString()
}


function isKomoji(char) {
  const komoji = "ぁぃぅぇぉっゃゅょゎゕゖ"
  return komoji.includes(char)
}

function isCanKomoji(text) {
  const template = "きゃきゅきょくぁくぃくぇくぉしゃしゅしょじゃじゅじょちゃちゅちょぢゃぢゅぢょりゃりゅりょひゃひゅひょびゃびゅびょぴゃぴゅぴょみゃみゅみょりゃりゅりょ"
  return template.includes(text)
}