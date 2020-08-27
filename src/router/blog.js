//处理路由

const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog

} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.id


    //获取博客列表
    if (method === "GET" && req.path === "/api/blog/list") {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
            // const listData = getList(author, keyWord)
            // return new SuccessModel(listData)
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情
    if (method === "GET" && req.path === "/api/blog/detail") {
        // const data = getDetail(id)
        // return new SuccessModel(data)
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    //新增一片博客
    if (method === "POST" && req.path === "/api/blog/new") {
        // const data = newBlog(req.body)
        // return new SuccessModel(data)
        //作者是假数据  待开发登陆改为真实数据
        req.body.author = 'zhangsan'
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    //更新博客
    if (method === "POST" && req.path === "/api/blog/update") {
        const result = updateBlog(id, req.body)
        return result.then(val => {
            if (val) {
                return new SuccessModel(val)
            } else {
                return new ErrorModel("更新失败")
            }

        })

    }

    //删除博客
    if (method == "POST" && req.path === "/api/blog/del") {
        const author = 'zhangsan'
        const result = delBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel(val)
            } else {
                return new ErrorModel("删除失败")
            }

        })

    }
}
module.exports = handleBlogRouter