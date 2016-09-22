var landVariable = {};
landVariable.en_Name2cn_Name = {}; //形式如{'grass':'草地'，'forest':'林地'，。。。。。}
landVariable.cn_Name2en_Name = {}; //形式如{'草地':'grass'，'林地':'forest'，。。。。。}
landVariable.en_Name2checked = {}; //{'grass':true,'woodland':true};
landVariable.en_Name2MarkURL = {};
landVariable.en_NameLandFilColor = {};
landVariable.en_NameLandBorColor = {};

var landLegendVarible = {};
landLegendVarible.hislegends = "";
landLegendVarible.nowlegends = "";
landLegendVarible.planlegends = "";


var otherVarible = {};
otherVarible.addFeatureID = 0;
otherVarible.LANDTYPE = 'unclear';
otherVarible.tmpAddFeature = null; //此处的作用为刚绘制完多边形回调使用（后续添加fields_county  town  landnum）
otherVarible.serverFeaturesUpdate = []; //{'feature':,'mType':}
otherVarible.addFeatures = []; //用于保存刚绘制的但是未保存到服务器的多边形要素{'LANDNUM':,'VILLAGE':'','CROP':'','LANDTYPE':,'ID'}
otherVarible.storeCheckLands = []; //用于保存标注的标注点，每一个是json对象{'x':geoPoint.x,'y':geoPoint.y,'landtype':tmplandtype,'marker':marker}
otherVarible.storeHelpMarkers = []; //这个变量用于保存疑问红色标注
otherVarible.curWindowFeatures = []; //用于保存视窗范围内所有features{'LANDNUM':,'VILLAGE':'','CROP':'','LANDTYPE':,'ID'},{'LANDNUM':,'VILLAGE':'','CROP':'','LANDTYPE':,'FID'}
otherVarible.selectedFeature = undefined;
otherVarible.serverOrCurrent = ""; //标示选中的多边形是来自服务器还是当前绘制的多边形SERVER  CURRENT
otherVarible.ifPropChange = ""; //区别选择编辑多边形还是只是单纯选择多边形不做reshap操作
otherVarible.ifPropChange_Dis = ""; //区别选择编辑多边形还是只是单纯选择多边形不做reshap操作
otherVarible.ifShpMark = ""; //判断操作是否为图形标注还是属性标注
otherVarible.curWindowInsureFeas = [];

var otherCtrolVarible = {};
otherCtrolVarible.dyndisplay = false; //默认情况下不显示基础图层
otherCtrolVarible.hisdatadisplay = false; //默认情况下不显示历史图层
otherCtrolVarible.plandatadisplay = false; //默认情况下不显示规划图层
otherCtrolVarible.tiandisplay = false; //默认情况下不显示天地图图层
otherCtrolVarible.drawcatchable = true; //默认情况下绘制多边形是打开捕捉功能的

otherCtrolVarible.planlyropen = false; //默认情况下规划图层不显示

var AreaData = {},
    TownData = {};
var Security;
/*
 *事件绑定函数
 **/
