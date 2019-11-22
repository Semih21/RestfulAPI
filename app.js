const express=require('express')
const mongoose=require('mongoose') 
const ejs=require('ejs')
const bodyParser=require('body-parser')

const app=express()
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser:true})
const articleSchema=new mongoose.Schema({
    title:String,
    content:String
})
const Article=mongoose.model('Article',articleSchema)

////////////////Request targeting all articles/////////////////

app.route('/articles').get((req,res)=>{

    Article.find({},function(err,foundArticles){
        if(!err){
            res.send(foundArticles)

        }else{
            res.send(err)
        }
        })

}).post((req,res)=>{


    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article")
        }else{
            res.send(err)
        }
    })
}).delete((req,res)=>{
    Article.deleteMany({},function(err){
        if(!err){
            res.send("Deleted all articles successfully")
        }else{
            res.send(err)
        }
    })
})

////////////////request targeting specific////////////////

app.route('/articles/:articleTitle')
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        }else{
            res.send("No articles matching that title was found")
        }
    })
})
.put(function(req,res){

    Article.update({title:req.params.articleTitle},
     {title:req.body.title,content:req.body.content},
     {overwrite:true},
     function(err,result){
            if(!err){
               res.send("Article is successfully updated.")
            }else{
               res.send(err)
        }})
})
.patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err,results){
            if(!err){
                res.send("Successfully updated")
            }else{
                res.send(err)
            }
        }
    )
})
.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted")
            }else{
                res.send(err)
            }
        }
    )
})


app.listen(3000,()=>{
    console.log("Server started on port 3000")
})












// app.get('/articles',(req,res)=>{

//     Article.find({},function(err,foundArticles){
//         if(!err){
//             res.send(foundArticles)

//         }else{
//             res.send(err)
//         }
//         })

// })

// app.post('/articles',(req,res)=>{


//     const newArticle=new Article({
//         title:req.body.title,
//         content:req.body.content
//     })
//     newArticle.save(function(err){
//         if(!err){
//             res.send("Successfully added a new article")
//         }else{
//             res.send(err)
//         }
//     })
// })

// app.delete('/articles',(req,res)=>{
//     Article.deleteMany({},function(err){
//         if(!err){
//             res.send("Deleted all articles successfully")
//         }else{
//             res.send(err)
//         }
//     })
// })