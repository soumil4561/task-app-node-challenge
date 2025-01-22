const taskService = require("../services/task.service");

const getTasks = async (req, res) => {
    const page = parseInt(req.query.page,10) || process.env.PAGINATION_DEFAULT_PAGE;
    const limit = parseInt(req.query.limit,10) || process.env.PAGINATION_DEFAULT_LIMIT;
    const tasks = await taskService.getAllUserTasks(req.user.id,page,limit);
    res.status(200).send(tasks);
}

const getTaskById = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        if (!task) {
            res.status(400).send("No task with given id found");
        }
        if (!task.creator.toString() === req.user.id) {
            res.status(403).send("Unauthorized to access this resource.");
        }
        res.status(200).send(task);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
}

const createTask = async (req, res) => {
    try{
        const task = await taskService.addTask(req.body, req.user.id);
        res.status(201).send(task);
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error Creating task at the moment. Please try later");
    }
    
}

const updateTask = async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
        return res.status(400).send("No task with given id found");
    }
    if (task.creator.toString() !== req.user.id) {
        return res.status(403).send("Unauthorized to access this resource.");
    }
    const updatedTask = await taskService.updateTask(req.params.id, req.body);
    res.status(200).send(updatedTask);
}

const deleteTask = async(req,res) => {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
        return res.status(400).send("No task with given id found");
    }
    if (task.creator.toString() !== req.user.id) {
        return res.status(403).send("Unauthorized to access this resource.");
    }
    await taskService.deleteTask(req.params.id);
    res.status(200).send("Deleted Task");
}

module.exports = {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
}