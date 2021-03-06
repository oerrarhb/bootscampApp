const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/aysnc');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @Decsription Get all Courses
// @Router /api/v1/courses
// @Router /api/v1/bootcamps/:bootcampId/courses
// @Access Public

exports.getCourses = asyncHandler(async (req,res,next) =>
{
    let query;
    if(req.params.bootcampId)
    {
        const courses = await Course.find({bootcamp : req.params.bootcampId});
        return res.status(200).json(
            {
                success : true,
                count : courses.length,
                data: courses
            }
        )
    }
    else
    {
        res.status(200).json(res.advancedResults);
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

// @Decsription Get single course
// @Router /api/v1/courses/:id
// @Access Public
exports.getCourse = asyncHandler(async (req,res,next) =>
{
    const course = await Course.findById(req.params.id).populate(
        {
            path : 'bootcamp',
            select : 'name description'
        }
    );

    if(!course)
    {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`,404));
    }
    res.status(200).json(
        {
            success : true,
            count : course.length,
            data: course
        }
    );
}
);

// @Decsription Create course
// @Router POST /api/v1/bootcamps/:bootcampId/courses
// @Access Private
exports.addCourse = asyncHandler(async (req,res,next) =>
{
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp)
    {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`,404));
    }

    const course = await Course.create(req.body);

    res.status(200).json(
        {
            success : true,
            data: course
        }
    );
}
);

// @Decsription Update course
// @Router PUT /api/v1/courses/:id
// @Access Private
exports.updateCourse = asyncHandler(async (req,res,next) =>
{
    const reqId = req.params.id;
    let course = await Course.findById(reqId);

    if(!course)
    {
        return next(
            new ErrorResponse(`No course with id of ${reqId}`,404)
        );
    }

    course = await Course.findByIdAndUpdate(reqId,req.body,{
        new : true,
        runValidators : true
    })

    res.status(200).json(
        {
            success : true,
            data: course
        }
    );
}
);

// @Decsription Delete course
// @Router DELETE /api/v1/courses/:id
// @Access Private
exports.deleteCourse = asyncHandler(async (req,res,next) =>
{
    const reqId = req.params.id;
    let course = await Course.findById(reqId);

    if(!course)
    {
        return next(
            new ErrorResponse(`No course with id of ${reqId}`,404)
        );
    }

    await course.remove();

    res.status(200).json(
        {
            success : true,
            data: {}
        }
    );
}
);