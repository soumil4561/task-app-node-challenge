const mongoose = require("mongoose");
const {Schema} = mongoose;

const taskSchema = mongoose.Schema({
    title:{
        type: String,
        required:true,
    },
    description:{
        type: String,
        required:false,
    },
    status:{
        type:String,
        required:true,
    },
    creator:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

const taskModel = mongoose.model('Task', taskSchema);

module.exports = taskModel;