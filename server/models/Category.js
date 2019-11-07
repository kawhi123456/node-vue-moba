const mongoose = require('mongoose')

//定义模型  字段name类型为string
const schema = new mongoose.Schema({
    name:{ type: String},
    //ref表示关联的哪一个模型
    parent:{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category'}
})

//子分类
schema.virtual('children',{
    localField: '_id',
    foreignField: 'parent',
    justOne: false,
    ref: 'Category'
})

schema.virtual('newsList',{
    localField: '_id',
    foreignField: 'categories',
    justOne: false,
    ref: 'Article'
})


module.exports = mongoose.model('Category',schema)