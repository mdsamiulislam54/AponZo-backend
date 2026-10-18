import { cloudinary } from "../lib/cloudinary.config"

const uploadToCloudinary = (file: Express.Multer.File): Promise<{ url: string, publicId: string }> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "AponZo/products",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                if (!result) {
                    return reject(
                        new Error("Error uploading image to cloudinary")
                    )
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                })
            }
        )

        stream.end(file.buffer)
    })
}

export { uploadToCloudinary }