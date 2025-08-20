import express from 'express'
import { login, signin } from '../controllers/userCon.js'
import  AuthUser from '../middlewares/Auth.js'


const app = express.Router()



app.post('/signin' , signin)
app.post('/login' ,  login)


export default app;