function initBtnEvents() {
    gmap.setCursorStyle('pan', 'img/cursorimg/openhand.bmp');

    /*
     *现状用地数据图层控制，绘制多边形，标注多边形绑定事件
     */
    $('#menu_content_list_dataget').click(function(event) {
        var targetEle = toolUtil.getTarget(event)
        var tmpid = targetEle.id;
        editData(tmpid);
    });
    /*
     *现状用地数据图层控制，绘制多边形，标注多边形绑定事件
     */
    /*    $('#maptoolTbody').click(function(event){
            var targetEle=toolUtil.getTarget(event)
            var parEle=targetEle.parentNode;
            var toolname=parEle.getAttribute('toolname');
            mapToolActive(toolname);
        });*/
    $('.maptoolbar').click(function(event) {
        var parEle = this;
        var toolname = parEle.getAttribute('toolname');
        mapToolActive(toolname);
    });
    /*影像切换命令*/
    $('#changeImg').click(function(event) {
        if ($('#imgyearlist').css('display') == 'none') {
            $('#imgyearlist').css('display', 'block');
        } else {
            $('#imgyearlist').css('display', 'none');
        }
    });
    /*
     *属性修改窗口的关闭命令
     */
    $('#closeprop').click(function(event) {
        toolUtil.closeThisDiv('propDiv_fix');
        gmap.clearOverlay();
        otherVarible.selectedFeature = undefined;
        otherVarible.serverOrCurrent = ""; //标示选中的多边形是来自服务器还是当前绘制的多边形SERVER  CURRENT
    });
    /*
     *属性修改窗口的保存命令
     */
    $('#saveProp').click(function(event) {
        saveFeaProp();
    });
    /*
     *网格查询容器的关闭命令
     */
    $('#pos_close').click(function(event) {
        toolUtil.closeThisDiv('posDiv');
    });
    /*
     *属性查看窗口的关闭命令
     */
    $('#closeprop_dis').click(function(event) {
        toolUtil.closeThisDiv('propDiv_fix_dis');
        gmap.clearOverlay();
        otherVarible.selectedFeature = undefined;
        otherVarible.serverOrCurrent = ""; //标示选中的多边形是来自服务器还是当前绘制的多边形SERVER  CURRENT
    });
    /*
     *网格查询容器的“查询”单击命令
     */
    $('#pos_qry').click(function(event) {
        grid_qry();
    });
    /*
     *乡镇查询容器的“查询”单击命令
     */
    $('#pos_qry2').click(function(event) {
        grid_qry_town();
    });

    $('#closeArrimg').click(function(event) {
        $(this).css('display', 'none');
        $('#openArrimg').css('display', 'block');
        $(".itemlist-pannel").animate({ left: '-350px', opacity: 'hidden' }, "slow");
    });
    $('#openArrimg').click(function(event) {
        $(this).css('display', 'none');
        $('#closeArrimg').css('display', 'block');
        $(".itemlist-pannel").animate({ left: '0px', opacity: 'show' }, "slow");
    });

    toolUtil.dragDiv('propDiv_fix', 'moveProp', 'maindiv');
    toolUtil.dragDiv('propDiv_fix_dis', 'moveProp', 'maindiv');

    /*gEcnu.Util.dragDiv('writeProperty','tt-move');*/

    //影像切换
    $('#imgyearlist li').click(function() {
        var year = 'img' + $(this).attr('year');
        $(this).children('img').attr('src', 'images/choose.png');
        $(this).prevAll().children('img').attr('src', '');
        $(this).nextAll().children('img').attr('src', '');
        $('#imgyearlist').css('display', 'none');
        //接口函数
        changeImgage(year);
    });

    //村且换定位
    $('#villageSel').delegate('li', 'click', function() {
        $('#selectedVill').text($(this).text());
        $('#villageSel').css('display', 'none');
        var centerx = parseFloat($(this).attr('centerx'));
        var centery = parseFloat($(this).attr('centery'));
        gmap.zoomTo(centerx, centery, { 'zl': 2 });
        addVillagemaker(centerx, centery);
    });
    $('#selectedVill').click(function() {
        $('#villageSel').toggle();
        $('#dt-town').hide();
    });
    $('#villageSel').on('mouseenter', 'li', function() {
        var sessionjson = JSON.parse(sessionStorage['mytasks']);
        var townid = sessionjson[0]['distId'];
        var prename = sessionjson[0]['preDistName'];
        var distname = sessionjson[0]['distName'];

        if (distname !== '上海市') {
            return;
        }
        $('#dt-town').show();
        var txt = $(this).text();
        inittownevt(txt);
    });

    $('#dt-town').delegate('li', 'click', function() {
        $('#selectedVill').text($(this).text());
        $('#villageSel').css('display', 'none');
        var centerx = parseFloat($(this).attr('centerx'));
        var centery = parseFloat($(this).attr('centery'));
        //gmap.zoomTo(centerx,centery,{'zl':4});
        hightLightTown1(centerx, centery);

    });

    $('#dt-town').mouseleave(function() {
        $('#dt-town').hide();
    });

    connect = aaicQuery.createConnect();

    var usrid = curval = sessionStorage.getItem("usrName");
    connect.fuzzyQuery(usrid, function(json) {
        console.log(json);
        Security = new createSecurityList(json);
    });

    $('.item-search-btn').click(function() {
        searchkind = 0;
        var val = curval = $('#item-search-input').val();
        if (val.length <= 0) return;
        connect.fuzzyQuery(val, function(json) {
            Security = new createSecurityList(json);
            getVectorLandData();
        });
    });

    $('.goback-main').click(function() {
        $('.goback-list').toggle();
    });
    $('.close-pannel').click(function() {

    });

    $('#bd-county-sel').on('change', function(){
        fillTowns4bd($(this).val(), 'bd-town-sel', true);
    });

    $('#bd-town-sel').on('change', function(){
        fillVillage4bd($(this).val(), 'bd-village-sel');
    });

    $('#bd-village-sel').on('change',function() {
        changeAddr();
    });

    $('#bd-detail-county-sel').on('change', function(){
        fillTowns4bd($(this).val(), 'bd-detail-town-sel', true);
    });

    $('#bd-detail-town-sel').on('change', function(){
        fillVillage4bd($(this).val(), 'bd-detail-village-sel');
    });

    $('#bd-detail-village-sel').on('change',function() {
        changeAddr_detail();
    });

}

