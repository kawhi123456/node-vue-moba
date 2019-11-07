const mongoose = require('mongoose')

//定义模型  字段name类型为string
const schema = new mongoose.Schema({
    title:{ type: String },
    categories:[{ type: mongoose.SchemaTypes.ObjectId, ref:'Category'}],
    body:{ type: String },
},{
    timestamps: true
})

module.exports = mongoose.model('Article',schema)