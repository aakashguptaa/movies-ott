# Movie-ott Backend Repository

CRUD Operation Based On Movies Ott, Where Admin can add, update and delete movies and anyone can view or search movies

Used Major Packages: NodeJs,Express Js,MongoDb,Node-cache,Joi

## Triggering Procedure
STEP 1 : Install Dependencies run npm install or npm i

STEP 2 : Run npm run start to start the server at http://localhost:4000


## Config
Can Edit Mongo Url Or Any Config In config/default.json path

## Rest Apis

### Req Create Movie Api With No Permission:

Create Movies Api: http://localhost:4000/movies

Body:{
  "title": "ABC Movie",
  "genre": "Comedy",
  "streamingLink": "https/abc-movies.com",
  "rating": 4
}

Headers:  { 
    'Content-Type': 'application/json'
}

Response: {
    "message": "Not Enough Permission"
}

### Req Create Movie Api With Permission:

Create Movies Api: http://localhost:4000/movies

Body:{
  "title": "ABC Movie",
  "genre": "Comedy",
  "streamingLink": "https/abc-movies.com",
  "rating": 4
}

Headers:  { 
    'Content-Type': 'application/json',
    'role': 'admin'
}

Response: {
    "message": "Movie added successfully"
}


### Req Get All Movies Api With Pagination:

Create Movies Api: http://localhost:4000/movies?limit=2&skip=0

Response: [
    {
        "_id": "132a2e9d-a238-404e-8cbf-97e799275616",
        "title": "ABC Movie",
        "genre": "Comedy",
        "streamingLink": "https/abc-movies.com",
        "rating:3
    },
    {
        "_id": "b43f9e34-7a27-4024-bc0c-d17a019f4b76",
        "title": "ABCD Movie",
        "genre": "Comedy",
        "streamingLink": "https/abcd-movies.com",
        "rating:4
    }
]

Implemented Cache Using Node-Cache For 20 Sec


### Req Get Search Movies Api With Pagination:

Create Movies Api: http://localhost:4000/movies/search?search=ABCD Movie&limit=2&skip=0

Response: [
    {
        "_id": "b43f9e34-7a27-4024-bc0c-d17a019f4b76",
        "title": "ABCD Movie",
        "genre": "Comedy",
        "streamingLink": "https/abcd-movies.com",
        "rating:4
    }
]

Implemented Cache Using Node-Cache For 20 Sec


### Update Movie API:

Create Movies PUT Api: http://localhost:4000/movies/b43f9e34-7a27-4024-bc0c-d17a019f4b76

Headers:  { 
    'Content-Type': 'application/json',
    'role': 'admin'
}

Body:{
  "rating": 3
}

Response: {
    "message": "Movie updated successfully"
}


### Delete Movie API:

Delete Api: http://localhost:4000/movies/b43f9e34-7a27-4024-bc0c-d17a019f4b76

Headers:  { 
    'Content-Type': 'application/json',
    'role': 'admin'
}


Response: {
    "message": "Movie deleted successfully"
}