function changeAddr() {
    var add = $('#bd-county-sel').val() + $('#bd-town-sel').val() + $('#bd-village-sel').val();
    $('#bd-address').val(add);
}

function changeAddr_detail() {
    var add = $('#bd-detail-county-sel').val() + $('#bd-detail-town-sel').val() + $('#bd-detail-village-sel').val();
    $('#bd-detail-address').val(add);
}

function inittownevt(txt) {
    $('#dt-town').empty();
    var townarr = [];
    for (var k = 0; k < county_town.length; k++) {
        for (var key in county_town[k]) {
            if (key === txt) {
                townarr = county_town[k][key];
            }
        }
    }

    var sel = document.getElementById('dt-town');
    var li = document.createElement('li');
    for (var i = 0, len = townarr.length; i < len; i++) {
        var litemp = li.cloneNode(false);
        litemp.innerHTML = townarr[i][0]['town'];
        litemp.setAttribute('centerx', townarr[i][1]['x']);
        litemp.setAttribute('centery', townarr[i][2]['y']);
        litemp.title = townarr[i][0]['town'];
        sel.appendChild(litemp);
    }
}
//高亮显示区县边界
function hightLightTown1(centerx, centery) {
    var geopoint = new gEcnu.Geometry.Point(centerx, centery);
    var ptquery = new gEcnu.WebFeatureServices.QueryByGeometry({
        'processCompleted': function(resultFea) {
            hightLightLayer.removeAllFeatures();
            for (var i = 0, len = resultFea.length; i < len; i++) {
                resultFea[i].highLight(hightLightLayer, { isTwinkle: true, twinkleCount: 2, twinkleInterval: 1000 }, { isFill: false });
            }
            if (resultFea[0]) {
                var shpbox = resultFea[0].shape.shpBox;
                if (shpbox) {
                    var xmin = shpbox[0];
                    var ymin = shpbox[1];
                    var xmax = shpbox[2];
                    var ymax = shpbox[3];
                    var cx = (xmin + xmax) / 2;
                    var cy = (ymin + ymax) / 2;
                    var zoom = (xmax - xmin) * 4;
                    gmap.zoomTo(cx, cy, { zoom: zoom });
                }
            }
        },
        'processFailed': function() {}
    });
    lyrid = 199;

    ptquery.processAscyn(geopoint, gEcnu.layerType.GeoDB, 'ecnugis', lyrid, '100', true, '');
}

//给定位乡镇的中心点加标注
var villagemarker = {};

function addVillagemaker(centerx, centery) {
    if (villagemarker) {
        gmap.mLayer.removeMarker(villagemarker);
    }
    villagemarker = new gEcnu.Marker('marker', {
        'x': centerx,
        'y': centery,
        'description': '',
        'src': 'images/3.png',
        'offset': {
            x: -16,
            y: -32
        }
    }, { 'opacity': 1.0 });
    villagemarker.regEvent('Rclick', removeMarker);
    gmap.mLayer.addMarker(villagemarker);
}



