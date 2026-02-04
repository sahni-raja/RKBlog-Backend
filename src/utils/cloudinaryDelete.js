import cloudinary from "./cloudinary.js";

/*
  Extract public_id from Cloudinary URL and delete image
*/
export const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    // example URL:
    // https://res.cloudinary.com/xxx/image/upload/v123/rkblog_posts/abc.png

    const parts = imageUrl.split("/");
    const fileName = parts.pop().split(".")[0]; // abc
    const folder = parts.slice(parts.indexOf("upload") + 2).join("/");

    const publicId = `${folder}/${fileName}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};
