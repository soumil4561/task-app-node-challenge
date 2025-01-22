const router = require('express').Router();
const {authController} = require('../../controllers');
const validate = require("../../middlewares/validation");
const {authValidation} = require("../../validations");

router.post("/login", validate(authValidation.login), authController.loginUser);
router.post("/register",validate(authValidation.register), authController.registerUser);

module.exports = router;