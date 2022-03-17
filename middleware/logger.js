

// @Description Logs requests to console
const logger = (req,res,next) =>
{
    console.log(`${req.method} ${req.protocall}://${req.get('host')}${req.originalUrl}`);
    next();
}

module.exports = logger;