
// @Decsription Get all bootcamps
// @Router /api/v1/bootcamps
// @Access Public
exports.getBootCamps = (req, res, next) =>
{
    res.status(200).json({success : true, msg : 'Show all bootcamps'});
}

// @Decsription Get all bootcamps
// @Router /api/v1/bootcamps
// @Access Public
exports.getBootCamp = (req, res, next) =>
{
    res.status(200).json({success : true, msg : 'Get bootcamps'});
}

// @Decsription create bootcamps
// @Router /api/v1/bootcamps/:id
// @Access Public
exports.createBootCamp = (req, res, next) =>
{
    res.status(200).json({success : true, msg : 'Create new bootcamp'});
}
// @Decsription update bootcam
// @Router /api/v1/bootcamps/:id
// @Access Public
exports.updateBootCamp = (req, res, next) =>
{
    res.status(200).json({success : true, msg : `Update bootcamp ${req.params.id}`});

}

// @Decsription Delete Bootcam
// @Router /api/v1/bootcamps/:id
// @Access Public
exports.deleteBootCamp = (req, res, next) =>
{
    res.status(200).json({success : true, msg : `Delete bootcamp ${req.params.id}`});
}