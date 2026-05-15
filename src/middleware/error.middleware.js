import dotenv from "dotenv"

dotenv.config()

function handleError(err, req, res, next) {
    const status = err.status || err.statusCode || 500;

    const response = {
        message: err.message || "Internal server error",
    };

    res.status(status).json(response);
}

export default handleError;