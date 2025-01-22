const Joi = require('joi');

const getTaskById = {
    params: Joi.object().keys({
        id: Joi.string(),
    })
};

const getTasks = {
    query: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
    }),
};

const createTask = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string(),
        status: Joi.string().required(),
    })
};

const updateTask = {
    body: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
        status: Joi.string(),
    }),
    params: Joi.object().keys({
        id: Joi.string()
    })
};

const deleteTask = {
    params: Joi.object().keys({
        id: Joi.string()
    })
};

module.exports = {
    getTaskById,
    getTasks,
    createTask,
    updateTask,
    deleteTask
}