import jwt from "jsonwebtoken"

export const getToken = async (userId) => {
    try {
        const token = jwt.sign({userId} ,process.env.JWT_SECRET , {expiresIn:"1d"}  )
        return token
       
    } catch (error) {
        console.log(error)
    }
}
