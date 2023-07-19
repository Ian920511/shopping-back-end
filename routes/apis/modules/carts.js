const express = require('express')
const router = express.Router()

const cartController = require('./../../../controllers/cartController')

router.put('/:productId', cartController.updateCart)
router.delete('/:productId', cartController.deleteCartProduct)
router.get('/', cartController.getCart)
router.post('/', cartController.postCart)

module.exports = router