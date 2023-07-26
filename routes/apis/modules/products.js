const express = require("express");

const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "temp/" });

const productController = require('./../../../controllers/productController')

const { checkRole } = require('./../../../middleware/api-auth')

router.get('/:productId', productController.getProduct)
router.post('/', checkRole('seller'),productController.postProduct)
router.put('/:productId', checkRole('seller'), upload.single('image'), productController.updateProduct)
router.delete('/:productId', checkRole('seller'),productController.deleteProduct)
router.get('/', productController.getProducts)

module.exports =router