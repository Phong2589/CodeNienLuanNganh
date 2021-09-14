const mongoose = require('mongoose');

async function connect(){
    try{
        //await mongoose.connect('mongodb://localhost:27017/pqshop');
        await mongoose.connect('mongodb+srv://phong:phongpqshop@pqshop.ibooi.mongodb.net/pqshop?retryWrites=true&w=majority');
        console.log('connect sucessfully!!!')
    }
    catch(error)
    {
        console.log('connect failure!!!')
    }
}

module.exports = {connect}
