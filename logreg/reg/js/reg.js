window.onload=function(){
  /**绑定提交，返回事件*/
  var commitele=document.getElementById('commit');
  var gobackele=document.getElementById('goback');
  EventUtil.addHander(commitele,'click',commitpage);
  EventUtil.addHander(gobackele,'click',gobackpage);
  /***执行加载单位列表*****/
  loadUnits();
};
function commitpage(){
	/**
	*逐次验证七个必选参数
	*/
	//用户名检测
	var usrname=document.getElementById('usrnametext').value;
	var inputusrname=document.getElementById("usrnametext");
	var usrnamemsg=document.getElementById("usrname");
	if (usrname==""){
		usrnamemsg.style.color="#FF0000";
	    usrnamemsg.textContent="用户名不能为空！";
	    inputusrname.focus();
	    return;
	}else if(/^[a-zA-Z0-9]{1}[a-zA-Z0-9|-|_]{2-16}[a-zA-Z0-9]{1}$/gi.test(usrname)){
		usrnamemsg.style.color="#FF0000";
	    usrnamemsg.textContent="用户名不符合规范！";
	    inputusrname.focus();
	    return;
	}else if(usrname.length<3){
		usrnamemsg.style.color="#FF0000";
	    usrnamemsg.textContent="用户名长度必须大于2位！";
	    inputusrname.focus();
	    return;
	}else{
		usrnamemsg.style.color="#000000";
	    usrnamemsg.textContent="用户名合法";
	}
	//密码检测
	var passtext=document.getElementById('passtext').value;
	var passmsg=document.getElementById("pass");
	var inputpass=document.getElementById("passtext");
	if (passtext==""){
	   passmsg.style.color="#FF0000";
	   passmsg.textContent="密码不能为空！";
	   inputpass.focus();
	   return;
	}else if(/[^a-z]/gi.test(passtext)){
		passmsg.style.color="#FF0000";
	    passmsg.textContent="密码必须为英文字母！";
	    inputpass.focus();
	    return;
	}else if(passtext.length<3||passtext.length>16){
		passmsg.style.color="#FF0000";
	    passmsg.textContent="密码长度超越3-16位范围！";
	    inputpass.focus();
	    return;
	}else{
		passmsg.style.color="#000000";
	    passmsg.textContent="密码合法";
	}
	//再次输入密码验证
	var repasstext=document.getElementById('repasstext').value;
	var repassmsg=document.getElementById('repass');
	var inputrepass=document.getElementById('repasstext');
	if (repasstext!=passtext){
		repassmsg.textContent="两次输入的密码不一致！";
		inputrepass.focus();
	}else{
		repassmsg.textContent="";
	}
	//验证真实姓名
	var relnametext=document.getElementById('relnametext').value;
	var relnamemsg=document.getElementById('relname');
	var inputrelname=document.getElementById('relnametext');
	if (relnametext==""){
		relnamemsg.textContent="真实姓名不能为空！";
		inputrelname.focus();
	}else{
		relnamemsg.textContent="";
	}
	//验证电话号码
	var pReg=/^[0-9]{8}$/;  
    var mReg=/^13[0-9]{9}$|^15[0-9]{9}$|^18[0-9]{9}$/; 
    var phonetext=document.getElementById('phonetext').value;
    var phonemsg=document.getElementById('phone');
    var inputphone=document.getElementById('phonetext');
    if((pReg.test(phonetext))||(mReg.test(phonetext))) {
        phonemsg.style.color="#000000";
	    phonemsg.textContent="固话8位或手机号11位";
    }else{
        phonemsg.style.color="#FF0000";
        phonemsg.textContent="固话8位或手机号11位！";
        inputphone.focus();
        return;
    }
    //验证邮箱
    var emailtext=document.getElementById('emailtext').value;
    var emailmsg=document.getElementById('email');
    var inputemail=document.getElementById('emailtext');
    var regEmail=/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if(!(regEmail.test(emailtext))){
    	emailmsg.textContent="邮箱格式不正确！";
    	inputemail.focus();
    	return;
    }else{
    	emailmsg.textContent="";
    }
    //验证部门选择
    var unitvalue=document.getElementById('selectunit').value;
    var unitmsg=document.getElementById('unit');
    var inputunit=document.getElementById('selectunit');
    if (unitvalue=="00"){
    	unitmsg.textContent="请选择部门！";
    	inputunit.focus();
    	return;
    }else{
    	unitmsg.textContent="";
    }
    /**
    *执行提交请求
    */
    var method="regNewUser";
    var url="../../serv/commPHP/Action.php";
    var params={method:method,Name:usrname,rName:relnametext,Pass:passtext,UnitID:unitvalue,Mail:emailtext,Tel:phonetext};
    $.ajax({
            url:url,
            type: 'POST',
            data:params,
            success:function(msg){
               if(msg.add){
                //注册成功，显示注册成功界面
                document.getElementById("regcontentdiv").style.display="none";
                document.getElementById("successdiv").style.display="block";
                document.getElementById('myname').textContent=usrname;
                var backlogin=document.getElementById('backlogin');
                var backreg=document.getElementById('backreg');
                EventUtil.addHander(backlogin,'click',loginpage);
                EventUtil.addHander(backreg,'click',regpage);
               }
               else{
               	//注册失败
               	alert("注册失败，请尝试更换用户名！");return;
               }

            },
            dataType: 'json',
            async:false
        }); 
}
function gobackpage(){
 window.location.href="../login";
}
function loadUnits(){
	var method="getAllUnits";
    var url="../../serv/commPHP/Action.php";
    var params={method:method,sortUsrID:'all'};
    $.ajax({
            url:url,
            type: 'GET',
            data:params,
            success:function(tmpmsg){ 
              var unit=tmpmsg;
              fillUnit(unit);
            },
            dataType: 'json',
            async:true 
        }); 
}
function fillUnit(unit){
  var oUnit=document.getElementById("selectunit");
  var opttitle=document.createElement("option");
  opttitle.value='00';
  opttitle.text="--请选择部门--";
  opttitle.selected=true;
  oUnit.appendChild(opttitle);
  for(var i=0;i<unit.length;i++){
    var opt=document.createElement("option");
    opt.value=unit[i].ID;
    opt.text=unit[i].Name;
    oUnit.appendChild(opt);
  }
}
function loginpage(){
  window.location.href="../login";
}
function regpage(){
	document.getElementById("successdiv").style.display="none";
  document.getElementById("regcontentdiv").style.display="block";   
}