function fillTowns4bd(areaName, id, auto, town){
    var doc=document;
    var townselect=doc.getElementById(id);
    townselect.innerHTML="";
    var detailTowns=AreaData[areaName];
    if(!detailTowns){
      //如果不存在，需要进行请求
      getTownsByCounty(areaName, function(towns) {
        display4towns(towns, id, auto, town);
      });
    } else {
      display4towns(detailTowns, id, auto, town);
    }
}

function getTownsByCounty(countyName, succ){
  var sqlservice = new gEcnu.WebSQLServices.SQLServices({'processCompleted':function(tmp,fields){
    AreaData[countyName] = tmp;
    succ(tmp);
  },'processFailed':function (){alert('读取乡镇信息失败！');return false;}});
  var qrysql = {'fields':"town,x,y","lyr":'county_town','filter':"county='"+countyName+"' and class=2"};
  sqlservice.processAscyn(gEcnu.ActType.SQLQUERY,config.sysdbName,qrysql);
}

function getVillageByTown(townName, succ){
  var sqlservice = new gEcnu.WebSQLServices.SQLServices({'processCompleted':function(tmp,fields){
    TownData[townName] = tmp;
    succ(tmp);
  },'processFailed':function (){alert('读取乡镇信息失败！');return false;}});
  var qrysql = {'fields':"Name,x,y","lyr":'villageinfo','filter':"town_name='"+townName+"'"};
  sqlservice.processAscyn(gEcnu.ActType.SQLQUERY,config.sysdbName,qrysql);
}


function display4towns(towns, id, auto, town) {
  var doc = document;
  var townselect=doc.getElementById(id);
  var option=doc.createElement('option');
  var town_len=towns.length;
  for(var m=0;m<town_len;m++){
    var detailtown = towns[m];
    var tmptown=detailtown['town'];
    if(m == 0 && auto) {
        var village_id = id.replace(/town/,'village');
        fillVillage4bd(tmptown, village_id);
    }
    var tmp_op=option.cloneNode(false);
    tmp_op.innerHTML=tmptown;
    tmp_op.value=tmptown;
    tmp_op.setAttribute('centerx',detailtown['x']);
    tmp_op.setAttribute('centery',detailtown['y']);
    townselect.appendChild(tmp_op);
  }
  if(auto){
    changeAddr();
    changeAddr_detail();
  } else {
    townselect.value = town;
  }
}

function fillVillage4bd(townName, id, village) {
    var doc=document;
    var townselect=doc.getElementById(id);
    townselect.innerHTML="";
    var detailVillage=TownData[townName];
    if(!detailVillage){
      //如果不存在，需要进行请求
      getVillageByTown(townName, function(villages) {
        display4villages(villages, id, village);
      });
    } else {
      display4villages(detailVillage, id, village);
    }
}

function display4villages(villages, id, village) {
    var doc = document;
    var townselect=doc.getElementById(id);
    var option=doc.createElement('option');
    var town_len=villages.length;
    for(var m=0;m<town_len;m++){
      var detailvillage = villages[m];
      var tmptown=detailvillage['Name'];
      var tmp_op=option.cloneNode(false);
      tmp_op.innerHTML=tmptown;
      tmp_op.value=tmptown;
      tmp_op.setAttribute('centerx',detailvillage['x']);
      tmp_op.setAttribute('centery',detailvillage['y']);
      townselect.appendChild(tmp_op);
    }
    if(village) {
        townselect.value = village;
    } else {
        changeAddr();
        changeAddr_detail();
    }
}










/*
 *事件绑定函数（业务函数初始化）
 **/
function otherInitEvents() {
    /*
     *1、首先获取所有用地类型(后面初始化绘制地块列表处应用)
     */
    loadAllLands();//初始化绘制地块列表

    //loadAllLegends();//初始化图层控制列表
    //此时需要声明矢量层并添加到gmap对象中
    //addFeatureLayer();
    /*****判断是否存在未保存数据*******/
    //judgeExitData();
}

function loadAllLands() {
    var landsServices = new gEcnu.WebSQLServices.SQLServices({ 'processCompleted': qryCompleted_lands, 'processFailed': qryFailed_lands });
    var qryjson = { 'lyr': 'landkind_nong', 'fields': 'CN_NAME,EN_NAME,URL_FIR,URL_SEC,FIL_COLOR,BOR_COLOR', 'filter': '' }
    landsServices.processAscyn(gEcnu.ActType.SQLQUERY, config.dbName, qryjson);
}

