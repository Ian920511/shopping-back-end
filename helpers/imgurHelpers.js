const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

imgur.setClientID(IMGUR_CLIENT_ID);

const uploadImageToImgur = async (file) => {
  try {
    const response = await imgur.uploadFile(file.path)
    const imageUrl = response.data.link
    return imageUrl
  } catch (error) {
    console.error("上傳失敗", error)
    throw error
  }
};

module.exports = {
  uploadImageToImgur,
};
