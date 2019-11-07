const mongoose = require('mongoose')

//定义模型  字段name类型为string
//引用bcryptjs来加密 不可逆
const schema = new mongoose.Schema({
    username:{ type: String },
    password:{
        type: String, 
        select: false,
        set(value){
        return require('bcryptjs').hashSync(value,10)
    }},
})

module.exports = mongoose.model('AdminUser',schema)