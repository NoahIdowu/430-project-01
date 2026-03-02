const fs = require('fs');
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Reusable function for get functions
const getResponses = (request, response, status, content, contentType) => {
    response.writeHead(status, {
        'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(content, 'utf8')
    });
    response.write(content);

    response.end();
};

// Gets the index page
const getIndex = (request, response) => {
    getResponses(request, response, 200, index, 'text/html');
};

// Gets the css
const getCss = (request, response) => {
    getResponses(request, response, 200, css, 'text/css');
};

module.exports = {
    getIndex,
    getCss,
};