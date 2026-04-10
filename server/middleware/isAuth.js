import jwt from "jsonwebtoken"

const isAuth = async (req,res,next) => {
    try {
        const authHeader = req.headers?.authorization || req.headers?.Authorization;
        let token = "";
        if (authHeader && String(authHeader).toLowerCase().startsWith("bearer ")) {
            token = String(authHeader).slice(7).trim();
        } else {
            token = req.cookies?.token;
        }

        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }

        let verifyToken = jwt.verify(token ,process.env.JWT_SECRET )
        if(!verifyToken){
            return res.status(401).json({message:"Unauthorized"})
        }
        req.userId = verifyToken.userId
        next()

    } catch (error) {
        return res.status(401).json({message:"Unauthorized"})
    }
}
export default isAuth
