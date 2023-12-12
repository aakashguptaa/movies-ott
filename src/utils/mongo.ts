let cachedDb: any;

import { Db, MongoClient } from "mongodb";
import { Movie } from "../models/movie";
import config from 'config';

const moviesCollectionName = "movies";
const mongoUrl:string = config.get('mongoUrl');
const DBName:string =  config.get('dbName');

/* --------------------- Initialization(Factory Pattern) -------------------- */
async function connectToDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;

  // Connect to our MongoDB database hosted on MongoDB Atlas
  const client = await MongoClient.connect(mongoUrl);
  // Specify which database we want to use
  const db = await client.db(DBName);
  cachedDb = db;
  console.log("connected To Database");
  // console.log(cachedDb);
  return db;
}

export async function addMovieService(
  moviePayload: Movie
) {
  try {
    console.log(moviePayload);
    const dbInstance = await connectToDatabase();

    let result: any = await dbInstance
      .collection(moviesCollectionName!)
      .insertOne(moviePayload);

    return result;
  } catch (error: any) {
    console.log(error);
    throw new Error("Unable to insert record");
  }
}

export async function updateMovieService(
    movieId:any,
    moviePayload: Movie
  ) {
    try {
      console.log(moviePayload);
      const dbInstance = await connectToDatabase();
  
      let result = await dbInstance
        .collection(moviesCollectionName!)
        .updateOne({_id:{ $eq: movieId }},{$set:moviePayload});
  
      return result;
    } catch (error: any) {
      console.log(error);
      throw new Error("Unable to insert record");
    }
}

export async function deleteMovieService(
    movieId:any,
  ) {
    try {
      const dbInstance = await connectToDatabase();
  
      let result = await dbInstance
        .collection(moviesCollectionName!)
        .deleteOne({_id:{ $eq: movieId }});
  
      return result;
    } catch (error: any) {
      console.log(error);
      throw new Error("Unable to insert record");
    }
}

export async function getMoviesService(paginateDetails:{limit:number,skip:number}) {
  try {
    const dbInstance = await connectToDatabase();
    let result: any = await dbInstance
      .collection(moviesCollectionName!).find().skip(paginateDetails.skip).limit(paginateDetails.limit).toArray();
    return result;
  } catch (error: any) {
    console.log(error);
    throw new Error("Unable to get records");
  }
}

export async function queryMoviesService(searchTerms:any,paginateDetails:{limit:number,skip:number}) {
    try {
      const dbInstance = await connectToDatabase();
      let result: any = await dbInstance
        .collection(moviesCollectionName!).find({$or:[{title:searchTerms},{genre:searchTerms}]}).skip(paginateDetails.skip).limit(paginateDetails.limit).toArray();
      return result;
    } catch (error: any) {
      console.log(error);
      throw new Error("Unable to get records");
    }
}
