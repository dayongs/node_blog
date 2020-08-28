const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')


//设置cookie过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (60 * 60 * 24 * 1000))
    return d.toGMTString()
        // console.log(d.toGMTString())
}

const handleUserRouter = (req, res) => {
    const method = req.method

    //登陆
    if (method === "GET" && req.path === '/api/user/login') {
        // const { username, password } = req.body // req.body 是post获取的data
        const { username, password } = req.query
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                //设置session
                req.session.username = data.username
                req.session.realname = data.realname
                    // console.log('req.session is', req.session)
                    // 同步到 redis
                set(req.sessionId, req.session)
                return new SuccessModel()
            }
            return new ErrorModel('登陆失败')
        })
    }


    //登陆检验测试

    if (method === 'GET' && req.path === '/api/user/login-test') {
        console.log('000', req.session.username)
        if (req.session.username) {

            return Promise.resolve(
                new SuccessModel({
                    session: req.session
                })
            )
        }
        return Promise.resolve(new ErrorModel('尚未登陆'))
    }
}

module.exports = handleUserRouter