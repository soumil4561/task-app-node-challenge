const taskService = require("../services/task.service");
const { sendSuccess, sendError } = require("../utils/response");
var status = require("statuses");

const getTasks = async (req, res) => {
  const page =
    parseInt(req.query.page, 10) ||
    parseInt(process.env.PAGINATION_DEFAULT_PAGE, 10) ||
    1;
  const limit =
    parseInt(req.query.limit, 10) ||
    parseInt(process.env.PAGINATION_DEFAULT_LIMIT, 10) ||
    10;

  try {
    const { tasks, totalTasks } = await taskService.getAllUserTasks(
      req.user.id,
      page,
      limit
    );
    const totalPages = Math.ceil(totalTasks / limit);
    return sendSuccess(
      res,
      {
        tasks,
        pagination: {
          totalTasks,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      "Tasks retrieved successfully!",
      200
    );
  } catch (err) {
    console.error(err);
    return sendError(
      res,
      "SERVER_ERROR",
      "Error fetching tasks.",
      err.message,
      500
    );
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user.id);
    return sendSuccess(res, task, "Task retrieved successfully!", 200);
  } catch (err) {
    console.error(err);
    const { code, message } = err;
    return sendError(
      res,
      status(code || 500) || "SERVER_ERROR",
      message || "An unexpected error occurred",
      err.message,
      code || 500
    );
  }
};

const createTask = async (req, res) => {
  try {
    const task = await taskService.addTask(req.body, req.user.id);
    return sendSuccess(res, task, "Task created successfully!", 201);
  } catch (err) {
    console.error(err);
    return sendError(
      res,
      "SERVER_ERROR",
      "Error creating task. Please try later.",
      err.message,
      500
    );
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await taskService.updateTask(
      req.params.id,
      req.body,
      req.user.id
    );
    return sendSuccess(res, updatedTask, "Task updated successfully!", 200);
  } catch (err) {
    console.error(err);
    const { code, message } = err;
    return sendError(
      res,
      status(code || 500) || "SERVER_ERROR",
      message || "An unexpected error occurred",
      err.message,
      code || 500
    );
  }
};

const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.id);
    return sendSuccess(res, null, "Task deleted successfully!", 200);
  } catch (err) {
    console.error(err);
    const { code, message } = err;
    return sendError(
      res,
      status(code || 500) || "SERVER_ERROR",
      message || "An unexpected error occurred",
      err.message,
      code || 500
    );
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
};
