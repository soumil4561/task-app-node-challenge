const {Task} = require("../models")

const addTask = async(taskBody, userId)=>{
    taskBody.creator = userId;
    const task = await Task.create(taskBody);
    return task;
}

const getAllUserTasks = async(userId, page, limit) => {
    const skip = (page-1)*limit;
    const tasks = await Task.find({creator:userId}).skip(skip).limit(limit);
    return tasks;
}

const getTaskById = async(taskId) => {
    const task = await Task.findById(taskId);
    return task;
}

const updateTask = async(taskId, updatedBody) => {
    const task = await Task.findOneAndUpdate({_id:taskId}, {$set: updatedBody}, {new:true});
    return task;
}

const deleteTask = async(taskId) => {
    await Task.findOneAndDelete({_id:taskId});
}

module.exports = {
    addTask,
    getAllUserTasks,
    getTaskById,
    updateTask,
    deleteTask
}