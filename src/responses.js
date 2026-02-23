const fs = require('fs');

let pokedexData = [];
const dataPath = `${__dirname}/pokedex.json`;

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

  if (request.method !== 'HEAD'  && status !== 204) {
    response.write(content);
  }
  response.end();
};


const notFound = (request, response) => {
  return respondJSON(request, response, 404, { error: "The page you are looking for was not found." });
};

module.exports = {
  notFound,
};