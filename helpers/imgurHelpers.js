// const imgur = require("imgur");
// const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const { ImgurClient } = require("imgur");
const client = new ImgurClient({ clientId: process.env.CLIENT_ID });

const uploadImageToImgur = async (file) => {
  try {
    const response = await client.upload({
      image: file.path,
      type: 'file'
    });
    console.log(response)
    const imageUrl = response.data.link;
    return imageUrl;
  } catch (error) {
    console.error("上傳失敗", error);
    throw error;
  }
};



module.exports = {
  uploadImageToImgur,
};
