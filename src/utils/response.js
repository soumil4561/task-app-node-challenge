const createResponse = (status, data = null, message = null, error = null) => {
    return {
        status,
        message,
        data,
        error
    };
};

const sendSuccess = async (res, data = null, message = "Request processed successfully.", statusCode = 200) => {
    return await res.status(statusCode).send(createResponse("success", data, message));
};

const sendError = async (res, errorCode, message = "An error occurred.", details = null, statusCode = 400) => {
    return await res.status(statusCode).send(
        createResponse("error", null, message, {
            code: errorCode,
            details
        })
    );
};

module.exports = {
    sendSuccess,
    sendError
};
