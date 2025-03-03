import mongooes from 'mongoose'

const messageSchema = new mongooes.Schema({
    chatId : String,
    senderId : String,
    text : String
},{
    timestamps:true
})

const messageModel = mongooes.model("Messages",messageSchema)

export default messageModel

