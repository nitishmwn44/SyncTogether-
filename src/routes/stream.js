
const express = require('express');
const app = express();
const path =  require('path');
const fs = require('fs');
const router = express.Router();

router.get('/',(req,res)=>{
    const videoPath = path.join(__dirname,'../../videos/demo2.mp4');
    const stat = fs.statSync(videoPath);
    const fileSize =  stat.size;
    console.log(`file size : ${fileSize}`);
    const range = req.headers.range;
    if(range){
  
      const parts = range.replace(/bytes=/,"").split("-");
      const start = parseInt(parts[0],10);
      //const end = parts[1] ? parseInt(parts[1],10) : fileSize-1;
      end = start + 100000;  // 100 KB
      if(end>=fileSize)end = fileSize-1;
      
      const chunkSize = (end - start)+1;
      const file = fs.createReadStream(videoPath , {start,end});
    
      console.log(`${start} - ${end} chunk`);
  
      const head = {
         'Content-Range':  `bytes ${start} - ${end}/${fileSize }`,
         'Accept-Range': 'bytes',
         'Content-Length': chunkSize,
         'Content-Type': 'video/mp4'
      }
  
      res.writeHead(206,head);
      file.pipe(res);
  
    }
    else{
  
      console.log('complete video');
  
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
     }
     
     res.writeHead(200,head);
     fs.createReadStream(videoPath).pipe(res);
    }
  
  });

  module.exports = router;