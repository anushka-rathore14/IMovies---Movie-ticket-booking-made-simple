const express = require('express');
const router = express.Router();
const {
  getPaymentById,
  verifyPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, getPaymentById);
router.post('/verify', protect, verifyPayment);

module.exports = router;
