import { cloudinary } from "../lib/cloudinary.config";



export const deleteFromCloudinary = async (
  publicId: string
): Promise<void> => {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(
      `Cloudinary image deletion failed: ${result.result}`
    );
  }
};
