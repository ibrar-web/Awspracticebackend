import express, {Express, Request, Response} from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import multer from  'multer';
import aws from 'aws-sdk'

const s3 = new aws.S3({
  accessKeyId: 'AKIAX7AARSDDPNTJWUVH',
  secretAccessKey: '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',
  region: 'ap-northeast-1'
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});
const app: Express = express();
const port = 5500;
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
app.post('/image', upload.single('image'),(req: Request, res: Response)=>{
 try {
  const file:any = req.file;
  console.log('file',file)
  const s3params = {
    Bucket: 'myfirsttestbucket1212',
    Key: `${Date.now().toString()}.${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };
  s3.upload(s3params, (err:any, data:any) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading file to S3.');
    }
    res.send('Image uploaded successfully.');
  });
 } catch (error) {
    
 }
});
app.get('/delete/:objectkey',(req: Request, res: Response)=>{
  try {
   const s3params = {
     Bucket: 'myfirsttestbucket1212',
     Key: `${req.params.objectkey}`,
   };
   s3.deleteObject(s3params, (err:any, data:any) => {
     if (err) {
       console.error(err);
       return res.status(500).send('Error uploading file to S3.');
     }
     res.send('Image Deleted successfully.');
   });
  } catch (error) {
     
  }
 });
 app.get('/test',(req,res)=>{

   try {
    res.send('app working')
   } catch (error) {
    
   }
 })

app.listen(port, ()=> {
    console.log(`[Server]: I am running at https://localhost:${port}`);
});
export default app;
