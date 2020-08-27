const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { randomBytes } = require('crypto')

//设置cookie过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (60 * 60 * 24 * 1000))
    return d.toGMTString()
    console.log(d.toGMTString())
}



//session 数据
const SESSION_DATA = {}


//用于处理post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}


const serverHandle = (req, res) => {

    //设置JSON返回格式
    res.setHeader('content-type', 'application/json')

    //获取path eg: /api/blog/new
    const url = req.url
    req.path = url.split('?')[0]
        // console.log(req.path)

    //解析query  ?name=zhansan&age=23
    req.query = querystring.parse(url.split('?')[1])


    //解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const str = item.split('=');
        const key = str[0].trim()
        const val = str[1].trim()
        req.cookie[key] = val

    });
    // console.log('req.cookie is', req.cookie)

    //处理session
    let needSetCookie = false
    let userID = req.cookie.userid;
    if (userID) {
        if (!SESSION_DATA[userID]) {
            SESSION_DATA[userID] = {}
        }
    } else {
        needSetCookie = true
        userID = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userID] = {}

    }
    req.session = SESSION_DATA[userID]

    //处理post data
    getPostData(req).then(postData => {
        req.body = postData

        // const blogData = handleBlogRouter(req, res)
        // if (blogData) {            
        //     res.end(
        //         JSON.stringify(blogData)
        //     )
        //     return
        // }

        //处理blog路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userID};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }

        //处理user路由
        const userData = handleUserRouter(req, res)
        if (userData) {
            userData.then(Data => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userID};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(Data)
                )
            })
            return
        }


        //未命中路由 返回 404
        res.writeHead(404, { 'content-tpye': 'text/plain' })
        res.write('404 NOT FOUNT\N')
        res.end()
    })









    // const resData = {
    //     name: "王勇的博客",
    //     site: "dayongs.com",
    //     env: process.env.NODE_ENV
    // }
    // res.end(
    //     JSON.stringify(resData)
    // )

}
module.exports = serverHandle

//process.env.NODE_ENV