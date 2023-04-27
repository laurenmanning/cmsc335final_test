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
    const types = technicalInfo.types.map(x=>x.type.name)

}

async function getIndivComments(){
    const allPokeEntries = await dataBase.fetchNamePokemonDatabase(name)
    if (allPokeEntries.length > 0){
        const totalScore = allPokeEntries.reduce((res, elem)=>(res + parseInt(elem.stars)), 0)
        const averageRating =  totalScore / allPokeEntries.length
        
    }
}

module.exports = {createRankingsList, createInfoTable, getIndivComments}