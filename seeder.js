const colors = require('colors');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path : './config/config.env'});

// Load models

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');


mongoose.connect(process.env.MONGO_URI);

// Read JSON Files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));


const importData = async () =>
{
    try{
        await Bootcamp.create(bootcamps);
        //await Course.create(courses);
        console.log('Data imported....'.green.inverse);
        process.exit();
    }catch(err)
    {
        console.error(err);
    }
}

const deleteData = async () =>
{
    try{
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data destroyed...'.red.inverse);        
        process.exit();
    }catch(err)
    {
        console.error(err);
    }
}

if(process.argv[2]==='-import')
{
    importData();
}
if(process.argv[2]==='-delete')
{
    deleteData();
}



