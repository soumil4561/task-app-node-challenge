const router = require('express').Router();
const auth = require("../../middlewares/auth");
const taskController = require("../../controllers/task.controller");

router.get("/:id", auth, taskController.getTaskById);
router.get("/", auth, taskController.getTasks);
router.post("/", auth, taskController.createTask);
router.put("/:id", auth, taskController.updateTask);
router.delete("/:id",auth, taskController.deleteTask);

module.exports = router;