"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pokemonModel_1 = __importDefault(require("../models/pokemonModel"));
const favoriteModels_1 = __importDefault(require("../models/favoriteModels"));
const node_fetch_1 = __importDefault(require("node-fetch"));
console.log("se ingreso a rutas del pokemon");
const router = express_1.default.Router();
function searchPokemon(namePokemon) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(`https://pokeapi.co/api/v2/pokemon/${namePokemon}`);
            if (response.ok) {
                const data = yield response.json();
                console.log("Ingreso al metodo de search pokemon");
                const { name, sprites: { front_default }, height, weight, id, base_experience } = data;
                return { name, sprites: { front_default }, height, weight, id, base_experience };
            }
            else {
                console.log("Not return the data from pokemon api");
            }
        }
        catch (error) {
            console.error(error);
            return null;
        }
    });
}
router.post("/searchPokemon", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pokemon = req.body;
        console.log(pokemon.name);
        const name = pokemon.name;
        const pokemonInfo = yield pokemonModel_1.default.findOne({ name });
        console.log(pokemonInfo);
        if (pokemonInfo) {
            console.log("Ingreso a db a realizar la consulta");
            res.status(200).json(pokemonInfo);
        }
        else {
            console.log("ingreso al api de pokemon");
            const informationPokemon = yield searchPokemon(req.params.namepokemon);
            console.log(informationPokemon);
            if (informationPokemon) {
                const { name, sprites: { front_default }, height, weight, id, base_experience } = informationPokemon;
                const newPokemon = new pokemonModel_1.default({ name, sprites: { front_default }, height, weight, id, base_experience });
                yield newPokemon.save();
                res.status(200).json({ message: "New pokemon aggree in the database", newPokemon });
            }
            else {
                res.status(401).json({ message: "The information about pokemon dont found" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: "Something gone wrong", error });
    }
}));
router.post("/favorite/save", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser, namePokemon } = req.body;
        const infoFavorite = yield favoriteModels_1.default.findOne({ idUser });
        console.log(infoFavorite);
        console.log(infoFavorite === null || infoFavorite === void 0 ? void 0 : infoFavorite.namePokemon);
        if ((infoFavorite === null || infoFavorite === void 0 ? void 0 : infoFavorite.namePokemon) == namePokemon) {
            res.status(401).json({ message: "Now you have this pokemon in favorites" });
        }
        else {
            const newFavorite = new favoriteModels_1.default({ idUser, namePokemon });
            yield newFavorite.save();
            res.status(200).json({ message: "The pokemon save in favorite" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Something gone wrong", error });
    }
}));
router.get("/favorite/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = req.params.id;
        console.log(idUser);
        const favoriteInfo = yield favoriteModels_1.default.findOne({ idUser });
        console.log(favoriteInfo);
        if (favoriteInfo) {
            const namePokemon = favoriteInfo.namePokemon;
            console.log(namePokemon);
            const pokemon = yield searchPokemon(namePokemon);
            res.status(200).json({ pokemon });
        }
        else {
            res.status(404).json({ message: "You dont have favorites" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Something gone wrong", error });
    }
}));
exports.default = router;