function qryCompleted_lands(qryresults) {
    var len_qryresults = qryresults.length;

    for (var i = 0; i < len_qryresults; i++) {
        var tmpres = qryresults[i];
        landVariable.en_Name2cn_Name[tmpres['EN_NAME']] = tmpres['CN_NAME'];
        landVariable.cn_Name2en_Name[tmpres['CN_NAME']] = tmpres['EN_NAME'];
        landVariable.en_Name2checked[tmpres['EN_NAME']] = true;
        landVariable.en_NameLandFilColor[tmpres['EN_NAME']] = tmpres['FIL_COLOR'];
        landVariable.en_NameLandBorColor[tmpres['EN_NAME']] = tmpres['BOR_COLOR'];
        landVariable.en_Name2MarkURL[tmpres['EN_NAME']] = tmpres['URL_SEC'];
    }

    loadAllLegends(); //初始化图层控制列表
    //此时需要声明矢量层并添加到gmap对象中
    addFeatureLayer();
    /*****判断是否存在未保存数据*******/
    //judgeExitData();
}

function qryFailed_lands() { toolUtil.alertDiv('查询用地数据类型失败！'); }

function addFeatureLayer(){
    var alllandstyles=[];
    for(var kk in landVariable.en_NameLandFilColor){
        var tmpfillcolor=landVariable.en_NameLandFilColor[kk];
        var tmpbordercolor=landVariable.en_NameLandBorColor[kk];
        var landkind_style=new gEcnu.Style({cirRadius:5, opacity:0.5,fillColor:tmpfillcolor,strokeColor:tmpbordercolor,lineWeight:1,mappingValue:kk});
        alllandstyles.push(landkind_style);
    }
    var options = {'opacity': 1.0}; 
    var style_ex_lands=new gEcnu.Style_Ex(alllandstyles,'LANDTYPE');
    land_Featurelayer=new gEcnu.Layer.Feature('polygonland',style_ex_lands,options,{'autoLabel':false,'lableField':'LANDTYPE','Mapping':landVariable.en_Name2cn_Name});
    gmap.addLayer(land_Featurelayer);
    land_Featurelayer.activeLabel();
    drawpolygon_obj=new gEcnu.DrawFeature.Polygon(land_Featurelayer,true);
    drawpolygon_obj.events.on('added',addpolygon_copleted);


    editpolygon=new gEcnu.EditFeature.Polygon(land_Featurelayer,true);
    editpolygon.events.on('selected',selectpolygon_copleted);
    editpolygon.events.on('updateCompleted',updateCompleted_shp);


    /*
    *添加事件监听，当地图范围发生变化时触发
    */
    gmap.events.on('boundsChanged',boundsChanged);
    /*
    *2、跳转到指定乡镇位置
    */
    //goToTaskTown();

}

function judgeExitData() {
    var tmpStr = localStorage['gmPolygon'];
    var tmpStr_ser = localStorage['gmPolygon_SER'];
    if (tmpStr || tmpStr_ser) {
        //存在未保存数据，提示用户保存数据
        toolUtil.confirmDiv('存在未保存数据，是否进行保存？', '提示确认', '保存', '取消', function() {
            //调用保存函数
            submitData();
        }, function() {
            //清除localstorage
            localStorage.removeItem('gmPolygon');
            localStorage.removeItem('gmPolygon_SER');
        }, false);
    }
}

function loadAllLegends() {
    var legendsServices = new gEcnu.WebSQLServices.SQLServices({ 'processCompleted': qryCompleted_legends, 'processFailed': qryFailed_legends });
    var qryjson = { 'lyr': 'layerlengend', 'fields': 'name,lyrlegendName', 'filter': '' }
    legendsServices.processAscyn(gEcnu.ActType.SQLQUERY, config.dbName, qryjson);

    //loadAllHelpMarkers(townname);
}

