const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../validations/authValidation');


router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted to protected route',
    user: req.user
  });
});

module.exports = router;