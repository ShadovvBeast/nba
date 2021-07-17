import express from 'express';
import fs from 'fs';
import readline from 'readline';
import _ from 'lodash-contrib';
import axios from 'axios'
import mongoose from 'mongoose';
import {playerSchema} from "./schemas/player.js";

const filepath = "players.csv";
const player = mongoose.model('Player', playerSchema);

main();
async function main()
{
    // Mongoose
    await mongoose.connect('mongodb://localhost:27017/nba', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log ('DB Initialized');

    // Express
    const app = express();
    const PORT = process.env.PORT || 3000;
    app.get('/players/parse', async (req, res) => (await parseCSV()) && res.send('CSV Parsed'));
    app.listen(PORT);
    console.log(`Application listening at port: ${PORT}`);
}

async function parseCSV() {
    const fileStream = fs.createReadStream(filepath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl)
        await enhance(line)

    return true;
}

async function enhance(id) {
    if (!_.isNumeric(id))
        return;
    const playerData = (await axios.get('https://www.balldontlie.io/api/v1/players/' + id)).data;
    const playerDB = await player.findOne({id}).lean().exec();

    if (playerDB) { // Already exists in the DB
        const mongoId = playerDB._id;
        // Remove mongodb doc fields
        delete playerDB._id;
        delete playerDB.__v;
        if (playerDB.team)
            delete playerDB.team._id;

        if (!_.isEqual(playerDB, playerData)) {
            playerData._id = mongoId;
            const currPlayer = new player(playerData);
            currPlayer.isNew = false;
            await currPlayer.save(); // Will only save if modified
        }
    } else {
        const newPlayer = new player(playerData);
        await newPlayer.save();
    }
    console.log(`Player ${id} updated`);
}