const express=require('express')
const http=require('http')

let app=express()
const router = express.Router();
let server=http.createServer(app)
router.get('/del/:id',(req,res)=>{
  res.json({name:'ok'});
});
app.use(router)
server.listen('8000',e=>{
  console.log('port:6000 Ok')
})
