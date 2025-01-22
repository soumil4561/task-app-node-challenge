const {Task} = require("../models");
const ApiError = require("../utils/ApiError");

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

const getTaskById = async(taskId, userId) => {
    const task = await Task.findById(taskId);
    if(!task) throw new ApiError(404, "No task with the given id found");
    if (task.creator.toString() !== userId) throw new ApiError(403, "Unauthorized to access this resource.");
    return task;
}

const updateTask = async(taskId, updatedBody,userId) => {
    const task = await Task.findOneAndUpdate({_id:taskId}, {$set: updatedBody}, {new:true});
    if(!task) throw new ApiError(404, "No task with the given id found");
    if (task.creator.toString() !== userId) throw new ApiError(403, "Unauthorized to access this resource.");
    return task;
}

const deleteTask = async(taskId, userId) => {
    const task = await Task.findOneAndDelete({_id:taskId});
    if(!task) throw new ApiError(404, "No task with the given id found");
    if (task.creator.toString() !== userId) throw new ApiError(403, "Unauthorized to access this resource.");
}

module.exports = {
    addTask,
    getAllUserTasks,
    getTaskById,
    updateTask,
    deleteTask
}