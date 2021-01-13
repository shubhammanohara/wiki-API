const express= require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const app=express();
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine","ejs");

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema={
  title: String,
  content: String
};

const Article=mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req,res){
  Article.find({},function(err,foudArticles){
    if(err){
      res.send(err)
    }else{
        res.send(foudArticles);
    }
  });
})

.post(function(req,res){
  const newArticle= new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Successfully added new article");
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("sucessfully deleted all articles");
    }else{
      res.send(err);
    }
  })
});

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("no article found");
    }
  });
})

.put(function(req,res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrites: true},
    function(err){
      if(!err){
        res.send("Sucessfully updated article")
      }else{
        res.send(err);
      }
    }
  )
})

.patch(function(req,res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("sucessfully updated the article");
      }else{
        res.send(err);
      }
    });
})

.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Deleted Sucessfully");
      }else{
        res.send(err);
      }
  });
});

app.listen(3000, function(){
  console.log("server started on PORT 3000");
});
