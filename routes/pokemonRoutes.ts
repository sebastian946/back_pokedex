import express, { Request, Response } from "express";
import pokemons, { IPokemon } from "../models/pokemonModel";
import favorite, { IFavorite } from "../models/favoriteModels";
import fetch from "node-fetch";
console.log("se ingreso a rutas del pokemon");
const router = express.Router();

async function searchPokemon(namePokemon: String) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${namePokemon}`);
        if (response.ok) {
            const data = await response.json();
            console.log("Ingreso al metodo de search pokemon");
            const { name, sprites: { front_default }, height, weight, id, base_experience } = data;
            return { name, sprites: { front_default }, height, weight, id, base_experience };
        } else {
            console.log("Not return the data from pokemon api");
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}



router.post("/searchPokemon", async (req: Request, res: Response) => {
    try {
        const pokemon = req.body;
        console.log(pokemon.name);
        const name = pokemon.name
        const pokemonInfo = await pokemons.findOne({ name });
        console.log(pokemonInfo);
        if (pokemonInfo) {
            console.log("Ingreso a db a realizar la consulta");
            res.status(200).json(pokemonInfo);
        } else {
            console.log("ingreso al api de pokemon");
            const informationPokemon = await searchPokemon(req.params.namepokemon);
            console.log(informationPokemon);
            if (informationPokemon) {
                const { name, sprites: { front_default }, height, weight, id, base_experience } = informationPokemon;
                const newPokemon: IPokemon = new pokemons({ name, sprites: { front_default }, height, weight, id, base_experience });
                await newPokemon.save();
                res.status(200).json({ message: "New pokemon aggree in the database", newPokemon });
            } else {
                res.status(401).json({ message: "The information about pokemon dont found" });
            }

        }

    } catch (error) {
        res.status(500).json({ message: "Something gone wrong", error });
    }
});

router.post("/favorite/save", async (req: Request, res: Response) => {
    try {
        const { idUser, namePokemon } = req.body;
        const infoFavorite = await favorite.findOne({ idUser });
        console.log(infoFavorite);
        console.log(infoFavorite?.namePokemon);
        if (infoFavorite?.namePokemon == namePokemon) {
            res.status(401).json({ message: "Now you have this pokemon in favorites" });
        } else {
            const newFavorite: IFavorite = new favorite({ idUser, namePokemon });
            await newFavorite.save();
            res.status(200).json({ message: "The pokemon save in favorite" });
        }

    } catch (error) {
        res.status(500).json({ message: "Something gone wrong", error });
    }
});

router.get("/favorite/:id", async (req: Request, res: Response) => {
    try {
        const idUser = req.params.id;
        console.log(idUser);
        const favoriteInfo = await favorite.findOne({ idUser });
        console.log(favoriteInfo);
        if (favoriteInfo) {
            const namePokemon = favoriteInfo.namePokemon;
            console.log(namePokemon);
            const pokemon = await searchPokemon(namePokemon);
            res.status(200).json({ pokemon });
        } else {
            res.status(404).json({ message: "You dont have favorites" });
        }
    } catch (error) {
        res.status(500).json({ message: "Something gone wrong", error });
    }
});


export default router;
