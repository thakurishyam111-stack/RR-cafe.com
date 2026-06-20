import mongoose from "mongoose";
 const todaySchema =new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },

        price:{
            type:Number,
            required:true,
        },
        category:{
            type:String,
            required:true,
        },
        image:{
            type:String,
        },
        description:{
            type:String,
        },
        vailable: {
      type: Boolean,
      default: true,
    },
    }
 );
 const today = mongoose.model("today",todaySchema);
 export default today;