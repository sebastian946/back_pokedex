"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const pokemonRoutes_1 = __importDefault(require("./routes/pokemonRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 8000;
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use('/api/pokemon', pokemonRoutes_1.default);
app.use('/api/pokemon/user', userRoutes_1.default);
try {
    mongoose_1.default.connect('mongodb://localhost:27017/pokemon', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
        console.log("Connected to mongo");
        app.listen(port, () => {
            console.log("Open in the port: " + port);
        });
    }).catch((error) => { console.log("This is the error in the server: " + error); });
}
catch (error) {
    console.log("this is the ", error);
}
