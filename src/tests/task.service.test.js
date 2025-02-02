const { Task } = require("../models");
const ApiError = require("../utils/ApiError");
const taskService = require("../services/task.service");

jest.mock("../models", () => ({
    Task: {
        create: jest.fn(),
        find: jest.fn(),
        countDocuments: jest.fn(),
        findById: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn()
    }
}));

describe("Task Service", () => {
    describe("addTask", () => {
        it("should add a task", async () => {
            const taskBody = {
                title: "Test Task",
                description: "This is a test task",
                status: "Pending",
            };
            const userId = 1234;
            const task = { ...taskBody, creator: userId };
            Task.create.mockResolvedValue(task);

            const result = await taskService.addTask(taskBody, userId);
            expect(result).toEqual(task);
        });

        it("should throw an error if task creation fails", async () => {
            const taskBody = {
                title: "Test Task",
                description: "This is a test task",
                status: "Pending",
            };
            const userId = 1234;
            Task.create.mockRejectedValue(new Error("Failed to create task"));

            await expect(taskService.addTask(taskBody, userId)).rejects.toThrow(
                "Failed to create task"
            );
        });
    });

    describe("getAllUserTasks", () => {
        it("should return all tasks of a user", async () => {
            const userId = 1234;
            const page = 1;
            const limit = 10;
            const tasks = [
                { title: "Test Task 1", description: "This is a test task", status: "Pending" },
                { title: "Test Task 2", description: "This is a test task", status: "Pending" },
            ];
            const totalTasks = 2;
            Task.find.mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(tasks),
            });
            Task.countDocuments.mockResolvedValue(totalTasks);

            const result = await taskService.getAllUserTasks(userId, page, limit);
            expect(result).toEqual({ tasks, totalTasks });
        });

        it("should throw an error if tasks retrieval fails", async () => {
            const userId = 1234;
            const page = 1;
            const limit = 10;
        
            // Mock the chain and make .lean() reject
            Task.find.mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockRejectedValue(new Error("Failed to retrieve tasks")),
            });
        
            await expect(taskService.getAllUserTasks(userId, page, limit)).rejects.toThrow(
                "Failed to retrieve tasks"
            );
        });
        
    });

    describe("getTaskById", () => {
        it("should return a task by id", async () => {
            const taskId = 1234;
            const userId = 5678;
            const task = { _id: taskId, creator: userId, title: "Test Task", description: "This is a test task", status: "Pending" };
            Task.findById.mockResolvedValue(task);

            const result = await taskService.getTaskById(taskId, userId.toString());
            expect(result).toEqual(task);
        });

        it("should throw an error if task retrieval fails", async () => {
            const taskId = 1234;
            const userId = 5678;
            Task.findById.mockRejectedValue(new Error("Failed to retrieve task"));

            await expect(taskService.getTaskById(taskId, userId)).rejects.toThrow(
                "Failed to retrieve task"
            );
        });

        it("should throw an error if task not found", async () => {
            const taskId = 1234;
            const userId = 5678;
            Task.findById.mockResolvedValue(null);

            await expect(taskService.getTaskById(taskId, userId)).rejects.toThrow(
                "No task with the given id found"
            );
        });

        it("should throw an error if unauthorized to access task", async () => {
            const taskId = 1234;
            const userId = 5678;
            const task = { _id: taskId, creator: 9999, title: "Test Task", description: "This is a test task", status: "Pending" };
            Task.findById.mockResolvedValue(task);

            await expect(taskService.getTaskById(taskId, userId)).rejects.toThrow(
                "Unauthorized to access this resource."
            );
        });
    });

    describe("updateTask", () => {
        it("should update a task", async () => {
            const taskId = 1234;
            const userId = 5678;
            const updatedBody = { title: "Updated Task" };
            const task = { _id: taskId, creator: userId, title: "Test Task", description: "This is a test task", status: "Pending" };
            Task.findOneAndUpdate.mockResolvedValue(task);

            const result = await taskService.updateTask(taskId, updatedBody, userId.toString());
            expect(result).toEqual(task);
        });

        it("should throw an error if task update fails", async () => {
            const taskId = 1234;
            const userId = 5678;
            const updatedBody = { title: "Updated Task" };
            Task.findOneAndUpdate.mockRejectedValue(new Error("Failed to update task"));

            await expect(taskService.updateTask(taskId, updatedBody, userId)).rejects.toThrow(
                "Failed to update task"
            );
        });

        it("should throw an error if task not found", async () => {
            const taskId = 1234;
            const userId = 5678;
            const updatedBody = { title: "Updated Task" };
            Task.findOneAndUpdate.mockResolvedValue(null);

            await expect(taskService.updateTask(taskId, updatedBody, userId)).rejects.toThrow(
                "No task with the given id found"
            );
        });

        it("should throw an error if unauthorized to access task", async () => {
            const taskId = 1234;
            const userId = 5678;
            const updatedBody = { title: "Updated Task" };
            const task = { _id: taskId, creator: 9999, title: "Test Task", description: "This is a test task", status: "Pending" };
            Task.findOneAndUpdate.mockResolvedValue(task);

            await expect(taskService.updateTask(taskId, updatedBody, userId)).rejects.toThrow(
                "Unauthorized to access this resource."
            );
        });
    });

    describe("deleteTask", () => {
        it("should delete a task", async () => {
            const taskId = 1234;
            const userId = 5678;
            const task = { _id: taskId, creator: userId, title: "Test Task", description: "This is a test task", status: "Pending" };
            Task.findOneAndDelete.mockResolvedValue(task);

            await taskService.deleteTask(taskId, userId.toString());
            expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: taskId });
        });

        it("should throw an error if task deletion fails", async () => {
            const taskId = 1234;
            const userId = 5678;
            Task.findOneAndDelete.mockRejectedValue(new Error("Failed to delete task"));

            await expect(taskService.deleteTask(taskId, userId)).rejects.toThrow(
                "Failed to delete task"
            );
        });

        it("should throw an error if task not found", async () => {
            const taskId = 1234;
            const userId = 5678;
            Task.findOneAndDelete.mockResolvedValue(null);

            await expect(taskService.deleteTask(taskId, userId)).rejects.toThrow(
                "No task with the given id found"
            );
        });

        it("should throw an error if unauthorized to access task", async () => {
            const taskId = 1234;
            const userId = 5678;
            const task = { _id: taskId, creator: 9999, title: "Test Task", description: "This is a test task", status: "Pending" };
            Task.findOneAndDelete.mockResolvedValue(task);

            await expect(taskService.deleteTask(taskId, userId)).rejects.toThrow(
                "Unauthorized to access this resource."
            );
        });
    });
});