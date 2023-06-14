'use strict'
const {Storage} = require('@google-cloud/storage')
const util = require('util')
const path = require('path');
const { format } = util

const pathKey = path.resolve('./serviceaccountkey.json')

// TODO: Sesuaikan konfigurasi Storage
const gcs = new Storage({
    projectId: 'projectakhir-389202',
    keyFilename: pathKey
})

// TODO: Tambahkan nama bucket yang digunakan
const bucketName = 'iplant'
const bucket = gcs.bucket(bucketName)

function uploadImage(file) {
    return new Promise((resolve, reject) => {
        try {
            const { originalname, buffer } = file
          
            const filename = Date.now()+'_'+originalname.replace(/ /g, "_")
            const blob = bucket.file('gambar/'+filename)
            const blobStream = blob.createWriteStream({
                resumable: false
            })
          
            blobStream.on('finish', async() => {
              const publicUrl = format(
                `https://storage.googleapis.com/${bucket.name}/${blob.name}`
              )
              resolve(filename)
            })
            .on('error', () => {
              reject(`Unable to upload image, something went wrong`)
            })
            .end(buffer)
            
        } catch (error) {
            reject(error)
        }
    })
}

async function getFileHistori() {
    try {
        let data = await bucket.file('histori.json').download() 
        return data
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function writeFileHistori(values) {
   try {
    await bucket.file('histori.json').save(values)    
   } catch (error) {
       console.error(error)
        throw error
   } 
}


  

module.exports ={uploadImage, getFileHistori, writeFileHistori}
