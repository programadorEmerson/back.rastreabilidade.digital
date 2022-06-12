import jwtDecode from 'jwt-decode'
import multer from 'multer'
import path from 'path'

export const UploadKmlFolder = path.join(__dirname, '..', 'uploads', 'kml')
export const UploadPdfFolder = path.join(__dirname, '..', 'uploads', 'pdf')
export const UploadJsonFolder = path.join(__dirname, '..', 'uploads', 'json')
export const UploadQrCodeFolder = path.join(__dirname, '..', 'uploads', 'qrCode')
export const archiveHtmlCertificate = path.join(__dirname, '..', 'html', 'certificate', 'index.ejs')
export const backgroundGuidedSale = path.join(__dirname, '..', 'assets', 'certificado.png')
export const folderCertifields = path.join(__dirname, '..', 'uploads', 'pdf', 'certifields')
export const fileTestPdf = path.join(__dirname, '..', 'uploads', 'pdf')
export const filesImg = path.join(__dirname, '..', 'uploads', 'img')

export const Multer = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, UploadKmlFolder)
    },
    filename: (req, _file, callback) => {
      const {
        user: { _id }
      } = jwtDecode(req.headers.authorization) as {user: { _id: string }}
      callback(null, `${_id}.kml`)
    }
  })
})

export const MulterPDF = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, UploadPdfFolder)
    },
    filename: (req, _file, callback) => {
      const {
        user: { _id }
      } = jwtDecode(req.headers.authorization) as { user: { _id: string } }
      callback(null, `${_id}.pdf`)
    }
  })
})

export const MulterFile = multer({
  storage: multer.memoryStorage()
  // limits: {
  //   fileSize: 5 * 1024 * 1024,
  // },
})
