import mongoose from 'mongoose'
const {Schema , model} = mongoose 


const adminSchema = new Schema({
    name : String,
    email : String,
    password : String,
},{timestamps : true})

const Admin =  model('Admin', adminSchema)

export default Admin;


