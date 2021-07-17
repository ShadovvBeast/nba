import express from 'express';
import fs from 'fs';
import readline from 'readline';
import _ from 'lodash-contrib';
import axios from 'axios'
const app = express();
const PORT = process.env.PORT || 3000;
const filepath = "players.csv";
app.listen(PORT);
app.get('/players/parse', async (req, res) => (await parseCSV()) && res.send('CSV Parsed'));

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
    console.log(playerData);
}