const express = require('express');
const app = express();
import { Request, Response } from 'express';

app.get('/', (req: Request, res: Response) => {
  res.send('hello!');
})

module.exports = app;
