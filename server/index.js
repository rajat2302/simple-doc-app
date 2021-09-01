import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import apiRoutes from "./routes/api.js";

const app = express();

app.use(bodyParser.json({limit: "50mb", extended: true}));
app.use(cors());

app.use("/api", apiRoutes);


const CONNECTION_URL = "mongodb+srv://prime:Qwerty123@cluster0.ewmoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.port || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server is running on port: ${PORT}` )))
    .catch((error) => console.log(error.message));

// mongoose.set('useFindAndModify', false);