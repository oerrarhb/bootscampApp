const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/aysnc');
const User = require('../models/user');


// @desc Register
// @Route POST /api/v1/auth/register
// Access Public

exports.register = asyncHandler(async (req,res,next)=>
{

    const {name,email,role,password} = req.body;
    const user = await User.create(
        {
            name,
            email,
            role,
            password
        }
    );
    res.status(200).json(
        {
            success : true
        }
    )
}
);