const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
    // const { resolve } = require('path')
    // const { rejects } = require('assert')

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

    //解析qurey  ?name=zhansan&age=23
    req.qurey = querystring.parse(url.split('?')[1])


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