const express = require('express')
const router = express.Router()
var moment = require('moment')
var {uploadImage, getFileHistori, writeFileHistori} = require('../modules/helper')

router.post("/api/submit", async (req, res) => {
  try {

    const reqBody = req.body
    var file = req.files
    if (!reqBody.nama_penyakit) {
      res.status(400).json({msg: 'Paramater nama_penyakit tidak boleh kosong!'})
    }
    if (!file || file.length === 0) {
      res.status(400).json({msg: 'Paramater gambar tidak boleh kosong!'})
    }
    file = file[0]

    let dataMedicine = [
      {
        disease: 'Early Blight',
        cure: 'Amistar Top 325 SC 250 ml, Miravis Duo 100 ml, Ripnazol 422EC, Cabrio 250 EC, Rampart 25 WP 100 gr'
      },
      {
        disease: 'Late Blight',
        cure: 'Bion M 1/48 WP 500 gr, Dorum 350 SC, Kapuas 560 SC, Zampro 525 SC, Ridomild  Gold MZ 4/64 WG, Phytoklor 82.5 WG'
      }
    ]

    let values = dataMedicine.filter(v => v.disease === reqBody.nama_penyakit)
    if (values.length === 0) {
      res.status(400).json({msg: `Nama Penyakit ${reqBody.nama_penyakit} tidak ditemukan!`})
    }
    values = values[0]
    values.tanggal = moment().format('YYYY-MM-DD HH:mm:ss')

    let filename = await uploadImage(file)

    values.filename = filename

    let dataJson = await getFileHistori()
    
    obj = JSON.parse(dataJson); //now it an object
    console.log(`-------------------------obj : `, obj)
    let ctx = obj.data.sort((a,b) => a.id - b.id).reverse()
    values.id = ctx.length === 0 ? 1 : (ctx[0].id + 1)
    obj.data.push(values); //add some data
    json = JSON.stringify(obj); //convert it back to json
    console.log(`-------------------------json : `, json)
    await writeFileHistori(json) // write it back 

    let result = {
      nama_penyakit: values.disease,
      obat: values.cure,
    }
    res.status(200).json(result)
  } catch (error) {
    console.log(`--------------- Error : `,error)
    res.status(500).json({msg: error})
  }
})

module.exports = router
