import jwt from 'jsonwebtoken'




const genToken  = (adminId ) => {

    return  jwt.sign({adminId} , process.env.SECRET_KEY, {expiresIn : '1d'})
    
}

export default genToken; 