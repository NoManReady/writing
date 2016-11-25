const noticeContext='$$notice';
const baseStyle={
  position:'fixed',
  textAlign:'center',
  display:'table',
  verticalAlign:'middle',
  zIndex:9999,
  top:'1em',
  fontSize:'14px',
  opacity:0,
  transform:'translateY(-100%)',
  transition:'all .3s',
};
const theme={
  success:{
    backgroundColor:'#87d068'
  },
  info:{
    backgroundColor:'#2db7f5'
  },
  warn:{
    backgroundColor:'#fa0'
  },
  error:{
    backgroundColor:'#f50'
  }
};
class Notice{
  constructor(content,options){

  }
  success(){

  }
  info(){

  }
  warn(){

  }
  error(){

  }
  config(){

  }
  destroy(){

  }
}
export default (vue,options)=>{
  vue.prototype.$notice=function(content,options){
    new Notice(content,options);
  }
};
