const router = require('express').Router();
const taskController = require("../../controllers/task.controller");

router.get("/", taskController.getPost);
router.post("/", taskController.createTask)

module.exports = router;