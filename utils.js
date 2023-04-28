const htmlStyle = require("./htmlStylize.cjs");
const dataBase = require("./databaseFunctions.cjs");
const pokeLookup = require("./pokemonAPI.cjs");

class RatingEntry{
    #count;
    #stars;
    #comments;

    constructor(stars, comment){
        this.#count = 1;
        this.#stars = parseInt(stars);
        this.#comments = Array()
        if (comment){
            this.#comments.push(comment)
        }
    }

    get stars(){
        return this.#stars;
    }

    set stars(star){
        let totalStars = this.#stars * this.#count
        totalStars += parseInt(star)
        this.#count += 1
        this.#stars = totalStars / this.#count;
    }

    get comments(){
        return this.#comments;
    }

    set comments(comment){
        if (comment){
            this.#comments.push(comment)
        }
    }
}


async function createRankingsList(){
    const allEntries = await dataBase.fetchAllPokemonDatabase()
    let ratingsTable = "Problem fetching from database"
    if (allEntries){
        let ratingPerPokemon = new Map()
        allEntries.forEach(x => {
            if (!ratingPerPokemon.get(x.name)){
                ratingPerPokemon.set(x.name, new RatingEntry(x.stars, x.comments))
            } else {
                let entry = ratingPerPokemon.get(x.name)
                entry.stars = x.stars
                entry.comments = x.comment
            }
        });
        let pokeList = []
        ratingPerPokemon.forEach((val, key)=>{
            const obj = {name:key, stars: val.stars}
            pokeList.push(obj)  })

        const allPokemon = await pokeLookup.getAllPokemon()
        pokeList = pokeList.sort( (x,y) =>{
            let x_index = allPokemon.findIndex(z => x.name == z) 
            let y_index = allPokemon.findIndex(z => y.name == z)
            return x_index - y_index ;
        }   )

        ratingsTable = htmlStyle.createRatingsTable(pokeList);
    }
    return ratingsTable
}

async function createInfoTable(name){
    const technicalInfo = await pokeLookup.getInfoFromName(name)
    const abilities = technicalInfo.abilities.map(x=>x.ability.name)
    let table = `<table><tr><th colspan='2'>${name} Types and Abilities</th></tr>`

    const types = technicalInfo.types.map(x=>x.type.name)
    table += `<tr><td rowspan=${types.length}>Types</td>`
    table += `<td>${types[0]}</td></tr>`
    types.slice(1).forEach( x => {
        table += `<tr><td>${x}</td></tr>`
    });

    table += `<tr><td rowspan=${abilities.length}>Abilites</td>`
    table += `<td>${abilities[0]}</td></tr>`
    abilities.slice(1).forEach( x => {
        table += `<tr><td>${x}</td></tr>`
    });

    table += `</table>`


    return table

}

async function getIndivComments(name){
    const allPokeEntries = await dataBase.fetchNamePokemonDatabase(name)
    if (allPokeEntries.length > 0){
        const totalScore = allPokeEntries.reduce((res, elem)=>(res + parseInt(elem.stars)), 0)
        const averageRating =  totalScore / allPokeEntries.length
        let html = `Average Rating: ${averageRating}`;
        allPokeEntries.sort( (x,y) => x.stars - y.stars)
        console.log(allPokeEntries)
        html += htmlStyle.createCommentsTable(allPokeEntries)
        return html
    }
}

module.exports = {createRankingsList, createInfoTable, getIndivComments}