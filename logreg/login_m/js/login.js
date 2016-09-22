window.onload=function(){
  var loginimg=document.getElementById('loginimg');
  var regimg=document.getElementById('registerid');
  EventUtil.addHander(loginimg,'click',doLogin);
  EventUtil.addHander(regimg,'click',register);
  EventUtil.addHander(document,'keydown',jugeKey);
  init();
}
function init(){
        var thiswidth=document.documentElement.clientWidth;
        if(thiswidth<1280){
           document.getElementById('txtimg').style.marginLeft="-500px";
           document.getElementById('login').style.marginLeft="80px";
        }
}
//登陆
function doLogin(){
  if(!checkData()) return false;
  login();
}

function checkData()
  {
    var acct = document.getElementById("account").value;
    var pwd = document.getElementById("password").value;
    if(acct.length < 1) {
    alert("请输入用户名!");
    document.getElementById("account").focus();
    return false;
      } else if(pwd.length < 1) {
        alert("请输入密码!");
        document.getElementById("password").focus();
        return false;
      } 
    return true;
  }
var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent)
        || this.searchVersion(navigator.appVersion)
        || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function (data) {
    for (var i=0;i<data.length;i++)	{
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      }
      else if (dataProp)
        return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    { 	string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera",
      versionSearch: "Version"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    {		// for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    { 		// for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],
  dataOS : [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
      string: navigator.userAgent,
      subString: "iPhone",
      identity: "iPhone/iPod"
    },
    {
      string: navigator.userAgent,
      subString: "Android",
      identity: "Android"
    },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]
};
BrowserDetect.init();
function login(){
    var usrName = $('#account').val();
    var usrPw = $('#password').val();
    var method = "userLogin";
    var params = {method:method,Name:usrName,Pass:usrPw};
    var url = "../../serv/commPHP/Action.php";
    $.ajax({
            url:url,
            type: 'POST',
            data:params,
            success:function(remsg){
              var tmpmsg=remsg.replace(/\s+/g,"");
              var first=tmpmsg.indexOf("{");
              var modifymsg=tmpmsg.substring(first);
              var msg=JSON.parse(modifymsg);
              if(msg.flag)
               {
                  if(msg.rID=="8"){
                    alert("暂不能访问系统！等待授权中");return;
                  }
                  else{
                        if(msg.effect=="yes"){
                          sessionStorage.setItem('usrName',usrName);
                          sessionStorage.setItem('usrID',msg.usrID);
                          sessionStorage.setItem('realName',msg.realName);
                          sessionStorage.setItem('roleID',msg.rID);
                          var platselect=document.getElementById('platformselect').value;
                          if(platselect=="default"){
						                if(BrowserDetect.OS== "Windows" || BrowserDetect.OS== "Mac"){
                          	  window.location.href="../../shaldapsys";
						                }else{
						    	            window.location.href="../../shaldapsys_mobile";  
						                }
                          }else if(platselect=="pc"){
                            window.location.href="../../shaldapsys";
                          }else if(platselect=="mobile"){
                            window.location.href="../../shaldapsys_mobile";
                          }
                        }
                        else{
                           alert('该用户已失效，请联系管理员！');return;
                        }
                   }
               }else{ 
                  alert('用户名或密码错误，请重新输入！');return;
              }
            },
            error:function(msg){
               alert(JSON.stringify(msg));
            },
            //dataType: 'json',
            async:false
        }); 
}
  //enter键=登陆按钮的效果
function jugeKey(event) 
{ 
  var e = event || window.event || arguments.callee.caller.arguments[0];
  if(e.keyCode == 13) { 
     //document.getElementById("loginimg").click();
     doLogin();
     return false; 
  } 
} 

function register()
{
  //跳转至注册界面
  window.location.href="../reg/";
}

