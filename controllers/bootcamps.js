const Bootcamp = require('../models/Bootcamp');
// @Decsription Get all bootcamps
// @Router /api/v1/bootcamps
// @Access Public
exports.getBootCamps = async (req, res, next) =>
{
    try
    {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success : true,count : bootcamps.length, data : bootcamps});

    }catch(err)
    {
        res.status(400).json({success:false});
    }
}

// @Decsription Get bootcamp by id
// @Router /api/v1/bootcamps/:id
// @Access Public
exports.getBootCamp = async (req, res, next) =>
{
    try
    {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp)
        {
            res.status(400).json({sucess : false});
        }
        res.status(200).json({success : true,data : bootcamp});

    }catch(err)
    {
        res.status(400).json({success:false});
    }
}

// @Decsription create bootcamps
// @Router /api/v1/bootcamps/:id
// @Access Public
exports.createBootCamp = async (req, res, next) =>
{
    try
    {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json(
            {
                success : true,
                data: bootcamp
            }
        );
    }
    catch(err)
    {
        res.status(400).json({success : false});
    }
}
// @Decsription update bootcam
// @Router /api/v1/bootcamps/:id
// @Access Public
exports.updateBootCamp = async (req, res, next) =>
{
    try
    {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,
            {
                new : true,
                runValidators : true
            });
        if(!bootcamp)
        {
            res.status(400).json({sucess : false});
        }
        res.status(200).json({success : true, data : bootcamp});

    }catch(err)
    {
        res.status(400).json({success:false});
    }
}

// @Decsription Delete Bootcam
// @Router /api/v1/bootcamps/:id
// @Access Public
exports.deleteBootCamp = async (req, res, next) =>
{
    try
    {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp)
        {
            res.status(400).json({sucess : false});
        }
        res.status(200).json({success : true, data : {}});

    }catch(err)
    {
        res.status(400).json({success:false});
    }
}