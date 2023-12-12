import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import NodeCache from 'node-cache';

const port = 4000;
 
async function init() {
    const app = express();

    // Helmet helps you secure your Express apps by setting various HTTP headers.
    app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }));

    // Configures the Access-Control-Allow-Origin CORS header.
    app.use(cors());

    // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
    app.use(bodyParser.json());

    app.use(extractUsersInfo);

    app.use('/',require('./routes'));

    await new Promise((resolve: any) => app.listen({ port }, resolve));

    console.log(`🚀 Server ready at: http://localhost:4000`);
    console.log("Server Started at :: ", Date.now());
}


// Ideally It should be extracted via auth token by verifying and decoding the token
function extractUsersInfo(req:any,res:express.Response,next:any){
 req.authScope = {role:req.headers.role};
 next();
}

init();