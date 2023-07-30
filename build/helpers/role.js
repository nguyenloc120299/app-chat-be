"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (...roleCodes) => (req, res, next) => {
    req.currentRoleCodes = roleCodes;
    next();
};
//# sourceMappingURL=role.js.map