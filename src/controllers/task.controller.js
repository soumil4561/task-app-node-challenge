const taskService = require("../services/task.service");

const getTasks = async (req, res) => {
    const page = parseInt(req.query.page, 10) || process.env.PAGINATION_DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || process.env.PAGINATION_DEFAULT_LIMIT;
    try {
        const tasks = await taskService.getAllUserTasks(req.user.id, page, limit);
        return res.status(200).send(tasks);
    }
    catch (err) {
        console.log(err);
        res.status(err.code).send(err.message);
    }

}

const getTaskById = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id, req.user.id);
        res.status(200).send(task);
    }
    catch (err) {
        console.log(err);
        res.status(err.code).send(err.message);
    }
}

const createTask = async (req, res) => {
    try {
        const task = await taskService.addTask(req.body, req.user.id);
        res.status(201).send(task);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error Creating task at the moment. Please try later");
    }

}

const updateTask = async (req, res) => {
    try {
        const updatedTask = await taskService.updateTask(req.params.id, req.body, req.user.id);
        res.status(200).send(updatedTask);
    }
    catch (err) {
        console.log(err)
        return res.status(err.code).send(err.message);
    }
}

const deleteTask = async (req, res) => {
    try {
        await taskService.deleteTask(req.params.id, req.user.id);
        res.status(200).send("Deleted Task");
    }
    catch (err) {
        console.log(err);
        return res.status(err.code).send(err.message);
    }
}

module.exports = {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
}