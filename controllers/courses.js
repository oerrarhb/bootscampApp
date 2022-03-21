const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/aysnc');
const Course = require('../models/Course');

// @Decsription Get all Courses
// @Router /api/v1/bootcamps
// @Router /api/v1/bootcamps/:bootcampId/courses
// @Access Public

exports.getCourses = asyncHandler(async (req,res,next) =>
{
    let query;
    if(req.params.bootcampId)
    {
        query = Course.find({bootcamp : req.params.bootcampId});
    }
    else
    {
        query = Course.find().populate(
            {
                path: 'bootcamp',
                select : 'name description'
            }
        );
    }

    const courses = await query;

    res.status(200).json(
        {
            success : true,
            count: courses.length,
            data: courses
        }
    );
}
);