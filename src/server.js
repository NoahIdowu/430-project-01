const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const type = request.headers['content-type'];

        if (type === 'application/x-www-form-urlencoded') {
            request.body = query.parse(bodyString);
        } else if (type === 'application/json') {
            request.body = JSON.parse(bodyString);
        } else {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({ error: 'invalid data format' }));
            return response.end();
        }

        handler(request, response);
    });
};

// Sends POST requests to the corresponding handler
const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/api/pokemon') {
        parseBody(request, response, responseHandler.addPokemon);
    } else if (parsedUrl.pathname.startsWith('/api/pokemon/')) {
        parseBody(request, response, responses.updatePokemon);
    } else {
        responses.notFound(request, response);
    }
};

// Sends GET requests to the corresponding handler
const handleGet = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/style.css') {
        htmlHandler.getCss(request, response);
    } else if (parsedUrl.pathname === '/') {
        htmlHandler.getIndex(request, response);
    } else if (parsedUrl.pathname === '/api/pokemon') {
        responseHandler.getPokemon(request, response);
    }
    else if(parsedUrl.pathname === '/api/type'){
        responseHandler.getTypes(request,response, parsedUrl);
    }
    else {
        responseHandler.notFound(request, response);
    }
};

// Handles requests
const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    if (request.method === 'POST') {
        handlePost(request, response, parsedUrl);
    }
   else if (request.method === 'HEAD') {
        handleGet(request, response, parsedUrl);
    } else {
        handleGet(request, response, parsedUrl);
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});