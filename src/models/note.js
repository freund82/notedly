const mongoose=require('mongoose');

const noteSchema=new mongoose.Schema(
    {
        content:{
            type:String,
            required:true
        },
        author:{
            type:String,
            required:true
        },
        //Добавляем свойство favoriteCount
        favoriteCount:{
            type:Number,
            default:0
        },
        //Добавляем свойство favoritedBy
        favoritedBy:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        ]
    },
    {
        //Присваиваем поля createdAt и updateAt с типом Date
        timestamps:true
    }
);

const Note=mongoose.model('Note', noteSchema);
module.exports=Note;