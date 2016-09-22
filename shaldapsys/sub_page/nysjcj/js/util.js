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
  alertDiv:function(strmsg){
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
     frontdiv.style.width="360px";
     frontdiv.style.height="140px";
     frontdiv.style.position="absolute";
     frontdiv.style.left="50%";
     frontdiv.style.top="50%";
     frontdiv.style.marginLeft="-180px";
     frontdiv.style.marginTop="-100px";
     frontdiv.style.zIndex=200000000001;
     frontdiv.style.background="#FFFFFF";
     frontdiv.style.borderRadius="2px";
     frontdiv.style.boxShadow="0 0 5px #535658";
     frontdiv.style.border="1px solid #999";
    
     var fronttitle=div.cloneNode(false);
     fronttitle.style.backgroundColor="#529f75";
     fronttitle.style.borderBottom="1px solid #E5E5E5";
     fronttitle.style.borderTopLeftRadius="1px";
     fronttitle.style.borderTopRightRadius="1px";
     fronttitle.style.height="30px";
     fronttitle.style.lineHeight="30px";
     fronttitle.style.width="100%";
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
     imgalert.style.marginLeft="15px";
     imgalert.style.marginTop="15px";
     imgalert.src="img/alert.png";
     var pmsg=tmpdoc.createElement('p');
     pmsg.style.paddingLeft="10px";
     pmsg.style.width="280px";
     pmsg.style.fontSize="14px";
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
     footerDiv.style.borderBottom="1px solid #E5E5E5";
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
     btnConfirm.style.width="80px";
     btnConfirm.style.height="22px";
     btnConfirm.style.fontSize="14px";
     btnConfirm.style.marginLeft="250px";
     btnConfirm.style.lineHeight="22px";
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
     frontdiv.style.width="360px";
     frontdiv.style.height="140px";
     frontdiv.style.position="absolute";
     frontdiv.style.left="50%";
     frontdiv.style.top="50%";
     frontdiv.style.marginLeft="-180px";
     frontdiv.style.marginTop="-70px";
     frontdiv.style.zIndex=200000000001;
     frontdiv.style.background="#FFFFFF";
     frontdiv.style.borderRadius="2px";
     frontdiv.style.boxShadow="0 0 5px #535658";
     frontdiv.style.border="1px solid #999";
    
     var fronttitle=div.cloneNode(false);
     fronttitle.style.backgroundColor="#529f75";
     fronttitle.style.position="relative";
     fronttitle.style.borderBottom="1px solid #E5E5E5";
     fronttitle.style.borderTopLeftRadius="1px";
     fronttitle.style.borderTopRightRadius="1px";
     fronttitle.style.height="30px";
     fronttitle.style.lineHeight="30px";
     fronttitle.style.width="100%";
     fronttitle.style.color="#fff";
     fronttitle.style.fontSize="12px";
     fronttitle.style.fontFamily='微软雅黑'; 
     fronttitle.innerHTML="&nbsp;&nbsp;<img src='img/logo.png' style='vertical-align:sub'>"+"&nbsp;&nbsp;"+titlename;
     if(ifclose){
        var closeDiv=div.cloneNode(false);
        closeDiv.style.position="absolute";
        closeDiv.style.right="10px";
        closeDiv.style.top="3px";
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
     imgalert.style.marginLeft="15px";
     imgalert.style.marginTop="15px";
     imgalert.src="img/help.png";
     var pmsg=tmpdoc.createElement('p');
     pmsg.style.paddingLeft="10px";
     pmsg.style.width="280px";
     pmsg.style.fontSize="14px";
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
     footerDiv.style.borderBottom="1px solid #E5E5E5";
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
     btnConfirm.style.width="80px";
     btnConfirm.style.height="22px";
     btnConfirm.style.fontSize="14px";
     btnConfirm.style.position="absolute";
     btnConfirm.style.left="150px";
     btnConfirm.style.top="3px";
     btnConfirm.style.lineHeight="22px";
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
  },
  isInArr: function(ele, arr) {
    return this.getIndexInarr(ele, arr) >= 0? true: false;
  },
  newalertDiv: function (msg){
    var div = document.createElement('div');
    div.innerHTML = msg;
    div.id = 'tb-alertdiv';
    div.style.width = '200px';
    div.style.height = '40px';
    div.style.position = 'absolute';
    div.style.left = '50%';
    div.style.top = '50%';
    div.style.color = '#fff';
    div.style.letterSpacing = '1px';
    div.style.marginLeft = '-100px';
    div.style.marginTop = '-20px';
    div.style.background = '#757575';
    div.style.fontSize = '15px';
    div.style.fontFamily = 'Microsoft Yahei';
    div.style.lineHeight = '40px';
    div.style.textAlign = 'center';
    div.style.borderRadius = '20px';
    div.style.zIndex = 100000000;
    document.body.appendChild(div);

    setTimeout(function (){
      var _alertdiv = document.getElementById('tb-alertdiv');
      if(_alertdiv){
        $(_alertdiv).fadeToggle(1500,function (){
          document.body.removeChild(_alertdiv);
          _alertdiv = null;
        });
      }
    },800);
   },

    /*
   *@describtion 删除表格中的记录
   *@Params database表示数据库名，tbName表示表格名称，idArr为一维数组，表示要删除行的主键(一般为id号)
   *@Params params = {'Fields':'id','Data':idArr};
   */
  recordDelete : function (db, tb, params, succCallback, failCallback) {
      var succ = arguments.length < 4 ? function() {} : succCallback;
      var sqlservice = new gEcnu.WebSQLServices.SQLServices({
          'processCompleted': function() {
              succ();
          },
          'processFailed': function() {
              if (arguments.length > 4) {
                  failCallback();
              }
          }
      });
      sqlservice.processAscyn('DELETE', db, tb, params);
  },
  //添加操作
  //params: {'Fields':["fldname","fldnum"],'Data':[["name1",1],["name2",2]]}
  recordAdd : function (db, tb, params, succ, fail) {
      var sqlservice = new gEcnu.WebSQLServices.SQLServices({
          'processCompleted': function() {
              if(typeof succ == 'function') succ();
          },
          'processFailed': function() {
              if(typeof fail == 'function') fail();
          }
      });
      sqlservice.processAscyn('ADD', db, tb, params);
  },
  //更新操作
  //params: {'Fields':[Array],'Data':[[Array],[Array]]}   Fields中第一个字段为更新标示
  recordUpdate : function (db, tb, params, succ) {
      var succCallback = arguments.length > 3 ? succ : function() {};
      var sqlservice = new gEcnu.WebSQLServices.SQLServices({
          'processCompleted': function() {
              succCallback();
          },
          'processFailed': function(){}
      });
      sqlservice.processAscyn('UPDATE', db, tb, params);
  },
  //查询操作
  //sql:   {'lyr':'表名','fields':'字段','filter':'条件'}
  recordQuery : function (db, sql, succ) {
      var sqlservice = new gEcnu.WebSQLServices.SQLServices({
          'processCompleted': function(data) {
              if(typeof succ == 'function') succ(data); //回调函数里返回数据
          },
          'processFailed': function(){}
      });
      sqlservice.processAscyn('SQLQUERY', db, sql);
  },
  //万能语句
  //sql:   {'lyr':'表名','fields':'字段','filter':'条件'}
  recordSQLEXEC : function (db, sql, succ) {
       var sqlservice = new gEcnu.WebSQLServices.SQLServices({
            'processCompleted': function(msg) {
                if(typeof succ == 'function') succ(msg);
            },
            'processFailed': function() {}
        });
        sqlservice.processAscyn('SQLEXEC', db, sql);
  },

  sqlScript : function (scriptname, option, callback) {
      option.scriptname = scriptname;
      var sqlScript = new gEcnu.WebsqlScript({
          'processCompleted': function(msg) {
            if(typeof callback == 'function') callback(msg);
          },
          'processFailed': function() {}
      });
      sqlScript.processAscyn(option);
  },



}
