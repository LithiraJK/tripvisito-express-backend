import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary"
import { env } from "./env"


dotenv.config()

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SCRET
})

export default cloudinary
