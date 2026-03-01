const fs = require('fs');

let pokedexData = [];
const dataPath = `${__dirname}/pokedex.json`;
pokedexData = dataPath;

try {
    const rawData = fs.readFileSync(dataPath);
    pokedexData = JSON.parse(rawData);
} catch (error) {
    console.error("Failed to load pokedex.json on startup:", error);
}

const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);

    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8')
    });

    if (request.method !== 'HEAD' && status !== 204) {
        response.write(content);
    }
    response.end();
};

const getPokemon = (request, response) => {
    const responseJson = {
        pokedexData,
    };
    respondJSON(request, response, 200, responseJson);
}

const addPokemon = (request, response) => {
    const { name, type } = request.body;
    if (!name || !type) {
        return respondJSON(request, response, 400, { error: 'missingParams' });
    }

    let responseCode = 200;

    if (!pokedexData[name]) {
        responseCode = 201;
        pokedexData[name] = {
        };
    }

    pokedexData[name].name = name;
    pokedexData[name].type = type;

    const newPokemon = {
        id: pokedexData.length + 1,
        num: pokedexData.length + 1,
        name: pokedexData[name].name,
        type: pokedexData[name].type = type,
    }

    pokedexData.push(newPokemon);

    if (responseCode === 201) {
        return respondJSON(request, response, responseCode, { message: 'Created Successfully' });
    }

    return respondJSON(request, response, responseCode, newPokemon);
}


const notFound = (request, response) => {
    return respondJSON(request, response, 404, { error: "The page you are looking for was not found." });
};

module.exports = {
    notFound,
    getPokemon,
    addPokemon,
};