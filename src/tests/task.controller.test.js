const taskController = require("../controllers/task.controller");
const taskService = require("../services/task.service");
const { sendSuccess, sendError } = require("../utils/response");
const httpMocks = require("node-mocks-http");
const ApiError = require("../utils/ApiError");

jest.mock("../services/task.service");
jest.mock("../utils/response");

describe("Task Controller", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should return tasks with pagination", async () => {
      const tasks = [{ title: "Test Task 1" }, { title: "Test Task 2" }];
      const totalTasks = 2;
      const page = 1;
      const limit = 10;
      const totalPages = 1;

      taskService.getAllUserTasks.mockResolvedValue({ tasks, totalTasks });

      req.query.page = page;
      req.query.limit = limit;
      req.user = { id: 1234 };

      await taskController.getTasks(req, res);

      expect(taskService.getAllUserTasks).toHaveBeenCalledWith(
        1234,
        page,
        limit
      );
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        {
          tasks,
          pagination: { totalTasks, totalPages, currentPage: page, limit },
        },
        "Tasks retrieved successfully!",
        200
      );
    });

    it("should handle error while fetching tasks", async () => {
      const error = new Error("Error fetching tasks");

      taskService.getAllUserTasks.mockRejectedValue(error);

      req.user = { id: 1234 };

      await taskController.getTasks(req, res);

      expect(sendError).toHaveBeenCalledWith(
        res,
        "SERVER_ERROR",
        "Error fetching tasks.",
        error.message,
        500
      );
    });

    it("should use default pagination values if not provided", async () => {
      const tasks = [{ title: "Test Task 1" }, { title: "Test Task 2" }];
      const totalTasks = 2;
      const page = 1;
      const limit = 10;
      const totalPages = 1;

      taskService.getAllUserTasks.mockResolvedValue({ tasks, totalTasks });

      req.user = { id: 1234 };

      await taskController.getTasks(req, res);

      expect(taskService.getAllUserTasks).toHaveBeenCalledWith(
        1234,
        page,
        limit
      );
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        {
          tasks,
          pagination: { totalTasks, totalPages, currentPage: page, limit },
        },
        "Tasks retrieved successfully!",
        200
      );
    });
  });

  describe("getTaskById", () => {
    it("should return a task by id", async () => {
      const task = { _id: 1234, title: "Test Task" };
      taskService.getTaskById.mockResolvedValue(task);

      req.params.id = 1234;
      req.user = { id: 5678 };

      await taskController.getTaskById(req, res);

      expect(taskService.getTaskById).toHaveBeenCalledWith(1234, 5678);
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        task,
        "Task retrieved successfully!",
        200
      );
    });

    it("should handle error when task is not found", async () => {
      const error = new Error("Task not found.");
      error.code = 404;

      taskService.getTaskById.mockRejectedValue(error);

      req.params.id = 1234;
      req.user = { id: 5678 };

      await taskController.getTaskById(req, res);

      expect(sendError).toHaveBeenCalledWith(
        res,
        "Not Found",
        "Task not found.",
        error.message,
        404
      );
    });

    it("should handle error when forbidden access", async () => {
      const error = new ApiError(403, "Unauthorized to access this resource.");

      taskService.getTaskById.mockRejectedValue(error);

      req.params.id = 1234;
      req.user = { id: 5678 };

      await taskController.getTaskById(req, res);

      expect(sendError).toHaveBeenCalledWith(
        res,
        "Forbidden",
        "Unauthorized to access this resource.",
        error.message,
        403
      );
    });
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      const newTask = { title: "New Task", description: "Test task" };
      const task = { _id: 1234, ...newTask };
      taskService.addTask.mockResolvedValue(task);

      req.body = newTask;
      req.user = { id: 1234 };

      await taskController.createTask(req, res);

      expect(taskService.addTask).toHaveBeenCalledWith(newTask, 1234);
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        task,
        "Task created successfully!",
        201
      );
    });

    it("should handle error while creating a task", async () => {
      const error = new Error("Error creating task");

      taskService.addTask.mockRejectedValue(error);

      req.body = { title: "New Task" };
      req.user = { id: 1234 };

      await taskController.createTask(req, res);

      expect(sendError).toHaveBeenCalledWith(
        res,
        "SERVER_ERROR",
        "Error creating task. Please try later.",
        error.message,
        500
      );
    });
  });

  describe("updateTask", () => {
    it("should update a task successfully", async () => {
      const updatedTask = { title: "Updated Task" };
      const task = { _id: 1234, ...updatedTask };
      taskService.updateTask.mockResolvedValue(task);

      req.params.id = 1234;
      req.body = updatedTask;
      req.user = { id: 1234 };

      await taskController.updateTask(req, res);

      expect(taskService.updateTask).toHaveBeenCalledWith(
        1234,
        updatedTask,
        1234
      );
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        task,
        "Task updated successfully!",
        200
      );
    });

    it("should handle error when task is not found during update", async () => {
      const error = new Error("Task not found");
      error.code = 404;

      taskService.updateTask.mockRejectedValue(error);

      req.params.id = 1234;
      req.body = { title: "Updated Task" };
      req.user = { id: 1234 };

      await taskController.updateTask(req, res);

      expect(sendError).toHaveBeenCalledWith(
        res,
        "Not Found",
        "Task not found",
        error.message,
        404
      );
    });

    it("should handle error when forbidden access during update", async () => {
      const error = new ApiError(403, "Unauthorized to access this resource.");

      taskService.updateTask.mockRejectedValue(error);

      req.params.id = 1234;
      req.body = { title: "Updated Task" };
      req.user = { id: 5678 };

      await taskController.updateTask(req, res);

      expect(sendError).toHaveBeenCalledWith(
        res,
        "Forbidden",
        "Unauthorized to access this resource.",
        error.message,
        403
      );
    });

    describe("deleteTask", () => {
      it("should delete a task successfully", async () => {
        taskService.deleteTask.mockResolvedValue(null);

        req.params.id = 1234;
        req.user = { id: 1234 };

        await taskController.deleteTask(req, res);

        expect(taskService.deleteTask).toHaveBeenCalledWith(1234, 1234);
        expect(sendSuccess).toHaveBeenCalledWith(
          res,
          null,
          "Task deleted successfully!",
          200
        );
      });

      it("should handle error when task is not found during deletion", async () => {
        const error = new Error("Task not found");
        error.code = 404;

        taskService.deleteTask.mockRejectedValue(error);

        req.params.id = 1234;
        req.user = { id: 1234 };

        await taskController.deleteTask(req, res);

        expect(sendError).toHaveBeenCalledWith(
          res,
          "Not Found",
          "Task not found",
          error.message,
          404
        );
      });

      it("should handle error when forbidden access during deletion", async () => {
        const error = new ApiError(
          403,
          "Unauthorized to access this resource."
        );

        taskService.deleteTask.mockRejectedValue(error);

        req.params.id = 1234;
        req.user = { id: 5678 };

        await taskController.deleteTask(req, res);

        expect(sendError).toHaveBeenCalledWith(
          res,
          "Forbidden",
          "Unauthorized to access this resource.",
          error.message,
          403
        );
      });
    });
  });
});
