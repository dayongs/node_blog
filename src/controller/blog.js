 //处理数据

 const { exec } = require("../db/mysql")


 const getList = (author, keyword) => {

     let sql = `select * from blogs where 1=1 `
     if (author) {
         sql += `and author ='${author}' `
     }
     if (keyword) {
         sql += `and title like '%${keyword}%' `
     }
     sql += `order by createtime desc;`

     //返回一个promise
     return exec(sql)


     //返回假数据
     //  return [{
     //          id: 1,
     //          titile: "我是标题A",
     //          content: "我是内容A",
     //          time: 1596450684461,
     //          author: "zhangsan"
     //      },
     //      {
     //          id: 2,
     //          titile: "我是标题B",
     //          content: "我是内容B",
     //          time: 1596450765306,
     //          author: "lisi"
     //      }
     //  ]
 }

 const getDetail = (id) => {




     //  //返回假数据
     //  return [{
     //      id: 1,
     //      titile: "我是标题A",
     //      content: "我是内容A",
     //      time: 1596450684461,
     //      author: "zhangsan"
     //  }]
 }

 //新增blog

 const newBlog = (blogData) => {
     //blogData是个博客对象，包含title content 属性
     console.log('11', blogData)
     return {
         id: 3
     }
 }

 const updataBlog = (id, blaoData = {}) => {
     //id 就是更新博客的id
     //blogData是个博客对象，包含title content 属性
     console.log(' 22', id, blaoData)

     return true
 }

 const delBlog = (id) => {
     //id 是要删除的id
     return true
 }

 module.exports = {
     getList,
     getDetail,
     newBlog,
     updataBlog,
     delBlog
 }