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
     const sql = `select * from blogs where id='${id}' `
     return exec(sql).then(rows => {
         return rows[0]
     })



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
     //blogData是个博客对象，包含title content  author 属性
     const title = blogData.title
     const content = blogData.content
     const author = blogData.author
     const createtime = Date.now()
     const sql = `insert into blogs (title,content,author,createtime) values ('${title}','${content}','${author}',${createtime} ) `
     return exec(sql).then(insertData => {
         //  return data
         //  console.log(insertData)
         return {
             id: insertData.insertId
         }
     })

     //  return {
     //      id: 3
     //  }
 }

 const updateBlog = (id, blogData = {}) => {
     //id 就是更新博客的id
     //blogData是个博客对象，包含title content 属性
     //  console.log(' 22', id, blaoData)

     const title = blogData.title
     const content = blogData.content
     const createtime = Date.now()
     const sql = `update blogs set title='${title}',content='${content}',createtime=${createtime} where id=${id}`
     return exec(sql).then(updateData => {
         if (updateData.affectedRows > 0) {
             return true
         }
         return false
     })


 }

 const delBlog = (id, author) => {
     //id 是要删除的id
     const sql = `delete from blogs where id=${id} and author='${author}'`

     return exec(sql).then(val => {
         if (val.affectedRows > 0) {
             return true
         }
         return false
     })

 }

 module.exports = {
     getList,
     getDetail,
     newBlog,
     updateBlog,
     delBlog
 }