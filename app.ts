import express from 'express';
import bodyParse from 'body-parser';
import mongoose, { ConnectOptions } from 'mongoose';
import pokemonRoutes from './routes/pokemonRoutes';
import userRoutes from './routes/userRoutes';
import cors from 'cors';
const app = express();
const port = 8000;

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));
app.use('/api/pokemon',pokemonRoutes);
app.use('/api/pokemon/user',userRoutes);
try{
    mongoose.connect('mongodb://localhost:27017/pokemon',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions)
    .then(() => {
        console.log("Connected to mongo");
        app.listen(port, () => {
            console.log("Open in the port: " + port);
        });
    }).catch((error) => { console.log("This is the error in the server: " + error) });
}catch(error){
    console.log("this is the ",error);
}


