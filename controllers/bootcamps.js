const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/aysnc');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
// @Decsription Get all bootcamps
// @Router /api/v1/bootcamps
// @Access Public
exports.getBootCamps = asyncHandler(async (req, res, next) =>
{
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success : true,count : bootcamps.length, data : bootcamps});
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