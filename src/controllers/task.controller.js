const taskService = require("../services/task.service");

const getPost = async(req,res) =>{
    res.send("Hello");
}

const createTask = async(req,res) => {
    console.log(req.body);
    const task = await taskService.addTask(req.body);
    res.send(task);
}

module.exports ={
    getPost,
    createTask,
}