const jwt = require('jsonwebtoken');

exports.verifyToken = (req,res,next)=>{
    const token= req.headers['authorization']?.split(' ')[1];
    if(!token){
        return res.status(401).json({ status: 'No token provided', status_code: 401});

    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err){
            return res.status(401).json({ status: 'Invalid token', status_code:401});
        }
        req.user= decoded;
        next();
    });
};

exports.verifyAdminKey = (req,res, next)=>{
    const apiKey= req.headers['x-api-key'];
    if(!apiKey || apiKey!== process.env.ADMIN_API_KEY){
        return res.status(403).json({ status: 'Forbidden', status_code: 403});

    }
    next();
};