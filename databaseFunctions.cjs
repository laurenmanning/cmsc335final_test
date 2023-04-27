const { MongoClient, ServerApiVersion } = require('mongodb');
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const uri = `mongodb+srv://${userName}:${password}@cluster0.afo8aeo.mongodb.net/?retryWrites=true&w=majority`;

const databaseAndCollection = {db: "PokemonList", collection:"pokemonRatings"};

async function addPokemonDatabase(pokemon){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
        const cursor = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(pokemon);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function fetchAllPokemonDatabase() {
    let result;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        let filter = {}
        await client.connect();
        const cursor = await client.db(databaseAndCollection.db)
                            .collection(databaseAndCollection.collection)
                            .find(filter);
        result = await cursor.toArray();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        return result
    }
}

async function fetchNamePokemonDatabase(name) {
    let result;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        let filter = {name : name}
        await client.connect();
        const cursor = await client.db(databaseAndCollection.db)
                            .collection(databaseAndCollection.collection)
                            .find(filter);
        result = await cursor.toArray();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        return result
    }
}

module.exports = { addPokemonDatabase, fetchAllPokemonDatabase, fetchNamePokemonDatabase }