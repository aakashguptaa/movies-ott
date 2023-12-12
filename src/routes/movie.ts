import express from 'express';
import joi from 'joi';
import { moviesFn } from '../apis';
const  router = express.Router();


/* --------------------------------- Schemas -------------------------------- */

const addMovieApiScheme = joi.object({
 title: joi.string().required(),
 genre:joi.string().required(),
 rating:joi.number().required(),
 streamingLink:joi.string().required(),   
});

const updateMovieApiSchema = joi.object({
  title: joi.string(),
  genre: joi.string(),
  rating: joi.number(),
  streamingLink:joi.string(),
  id:joi.string().required() 
 });

const getMoviesApiSchema = joi.object({
  limit: joi.number().required(),
  skip:joi.number().default(0)  
});

const searchMoviesApiSchema = joi.object({
  limit: joi.number().required(),
  skip:joi.number().default(0),
  search:joi.string().required()
});

const deleteMovieApiSchema = joi.object({
  id:joi.string().required()
});

/* -------------------------- Validator MiddleWare -------------------------- */

// Middleware function to validate POST request body
const validateRequest = (schema:joi.ObjectSchema<any>) => {
    return (req:express.Request, res:express.Response, next:any) => {
        const body = (req.body ?? {});
        const params = (req.params ?? {});
        const query = (req.query ?? {})
        const data = {...body,...params,...query};
        const { error } = schema.validate(data);
        if (error) {
          return res.status(400).json({ error: error.details.map((err) => err.message) });
        }
        next();
      };
};

/* --------------------------------- Routes --------------------------------- */

router.post('/', validateRequest(addMovieApiScheme), moviesFn.createMovie);

router.get('/', validateRequest(getMoviesApiSchema), moviesFn.getAllMovie);

router.get('/search', validateRequest(searchMoviesApiSchema), moviesFn.searchMovie);

router.put('/:id', validateRequest(updateMovieApiSchema), moviesFn.updateMovie);

router.delete('/:id', validateRequest(deleteMovieApiSchema), moviesFn.deleteMovie);

module.exports = router;
