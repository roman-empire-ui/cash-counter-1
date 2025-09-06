import express from 'express'
import { TryCatch } from '../middlewares/errors.js'
import { getInitialCash, initialCounter } from '../controllers/counterCon.js'
import { getRemainingCash, saveRemainingCash } from '../controllers/remCash.js'


const app = express.Router()



app.post('/initialCount', TryCatch(initialCounter))
app.post('/remCash', TryCatch(saveRemainingCash))
app.get('/getInitial', getInitialCash)
app.get('/getRemainingCash', getRemainingCash)



export default app