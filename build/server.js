"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
app_1.default
    .listen(7000, () => {
    console.log(`Server running on port : ${5000}`);
})
    .on("error", (e) => console.log(e));
//# sourceMappingURL=server.js.map