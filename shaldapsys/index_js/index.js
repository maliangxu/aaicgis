/**
 * 当用户单击注销按钮的时候，清空sessionStorage并能实现页面跳转至登录界面
 */
function logoutSys(){
   //首先需要判断是否有保存的数据，即判断gmpolygon是否有数据
/*    if (localStorage['gmPolygon']||localStorage['gmPolygon_store']) {
        if (confirm('发现未保存数据，是否保存？')) {
            document.getElementById('subpageframe').contentWindow.commInterface.submitFeature();
        }else{
           localStorage.removeItem('gmPolygon'); 
           localStorage.removeItem('gmPolygon_store'); 
        }
    }*/
   sessionStorage.clear();
   window.location.href="../logreg/login/"; 
}	
function back2menu(){
   //首先需要判断是否有保存的数据，即判断gmpolygon是否有数据
/*   if (localStorage['gmPolygon']||localStorage['gmPolygon_store']) {
        if (confirm('发现未保存数据，是否保存？')) {
            document.getElementById('subpageframe').contentWindow.commInterface.submitFeature();
        }else{
           localStorage.removeItem('gmPolygon'); 
           localStorage.removeItem('gmPolygon_store'); 
        }
    }*/
        document.getElementById('curPositionDiv').innerHTML="";
	      document.getElementById("subpageframe").src="sub_page/menupage/menu.html";
        $("#righttitlediv").css({"width":"145px"});
        $("#goBack").css({"display":"none"});
  //document.getElementById('goBack').style.visibility="hidden";
}
window.onbeforeunload = function() {
  //首先需要判断是否有保存的数据，即判断gmpolygon是否有数据
/*  if(localStorage['gmPolygon']||localStorage['gmPolygon_store']){
    return "-------发现未保存数据，是否确认离开？--------";
  }else{
    return;
  } */ 
};

function alertDiv(){
        //询问框
      var i=$.layer({
      shade : [0.5 , '#000' , true], //不显示遮罩
      area : ['auto','auto'],
      title:'信息提示',
      closeBtn : [0 , false],
      dialog : {
        msg:'发现未保存数据，是否保存？',
        btns : 2, 
        type : 4,
        btn : ['保存','放弃保存'],
        yes : function(){
          layer.closeAll();
          //保存对象
            document.getElementById('subpageframe').contentWindow.commInterface.submitFeature();
            //return true;
        },
        no : function(){
            layer.closeAll();
            //不保存，清空localStorage
            var localstorage = window.localStorage;
            for (var j=0, locallen = localstorage.length; j < locallen; j++){
                var localkey = localstorage.key(j);
                localstorage.removeItem(localkey);
            }
            localStorage.clear();
          }
          //return true;
        }
        });
}