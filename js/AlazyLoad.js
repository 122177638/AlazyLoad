/**
 * 
 * @description 图片懒加载  <img width="100%" A-lazyImg="" alt="">
 * @example var alazy = new Alazy('#main',{loading:'加载中的图片',loadError:'加载失败的图片'}) 
 * @param {String} elm dom节点  
 * @param {Object} options 配置默认图片
 * @author Anles
 * @constructor
 */
var AlazyLoad = (function(){
  function Alazy(elm,options){
    this.init(elm,options)
    return this;
  }
  Alazy.prototype = {
    isParamType(param){
      if(typeof param == 'string'){
        this.elm = param;
      }
      if(param instanceof Object){
        this.loading = param.loading;
        this.loadError = param.loadError;
      }
    },
    init(elm,options){
      this.isParamType(elm);
      this.isParamType(options);
      if(this.elm){
        this.elm = document.querySelector(this.elm);
        console.warn('请确保必须满足scorll条件')
      }else{
        this.elm = document.querySelector('html,body');
        this.elm.name = 'WID';
      }
      this.exe();
    },
    
    exe(){
      var _this = this;
      window.addEventListener('load',function(){
        _this.checkShow();
      })
      var eventNode;
      //兼容scroll监听事件，window全支持，有些浏览器不支持document.body || document.documentElement
      eventNode = this.elm.name == 'WID'?window:this.elm; 
      eventNode.addEventListener('scroll',this.throttle(this.checkShow.bind(this),100,500))  
    },
    throttle(method,delay,duration){
      var timer=null;
      var begin=new Date();    
      return function(){                
        var context=this, args=arguments;
        var current=new Date();        
        clearTimeout(timer);
        if(current-begin>=duration){
            method.apply(context,args);
            begin=current;
        }else{
            timer=setTimeout(function(){
                method.apply(context,args);
            },delay);
        }
      }
    },
    checkShow(){
      var _this = this;
      var nodeTotal = this.elm.querySelectorAll("img[A-lazyImg]");
      nodeTotal.forEach(function(item){
        if(item.getAttribute('isloaded')){
          return;
        }
        item.setAttribute('src',_this.loading)
        if(_this.shouldShow(item)){_this.showImg(item)}
      })
    },
    shouldShow($node){
      var scrollT = this.elm.scrollTop,
        winH = window.screen.height || document.documentElement.clientHeight || document.body.clientHeight,
        top = $node.offsetTop;
      if(top < winH + scrollT){
        return true;
      }else{
        return false;
      }
    },
    showImg($node){
      var _this = this;
      $node.setAttribute('src',$node.getAttribute('A-lazyImg'));
      // 加载失败
      $node.onerror = function(){
        this.setAttribute('src',_this.loadError);
        this.onerror = null;
      }
      $node.setAttribute('isLoaded', true);
    }
  }
  return Alazy;
})()