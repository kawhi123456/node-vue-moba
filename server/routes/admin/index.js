module.exports = app =>{
    const express = require('express')
    const jwt =  require('jsonwebtoken')
    const assert = require('http-assert')
    const AdminUser = require('../../models/AdminUser')
    const router = express.Router({
        //合并参数(父级的参数合并到router里面来 让他们可以访问得到)
        mergeParams: true
    })
    // const Category = require('../../models/Category')

    //向数据库种添加数据 创建资源
    router.post('/',async(req, res)=>{
        const model = await req.Model.create(req.body)
        res.send(model)
    })

    //根据id来修改更新该行信息
    router.put('/:id',async(req, res)=>{
        const model = await req.Model.findByIdAndUpdate(req.params.id,req.body)
        res.send(model)
    })

    //根据id来删除该行信息
    router.delete('/:id',async(req, res)=>{
        await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success: true
        })
    })

    //从数据库种读取资源列表数据 
    router.get('/',async(req, res)=>{
        //populate表示关联取出某个字段  不单单要id  而且是要id对应的完整信息
        //req.params.resource为前端传来的(rest/categories) 使用clasift插件来将 categories转换成对应的模块文件名req.Model
        //setOptions是来动态判断该接口是否需要添加一些属性 保证通用性
        const queryOptions = {}
        if(req.Model.modelName === 'Category'){
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(100)
        res.send(items)
    })

    //根据id来查询该行的信息
    router.get('/:id',async(req, res)=>{
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    // auth就表示为登陆校验中间件
    const authMiddleware = require('../../middleware/auth')

    const resourceMiddleware = require('../../middleware/resource')

    //挂载路由之前添加2个中间件 第一个为登录时的判断  第二个为req找到对应的模型
    app.use('/admin/api/rest/:resource',authMiddleware(),resourceMiddleware(),router)

    //上传图片接口
    const multer = require('multer')
    //__dirname就是绝对地址
    const upload = multer({dest:__dirname + '/../../uploads'})
    app.post('/admin/api/upload', authMiddleware(), upload.single('file'),async(req, res)=>{
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

    //登录接口
    app.post('/admin/api/login',async(req, res) => {
        const { username, password } = req.body
        //1.根据用户名找用户
        //username:username 简写成username
        const user = await AdminUser.findOne({username}).select('+password')
        //用一行来代替下面的判断
        assert(user, 422, '用户不存在')
        // if(!user){
        //     return res.status(422).send({
        //         message:'用户名不存在'
        //     })
        // }
        //2.校验密码 明文和密文是否匹配
        const isValid = require('bcryptjs').compareSync(password, user.password)
        assert(isValid, 422, '密码错误')
        // if(!isValid){
        //     return res.status(422).send({
        //         message:'密码错误'
        //     })
        // }
        //3.返回token
        const token = jwt.sign({ id:user._id },app.get('secret'))
        res.send({token})
    })
    //错误处理函数
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}