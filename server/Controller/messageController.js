import messageModel from "../Models/messageModel.js";

const createMessage = async (req,res)=>{
    const {chatId,senderId,text} = req.body
    const message = new messageModel({
        chatId,
        senderId,text
    })

    try{
        const responce = await message.save()
        res.status(200).json(responce)
    }catch(err){
        console.log("Error : ",err);
        res.status(500).json(err)
        
    }
}

const getMessage=async(req,res)=>{
    const {chatId} = req.params

    try{
        const message = await messageModel.find({chatId})
        res.status(200).json(message)
    }catch(err){
        console.log("Error : ",err);
        res.status(500).json(err)
        
    }
}

export {createMessage,getMessage}