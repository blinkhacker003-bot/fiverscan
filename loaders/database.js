const database = require("../models");
const config = require("../config/main");
const logger = require("../utils/logger");

let connectionPromise;

module.exports = async () => {
    if (!config.database.url && !config.database.host) {
        throw new Error("DATABASE_URL is required");
    }

    if (!connectionPromise) {
        connectionPromise = database.sequelize.authenticate().then(() => {
            logger("info", "Database", "PostgreSQL connection established");
        });
    }

    try {
        await connectionPromise;
    } catch (error) {
        connectionPromise = undefined;
        logger("error", "Database", `Database connection failed: ${error.message}`);
        throw error;
    }
};
