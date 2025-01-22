const router = require('express').Router();
const auth = require("../../middlewares/auth");
const {taskController} = require("../../controllers");
const validate = require('../../middlewares/validation');
const {taskValidation} = require('../../validations')

router.get("/:id", validate(taskValidation.getTaskById), auth, taskController.getTaskById);
router.get("/", validate(taskValidation.getTasks), auth, taskController.getTasks);
router.post("/", validate(taskValidation.createTask), auth, taskController.createTask);
router.put("/:id", validate(taskValidation.updateTask), auth, taskController.updateTask);
router.delete("/:id", validate(taskValidation.deleteTask), auth, taskController.deleteTask);

module.exports = router;