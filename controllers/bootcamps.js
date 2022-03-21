const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/aysnc');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const path = require('path');


// @Decsription Get all bootcamps
// @Router /api/v1/bootcamps
// @Access Public
exports.getBootCamps = asyncHandler(async (req, res, next) =>
{
        // Extracting query to compute it
        const reqQuery = {...req.query};

        // Fields to exclude
        const removeFields = ['select','sort','page','limit'];

        //Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        // Follow the doc the extract the comparison
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/,match => `$${match}`);
        let query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

        // select fields
        if(req.query.select)
        {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if(req.query.sort)
        {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
        else
        {
            query = query.sort('-createdAt');
        }

        //Pagination
        const page = parseInt(req.query.page,10) || 1;
        const limit = parseInt(req.query.limit,10) || 25;
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        const total = await Bootcamp.countDocuments();

        query = query.skip(startIndex).limit(limit);

        const bootcamps = await query;

        const pagination = {};
        if(endIndex<total)
        {
            pagination.next = 
            {
                page: page+1,
                limit
            }
        }
        if(startIndex>0)
        {
            pagination.prev = 
            {
                page : page -1,
                limit
            }
        }
        res.status(200).json({success : true,count : bootcamps.length, pagination : pagination,data : bootcamps});
});

// @Decsription Get bootcamp by id
// @Router /api/v1/bootcamps/:id
// @Access Public
exports.getBootCamp = asyncHandler (async (req, res, next) =>
{
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp)
        {
            return next(new ErrorResponse(`Bootcamp cannot be found with id of ${req.params.id}`,404));
        }
        res.status(200).json({success : true,data : bootcamp});
});

// @Decsription create bootcamps
// @Router /api/v1/bootcamps/:id
// @Access Public
exports.createBootCamp = asyncHandler (async (req, res, next) =>
{
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json(
            {
                success : true,
                data: bootcamp
            }
        );
});
// @Decsription update bootcam
// @Router /api/v1/bootcamps/:id
// @Access Public
exports.updateBootCamp = asyncHandler (async (req, res, next) =>
{
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,
            {
                new : true,
                runValidators : true
            });
        if(!bootcamp)
        {
            return next(new ErrorResponse(`Bootcamp cannot be found with id of ${req.params.id}`,404));
        }
        res.status(200).json({success : true, data : bootcamp});
});

// @Decsription Delete Bootcam
// @Router /api/v1/bootcamps/:id
// @Access Public
exports.deleteBootCamp = asyncHandler(async (req, res, next) =>
{
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp)
        {
            return next(new ErrorResponse(`Bootcamp cannot be found with id of ${req.params.id}`,404));
        }

        bootcamp.remove();

        res.status(200).json({success : true, data : {}});
});

// @Decsription Get Bootcam withing a radius
// @Router GET /api/v1/bootcamps/radius/:zipcode/:distance
// @Access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) =>
{
    const {zipcode, distance} = req.params;
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
    //Calculate radius using radians (Dividing dist by radius if earth)
    // Earth radius = 3963 mi
    const radius = distance/3963;
    const bootcamps = await Bootcamp.find(
        {
            location : {$geoWithin : {$centerSphere : [[lng,lat], radius]}}
        }
    );
    res.status(200).json(
        {
            success:true,
            count:bootcamps.length,
            data : bootcamps
        }
    );
});

// @Decsription Upload photo for bootcamp
// @Router PUT /api/v1/bootcamps/:id/photo
// @Access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) =>
{
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp)
        {
            return next(new ErrorResponse(`Bootcamp cannot be found with id of ${req.params.id}`,404));
        }
        if(!req.files)
        {
            return next(new ErrorResponse(`Please upload a file`,400));
        }
        const uploadedFile = req.files.image;

        // Check file type
        if(!uploadedFile.mimetype.startsWith('image'))
        {
            return next(new ErrorResponse(`Please load an image`,400));
        }

        // Check file size
        if(uploadedFile.size > process.env.MAX_FILE_UPLOAD)
        {
            return next(new ErrorResponse(`Please load an image less than ${process.env.MAX_FILE_UPLOAD}`,400));
        }

        uploadedFile.name = `photo_${bootcamp._id}${path.parse(uploadedFile.name).ext}`;
        
        uploadedFile.mv(`${process.env.FILE_UPLOAD_PATH}/${uploadedFile.name}`, async err =>
        {
            if(err)
            {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload`,500));
            }

            await Bootcamp.findByIdAndUpdate(req.params.id,
                {
                    photo : uploadedFile.name
                });
            
            res.status(200).json(
                {
                    success : true,
                    data : uploadedFile.name
                }
            );
        });
});