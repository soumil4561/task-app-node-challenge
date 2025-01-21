const {Task} = require("../models")

const addTask = async(taskBody)=>{
    const task = await Task.create(taskBody);
    return task;
}

module.exports = {
    addTask,
}