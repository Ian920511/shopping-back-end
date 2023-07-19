const express = require("express");

const router = express.Router();

const productController = require('./../../../controllers/productController')

const { checkRole } = require('./../../../middleware/api-auth')

router.get('/:productId', productController.getProduct)
router.post('/', checkRole('seller'),productController.postProduct)
router.put('/:productId', checkRole('seller'),productController.updateProduct)
router.delete('/:productId', checkRole('seller'),productController.deleteProduct)
router.get('/', productController.getProducts)

module.exports =router