function qryCompleted_legends(qryresults) {
    var len_qryresults = qryresults.length;
    /*
     *1、首先获取所有用地类型(后面初始化绘制地块列表处应用)
     *2、将对应用地类型的三种图片路径（active,click,hover）保存到变量中
     *3、将其写入绘制类型的tbody中
     */
    for (var i = 0; i < len_qryresults; i++) {
        var tmpres = qryresults[i];
        var legendKind = tmpres['name'];
        if (legendKind == 'history') {
            landLegendVarible.hislegends = landLegendVarible.hislegends + [tmpres['lyrlegendName']] + ",";
        } else if (legendKind == 'now') {
            landLegendVarible.nowlegends = landLegendVarible.nowlegends + [tmpres['lyrlegendName']] + ",";
        } else {
            landLegendVarible.planlegends = landLegendVarible.planlegends + [tmpres['lyrlegendName']] + ",";
        }
    }
}

function qryFailed_legends() { toolUtil.alertDiv('查询历史、现状、规划图层失败！'); }
/*
 *加载该乡镇所有疑问网格
 */
/*
 *从数据库中读取已进行标注的标注信息
 */
function loadAllHelpMarkers(townName) {
    var shpmarkerServices = new gEcnu.WebSQLServices.SQLServices({ 'processCompleted': qryCompleted_websql_shp, 'processFailed': qryFailed_websql_shp });
    var qrysql = "ERROR='marker_shp' AND TOWN=" + "'" + townName + "'";
    var qryjson = { 'lyr': 'errorinfo', 'fields': 'FID', 'filter': qrysql }
    shpmarkerServices.processAscyn(gEcnu.ActType.SQLQUERY, config.dbName, qryjson);
}
/*
 *从数据库中读取已进行标注的标注信息
 *返回成功
 */
function qryCompleted_websql_shp(qryresults) {
    var shpmarkers = qryresults;
    var shpmarkers_len = shpmarkers.length;
    for (var i = 0; i < shpmarkers_len; i++) {
        var tmpmarker = shpmarkers[i].FID;
        var marker_x = parseInt(tmpmarker.split('_')[0], 10);
        var marker_y = parseInt(tmpmarker.split('_')[1], 10);
        //图形错误标注，直接读入数据库
        var marker = new gEcnu.Marker('marker', {
            'x': marker_x,
            'y': marker_y,
            'description': '',
            'src': 'img/editPoly/shp_err.png',
            'offset': {
                x: -12,
                y: -24
            }
        }, { 'opacity': 1.0 });
        otherVarible.storeHelpMarkers.push(marker);
        marker.regEvent('Rclick', function() {
            gmap.mLayer.removeMarker(this);
            removerMarkFromDB([this]);
        });
        gmap.mLayer.addMarker(marker);
    }
}
/*
 *从数据库中读取已进行标注的标注信息
 *返回失败
 */
function qryFailed_websql_shp() {
    toolUtil.alertDiv('页面载入时，加载疑问标注出现问题！');
}






/*document.onkeydown = function() {
    if (event.ctrlKey == true && event.keyCode == 83) { //Ctrl+S 
        event.returnvalue = false;
        submitData(); //保存用地数据
        return false;
    }
    if (event.ctrlKey == true && event.keyCode == 90) { //Ctrl+Z
        event.returnvalue = false;
        drawpolygon_obj.reVoke();
    }
    if (event.ctrlKey == true && event.keyCode == 79) { //Ctrl+N
        event.returnvalue = false;
    }
    if (event.keyCode == 81) { //Q历史用地图层
        event.returnvalue = false;
        hisDataCtrl();
    }
    if (event.keyCode == 69) { //E规划用地图层
        event.returnvalue = false;
        planDataCtrl();
    }
    if (event.keyCode == 82) { //R打开河流，线，道路面
        event.returnvalue = false;
        baseDataCtrl();
    }
    if (event.keyCode == 84) { //T打开天地图
        event.returnvalue = false;
        tianCtrl();
    }
    if (event.keyCode == 67) { //C绘制捕捉开关快捷键
        event.returnvalue = false;
        catchDrawAble();
    }
    if (event.keyCode == 46) { //Delete绘制捕捉开关快捷键
        event.returnvalue = false;
        editData('delpolygon'); //delete快捷键删除多边形
    }
    if (event.keyCode == 75) { //打开参考图层  k
        event.returnvalue = false;
        refrenceDataCtrl();
    }
    //添加规划图层
    if (event.keyCode == 89) {
        event.returnvalue = false;
        openplanlyr();
    }
}*/

