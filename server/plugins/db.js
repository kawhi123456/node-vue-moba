module.exports = app => {
    //引用mongoose插件
    const mongoose = require("mongoose")
    //链接mongodb
    mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba',{
        useNewUrlParser: true
    })

    require('require-all')(__dirname + '/../models')
}