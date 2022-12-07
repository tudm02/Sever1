var express = require('express');
var router = express.Router();

const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    //var abc = file.originalname+""+Date();
    cb(null,file.originalname)
  }
})
const upload = multer({ storage: storage,limit:{
    fileSize : 2*1024*1024
  }})


const mongoose = require('mongoose');
const {Schema} = mongoose;

mongoose.connect('mongodb+srv://admin1:tudm02@cluster0.nfsjbrz.mongodb.net/test').then((error)=>{
  if (error!=null){
    console.log("connect success");
  }else{
    console.log("connect fail");
  }
})


const Wallpaper = new Schema({
  title: String,
  messeger: String,
  linkOld :String
});
const WallPp =mongoose.model('Wallpaper1',Wallpaper);

const data = [];


/* GET home page. */
router.get('/', function(req, res, next) {
  var data1 = [];

  WallPp.find({}).limit(100).then(data=>{
    data1= data;
    res.render('index', { title: 'Wallpaper 4k' ,data1:data,data:data.slice(0,3)});
  })

});
router.get('/page=:page', function(req, res, next) {
  var tab = 3;
  var page = req.params.page;
  var start = (page-1)*tab;
  var end = (page-1)*tab+tab;


  WallPp.find({}).limit(100).then(data=>{
    res.render('index', { title: 'Wallpaper 4k' ,data1:data,data:data.slice(start,end)});
    //res.send(data.slice(start,end))
  })


});


router.post('/create',upload.single('linkOld'), function(req, res) {
  var title = req.body.title;
  var messeger = req.body.messeger;
  var linkOld = req.file.path;

  const Wpp = new WallPp({
    title:title,
    messeger:messeger,
    linkOld:linkOld
  })
  Wpp.save().then(data=>{
    if (data!=null){
      res.send(" <a href='./'>send Image seccess</a>")
    }else{
      console.log("send image fail")
    }
  })

});
router.get('/delete/:id',function (req,res) {
  var id = req.params.id;
  WallPp.deleteOne({_id:id}).then(data=>{
    if (data!=null){
      res.send(" <a href='../'>delete Image seccess</a>")
    }else{
      res.send(" <a href='../'>delete Image fail</a>")
    }
  })
})

router.get('/view/:_id',function (req,res){
  WallPp.findById(req.params._id).then(data=>{
    console.log(req.params._id)
    res.render('viewImage',{title:'View Image',data:data})
  })
})

router.get('/api',function (req,res){
  WallPp.find({}).then(data=>{
    res.json(data)
  })
})

module.exports = router;
