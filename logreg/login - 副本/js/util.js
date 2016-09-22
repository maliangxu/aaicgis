var toolUtil={
      /**
    *添加事件绑定函数
    *跨浏览器
    */
    addHander:function(element,type,hander)
    {
       if (element.addEventListener)
       {
         element.addEventListener(type,hander,false);
       }else if (element.attachEvent) {
         element.attachEvent("on"+type, hander);
       }else{
        //element.setAttribute("on"+type, hander);
         element['on'+type]=hander;
       }
    },
    /**
    *获取事件对象
    *跨浏览器
    */
    getEvent:function(event)
    {
      return event?event:window.event;
    },
    /**
    *获取事件元素对象
    *跨浏览器
    */
    getTarget:function(event)
    {
      return event.target||event.srcElement;
    },
    /**
    *取消元素默认行为
    *跨浏览器，如<a href="" >可以通过在onclick事件中阻止href执行页面跳转的默认行为
    */
    preventDefault:function(event)
    {
      if (event.preventDefault)
        {event.preventDefault();}
      else
      { window.event.returnValue=false;}
    },
    getAttr:function(ele,attr){
       var retAttr=""
       retAttr=ele.getAttribute(attr);
       return retAttr;
    },
    setAttr:function(ele,attr,value){
       ele.setAttribute(attr,value);
    },
    /**
    *移除对象事件
    *跨浏览器
    */
    removeHander:function(element,type,hander)
    {
       if (element.removeEventListener)
       {
         element.removeEventListener(type,hander,false);
       }else if (element.detachEvent) {
         element.detachEvent("on"+type, hander);
       }else{
        element['on'+type]=null;
       }
    },
    /**
    *阻止事件冒泡
    *跨浏览器
    */
    stopPropagation:function(event)
    {
       if (event.stopPropagation)
       {
        event.stopPropagation();
       }else
       {
        window.event.cancelBubble=true;
       }
    },
  setCookie:function(name,value){
    toolUtil.delCookie(name);
    var Days = 10;
    var exp=new Date();
    exp.setTime(exp.getTime()+Days*24*3600*1000);
    var namevalue=name+"="+escape(value);
    document.cookie=namevalue+";expires="+exp.toGMTString();
  },
  delCookie:function(name) {  
      var exp = new Date(); //当前时间   
      exp.setTime(exp.getTime() - 10); //删除cookie 只需将cookie设置为过去的时间    
      var cval = toolUtil.getcookie(name);  
      if (cval != "")  
        document.cookie = name + "=" + cval + ";expires="+ exp.toGMTString();  
  }, 
  getcookie:function(sname){//获取单个cookies
    var acookie=document.cookie.split(";"); 
    for(var i=0;i<acookie.length;i++){
    var arr=acookie[i].split("=");
    if(sname==arr[0]){
      if(arr.length>1)
        return unescape(arr[1]);
      else
        return "";
      }}
    return "";
  },
  closeThisDiv:function(id){
    document.getElementById(id).style.display="none";
  },
  openThisDiv:function(id){
    document.getElementById(id).style.display="block";
  },
  ifctrl:function(e){ //函数:判断键盘Ctrl按键
     var nav4 = window.Event ? true : false; //初始化变量
     if(nav4) { //对于Netscape浏览器
       //判断是否按下Ctrl按键
       if((typeof e.ctrlKey != 'undefined') ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK > 0) { 
         return true;
       } else {
          return false;
       }
     } else {
       //对于IE浏览器，判断是否按下Ctrl按键
       if(window.event.ctrlKey) {
           return true;
       } else {
           return false;
       }
     }
     return false;
   },
   ifshift:function(e){ //函数:判断键盘Shift按键
     var nav4 = window.Event ? true : false; //初始化变量
     if(nav4) { //对于Netscape浏览器
       //判断是否按下Ctrl按键
       if((typeof e.shiftKey != 'undefined') ? e.shiftKey : e.modifiers & Event.SHIFT_MASK > 0) { 
         return true;
       } else {
          return false;
       }
     } else {
       //对于IE浏览器，判断是否按下Ctrl按键
       if(window.event.shiftKey) {
           return true;
       } else {
           return false;
       }
     }
     return false;
   },
   dragDiv:function(id,titleclassName){
     var oDiv=document.getElementById(id);
     oDiv.onmousedown=function(e){
      e=e||window.event;
      var targetEle=e.target||e.srcElement;
      if(targetEle.className==titleclassName){
        var diffx=e.clientX-oDiv.offsetLeft;
        var diffy=e.clientY-oDiv.offsetTop;
        document.onmousemove=function(e){
           e=e||window.event;
           oDiv.style.left=e.clientX-diffx+"px";
           oDiv.style.top=e.clientY-diffy+"px";
        };
        document.onmouseup=function(e){
           document.onmousemove=null;
           document.onmouseup=null;
        };
      }       
     }


   },
  loadScript:function(url, callback){ //此处是异步加载js,但是不适合用户js指向其他文件的例子，如gooleapi baiduapi
      var script = document.createElement("script");
      script.type = "text/javascript"; 
      if (script.readyState){ //IE 
        script.onreadystatechange = function(){ 
          if (script.readyState == "loaded" || script.readyState == "complete"){ 
            script.onreadystatechange = null; 
            callback(); 
          } 
        }; 
      }else { //Others: Firefox, Safari, Chrome, and Opera 
        script.onload = function(){ 
          callback(); 
        }; 
      } 
      script.src = url; 
      document.body.appendChild(script); 
  },
  loadScript_nocall:function(url){ //创建script 并加载至body,没有回调
    var scripts=document.getElementsByTagName("SCRIPT");
    var scriptlen=scripts.length;
    for(var i=0;i<scriptlen;i++){
      if(scripts[i].src==url){
        return;
      }
    }
    var script = document.createElement("script");
    script.type = "text/javascript"; 
    script.src = url; 
    document.body.appendChild(script); 
  },
  changeTwoDecimal:function(floatvar){
    var f_x = parseFloat(floatvar);
    if (isNaN(f_x)){
      alert('function:changeTwoDecimal->parameter error');
      return false;
    }
    var f_x = Math.round(floatvar*100)/100;
    return f_x;
  },
  delTextSpace:function(elem){
    var elem_child = elem.childNodes;
    for(var i=0; i<elem_child.length; i++)
    {
       var node = elem_child[i];
       if(node.nodeType == 3 && !/\S/.test(node.nodeValue))
       {
          elem.removeChild(node);
       }
    }
  },
  $_element:function(str){
    if(str.indexOf('#')>=0){//通过ID
      str=str.replace(/(^\s*)|(\s*$)/g, "");
      var id=str.substring(1);
      var element=document.getElementById(id);
      return element;
    }else if(str.indexOf('.')>=0){//通过CLASS
      str=str.replace(/(^\s*)|(\s*$)/g, "");
      var classNme=str.substring(1);  
      var elements=document.getElementsByClassName(classNme);
      return elements;
    }else{//通过TagName
      str=str.replace(/(^\s*)|(\s*$)/g, "");
      var tagmne=str.toUpperCase();
      var elements=document.getElementsByTagName(tagmne);
      return elements;
    }
  },
  getButton:function (event)
  {
    event= event || window.event;
    if(!+[1,]){
      switch(event.button)
      {
        case 0:
        case 1:
        case 3:
        case 5:
        case 7:
          return 0;
        case 2:
        case 6:
          return 2;
        case 4:
          return 1;
      }
    }
    else
    {
      return event.button;
    }
  },
  hover:function(className,overBacColor,overFontColor,outBacColor,outFontColor,attrKey,attrValue){
    var doc=document;
    var elements=doc.getElementsByClassName(className);
    var eles_len=elements.length;
    for(var i=0;i<eles_len;i++){
      var tmpEle=elements[i];
      (function(tmpEle_private){
        tmpEle_private.onmousemove=function(){
        var _attrvalue=tmpEle_private.getAttribute(attrKey);
        if(_attrvalue!=attrValue){
          tmpEle_private.style.backgroundColor=overBacColor;
          tmpEle_private.style.color=overFontColor;
        }
      };})(tmpEle);
      (function(tmpEle_private){
        tmpEle_private.onmouseout=function(){
        var _attrvalue=tmpEle_private.getAttribute(attrKey);
        if(_attrvalue!=attrValue){
          tmpEle_private.style.backgroundColor=outBacColor;
          tmpEle_private.style.color=outFontColor;
        }
      };
      })(tmpEle);  
    }
  },
  alertDiv:function(strmsg){
    if(document.getElementById('alertmsgDiv_me')){
      return;
    }
    var tmpdoc=document;
     var div=tmpdoc.createElement('div');
     var bckdiv=div.cloneNode(false);
     bckdiv.style.position="absolute";
     bckdiv.id="alertmsgDiv_me";
     bckdiv.style.width="100%";
     bckdiv.style.height="100%";
     bckdiv.style.left="0px";
     bckdiv.style.top="0px";
     bckdiv.style.background="rgba(0,14,12,0.3)";
     bckdiv.style.zIndex=200000000000;
     var frontdiv=div.cloneNode(false);
     frontdiv.style.width="375px";
     frontdiv.style.height="180px";
     frontdiv.style.position="absolute";
     frontdiv.style.left="50%";
     frontdiv.style.top="50%";
     frontdiv.style.marginLeft="-190px";
     frontdiv.style.marginTop="-100px";
     frontdiv.style.zIndex=200000000001;
     frontdiv.style.background="#FFFFFF";
     frontdiv.style.borderRadius="2px";
     frontdiv.style.boxShadow="2px 5px 7px #676a6c";
     frontdiv.style.border="1px solid #d8d6d8";
    
     var fronttitle=div.cloneNode(false);
     fronttitle.style.backgroundColor="#529f75";
     fronttitle.style.borderBottom="1px solid #E5E5E5";
     fronttitle.style.borderTopLeftRadius="1px";
     fronttitle.style.borderTopRightRadius="1px";
     fronttitle.style.height="30px";
     fronttitle.style.lineHeight="30px";
     fronttitle.style.width="100%";
     fronttitle.style.border="1px solid #529f75";
     fronttitle.style.marginLeft="-1px";
     fronttitle.style.marginTop="-1px";
     fronttitle.style.color="#fff";
     fronttitle.style.fontSize="12px";
     fronttitle.style.fontFamily='微软雅黑'; 
     fronttitle.innerHTML="&nbsp;&nbsp;<img src='img/logo.png' style='vertical-align:sub'>"+"&nbsp;&nbsp;系统提醒";
     frontdiv.appendChild(fronttitle);

     var contentDiv=div.cloneNode(false);
     contentDiv.style.backgroundColor="#FFFFFF";
     contentDiv.style.height="80px";
     contentDiv.style.width="100%";

     var imgalert=tmpdoc.createElement('img');
     imgalert.style.marginLeft="30px";
     imgalert.style.marginTop="25px";
     imgalert.src="img/alert.png";
     var pmsg=tmpdoc.createElement('p');
     pmsg.style.paddingLeft="10px";
     pmsg.style.width="280px";
     pmsg.style.fontSize="14px";
     pmsg.style.fontFamily='微软雅黑'; 
     pmsg.style.textIndent="2em";
     pmsg.style.lineHeight="25px";
     pmsg.style.color="#333";
     pmsg.style.display="inline-block";
     pmsg.style.verticalAlign="bottom";
     pmsg.innerHTML=strmsg;
     contentDiv.appendChild(imgalert);
     contentDiv.appendChild(pmsg);
     frontdiv.appendChild(contentDiv);
     
     
     var footerDiv=div.cloneNode(false);
     footerDiv.style.backgroundColor="#fff";
     //footerDiv.style.borderBottom="1px solid #E5E5E5";
     footerDiv.style.borderBottomLeftRadius="2px";
     footerDiv.style.borderBottomRightRadius="2px";
     footerDiv.style.height="30px";
     footerDiv.style.lineHeight="30px";
     footerDiv.style.width="100%";
     footerDiv.style.textAlign="center";
     var btnConfirm=div.cloneNode(false);
     btnConfirm.style.background="#529f75";
     btnConfirm.style.background="-webkit-gradient(linear, left top, left bottom, color-stop(0%,#529f75), color-stop(100%,#529f75))";
     btnConfirm.style.background="-webkit-linear-gradient(top, #529f75 0%,#529f75 100%)";
     btnConfirm.style.border="1px solid #529f75";
     btnConfirm.style.color="#FFFFFF";
     btnConfirm.style.fontWeight="bold";
     btnConfirm.style.textAlign="center";
     btnConfirm.style.width="90px";
     btnConfirm.style.height="25px";
     btnConfirm.style.fontFamily='微软雅黑'; 
     btnConfirm.style.fontSize="12px";
     btnConfirm.style.borderRadius="2px";
     btnConfirm.style.border="1px solid #bab9b9";
     btnConfirm.style.marginLeft="250px";
     btnConfirm.style.lineHeight="25px";
     btnConfirm.style.marginTop="30px";
     btnConfirm.style.cursor="pointer";
     btnConfirm.innerHTML="确定";
     btnConfirm.onclick=function(){
        var obj=tmpdoc.getElementById('alertmsgDiv_me');
        obj.parentNode.removeChild(obj);
     };
     //
     footerDiv.appendChild(btnConfirm);
     frontdiv.appendChild(footerDiv);
 
     bckdiv.appendChild(frontdiv);
     tmpdoc.body.appendChild(bckdiv);
  },
  confirmDiv:function(strmsg,titlename,confirmName,failName,Success_callback,Fail_callback,ifclose){
     var tmpdoc=document;
     var div=tmpdoc.createElement('div');
     var bckdiv=div.cloneNode(false);
     bckdiv.id="confirm_wode";
     bckdiv.style.position="absolute";
     bckdiv.style.width="100%";
     bckdiv.style.height="100%";
     bckdiv.style.left="0px";
     bckdiv.style.top="0px";
     bckdiv.style.background="rgba(0,14,12,0.3)";
     bckdiv.style.zIndex=200000000000;
     var frontdiv=div.cloneNode(false);
     frontdiv.style.width="375px";
     frontdiv.style.height="180px";
     frontdiv.style.position="absolute";
     frontdiv.style.left="50%";
     frontdiv.style.top="50%";
     frontdiv.style.marginLeft="-190px";
     frontdiv.style.marginTop="-140px";
     frontdiv.style.zIndex=200000000001;
     frontdiv.style.background="#FFFFFF";
     frontdiv.style.borderRadius="2px";
     frontdiv.style.boxShadow="2px 5px 7px #676a6c";
     frontdiv.style.border="1px solid #d8d6d8";
    
     var fronttitle=div.cloneNode(false);
     fronttitle.style.backgroundColor="#529f75";
     fronttitle.style.position="relative";
     fronttitle.style.borderBottom="1px solid #E5E5E5";
     fronttitle.style.borderTopLeftRadius="1px";
     fronttitle.style.borderTopRightRadius="1px";
     fronttitle.style.height="30px";
     fronttitle.style.lineHeight="30px";
     fronttitle.style.width="100%";
     fronttitle.style.border="1px solid #529f75";
     fronttitle.style.marginLeft="-1px";
     fronttitle.style.marginTop="-1px";
     fronttitle.style.color="#fff";
     fronttitle.style.fontSize="12px";
     fronttitle.style.fontFamily='微软雅黑'; 
     fronttitle.innerHTML="&nbsp;&nbsp;<img src='img/logo.png' style='vertical-align:sub'>"+"&nbsp;&nbsp;"+titlename;
     if(ifclose){
        var closeDiv=div.cloneNode(false);
        closeDiv.style.position="absolute";
        closeDiv.style.right="10px";
        closeDiv.style.top="2px";
        closeDiv.innerHTML="<img src='img/pop_close.png'>";
        closeDiv.style.cursor="pointer";
        closeDiv.onclick=function(){
           var obj=tmpdoc.getElementById('confirm_wode');
           obj.parentNode.removeChild(obj);
        };
        fronttitle.appendChild(closeDiv);
      }
     frontdiv.appendChild(fronttitle);

     var contentDiv=div.cloneNode(false);
     contentDiv.style.backgroundColor="#FFFFFF";
     contentDiv.style.height="80px";
     contentDiv.style.width="100%";


     var imgalert=tmpdoc.createElement('img');
     imgalert.style.marginLeft="30px";
     imgalert.style.marginTop="25px";
     imgalert.src="img/help.png";
     var pmsg=tmpdoc.createElement('p');
     pmsg.style.paddingLeft="10px";
     pmsg.style.width="280px";
     pmsg.style.fontSize="14px";
     pmsg.style.fontFamily='微软雅黑'; 
     pmsg.style.textIndent="2em";
     pmsg.style.lineHeight="25px";
     pmsg.style.color="#333";
     pmsg.style.display="inline-block";
     pmsg.style.verticalAlign="bottom";
     pmsg.innerHTML=strmsg;
     contentDiv.appendChild(imgalert);
     contentDiv.appendChild(pmsg);
     frontdiv.appendChild(contentDiv);
     
     
     var footerDiv=div.cloneNode(false);
     footerDiv.style.position="relative";
     footerDiv.style.backgroundColor="#fff";
     //footerDiv.style.borderBottom="1px solid #E5E5E5";
     footerDiv.style.borderBottomLeftRadius="2px";
     footerDiv.style.borderBottomRightRadius="2px";
     footerDiv.style.height="30px";
     footerDiv.style.lineHeight="30px";
     footerDiv.style.width="100%";
     footerDiv.style.textAlign="center";
     var btnConfirm=div.cloneNode(false);
     btnConfirm.style.background="#529f75";
     btnConfirm.style.background="-webkit-gradient(linear, left top, left bottom, color-stop(0%,#529f75), color-stop(100%,#529f75))";
     btnConfirm.style.background="-webkit-linear-gradient(top, #529f75 0%,#529f75 100%)";
     btnConfirm.style.border="1px solid #529f75";
     btnConfirm.style.color="#FFFFFF";
     btnConfirm.style.fontWeight="bold";
     btnConfirm.style.textAlign="center";
     btnConfirm.style.width="90px";
     btnConfirm.style.height="25px";
     btnConfirm.style.borderRadius="2px";
     btnConfirm.style.border="1px solid #bab9b9";
     btnConfirm.style.fontSize="12px";
     btnConfirm.style.fontFamily='微软雅黑'; 
     btnConfirm.style.position="absolute";
     btnConfirm.style.left="150px";
     btnConfirm.style.top="3px";
     btnConfirm.style.lineHeight="25px";
     btnConfirm.style.marginTop="30px";
     btnConfirm.style.cursor="pointer";
     btnConfirm.innerHTML=confirmName;
     btnConfirm.onclick=function(){
        var obj=tmpdoc.getElementById('confirm_wode');
        obj.parentNode.removeChild(obj);
        Success_callback();
     };

     var btnCancle=div.cloneNode(false);
     btnCancle.style.background="#529f75";
     btnCancle.style.background="-webkit-linear-gradient(top, #529f75 0%,#529f75 100%)";
     btnCancle.style.background="linear-gradient(top, #529f75 0%,#dfdede 100%)";
     btnCancle.style.border="1px solid #529f75";
     btnCancle.style.color="#FFFFFF";
     btnCancle.style.textAlign="center";
     btnCancle.style.width="90px";
     btnCancle.style.height="25px";
     btnCancle.style.borderRadius="2px";
     btnCancle.style.border="1px solid #bab9b9";
     btnCancle.style.fontSize="12px";
     btnCancle.style.fontFamily='微软雅黑'; 
     btnCancle.style.position="absolute";
     btnCancle.style.right="20px";
     btnCancle.style.top="33px";
     btnCancle.style.lineHeight="25px";
     btnCancle.style.cursor="pointer";
     btnConfirm.innerHTML=confirmName;
     btnConfirm.onclick=function(){
        var obj=tmpdoc.getElementById('confirm_wode');
        obj.parentNode.removeChild(obj);
        Success_callback();
     };

     var btnCancle=div.cloneNode(false);
     btnCancle.style.background="#529f75";
     btnCancle.style.background="-webkit-linear-gradient(top, #529f75 0%,#529f75 100%)";
     btnCancle.style.background="linear-gradient(top, #529f75 0%,#dfdede 100%)";
     btnCancle.style.border="1px solid #529f75";
     btnCancle.style.color="#FFFFFF";
     btnCancle.style.textAlign="center";
     btnCancle.style.width="80px";
     btnCancle.style.height="22px";
     btnCancle.style.fontSize="14px";
     btnCancle.style.fontWeight="bold";
     btnCancle.style.position="absolute";
     btnCancle.style.right="20px";
     btnCancle.style.top="3px";
     btnCancle.style.lineHeight="22px";
     btnCancle.style.cursor="pointer";
     btnCancle.innerHTML=failName;
     btnCancle.onclick=function(){
        var obj=tmpdoc.getElementById('confirm_wode');
        obj.parentNode.removeChild(obj);
        Fail_callback();
     };
     footerDiv.appendChild(btnConfirm);
     footerDiv.appendChild(btnCancle);
     frontdiv.appendChild(footerDiv);
 
     bckdiv.appendChild(frontdiv);
     tmpdoc.body.appendChild(bckdiv);
  },
  getIndexInarr:function(ele,arr){
     var arr_len=arr.length;
     for(var i=0;i<arr_len;i++){
        var tmpele=arr[i]; 
        if(tmpele==ele){
           return i;
        }
     }
     return -1;
  }
}
