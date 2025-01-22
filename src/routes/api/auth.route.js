const router = require('express').Router();
const {authController} = require('../../controllers');

router.post("/login", authController.loginUser);
// router.post("/logout",)
router.post("/register",authController.registerUser);

module.exports = router;