function hisDataCtrl() {
    if (!otherCtrolVarible.hisdatadisplay) {
        dLayer.addLyr(landLegendVarible.hislegends);
        otherCtrolVarible.hisdatadisplay = true;
    } else {
        dLayer.removeLyr(landLegendVarible.hislegends);
        otherCtrolVarible.hisdatadisplay = false;
    }
}

function planDataCtrl() {
    if (!otherCtrolVarible.plandatadisplay) {
        dLayer.addLyr(landLegendVarible.planlegends);
        otherCtrolVarible.plandatadisplay = true;
    } else {
        dLayer.removeLyr(landLegendVarible.planlegends);
        otherCtrolVarible.plandatadisplay = false;
    }
}

function baseDataCtrl() {
    if (!otherCtrolVarible.dyndisplay) {
        //dLayer.addLyr('shImg2012a1Rect');
        gmap.addLayer(dLayer2014);
        otherCtrolVarible.dyndisplay = true;
    } else {
        //dLayer.removeLyr('shImg2012a1Rect');
        gmap.removeLayer(dLayer2014);
        otherCtrolVarible.dyndisplay = false;
    }
}

function tianCtrl() {
    if (!otherCtrolVarible.tiandisplay) {
        gmap.addLayer(otherMapLayer);
        //gmap.removeLayer(tileLayer_2012);

        tileLayer_2012.hide();
        tileLayer_2013.hide();
        tileLayer_2014.hide();
        otherCtrolVarible.tiandisplay = true;
    } else {
        var zl = gmap.getZoom().zl;
        if (zl > 7 || zl < 1) { toolUtil.alertDiv('当前级别不存在影像，请缩放至指定级别！');
            return; }
        gmap.removeLayer(otherMapLayer);
        //gmap.addLayer(tileLayer_2012);
        switch (imgNameID) {
            case 'img2012':
                tileLayer_2012.show();
            break;
            case 'img2013':
                tileLayer_2013.show();
            break;
            case 'img2014':
                tileLayer_2014.show();
            break;
        }
        otherCtrolVarible.tiandisplay = false;
    }
}

function catchDrawAble() {
    if (!otherCtrolVarible.drawcatchable) {
        drawpolygon_obj.setCatchable(true);
        otherCtrolVarible.drawcatchable = true;
    } else {
        drawpolygon_obj.setCatchable(false);
        otherCtrolVarible.drawcatchable = false;
    }
}
var refrenceFlag = false;

function refrenceDataCtrl() {
    if (!refrenceFlag) {
        dLayer.addLyr('lindi_baoshan,guolin_baoshan,miaomu_baoshan');
        refrenceFlag = true;
    } else {
        dLayer.removeLyr('lindi_baoshan,guolin_baoshan,miaomu_baoshan');
        refrenceFlag = false;
    }
}
var PlanFeature; //存储规划图层的要素图层
function openplanlyr() {
    if (!otherCtrolVarible.planlyropen) {
        if (!PlanFeature) {
            var usrname = 'lzh';
            var featureServices = new gEcnu.WebFeatureServices.QueryBySQL({ 'processCompleted': queryPlanLyrCompleted, 'processFailed': Failed_featurebysql });
            var sql = 'usrname=' + "'" + usrname + "' and shpType=5";
            featureServices.processAscyn(sql, gEcnu.layerType.GeoDB, config.dbName, 'landplan', true, 'INTRO');
        } else {
            plan_feature_layer.addFeatures(PlanFeature);
            otherCtrolVarible.planlyropen = true;
        }
    } else {
        plan_feature_layer.removeFeatures(PlanFeature);
        otherCtrolVarible.planlyropen = false;
    }

}

function queryPlanLyrCompleted(res) {
    PlanFeature = res;
    plan_feature_layer.addFeatures(res);
    otherCtrolVarible.planlyropen = true;

}

function Failed_featurebysql() {
    toolUtil.alertDiv('打开规划图层失败！');
}
