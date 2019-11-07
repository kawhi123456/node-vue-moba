const mongoose = require('mongoose')

//定义模型  字段name类型为string
const schema = new mongoose.Schema({
    name:{ type: String},
    icon:{ type: String}
})

module.exports = mongoose.model('Item',schema)