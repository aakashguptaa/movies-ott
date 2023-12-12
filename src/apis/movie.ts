import express from 'express';
import { uuid } from 'uuidv4';
import { addMovieService, deleteMovieService, getMoviesService, queryMoviesService, updateMovieService } from '../utils/mongo';
import { Paginate } from '../models/paginate';
import config from 'config';
import NodeCache from 'node-cache';

const adminRole =  config.get('adminRole');

const cache = new NodeCache({
    stdTTL: 20
});


/* ------------------------------- Movies APIS ------------------------------ */

export async function createMovie(req: any, res: express.Response) {
    try {
        const payload = { ...req.body, _id: uuid() }
        const userRole = req.authScope.role;
        if (userRole !== adminRole) return res.status(401).json({ message: 'Not Enough Permission' })

        await addMovieService(payload);
        return successResponse(res, { message: 'Movie added successfully' });
    } catch (error) {
        return errorResponse(res, { message: "Failed Adding Movie", error })
    }
}

export async function getAllMovie(req: express.Request, res: express.Response) {
    try {
        const paginateDetails: Paginate = { limit: Number(req.query.limit), skip: Number(req.query.skip) }
        const movieCacheData = cache.get(`getMovies_${paginateDetails.limit}_${paginateDetails.skip}`);
        if(movieCacheData) return successResponse(res, movieCacheData) ;
        const response = await getMoviesService(paginateDetails);
        cache.set(`getMovies_${paginateDetails.limit}_${paginateDetails.skip}`,response);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, { message: "Failed Fetching Movie", error })
    }
};

export async function searchMovie(req: express.Request, res: express.Response) {
    try {
        const searchTerm = req.query.search;
        const paginateDetails: Paginate = { limit: Number(req.query.limit), skip: Number(req.query.skip) }
        const cacheData = cache.get(`searchMovies_${searchTerm}_${paginateDetails.limit}_${paginateDetails.skip}`);
        if(cacheData) return successResponse(res, cacheData);
        const response = await queryMoviesService(req.query.search, paginateDetails);
        cache.set(`searchMovies_${searchTerm}_${paginateDetails.limit}_${paginateDetails.skip}`,response);
        return successResponse(res, response);
    } catch (error) {
        return errorResponse(res, { message: "Failed Fetching Movie", error })
    }
};

export async function updateMovie(req: any, res: express.Response) {
    try {
        const movieId = req.params.id as string;
        const userRole = req.authScope.role;
        const payload = { ...req.body };

        if (userRole !== adminRole) return res.status(401).json({ message: 'Not Enough Permission' })

        const response = await updateMovieService(movieId, payload);
        if (!response?.matchedCount) return res.status(400).json({ message: 'No Movie Found To Update' })
        return successResponse(res, { message: 'Movie updated successfully' });
    } catch (error) {
        return errorResponse(res, { message: "Failed Updating Movie", error })
    }
};

export async function deleteMovie(req: any, res: express.Response) {
    try {
        const movieId = req.params.id as string;
        const userRole = req.authScope.role;
        if (userRole !== adminRole) return res.status(401).json({ message: 'Not Enough Permission' })

        const response = await deleteMovieService(movieId);
        if (!response?.deletedCount) return res.status(400).json({ message: 'No Movie Found To Delete' })
        return successResponse(res, { message: 'Movie updated successfully' });
    } catch (error) {
        return errorResponse(res, { message: "Failed Deleting Movie", error })
    }
};


/* ---------------------------------- Utils --------------------------------- */
function successResponse(res: express.Response, data: any) {
    return res.status(200).json(data);
}

function errorResponse(res: express.Response, data: any) {
    return res.status(500).json(data);
}