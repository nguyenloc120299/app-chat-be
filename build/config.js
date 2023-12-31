"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsUrl = exports.apiToken = exports.tokenInfo = exports.db = exports.timezone = exports.port = exports.environment = void 0;
exports.environment = process.env.NODE_ENV;
exports.port = process.env.PORT;
exports.timezone = process.env.TZ;
exports.db = {
    name: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    port: process.env.DB_PORT || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_USER_PWD || "",
    minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || "5"),
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || "10"),
};
exports.tokenInfo = {
    accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || "259200000"),
    refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || "259200000"),
    issuer: process.env.TOKEN_ISSUER || "api.dev.xyz.com",
    audience: process.env.TOKEN_AUDIENCE || "xyz.com",
};
exports.apiToken = '6387676803:AAEAZe4OlxBrMcuA1bwZLP-pgNd1LxroDQI';
exports.corsUrl = process.env.CORS_URL || "*";
//# sourceMappingURL=config.js.map