import express from 'express';
const router = express.Router();

router.use('/movies', require('./movie'));

module.exports = router;
