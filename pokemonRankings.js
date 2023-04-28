const path = require("path");
const express = require("express");   /* Accessing express module */
const http = require('http');
const bodyParser = require("body-parser");
const app = express();  /* app is a request handler function */
const portNumber = 5000; /* port number used must be the same used in formGet.html */
const mongoSanitize = require('express-mongo-sanitize');

require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') })  
const pokeLookup = require("./pokemonAPI.cjs");
const htmlStyle = require("./htmlStylize.cjs");
const dataBase = require("./databaseFunctions.cjs");
const utils = require("./utils.js");
const { info } = require("console");

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/static'));
app.use(mongoSanitize());
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (request, response) => {
   response.render("index");
});

app.get("/browse", async (request, response) => {
    //get the comments for a pokemon + other info
    const ratingsTable = await utils.createRankingsList()
    const variables = {addedMessage:"", ratingsTable:ratingsTable}
    response.render("viewratings", variables);
});

app.get("/browse/:pokemon", async (request, response) => {
    let name = request.params.pokemon
    //get the comments for a pokemon + other info
    let pokeId = await pokeLookup.getIDFromName(name)
    if (pokeId > -1){
        const infoTable = await utils.createInfoTable(name)
        const ratingsTable = await utils.getIndivComments(name)
        const variables = {pokeName:name, infoTable:infoTable, ratingsTable:ratingsTable }
        response.render("browseSpec", variables);
    } else {
        response.redirect("/viewratings")
    }
});

app.get("/rating", async (request, response) => {
    const pokemonList = await pokeLookup.getAllPokemon();
    const pokemonOptions = htmlStyle.createOptions(pokemonList);
    const variables = {"items" : pokemonOptions};
    response.render("ratingForm", variables);
});

app.get("/viewratings", async (request, response) => {
    const ratingsTable = await utils.createRankingsList()
    const variables = {addedMessage:"", ratingsTable:ratingsTable}
    response.render("viewratings", variables);
});

app.post("/rating", async (request, response) => {
    let {name, stars, comments} = request.body;
    let addedMessage = ""
    if (pokeLookup.getIDFromName(name)){
        if (stars > 0 && stars < 6){
            addedMessage = `Added your rating of ${stars} for ${name}.`
            pokeToAdd = {}
            usefulKeys = ["name", "stars", "comments"]
            usefulKeys.forEach(x => pokeToAdd[x] = request.body[x])
            dataBase.addPokemonDatabase( pokeToAdd )
        }
    }
    const ratingsTable = await utils.createRankingsList()
    const variables = {addedMessage:"", ratingsTable:ratingsTable}
    response.render("viewratings", variables);
 });
app.listen(portNumber);



