import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import path from "path";

const app = express();

app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(path.resolve(),"public")))

import { v2 as cloudinary } from 'cloudinary';
app.use(express.json())

cloudinary.config({ 
    cloud_name: 'djbuumzmi',    
    api_key: '996584787551643', 
    api_secret: '_ugkOKgyvRedZfXjtbZHWwFBp8s' // Click 'View API Keys' above to copy your API secret
});

// 
mongoose.connect("mongodb+srv://ramanandtomar1234:lTD0yCCVzenobWYL@cluster0.wb4lt.mongodb.net/myFirstDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB successfully connected"))
.catch((e) => console.error(e)); 




app.get("/",(req, res) => {
    
    res.render('index.ejs')
    
});
app.get("/login",(req,res)=>{
    res.render('login.ejs')
})

const storage = multer.diskStorage({
    destination: './public/uploads' ,
    filename : function (req, file, cb) {
      const uniqueSuffix = Date.now() + path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

const imageschema = new mongoose.Schema({
    name : {type : String , require:true},
    email : {type : String , require:true},
    filename:String,
    public_id:String,
    imgurl : String
});
const File = mongoose.model("cloudy",imageschema)



app.post('/register', upload.single('file'), async(req, res)=> {
    const file = req.file.path;
    const {name , email} = req.body;

    const cloudinaryres = await cloudinary.uploader.upload(file,{
        folder:"mynewfolder"
    })
    const db = await File.create({
        name,
        email,
        filename:file.originalname,
        public_id:cloudinaryres.public_id,
        imgurl: cloudinaryres.secure_url,
    })
    res.render("index.ejs")
    // res.render("index.ejs",{url:cloudinaryres.secure_url})
    
  
})



const port = 5000;
app.listen(port,()=>console.log("server is connected at port number ",port));