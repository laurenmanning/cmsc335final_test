async function getAllPokemon(){
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/?&limit=2000");
    const json = await response.json();
	const allPokemon = json.results.map(x => x.name);
    return allPokemon
}

async function getIDFromName(name){
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);
    if (response.status == 200){
        const json = await response.json();
        return json.id
    } else {
        return -1
    }

}

async function getInfoFromName(name){
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);
    if (response.status == 200){
        const json = await response.json();
        return json
    } else {
        return -1
    }

}


module.exports = { getAllPokemon, getIDFromName, getInfoFromName }