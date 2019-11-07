const express = require('express')

const app = express()

app.set('secret','dasdsadawqe12')

//引用解决跨域
app.use(require('cors')())
//引用使用json
app.use(express.json())

//将前端文件夹和后台文件夹打包放进node后端文件夹中  这样只需要将node文件夹放到服务器端即可
app.use('/',express.static(__dirname + '/web'))
app.use('/admin',express.static(__dirname + '/admin'))
app.use('/uploads',express.static(__dirname + '/uploads'))


//引用数据库
require('./plugins/db')(app)
//关于admin的接口
require('./routes/admin')(app)
//引用web端的接口
require('./routes/web')(app)

//启动服务 3000端口
app.listen(3000,()=>{
    console.log('http://localhost:3000')
})