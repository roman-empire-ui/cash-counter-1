import express from 'express'
import { TryCatch } from '../middlewares/errors.js'
import { getInitialCash, initialCounter } from '../controllers/counterCon.js'
import { saveRemainingCash } from '../controllers/remCash.js'


const app = express.Router()



app.post('/initialCount' , TryCatch(initialCounter))
app.post('/remCash' , TryCatch(saveRemainingCash))
app.get('/getInitial' , getInitialCash)


export default app