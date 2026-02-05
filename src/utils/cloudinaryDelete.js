import cloudinary from "./cloudinary.js";

export const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;

  try {

    const parts = imageUrl.split("/");
    const fileName = parts.pop().split(".")[0]; 
    const folder = parts.slice(parts.indexOf("upload") + 2).join("/");

    const publicId = `${folder}/${fileName}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};
