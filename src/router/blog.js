//处理路由

const {
    getList,
    getDetail,
    newBlog,
    updataBlog,
    delBlog

} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.qurey.id


    //获取博客列表
    if (method === "GET" & req.path === "/api/blog/list") {
        const author = req.qurey.author || ''
        const keyword = req.qurey.keyword || ''
            // const listData = getList(author, keyWord)
            // return new SuccessModel(listData)
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情
    if (method === "GET" & req.path === "/api/blog/detail") {
        // const data = getDetail(id)
        // return new SuccessModel(data)
        const result =getDetail(id)
        return result.then(data=>{
            return new SuccessModel(data) 
        })
    }

    //新增博客
    if (method === "POST" & req.path === "/api/blog/new") {
        const data = newBlog(req.body)
        return new SuccessModel(data)
    }

    //更新博客
    if (method === "POST" & req.path === "/api/blog/update") {
        const result = updataBlog(id, req.body)
        if (result) {
            return new SuccessModel(result)
        } else {
            return new ErrorModel("更新失败")
        }
    }

    //删除博客
    if (method == "POST" & req.path === "/api/blog/del") {
        const result = delBlog(id)
        if (result) {
            return new SuccessModel(result)
        } else {
            return new ErrorModel("删除失败")
        }
    }
}
module.exports = handleBlogRouter