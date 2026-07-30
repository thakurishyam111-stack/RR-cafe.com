import multer from "multer"
import fs from "fs"


const uploader = (dir = '/') => {

    const myStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            let pathToUpload = "./public/uploads" + dir
            if (fs.existsSync(pathToUpload)) {
                fs.mkdirSync(pathToUpload, { recursive: true })
            }
            cb(null, pathToUpload)

        },
        filename: (req, file, cb) => {
            const name = Date.now() + " " + file.originalname
            cb(null, name)

        }
    })

    return multer({
        storage: myStorage,
        fileFilter: (req, file, cb) => {
            let allowedExts = ['png', 'jpg',]
            const ext = file.originalname.split(".").pop() as string

            if (allowedExts.includes(ext?.toLocaleLowerCase())) {
                cb(null, true)
            }
            else {
                cb(new Error("File formate is not supported "))
            }

        },
        limits: {
            fileSize: 3 * 1024 * 1024,
        }
    })


}

export default uploader

//npm i --save-dev @types/multer