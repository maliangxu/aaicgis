function resizeDocu() {
    $('#menu_content_drawlands').perfectScrollbar('update');
    gmap.resize();
}


/********开始****开始*****开始*********多边形绘制完成时的回调+其他相关函数*******开始****开始***********开始****************/
/*
 *绘制多边形完成之后的回调函数
 */
var addPolygon_centerPoint, linerRing_glob;

function addpolygon_copleted(e, linerRing) {
    linerRing_glob = linerRing;

    /*var landArea=linerRing.getArea();
    var dis_fea_polygon=new gEcnu.Feature.Polygon([linerRing],{'LANDTYPE':otherVarible.LANDTYPE,'ID':otherVarible.addFeatureID,'SHPAREA':landArea,'YEARNUM':'2014'});
    otherVarible.tmpAddFeature=dis_fea_polygon;
    land_Featurelayer.addFeature(dis_fea_polygon);*/
    var centerPoint = linerRing.getCenterPoint();

    var ta = gEcnu.Util.worldToScreen(centerPoint.x, centerPoint.y);
    //showCenterInfo(ta);

    addPolygon_centerPoint = centerPoint;
    otherVarible.addFeatureID++;
    var landArea = linerRing.getArea();
    var o = {};
    o.ID = otherVarible.addFeatureID;
    o.SHPAREA = otherVarible.landArea;
    o.CODING = curcoding;
    o.BDID = curbdid;
    var dis_fea_polygon = new gEcnu.Feature.Polygon([linerRing], o);
    otherVarible.tmpAddFeature = dis_fea_polygon;
    land_Featurelayer.addFeature(dis_fea_polygon);
    var townqryservice = new gEcnu.WebFeatureServices.QueryByGeometry({ 'processCompleted': Completed_town, 'processFailed': Failed_town });
    townqryservice.processAscyn(centerPoint, gEcnu.layerType.GeoDB, config.dbName, 199, 1000, false, 'NAME,COUNTY');
    //然后根据这个中心点与zhenjiedaomian做一个请求得到区县、乡镇信息
    /*var townqryservice=new gEcnu.WebFeatureServices.QueryByGeometry({'processCompleted':Completed_town,'processFailed':Failed_town});
    townqryservice.processAscyn(centerPoint,gEcnu.layerType.GeoDB,config.dbName,199,1000,false,'NAME,COUNTY');*/
}

/*
 *获取地块所在区县 乡镇返回成功
 */
function Completed_town(results) {
    if (results.length > 0) {
        var towninfo = results[0];
        if (ifCountyTask) {
            if (townname != "上海市") {
                var townname_ = towninfo.COUNTY;
            }
        } else {
            var townname_ = towninfo.NAME;
        }
        if (townname_ != townname && townname != "上海市") {
            //此时需要进行该地块的取消，因为不属于任务区域
            //首先需要对绘制的多边形进行自动删除操作,然后返回
            var aAllAddFeas = land_Featurelayer.getAllFeatures();
            var lastAddFea = aAllAddFeas[aAllAddFeas.length - 1];
            land_Featurelayer.removeFeature(lastAddFea);
            toolUtil.alertDiv('请进入‘' + townname_ + "’进行数据采集！");
            mapToolActive('pan');
            return;
        }
        var countyname = towninfo.COUNTY;
        var townname_me = towninfo.NAME;
        //此时进行编码请求
        otherVarible.tmpAddFeature.addFields({ 'COUNTY': countyname });
        var addgeocoding = new gEcnu.WebGeoCoding({ 'processCompleted': addCompleted_geocode, 'processFailed': addFailed_geocode });
        addgeocoding.geoCoding(otherVarible.tmpAddFeature);
    } else {
        //然后根据这个中心点与zhenjiedaomian做一个请求得到区县、乡镇信息
        var countyqryservice = new gEcnu.WebFeatureServices.QueryByGeometry({ 'processCompleted': Completed_county, 'processFailed': Failed_county });
        countyqryservice.processAscyn(addPolygon_centerPoint, gEcnu.layerType.GeoDB, config.dbName, 200, 1000, false, '区县名称');
    }
}

function Failed_town() { toolUtil.alertDiv('查询多边形所在区县、乡镇失败！'); }

function Completed_county(results) {
    if (results.length > 0) {
        var countyinfo = results[0];
        var townname = '无数据';
        var countyname = countyinfo['区县名称'];
        //此时进行编码请求
        otherVarible.tmpAddFeature.addFields({ 'COUNTY': countyname, 'TOWN': townname });
    } else {
        var townname = '无数据';
        var countyname = '上海市';
        //此时进行编码请求
        otherVarible.tmpAddFeature.addFields({ 'COUNTY': countyname, 'TOWN': townname });
    }
    var addgeocoding = new gEcnu.WebGeoCoding({ 'processCompleted': addCompleted_geocode, 'processFailed': addFailed_geocode });
    addgeocoding.geoCoding(otherVarible.tmpAddFeature);
}

function Failed_county() { toolUtil.alertDiv('查询多边形所在区县失败！'); }

function addCompleted_geocode(results) {

    //var num = createSecureNum();

    var landnum = results.code;
    otherVarible.tmpAddFeature.addFields({ 'LANDNUM': landnum, 'VILLAGE': '', 'CROP': '', 'YEARNUM': '2014' });
    otherVarible.addFeatures.push(otherVarible.tmpAddFeature);
    otherVarible.curWindowFeatures.push(otherVarible.tmpAddFeature);

    //存入到localstorage[gmPolygon]
    savePtArr('polygon', { 'feature': otherVarible.tmpAddFeature, 'ID': otherVarible.tmpAddFeature.fields.ID, 'mType': 'ADD' });
}

function addFailed_geocode() {
    toolUtil.alertDiv('编码失败！');
    var landnum = '-1';
    otherVarible.tmpAddFeature.addFields({ 'LANDNUM': landnum, 'VILLAGE': '', 'CROP': '' });
    otherVarible.addFeatures.push(otherVarible.tmpAddFeature);
    otherVarible.curWindowFeatures.push(otherVarible.tmpAddFeature);
    //$('#writeProperty').show();
    //存入到localstorage[gmPolygon]  
    savePtArr('polygon', { 'feature': otherVarible.tmpAddFeature, 'ID': otherVarible.tmpAddFeature.fields.ID, 'mType': 'ADD' });
}

/*function showCenterInfo(p){
  $('#writeProperty').css({left:parseInt(p.x)+'px',top:parseInt(p.y)+'px'}).show();
  $('.l-wp').find('input[name=bdbh]').val(curcoding);
}*/

/*function createSecureNum(){
  var time = new Date();
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
}*/

function savePtArr(type, featureObj) { //featureObj{'feature':,'ID':}
    var tmpfea = featureObj;
    switch (type) {
        case 'polygon':
            var tmpStr = localStorage['gmPolygon'];
            if (tmpStr) {
                var tmpArr = JSON.parse(tmpStr);
            } else {
                var tmpArr = [];
            }
            var tmplen = tmpArr.length;
            for (var i = (tmplen - 1); i >= 0; i--) {
                if (tmpfea.ID == tmpArr[i].ID) {
                    tmpArr.splice(i, 1);
                }
            }
            if (tmpfea.mType == "DELETE") {
                clientOrServArr('CLIENT', tmpfea.ID, true);
                if (tmpArr.length == 0) {
                    //删除该gmPolygon  item
                    localStorage.removeItem('gmPolygon');
                    return;
                }
                var jsonText = JSON.stringify(tmpArr, "\t");
                localStorage['gmPolygon'] = jsonText;
                return;
            }
            clientOrServArr('CLIENT', tmpfea.ID, false);
            var tmpfeature = tmpfea.feature;
            var tmplinerRings = tmpfeature.getGeometrys();
            var tmpfields = tmpfeature.fields;
            var newFields = {};
            for (var kk in tmpfields) {
                if (kk != "ID" && kk != "SHPAREA") {
                    newFields[kk] = tmpfields[kk];
                }
            }
            var newJsonObj = { 'linerRings': tmplinerRings, 'fields': newFields, 'ID': tmpfea.ID }
            tmpArr.push(newJsonObj);
            var jsonText = JSON.stringify(tmpArr, "\t");
            localStorage['gmPolygon'] = jsonText;
            break;
        case 'serpolygon':
            var tmpStr = localStorage['gmPolygon_SER'];
            if (tmpStr) {
                var tmpArr = JSON.parse(tmpStr);
            } else {
                var tmpArr = [];
            }
            var tmplen = tmpArr.length;
            for (var i = (tmplen - 1); i >= 0; i--) {
                if (tmpfea.FID == tmpArr[i].FID) {
                    tmpArr.splice(i, 1);
                }
            }
            clientOrServArr('SERVER', tmpfea.FID, false);
            var tmpfeature = tmpfea.feature;
            var tmplinerRings = tmpfeature.getGeometrys();
            var tmpfields = tmpfeature.fields;
            var newFields = {};
            for (var kk in tmpfields) {
                if (kk != "ID" && kk != "SHPAREA") {
                    newFields[kk] = tmpfields[kk];
                }
            }
            var newJsonObj = { 'linerRings': tmplinerRings, 'fields': newFields, 'FID': tmpfea.FID, 'mType': tmpfea.mType };
            tmpArr.push(newJsonObj);
            var jsonText = JSON.stringify(tmpArr, "\t");
            localStorage['gmPolygon_SER'] = jsonText;
            break;
    }

    submitData();
    // $('#writeProperty').hide();
}

var clientOrServ = [];

function clientOrServArr(_type, idNum, bDelete) {
    var clientOrServ_len = clientOrServ.length;
    for (var i = 0; i < clientOrServ_len; i++) {
        var tmpObj = clientOrServ[i]
        if (tmpObj.type == _type && tmpObj.id == idNum) {
            clientOrServ.splice(i, 1);
            break;
        }
    }
    if (bDelete) {
        return;
    }
    var _tmpObj = { type: _type, id: idNum };
    clientOrServ.push(_tmpObj);
}

function savePtArr_abort(type) { //featureObj{'feature':,'ID':}
    switch (type) {
        case 'polygon':
            var tmpStr = localStorage['gmPolygon'];
            if (tmpStr) {
                var tmpArr = JSON.parse(tmpStr);
            } else {
                var tmpArr = [];
            }
            var tmplen = tmpArr.length;
            if (tmplen == 0) {
                return false;
            } else {
                tmpArr.pop();
            }
            if (tmpArr.length == 0) {
                localStorage.removeItem('gmPolygon');
            }
            otherVarible.addFeatures.pop();
            var jsonText = JSON.stringify(tmpArr, "\t");
            localStorage['gmPolygon'] = jsonText;
            return true;
            break;
        case 'serpolygon':
            var tmpStr = localStorage['gmPolygon_SER'];
            if (tmpStr) {
                var tmpArr = JSON.parse(tmpStr);
            } else {
                var tmpArr = [];
            }
            var tmplen = tmpArr.length;
            if (tmplen == 0) {
                return false;
            } else {
                tmpArr.pop();
            }
            if (tmpArr.length == 0) {
                localStorage.removeItem('gmPolygon_SER');
            }
            otherVarible.serverFeaturesUpdate.pop();
            var jsonText = JSON.stringify(tmpArr, "\t");
            localStorage['gmPolygon_SER'] = jsonText;
            return true;
            break;
    }
}


/**********结束********结束********多边形绘制完成时的回调+其他相关函数********结束**结束****************************/




/********开始****开始*****开始*********标注属性信息按钮触发命令*******开始****开始***********开始****************/
function addMarker_copleted(e, geoPoint) {
    if (otherVarible.ifShpMark == "propmark") {
        var tmplandtype = otherVarible.LANDTYPE;
        var src = landVariable.en_Name2MarkURL[tmplandtype];
        var marker = new gEcnu.Marker('marker', {
            'x': geoPoint.x,
            'y': geoPoint.y,
            'description': '',
            'src': src,
            'offset': {
                x: -16,
                y: -32
            }
        }, { 'opacity': 1.0 });
        var checkjson = { 'x': geoPoint.x, 'y': geoPoint.y, 'landtype': tmplandtype, 'marker': marker };
        otherVarible.storeCheckLands.push(checkjson);
        marker.regEvent('Rclick', removeMarker);
        gmap.mLayer.addMarker(marker);
    } else if (otherVarible.ifShpMark == "shpmark") { //红色标注图形标注
        var marker = new gEcnu.Marker('marker', {
            'x': geoPoint.x,
            'y': geoPoint.y,
            'description': '',
            'src': 'img/editPoly/shp_err.png',
            'offset': {
                x: -12,
                y: -24
            }
        }, { 'opacity': 1.0 });
        marker.regEvent('Rclick', function() {
            gmap.mLayer.removeMarker(this);
            removerMarkFromDB([this]);
        });
        otherVarible.storeHelpMarkers.push(marker);
        //此时需要将次标注读入到数据库
        var addmarker = { 'x': parseInt(geoPoint.x, 10), 'y': parseInt(geoPoint.y, 10), 'error': 'marker_shp', 'town': townname };
        readToDB_errorinfo(addmarker);
        gmap.mLayer.addMarker(marker);
    }
}

function removeMarker() {
    gmap.mLayer.removeMarker(this);
    //此时还需要从storeCheckLands删除标注信息
    var len_storeCheckLands = otherVarible.storeCheckLands.length;
    for (var j = 0; j < len_storeCheckLands; j++) {
        var tmpstoreCheckLand = otherVarible.storeCheckLands[j];
        if ((tmpstoreCheckLand.x == this.x) && (tmpstoreCheckLand.y == this.y)) {
            otherVarible.storeCheckLands.splice(j, 1);
            break;
        }
    }
}
/*
 *将图形标注读到数据库中
 */
function readToDB_errorinfo(addmarker) {
    //在数据库中griddown中对应增加该网格编号
    var addfid = addmarker.x + "_" + addmarker.y;
    var shpmarkADDServices = new gEcnu.WebSQLServices.SQLServices({
        'processCompleted': qryCompleted_shpMark,
        'processFailed': qryFailed_shpMark
    });
    shpmarkADDServices.processAscyn(gEcnu.ActType.ADD, config.dbName, 'errorinfo', {
        'Fields': ['FID', 'X', 'Y', 'ERROR', 'TOWN'],
        'Data': [
            [addfid, addmarker.x, addmarker.y, addmarker.error, addmarker.town]
        ]
    });
}
/*
 *将图形标注读到数据库中
 *返回成功
 */
function qryCompleted_shpMark() {}
/*
 *将图形标注读到数据库中
 *返回失败
 */
function qryFailed_shpMark() {}
/*
 *将图形标注从数据库中删除
 */
function removerMarkFromDB(markers) {
    var len_markers = markers.length;
    var fidsql = "";
    var allhelpmarkers = otherVarible.storeHelpMarkers;
    var allhelpmarkers_len = allhelpmarkers.length;
    for (var i = 0; i < len_markers; i++) {
        var marker = markers[i];
        for (var jj = 0; jj < allhelpmarkers_len; jj++) {
            if (marker == allhelpmarkers[jj]) {
                allhelpmarkers.splice(jj, 1);
                break;
            }
        }
        var marker_x = marker.x;
        var marker_y = marker.y;
        var markerID = marker_x + "_" + marker_y;
        fidsql = fidsql + "'" + markerID + "'";
        if (i < (len_markers - 1)) {
            fidsql = fidsql + " or FID=";
        }
    }
    //在数据库中griddown中对应增加该网格编号
    var gridsexeServices = new gEcnu.WebSQLServices.SQLServices({ 'processCompleted': qryCompleted_delmarker, 'processFailed': qryFailed_delmarker });
    var exesql = "delete from errorinfo where FID=" + fidsql;
    gridsexeServices.processAscyn(gEcnu.ActType.SQLEXEC, config.dbName, exesql);
}
/*
 *将图形标注从数据库中删除
 *删除成功
 */
function qryCompleted_delmarker() {}
/*
 *将图形标注从数据库中删除
 *删除失败
 */
function qryFailed_delmarker() { toolUtil.alertDiv('删除失败！'); }

/**********结束********结束********标注属性信息按钮触发命令********结束**结束****************************/



/********开始****开始*****开始*********获取视窗范围内矢量要素*******开始****开始***********开始****************/
/*
 *跳转到指定乡镇
 */
function goToTaskTown() {
    var mytasks = JSON.parse(sessionStorage.getItem('mytasks'));
    if (mytasks.length == 1) {
        var myidno = sessionStorage.getItem('usrID');
        var myposition = toolUtil.getcookie(myidno);
        if (myposition == "") {
            sessionStorage.setItem('curX', mytasks[0].distX);
            sessionStorage.setItem('curY', mytasks[0].distY);

            var x = sessionStorage.getItem('curX');
            var y = sessionStorage.getItem('curY');

            x = -7713.196422;
            y = 48070.68522;

            gmap.zoomTo(parseInt(x, 10), parseInt(y, 10), { 'zl': 1 });
            hightLightTown(x, y);
        } else {
            var centerxy = myposition.split('_');
            var centerx = centerxy[0];
            var centery = centerxy[1];
            sessionStorage.setItem('curX', centerx);
            sessionStorage.setItem('curY', centery);

            gmap.zoomTo(parseInt(centerx, 10), parseInt(centery, 10), { 'zl': 1 });
            hightLightTown(centerx, centery);
        }
    } else if (mytasks.length > 1) {
        //首先查询该用户对应的cookie信息是否
        var myidno = sessionStorage.getItem('usrID');
        var myposition = toolUtil.getcookie(myidno);
        if (myposition == "") {
            sessionStorage.setItem('curX', mytasks[0].distX);
            sessionStorage.setItem('curY', mytasks[0].distY);
            var x = sessionStorage.getItem('curX');
            var y = sessionStorage.getItem('curY');



            gmap.zoomTo(parseInt(x, 10), parseInt(y, 10), { 'zl': 1 });
            hightLightTown(x, y);
        } else {
            var centerxy = myposition.split('_');
            var centerx = centerxy[0];
            var centery = centerxy[1];
            sessionStorage.setItem('curX', centerx);
            sessionStorage.setItem('curY', centery);
            gmap.zoomTo(parseInt(centerx, 10), parseInt(centery, 10), { 'zl': 1 });
            hightLightTown(centerx, centery);
        }
    }
    //getVectorLandData();

}
//高亮显示乡镇边界
function hightLightTown(centerx, centery) {
    var geopoint = new gEcnu.Geometry.Point(centerx, centery);
    var ptquery = new gEcnu.WebFeatureServices.QueryByGeometry({
        'processCompleted': function(resultFea) {
            for (var i = 0, len = resultFea.length; i < len; i++) {
                resultFea[i].highLight(hightLightLayer, { isTwinkle: true, twinkleCount: 3, twinkleInterval: 1000 }, { isFill: false });
            }
        },
        'processFailed': function() {}
    });
    //var task_CountyOrTown="zhenjiedaomian";
    var task_CountyOrTown = 199;
    if (ifCountyTask && townname != "上海市") {
        //var task_CountyOrTown="quxianmian";
        var task_CountyOrTown = 200;
    }
    if (townname != "上海市") {
        ptquery.processAscyn(geopoint, gEcnu.layerType.GeoDB, config.dbName, task_CountyOrTown, '100', true, '');
    }
}
/*
 *获取当前视窗范围内的矢量数据信息
 */
//var webFeatureServices_land;
function getVectorLandData() {
    //加载矢量数据
    var mapbounds = gmap.getBounds();
    var nwPoint = new gEcnu.Geometry.Point(mapbounds.nw.x, mapbounds.nw.y);
    var nePoint = new gEcnu.Geometry.Point(mapbounds.ne.x, mapbounds.ne.y);
    var swPoint = new gEcnu.Geometry.Point(mapbounds.sw.x, mapbounds.sw.y);
    var sePoint = new gEcnu.Geometry.Point(mapbounds.se.x, mapbounds.se.y);
    var boundsPoints = [nwPoint, nePoint, sePoint, swPoint];
    var rect_geometry = new gEcnu.Geometry.RectRing(boundsPoints);
    var webFeatureServices_land = new gEcnu.WebFeatureServices.QueryByGeometry({
        'processCompleted': function(result) {
            getBdFids(function(json) {
                qryCompleted_serland(result, json);
            });
        },
        'processFailed': qryFailed_serland
    });
    webFeatureServices_land.processAscyn(rect_geometry, gEcnu.layerType.GeoDB, config.dbName, 198, 1000, true, 'XMIN,YMIN,XMAX,YMAX,SHPLEN,SHPAREA,COUNTY,TOWN,SHPAREA,LANDNUM,VILLAGE,CROP,LANDTYPE,LANDTYPE_CN,YEARNUM');
}
/*
 *获取当前视窗范围内的矢量数据信息
 *返回成功
 */
function qryCompleted_serland(resultFeatures, fidObj) {
    var zl = gmap.getZoom().zl;
    if (land_Featurelayer) {
        land_Featurelayer.removeAllFeatures();
        insure_Featurelayer.removeAllFeatures();
    }

    if (zl != 1) {
        /*取消绘制，直接返回*/
        return;
    }
    otherVarible.curWindowInsureFeas = [];
    var tmpserverFeas = otherVarible.serverFeaturesUpdate;
    var len_tmpserverFeas = tmpserverFeas.length;
    var tmpResFeas = [];
    var len_resultFeatures = resultFeatures.length;
    for (var kk = 0; kk < len_resultFeatures; kk++) {
        var tmpfea_ope = resultFeatures[kk];
        var ifaddTo = true;
        for (var mm = 0; mm < len_tmpserverFeas; mm++) {
            var tmpmmfea_ope = tmpserverFeas[mm];
            if (tmpfea_ope.fields.FID == tmpmmfea_ope.feature.fields.FID) {
                if (tmpmmfea_ope.mType == "UPDATE") { //更新的要素
                    tmpfea_ope = tmpmmfea_ope.feature;
                } else if (tmpmmfea_ope.mType == "DELETE") { //删除的要素
                    ifaddTo = false;
                }
                break;
            }
        }
        if (ifaddTo) {
            if (ifCountyTask) {
                //说明是区县或者全市
                if (townname == "上海市") {
                    //说明是全市
                    tmpResFeas.push(tmpfea_ope);
                } else {
                    //说明是区县
                    if (tmpfea_ope.fields.COUNTY == townname) {
                        tmpResFeas.push(tmpfea_ope);
                    }
                }
            } else { //说明是乡镇
                if (tmpfea_ope.fields.TOWN == townname) {
                    tmpResFeas.push(tmpfea_ope);
                }
            }
        }
    }
    var len_feas = tmpResFeas.length;
    var tmpchecked = landVariable.en_Name2checked;

    for (var ii = 0; ii < len_feas; ii++) {
        var tmpfea_land = tmpResFeas[ii];
        var tmpfea_land_type = tmpfea_land.fields.LANDTYPE;
        if (tmpchecked[tmpfea_land_type]) {
            land_Featurelayer.addFeature(tmpfea_land);
            var fields = tmpfea_land.fields;
            if (typeof fidObj[fields.FID] == 'object') {
                otherVarible.curWindowInsureFeas.push(tmpfea_land);
                tmpfea_land.addFields({ 'BDID': fidObj[fields.FID].BDID, 'CODING': fidObj[fields.FID].CODING});
                if (toolUtil.isInArr(fields.BDID, curWinBdArr) && !toolUtil.isInArr(fields.FID, exceptFIDArr)) {
                    insure_Featurelayer.addFeature(tmpfea_land);
                }
            }
        }
    }
    var alladdfeas = otherVarible.addFeatures;
    var len_feas_add = alladdfeas.length;
    for (var jj = 0; jj < len_feas_add; jj++) {
        var tmpfea_land_ = alladdfeas[jj];
        var tmpfea_land_type_ = tmpfea_land_.fields.LANDTYPE;
        if (tmpchecked[tmpfea_land_type_]) {
            land_Featurelayer.addFeature(tmpfea_land_);
            var fields = tmpfea_land_.fields;
            if (typeof fidObj[fields.FID] == 'object') {
                otherVarible.curWindowInsureFeas.push(tmpfea_land_);
                tmpfea_land_.addFields({ 'BDID': fidObj[fields.FID].BDID, 'CODING': fidObj[fields.FID].CODING});
                if (toolUtil.isInArr(fields.BDID, curWinBdArr) && !toolUtil.isInArr(fields.FID, exceptFIDArr)) {
                    insure_Featurelayer.addFeature(tmpfea_land_);
                }
            }
        }
    }
    otherVarible.curWindowFeatures = tmpResFeas;
    otherVarible.curWindowFeatures = otherVarible.curWindowFeatures.concat(otherVarible.addFeatures);
}

function getBdFids(succ) {
    var sql = { 'lyr': 'landRel', 'fields': 'FID,BDID,CODING', 'filter': '1=1' };
    toolUtil.recordQuery(config.dbName, sql, function(msg) {
        var obj = {};
        var i = msg.length;
        while (i--) {
            obj[msg[i].FID] = { 'BDID': msg[i].BDID, 'CODING': msg[i].CODING };
        }
        succ(obj);
    });
}

function qryFailed_serland() { toolUtil.alertDiv('获取视窗范围内矢量要素失败！'); }

/**********结束********结束********获取视窗范围内矢量要素********结束**结束****************************/


/********开始****开始*****开始*********地图范围发生变化时触发*******开始****开始***********开始****************/
//var curPosiqryservice;
var getVectorTimeOut;

function boundsChanged() {
    //获取zoomlevel
    if (hightLightLayer) {
        hightLightLayer.removeAllFeatures();
    }
    var zl = gmap.getZoom().zl;
    otherVarible.curWindowFeatures = []; //清空一下视窗范围内数组
    if (zl == 1) {
        var pre_zl = gmap.getPreZl();
        if (pre_zl == 2 || pre_zl == 0) {
            var alllands = landVariable.en_Name2checked;
            var dynlyrs = "";
            for (var kk in alllands) {
                dynlyrs = dynlyrs + kk + ",";
            }
            dLayer.removeLyr(dynlyrs);
        }
        if (getVectorTimeOut) {
            clearTimeout(getVectorTimeOut);
        }
        getVectorTimeOut = setTimeout(getVectorLandData, 250);
    } else {
        var pre_zl = gmap.getPreZl();
        land_Featurelayer.removeAllFeatures();
        insure_Featurelayer.removeAllFeatures();
        if (pre_zl == 1) {
            var alllands = landVariable.en_Name2checked;
            var dynlyrs = "";
            for (var kk in alllands) {
                if (alllands[kk]) {
                    dynlyrs = dynlyrs + kk + ",";
                }
            }
            dLayer.addLyr(dynlyrs);
        }
    }
    //获取用户当前所在位置，在标题栏中显示
    var mapcenter_ = gmap.getCenter();
    var centerPoint_ = new gEcnu.Geometry.Point(mapcenter_.x, mapcenter_.y);
    //然后根据这个中心点与zhenjiedaomian做一个请求得到区县、乡镇信息
    var curPosiqryservice = new gEcnu.WebFeatureServices.QueryByGeometry({ 'processCompleted': Completed_town_curposi, 'processFailed': Failed_town_posi });
    curPosiqryservice.processAscyn(centerPoint_, gEcnu.layerType.GeoDB, config.dbName, 199, 1000, false, 'NAME,COUNTY');

}

function Completed_town_curposi(results) {
    var towninfo = results[0];
    if (towninfo && (typeof towninfo.NAME) != "undefined") {
        var townname = towninfo.NAME;
        var countyname = towninfo.COUNTY;
        parent.document.getElementById('curPositionDiv').innerHTML = "当前位置：" + countyname + "-" + townname;
    }
}

function Failed_town_posi() { toolUtil.alertDiv('查询当前位置区县、乡镇失败！'); }


/**********结束********结束********地图范围发生变化时触发********结束**结束****************************/



/********开始****开始*****开始*********选择、编辑多边形*******开始****开始***********开始****************/
function editData(elementID) {
    switch (elementID) {
        case 'select_poly':
            var zl = gmap.getZoom().zl;
            if (zl != 1) {
                toolUtil.alertDiv('请在影像最高级别下进行编辑、修改！');
                return;
            }
            editpolygon.activate(true);
            otherVarible.ifPropChange = 'reshape';
            gmap.setCursorStyle('select', 'img/cursorimg/edit.png');
            break;
        case 'addnode':
            editpolygon.addPoint();
            gmap.setCursorStyle('addpoint', 'img/cursorimg/addpoint.png');
            break;
        case 'delnode':
            editpolygon.delPoint();
            gmap.setCursorStyle('delpoint', 'img/cursorimg/editdel.png');
            break;
        case 'delpolygon':
            editpolygon.deactivate();
            var tmpFeature = otherVarible.selectedFeature;
            if ((typeof tmpFeature) == "undefined") return;
            land_Featurelayer.removeFeature(tmpFeature);
            //然后执行后续操作
            delFeature(tmpFeature);
            break;
        case 'proppolygon':
            var zl = gmap.getZoom().zl;
            if (zl != 1) {
                toolUtil.alertDiv('请在最高级别下进行属性修改！');
                return;
            }
            editpolygon.deactivate();
            editpolygon.activate(false);
            otherVarible.ifPropChange = 'offshape';
            otherVarible.ifPropChange_Dis = "prochange";
            gmap.setCursorStyle('select', 'img/cursorimg/prop.png');
            break;
        case 'savepolygon':
            submitData();
            break;
        case 'revokepolygon':
            revokepolygon();
            break;

    }
}

function selectpolygon_copleted(e, selectedfeas) {
    if (selectedfeas.length > 0) {
        var selectedfea = selectedfeas[0];
        otherVarible.selectedFeature = selectedfea;
        if ((typeof otherVarible.selectedFeature.fields.ID) == "undefined") {
            otherVarible.serverOrCurrent = "SERVER";
        } else {
            otherVarible.serverOrCurrent = "CURRENT";
        }
        if (otherVarible.ifPropChange == 'offshape') { //说明进行的是属性信息修改
            searchkind = 1;
            var cp = selectedfea._lineRings[0].getCenterPoint();
            var point = new gEcnu.Geometry.Point(parseFloat(cp.x), parseFloat(cp.y));
            curval = point;
            var webFeature = aaicQuery.createWebFeature();
            var fid = selectedfea._data.FID;
            $('.l-item').removeClass('colorred-land');
            webFeature.QueryByGeometry(point, function(json) {
                if (json.length > 0) {
                    Security = new createSecurityList(json, fid);
                    getVectorLandData();
                }
            });
        } else if (otherVarible.ifPropChange == 'addLand') {

            if (!isInInsureFeas(selectedfea)) {
                var fields = selectedfea.fields;
                var params = {
                    'Fields': ['FID', 'BDID', 'CODING', 'XMIN', 'YMIN', 'XMAX', 'YMAX', 'SHPLEN', 'SHPAREA', 'LANDTYPE', 'LANDTYPE_CN'],
                    'Data': [
                        [fields.FID, curbdid, curcoding, fields.XMIN, fields.YMIN, fields.XMAX, fields.YMAX, fields.SHPLEN, fields.SHPAREA, fields.LANDTYPE, fields.LANDTYPE_C]
                    ]
                };

                selectedfea.addFields({'BDID': curbdid, 'CODING': curcoding});
                otherVarible.curWindowInsureFeas.push(selectedfea);
                insure_Featurelayer.addFeature(selectedfea);

                var land = {};
                params.Fields.forEach(function(fld, idx) {
                    land[fld] = params.Data[0][idx];
                });
                var area = parseFloat(land.SHPAREA) / 666.67;
                var cp = Security._calCenterPoint(land.XMIN, land.XMAX, land.YMIN, land.YMAX);
                land.centerPoint = '' + cp.x + ',' + cp.y;
                var index = 0;
                Security.items.forEach(function(item) {
                    if (item.policy.CODING == curcoding) {
                        var bdArr = item.bd;
                        bdArr.forEach(function(bd) {
                            if (bd.bdxq.ID == curbdid) {
                                index = bd.land.length;
                                bd.land.push(land);
                            }
                        });
                    }
                });
                Security.updateArea(area, curbdid, curcoding, 'PLUS');
                Security.addLandDom(curbdid, land, index);
                toolUtil.recordAdd(config.dbName, 'landRel', params);
            } else {
                toolUtil.newalertDiv('地块已被承保！');
            }
        }
    } else {

    }
}
var _tmpUpdate;


function isInInsureFeas(feat) {
    return otherVarible.curWindowInsureFeas.some(function(fea) {
        return (fea === feat);
    });
}

function updateCompleted_shp(e, updatefeature) {
    //重新对要素进行编码
    //otherVarible.selectedFeature=updatefeature;
    _tmpUpdate = updatefeature;
    var geocoding = new gEcnu.WebGeoCoding({ 'processCompleted': Completed_geocode, 'processFailed': Failed_geocode });
    geocoding.geoCoding(updatefeature);
}

function Completed_geocode(results) {
    var landnum = results.code;
    Completed_geocode_ex(landnum);
}

function Failed_geocode() {
    toolUtil.alertDiv('进行重新编码失败！');
    var landnum = "-1";
    Completed_geocode_ex(landnum);
}

function Completed_geocode_ex(landnum) {
    var selectedfea = otherVarible.selectedFeature;
    var updatefeature = _tmpUpdate;
    var updatefeature_area = updatefeature.getGeometrys()[0].getArea();
    updatefeature.addFields({ 'LANDNUM': landnum });
    updatefeature.addFields({ 'SHPAREA': updatefeature_area });
    if (otherVarible.serverOrCurrent == "SERVER") {
        addFeatureToSevrArr({ 'feature': updatefeature, 'mType': 'UPDATE' });
        otherVarible.curWindowFeatures = updateFeaturesInArr(selectedfea, updatefeature, otherVarible.curWindowFeatures);
        savePtArr('serpolygon', { 'feature': updatefeature, 'FID': updatefeature.fields.FID, 'mType': 'UPDATE' });
    } else if (otherVarible.serverOrCurrent == "CURRENT") {
        //首先需要删除addFeatures中的feature
        otherVarible.addFeatures = updateFeaturesInArr(selectedfea, updatefeature, otherVarible.addFeatures);
        //其次需要删除curWindowFeatures中的feature
        otherVarible.curWindowFeatures = updateFeaturesInArr(selectedfea, updatefeature, otherVarible.curWindowFeatures);
        savePtArr('polygon', { 'feature': updatefeature, 'ID': updatefeature.fields.ID, 'mType': 'UPDATE' });
    }
    otherVarible.selectedFeature = updatefeature;
}
/*
 *删除地块
 */
function revokepolygon() {
    var clientOrServ_len = clientOrServ.length;
    if (clientOrServ_len == 0) {
        toolUtil.alertDiv('不存在撤销数据！');
        return;
    }
    var lastEle = clientOrServ[clientOrServ_len - 1];
    if (lastEle.type == "SERVER") {
        savePtArr_abort('serpolygon');
    } else if (lastEle.type == "CLIENT") {
        savePtArr_abort('polygon');
    }
    clientOrServ.pop();
    //重新进行绘制
    getVectorLandData();
}
/*
 *删除地块
 */
function delFeature(selectedfea) {
    if (otherVarible.ifPropChange == 'offshape') {
        return;
    }
    if (otherVarible.serverOrCurrent == "SERVER") {
        addFeatureToSevrArr({ 'feature': otherVarible.selectedFeature, 'mType': 'DELETE' });
        otherVarible.curWindowFeatures = delFeaturesInArr(selectedfea, otherVarible.curWindowFeatures);
        savePtArr('serpolygon', { 'feature': selectedfea, 'FID': selectedfea.fields.FID, 'mType': 'DELETE' });
        otherVarible.selectedFeature = undefined;
        otherVarible.serverOrCurrent = "";
    } else if (otherVarible.serverOrCurrent == "CURRENT") {
        //首先需要删除addFeatures中的feature
        otherVarible.addFeatures = delFeaturesInArr(selectedfea, otherVarible.addFeatures);
        //其次需要删除curWindowFeatures中的feature
        otherVarible.curWindowFeatures = delFeaturesInArr(selectedfea, otherVarible.curWindowFeatures);
        //从localstorage中删除
        savePtArr('polygon', { 'feature': selectedfea, 'ID': selectedfea.fields.ID, 'mType': 'DELETE' });
        otherVarible.selectedFeature = undefined;
        otherVarible.serverOrCurrent = "";
    }
    //将命令切换至选择状态
    editData('select_poly');
}

function delFeaturesInArr(fea, feasArr) {
    var len_feasArr = feasArr.length;
    for (var i = (len_feasArr - 1); i >= 0; i--) {
        if (feasArr[i] == fea) {
            feasArr.splice(i, 1);
            break;
        }
    }
    return feasArr;
}

function updateFeaturesInArr(oldfea, newfea, feasArr) {
    var len_feasArr = feasArr.length;
    for (var i = (len_feasArr - 1); i >= 0; i--) {
        if (feasArr[i] == oldfea) {
            feasArr.splice(i, 1, newfea);
            break;
        }
    }
    return feasArr;
}

function addFeatureToSevrArr(serObj, serveArr) {
    var tmpfeatures = otherVarible.serverFeaturesUpdate;
    var len_feas = tmpfeatures.length;
    for (var i = 0; i < len_feas; i++) {
        var tmpfe = tmpfeatures[i];
        if (tmpfe.feature.fields.FID == serObj.feature.fields.FID) {
            otherVarible.serverFeaturesUpdate.splice(i, 1);
            break;
        }
    }
    otherVarible.serverFeaturesUpdate.push(serObj);
}
//属性信息修改
function propFix() {
    var tmpfea = otherVarible.selectedFeature;
    toolUtil.openThisDiv('propDiv_fix');
    toolUtil.$_element('#pro_county').value = tmpfea.fields.COUNTY;
    toolUtil.$_element('#pro_town').value = tmpfea.fields.TOWN;
    toolUtil.$_element('#pro_village').value = tmpfea.fields.VILLAGE;
    toolUtil.$_element('#pro_crop').value = tmpfea.fields.CROP;
}
//属性信息修改之后保存
function saveFeaProp() {
    var village_info = toolUtil.$_element('#pro_village').value;
    var crop_info = toolUtil.$_element('#pro_crop').value;
    var selectedfea = otherVarible.selectedFeature;
    var newFeaProp = new gEcnu.Feature.Polygon(selectedfea.getGeometrys(), selectedfea.fields);
    newFeaProp.addFields({ 'VILLAGE': village_info, 'CROP': crop_info });
    if (otherVarible.serverOrCurrent == "SERVER") {
        land_Featurelayer.updateFea(selectedfea, newFeaProp);
        addFeatureToSevrArr({ 'feature': newFeaProp, 'mType': 'UPDATE' });
        otherVarible.curWindowFeatures = updateFeaturesInArr(selectedfea, newFeaProp, otherVarible.curWindowFeatures);
        savePtArr('serpolygon', { 'feature': newFeaProp, 'FID': newFeaProp.fields.FID, 'mType': 'UPDATE' });
    } else if (otherVarible.serverOrCurrent == "CURRENT") {
        land_Featurelayer.updateFea(selectedfea, newFeaProp);
        //首先需要删除addFeatures中的feature
        otherVarible.addFeatures = updateFeaturesInArr(selectedfea, newFeaProp, otherVarible.addFeatures);
        //其次需要删除curWindowFeatures中的feature
        otherVarible.curWindowFeatures = updateFeaturesInArr(selectedfea, newFeaProp, otherVarible.curWindowFeatures);
        savePtArr('polygon', { 'feature': newFeaProp, 'ID': newFeaProp.fields.ID, 'mType': 'UPDATE' });
    }
    toolUtil.closeThisDiv('propDiv_fix');
    gmap.clearOverlay();
    otherVarible.selectedFeature = undefined;
    otherVarible.serverOrCurrent = ""; //标示选中的多边形是来自服务器还是当前绘制的多边形SERVER  CURRENT
}

function propDis() {
    var tmpfea = otherVarible.selectedFeature;
    toolUtil.openThisDiv('propDiv_fix_dis');
    toolUtil.$_element('#pro_county_dis').innerHTML = tmpfea.fields.COUNTY;
    toolUtil.$_element('#pro_town_dis').innerHTML = tmpfea.fields.TOWN;
    toolUtil.$_element('#pro_village_dis').innerHTML = tmpfea.fields.VILLAGE;
    toolUtil.$_element('#pro_landtype_dis').innerHTML = landVariable.en_Name2cn_Name[tmpfea.fields.LANDTYPE];
    toolUtil.$_element('#pro_area_dis').innerHTML = toolUtil.changeTwoDecimal(tmpfea.fields.SHPAREA * 0.0015) + "亩";
    toolUtil.$_element('#pro_crop_dis').innerHTML = tmpfea.fields.CROP;
    toolUtil.$_element('#pro_code_dis').innerHTML = tmpfea.fields.LANDNUM;
    toolUtil.$_element('#pro_year_dis').innerHTML = tmpfea.fields.YEARNUM;
}

function propDis_infoQry(feaparam) {
    var tmpfea = feaparam;
    toolUtil.openThisDiv('propDiv_fix_dis');
    toolUtil.$_element('#pro_county_dis').innerHTML = tmpfea.fields.COUNTY;
    toolUtil.$_element('#pro_town_dis').innerHTML = tmpfea.fields.TOWN;
    toolUtil.$_element('#pro_village_dis').innerHTML = tmpfea.fields.VILLAGE;
    toolUtil.$_element('#pro_landtype_dis').innerHTML = landVariable.en_Name2cn_Name[tmpfea.fields.LANDTYPE];
    toolUtil.$_element('#pro_area_dis').innerHTML = toolUtil.changeTwoDecimal(tmpfea.fields.SHPAREA * 0.0015) + "亩";
    toolUtil.$_element('#pro_crop_dis').innerHTML = tmpfea.fields.CROP;
    toolUtil.$_element('#pro_code_dis').innerHTML = tmpfea.fields.LANDNUM;
    toolUtil.$_element('#pro_year_dis').innerHTML = tmpfea.fields.YEARNUM;
}
/**********结束********结束********选择、编辑多边形********结束**结束****************************/




/********开始****开始*****开始*********右侧工具栏的下侧工具绑定命令*******开始****开始***********开始****************/
function mapToolActive(toolname) {
    otherVarible.selectedFeature = undefined;
    switch (toolname) {
        case 'pan':
            gmap.setMode('map');
            gmap.setMapTool('pan');
            editpolygon.deactivate();
            gmap.setCursorStyle('pan', 'img/cursorimg/openhand.bmp');
            break;
        case 'dis':
            gmap.setMode('map');
            gmap.setMapTool('rulerLength');
            gmap.setCursorStyle('dis', 'img/cursorimg/rulerLength.png');
            break;
        case 'area':
            gmap.setMode('map');
            gmap.setMapTool('rulerArea');
            gmap.setCursorStyle('area', 'img/cursorimg/rulerArea.png');
            break;
        case 'grid':
            toolUtil.openThisDiv('posDiv');
            break;
        case 'repos':
            var x = sessionStorage.getItem('curX');
            var y = sessionStorage.getItem('curY');
            gmap.zoomTo(parseInt(x, 10), parseInt(y, 10));
            break;
        case 'qry':
            editpolygon.deactivate();
            editpolygon.activate(false);
            otherVarible.ifPropChange = 'offshape';
            otherVarible.ifPropChange_Dis = "prodis";
            gmap.setCursorStyle('select', 'img/cursorimg/INFOqry.png');
            break;
        case 'create':
            //editpolygon.deactivate();

            break;

        case 'qry_property':
            //editpolygon.deactivate();
            $('#qry_mulity').toggle();

            break;

            /*        case 'changeimage':
                      if($('#imgyearlist').css('display')=='none'){
                        $('#imgyearlist').css('display','block');
                      }else{
                        $('#imgyearlist').css('display','none');
                      }
                    break;*/
    }
}
/*
 *保存数据
 */
var ifInSubmitProgress = false;

function submitData() {
    if (ifInSubmitProgress) {
        //说明进入数据保存状态，应该返回
        return;
    }
    ifInSubmitProgress = true;
    //首先需要对属性标注进行判断
    var markers = otherVarible.storeCheckLands;
    var marker_len = markers.length;
    //{'x':geoPoint.x,'y':geoPoint.y,'landtype':tmplandtype,'marker':marker}
    var gmpolygons = getgmPolygons();
    var addFeatures_len = gmpolygons.length;
    var gmSerPolygons = getgmSerPolygons();
    var updatefeas = gmSerPolygons[0];
    var delfeas = gmSerPolygons[1];
    var updateFeatures_len = updatefeas.length;
    var allfeasInwindow = otherVarible.curWindowFeatures;
    var allfeasInwindow_len = allfeasInwindow.length;
    for (var i = 0; i < marker_len; i++) {
        var tmpMarkerObj = markers[i];
        var markerpoint = new gEcnu.Geometry.Point(tmpMarkerObj.x, tmpMarkerObj.y);
        var ifAddfea = false;
        var ifother = false;
        for (var jj = 0; jj < addFeatures_len; jj++) { //首先判断是否落在addfeatures中
            var tmpadd_fea = gmpolygons[jj];
            var ifPointInFeature = tmpadd_fea.pointInFeature(markerpoint);
            if (ifPointInFeature) {
                tmpadd_fea.addFields({ 'LANDTYPE': tmpMarkerObj.landtype });
                ifAddfea = true;
                ifother = true;
                break;
            }
        }
        if (!ifAddfea) {
            for (var mm = 0; mm < updateFeatures_len; mm++) {
                var tmpup_fea = updatefeas[mm];
                var ifPointInFeature = tmpup_fea.Feature.pointInFeature(markerpoint);
                if (ifPointInFeature) {
                    tmpup_fea.Feature.addFields({ 'LANDTYPE': tmpMarkerObj.landtype });
                    ifother = true;
                    break;
                }
            }
        }
        if (!ifother) {
            for (var nn = 0; nn < allfeasInwindow_len; nn++) {
                var tmpall_fea = allfeasInwindow[nn];
                var ifPointInFeature = tmpall_fea.pointInFeature(markerpoint);
                if (ifPointInFeature) {
                    tmpall_fea.addFields({ 'LANDTYPE': tmpMarkerObj.landtype });
                    var updateFea_ = { 'FID': tmpall_fea.fields.FID, 'Feature': tmpall_fea, 'UPDATE': 'FIELDS' };
                    updatefeas = addUpdateFeaToArr(updateFea_, updatefeas);
                    break;
                }
            }
        }
    }
    //然后执行构造批量修改参数+提交服务器
    saveDataToser(gmpolygons, updatefeas, delfeas);
}

function saveDataToser(addfeas, updatefeas, delfeas) {
    var sqltaskparams = [];
    var addsqltask = new gEcnu.WebFeatureServices.SQLTasks(gEcnu.ActType.ADD, gEcnu.layerType.GeoDB, 'landtype', addfeas);
    var addParams = addsqltask.taskParams;
    if (addfeas.length > 0) {
        sqltaskparams.push(addParams);
    }

    var updatesqltask = new gEcnu.WebFeatureServices.SQLTasks(gEcnu.ActType.UPDATE, gEcnu.layerType.GeoDB, 'landtype', updatefeas);
    var updateParams = updatesqltask.taskParams;
    if (updatefeas.length > 0) {
        sqltaskparams.push(updateParams);
    }

    var len_delfeas = delfeas.length;
    var delsql = "";
    for (var nn = 0; nn < len_delfeas; nn++) {
        delsql = delsql + "FID=" + delfeas[nn];
        if (nn < (len_delfeas - 1)) {
            delsql = delsql + " or ";
        }
    }
    var delsqltask = new gEcnu.WebFeatureServices.SQLTasks(gEcnu.ActType.DELETE, gEcnu.layerType.GeoDB, 'landtype', delsql);
    var delParams = delsqltask.taskParams;
    if (delsql != "") {
        sqltaskparams.push(delParams);
    }
    //执行请求服务器进行更新
    var sqltaskFeaServices = new gEcnu.WebFeatureServices.FeatureServices({ 'processCompleted': updateCompleted, 'processFailed': updateFailed });
    sqltaskFeaServices.processAscyn(gEcnu.ActType.SQLTask, gEcnu.layerType.GeoDB, config.dbName, sqltaskparams);
}

function updateCompleted() {
    var allshpmarkers = otherVarible.storeCheckLands;
    var mar_len = allshpmarkers.length;
    for (var i = 0; i < mar_len; i++) {
        gmap.mLayer.removeMarker(allshpmarkers[i].marker);
    }
    $('#msgSave').fadeIn(1000);
    $('#msgSave').fadeOut(1000);

    otherVarible.LANDTYPE = 'unclear';
    otherVarible.tmpAddFeature = null; //此处的作用为刚绘制完多边形回调使用（后续添加fields_county  town  landnum）
    otherVarible.serverFeaturesUpdate = []; //{'feature':,'mType':}
    otherVarible.addFeatures = []; //用于保存刚绘制的但是未保存到服务器的多边形要素{'LANDNUM':,'VILLAGE':'','CROP':'','LANDTYPE':,'ID'}
    otherVarible.storeCheckLands = []; //用于保存标注的标注点，每一个是json对象{'x':geoPoint.x,'y':geoPoint.y,'landtype':tmplandtype,'marker':marker}
    otherVarible.curWindowFeatures = []; //用于保存视窗范围内所有features{'LANDNUM':,'VILLAGE':'','CROP':'','LANDTYPE':,'ID'},{'LANDNUM':,'VILLAGE':'','CROP':'','LANDTYPE':,'FID'}
    otherVarible.selectedFeature = undefined;
    otherVarible.serverOrCurrent = ""; //标示选中的多边形是来自服务器还是当前绘制的多边形SERVER  CURRENT
    clientOrServ = []; //清空记录顺序

    ifInSubmitProgress = false; //将进入数据保存任务状态取消掉

    gmap.setMode('map');
    gmap.setMapTool('pan');
    editpolygon.deactivate();
    gmap.setCursorStyle('pan', 'img/cursorimg/openhand.bmp');
    localStorage.removeItem('gmPolygon');
    localStorage.removeItem('gmPolygon_SER');
    getVectorLandData();

    hightLightLayer.removeAllFeatures();
    $('#writeProperty').hide();
    refreshList();
}

function refreshList() {
    if (searchkind === 0) {
        connect.fuzzyQuery(curval, function(json) {
            Security = new createSecurityList(json);
        });
    } else {
        var webFeature = aaicQuery.createWebFeature();
        webFeature.QueryByGeometry(curval, function(json) {
            Security = new createSecurityList(json);
        });
    }
}

function updateFailed() { toolUtil.alertDiv('提交数据至服务器失败！'); }

function getgmPolygons() {
    //{'linerRings':tmplinerRings,'fields':newFields,'ID':tmpfea.ID}
    var tmpStr = localStorage['gmPolygon'];
    var returnFeas = [];
    if (tmpStr) {
        tmpArr = JSON.parse(tmpStr);
    } else {
        return returnFeas;
    }
    var len_feas = tmpArr.length;
    for (var i = 0; i < len_feas; i++) {
        var tmpfea = tmpArr[i];
        var fea_poly = new gEcnu.Feature.Polygon(tmpfea.linerRings, tmpfea.fields);
        returnFeas.push(fea_poly);
    }
    return returnFeas;
}

function getgmSerPolygons() {
    //{'linerRings':tmplinerRings,'fields':newFields,'FID':tmpfea.FID,'mType':tmpfea.mType}
    var tmpStr = localStorage['gmPolygon_SER'];
    var returnFeas = [
        [],
        []
    ]; //第一个是update要素，第二个是delete要素
    if (tmpStr) {
        var tmpArr = JSON.parse(tmpStr);
    } else {
        return returnFeas;
    }
    var len_feas = tmpArr.length;
    for (var i = 0; i < len_feas; i++) {
        var tmpfea = tmpArr[i];
        if (tmpfea.mType == "UPDATE") {
            var fea_poly = new gEcnu.Feature.Polygon(tmpfea.linerRings, tmpfea.fields);
            var updateFea = { 'FID': tmpfea.FID, 'Feature': fea_poly, 'UPDATE': 'ALL' };
            returnFeas[0].push(updateFea);
        } else if (tmpfea.mType == "DELETE") {
            returnFeas[1].push(tmpfea.FID);
        }
    }
    return returnFeas;
}

function addUpdateFeaToArr(upfea, fesarr) { //{'FID':tmpall_fea.FID,'Feature':tmpall_fea,'UPDATE':'FIELDS'}
    var len_fesarr = fesarr.length;
    for (var i = 0; i < len_fesarr; i++) {
        var tmpfea = fesarr[i];
        if (tmpfea.FID == upfea.FID) {
            fesarr.splice(i, 1);
            break;
        }
    }
    fesarr.push(upfea);
    return fesarr;
}

/**********结束********结束********右侧工具栏的下侧工具绑定命令********结束**结束****************************/



/********开始****开始*****开始*********网格定位*******开始****开始***********开始****************/
//根据网格编号进行定位
function grid_qry() {
    var curGrid = document.getElementById('pos_qrytext').value;
    var result = DeCodeShGrid(curGrid);
    if (!(result.flag)) {
        toolUtil.alertDiv('查询失败！');
        return;
    }
    var x = result.x;
    var y = result.y;
    gmap.zoomTo(x, y, { zl: 1 });
}
//根据乡镇进行定位
function grid_qry_town() {
    var curGrid = document.getElementById('pos_qrytown').value;
    if (curGrid == "") {
        toolUtil.alertDiv('查询失败！');
        return;
    }
    var qrysqlser = new gEcnu.WebFeatureServices.QueryBySQL({ 'processCompleted': success_qrysql, 'processFailed': failed_qrysql });
    var qrysql = "NAME='" + curGrid + "'";
    qrysqlser.processAscyn(qrysql, gEcnu.layerType.GeoDB, config.dbName, 199, false, 'FID');
}

function success_qrysql(res) {
    var res_len = res.length;
    if (res_len == 0) {
        toolUtil.alertDiv('结果为空！');
        return;
    }
    var firTown = res[0];
    var x = firTown.cx;
    var y = firTown.cy;
    gmap.zoomTo(x, y, { zl: 3 });
}

function failed_qrysql() {
    toolUtil.alertDiv('查询失败！');
}

function DeCodeShGrid(grdNum) {
    var xid, yid, flag, dash, len, ix, iy, x, y;
    var result = { 'flag': false, 'x': 0, 'y': 0 };
    len = grdNum.length;
    xid = grdNum.substr(len - 3, 3);
    yid = grdNum.substr(len - 7, 3);
    flag = grdNum.substr(0, 1);
    dash = grdNum.substr(len - 4, 1);

    ix = parseInt(xid, 10);
    iy = parseInt(yid, 10);
    if (ix == -1 || iy == -1) {
        return result;
    }
    if (ix == 0 || iy == 0) {
        return result;
    }
    if (dash != '_' && dash != '-') {
        return result;
    }
    var lowerFlag = flag.toLowerCase();
    if (lowerFlag != "i" && lowerFlag != "j" && lowerFlag != "k" && lowerFlag != "l") {
        return result;
    }
    x = ix * 250 - 125;
    y = iy * 200 - 100;
    if (lowerFlag == "k" || lowerFlag == "l") {
        x = -x;
    }
    if (lowerFlag == "j" || lowerFlag == "k") {
        y = -y;
    }
    result.flag = true;
    result.x = x;
    result.y = y;
    return result;
}

/**********结束********结束********网格定位********结束**结束****************************/


/*
 *
 */
function changeImgage(imgName) {
    tileLayer_2012.hide();
    tileLayer_2013.hide();
    tileLayer_2014.hide();
    switch (imgName) {
        case 'img2012':
            imgNameID = 'img2012';
            tileLayer_2012.show();
            break;
        case 'img2013':
            imgNameID = 'img2013';
            tileLayer_2013.show();
            break;
        case 'img2014':
            imgNameID = 'img2014';
            tileLayer_2014.show();
            break;
    }
}

var num_mee = 1;
var offsetNum_mee = 0;

function updateAreaDatas(num, offsetNum) {
    var qrysql = new gEcnu.WebFeatureServices.QueryBySQL({ 'processCompleted': sql_suc_me, 'processFailed': sql_fail_me });
    var qrysql_me = "1=1 limit " + num + " offset " + offsetNum;
    if (offsetNum_mee % 100 == 0) {
        console.log("更新完成：" + offsetNum_mee);
    }
    qrysql.processAscyn(qrysql_me, gEcnu.layerType.GeoDB, config.dbName, 198, true, 'county,town');
}

function sql_suc_me(res) {
    var reslen = res.length;
    if (reslen == 0) {
        //说明更新结束
        console.log('全部结束');
        return;
    }
    //获取每一个地块的county,town属性
    curFea_aaa = res[0];
    opeFea(curFea_aaa);
}
var curFea_aaa;

function opeFea(curFea_aaa_) {
    var aaa_linerRing = curFea_aaa_.getGeometrys()[0];
    var aaa_centerPoint = aaa_linerRing.getCenterPoint();
    //然后根据这个中心点与zhenjiedaomian做一个请求得到区县、乡镇信息
    var townqryservice_aaa = new gEcnu.WebFeatureServices.QueryByGeometry({ 'processCompleted': aaa_Completed_town, 'processFailed': aaa_Failed_town });
    townqryservice_aaa.processAscyn(aaa_centerPoint, gEcnu.layerType.GeoDB, config.dbName, 199, 1000, false, 'NAME,COUNTY');
}

function sql_fail_me(res) {

}

function aaa_Completed_town(results) {
    if (results.length > 0) {
        var towninfo = results[0];
        var townname = towninfo.NAME;
        var countyname = towninfo.COUNTY;
        //此时进行编码请求
        curFea_aaa.addFields({ 'COUNTY': countyname, 'TOWN': townname });
        var nowFEA = { 'Feature': curFea_aaa, 'UPDATE': 'FIELDS', 'FID': curFea_aaa.fields.FID };
        submit_aaaaa([nowFEA]);
    }
}

function aaa_Failed_town() {

}

function submit_aaaaa(tmpfeas) {
    var feaser_me = new gEcnu.WebFeatureServices.FeatureServices({ 'processCompleted': fea_suc_me, 'processFailed': fea_fail_me });
    feaser_me.processAscyn(gEcnu.ActType.UPDATE, gEcnu.layerType.GeoDB, config.dbName, 198, tmpfeas);
}

function fea_suc_me(res) {
    offsetNum_mee = offsetNum_mee + num_mee;
    updateAreaDatas(num_mee, offsetNum_mee);
}

function fea_fail_me() {
    console.log('失败');
}

//村定位
function InitVillages() {
    var sessionjson = JSON.parse(sessionStorage['mytasks']);
    var townid = sessionjson[0]['distId'];
    var prename = sessionjson[0]['preDistName'];
    var distname = sessionjson[0]['distName'];
    if (sessionjson) {
        document.getElementById('villageSel').style.display = 'display';
    } else {
        document.getElementById('villageSel').style.display = 'none';
    }
    var sqlservice, qrysql;
    if (prename === '上海市') {
        if (distname == '上海市') {
            sqlservice = new gEcnu.WebSQLServices.SQLServices({
                'processCompleted': function(tmp, fields) {
                    //createselect(tmp,"--区县定位--");
                    qrytowninfo(tmp);
                },
                'processFailed': function() {
                    alert('读取乡镇信息失败！');
                    return false;
                }
            });
            qrysql = { 'fields': "Name,X,Y", "lyr": 'countyinfo', 'filter': 'PreDist=' + "'" + distname + "'" + " and ID<>'310' and class=1" };
            sqlservice.processAscyn(gEcnu.ActType.SQLQUERY, config.sysdbName, qrysql);
        } else {
            sqlservice = new gEcnu.WebSQLServices.SQLServices({
                'processCompleted': function(tmp, fields) {
                    createselect(tmp, "--乡镇定位--");
                },
                'processFailed': function() {
                    alert('读取乡镇信息失败！');
                    return false;
                }
            });
            qrysql = { 'fields': "Name,X,Y", "lyr": 'towninfo', 'filter': 'CountyID=' + "'" + townid + "'" + " and class=1" };
            sqlservice.processAscyn(gEcnu.ActType.SQLQUERY, config.sysdbName, qrysql);
        }
    } else {
        sqlservice = new gEcnu.WebSQLServices.SQLServices({
            'processCompleted': function(tmp, fields) {
                createselect(tmp, "--村庄定位--");
            },
            'processFailed': function() {
                alert('读取村信息失败！');
                return false;
            }
        });
        qrysql = { 'fields': "Name,X,Y", "lyr": 'villageinfo', 'filter': 'town_id=' + "'" + townid + "'" };
        sqlservice.processAscyn(gEcnu.ActType.SQLQUERY, config.sysdbName, qrysql);
    }

}

function qrytowninfo(temp) {
    var sqlservice = new gEcnu.WebSQLServices.SQLServices({
        'processCompleted': function(tmp, fields) {
            createselect(temp, "--区县定位--");
            formc_t(temp, tmp);
            createselect4bd(temp);
        },
        'processFailed': function() {
            alert('读取乡镇信息失败！');
            return false;
        }
    });
    qrysql = { 'fields': "county,town,X,Y", "lyr": 'county_town', 'filter': 'class=2' };
    sqlservice.processAscyn(gEcnu.ActType.SQLQUERY, config.sysdbName, qrysql);
}
var county_town = [];

function formc_t(c, t) {
    for (var i = 0; i < c.length; i++) {
        var county = c[i]['Name'];
        var tmps = {};
        tmps[county] = [];
        for (var j = 0, len = t.length; j < len; j++) {
            if (county === t[j]['county']) {
                tmps[c[i]['Name']].push([{ town: t[j]['town'] }, { x: t[j]['X'] }, { y: t[j]['Y'] }]);
            }
        }
        county_town.push(tmps);
    }
}

function createselect(tmp, txt) {
    var sessionjson = JSON.parse(sessionStorage['mytasks']);
    var distx = sessionjson[0]['distX'];
    var disty = sessionjson[0]['distY'];
    document.getElementById('selectedVill').innerHTML = txt;
    var sel = document.getElementById('villageSel');
    var li = document.createElement('li');
    li.innerHTML = txt;
    li.setAttribute('centerx', distx);
    li.setAttribute('centery', disty);
    li.title = txt;
    sel.appendChild(li);
    console.log(tmp)
    for (var i = 0, len = tmp.length; i < len; i++) {
        var litemp = li.cloneNode(false);
        litemp.innerHTML = tmp[i]['Name'];
        litemp.setAttribute('centerx', tmp[i]['X']);
        litemp.setAttribute('centery', tmp[i]['Y']);
        litemp.title = tmp[i]['Name'];
        sel.appendChild(litemp);
    }
}

function createselect4bd(tmp) {
    var extAreas = ['徐汇区', '长宁区', '静安区', '普陀区', '闸北区', '虹口区', '杨浦区'];
    var sel = document.getElementById('bd-county-sel');
    var bdsel = document.getElementById('bd-detail-county-sel');
    var opt = document.createElement('option');
    var first = true;
    for (var i = 0, len = tmp.length; i < len; i++) {
        if (toolUtil.getIndexInarr(tmp[i]['Name'], extAreas) >= 0) continue;
        var optemp = opt.cloneNode(false);
        var name = tmp[i]['Name'];
        optemp.innerHTML = name;
        optemp.value = name;
        if (first) {
            fillTowns4bd(name, 'bd-town-sel', true);
        }
        optemp.setAttribute('centerx', tmp[i]['X']);
        optemp.setAttribute('centery', tmp[i]['Y']);
        sel.appendChild(optemp);
        first = false;
    }
    bdsel.innerHTML = sel.innerHTML;
}

//显示位置信息
function showmapinfo() {
    gmap.events.on('mousemove', function(e, pos) {
        pos.geoX = parseInt(pos.geoX);
        pos.geoY = parseInt(pos.geoY);
        // console.log('移动',pos);
        $('#xpos').text(pos.geoX);
        $('#ypos').text(pos.geoY);
        var gridnum = encodegrid(pos.geoX, pos.geoY);
        $('#gridpos').text(gridnum);
    });
}

function encodegrid(wx, wy) {
    var gridnum, xid, yid, ix, iy, fk;
    if (wx < 0 && wy < 0) {
        fk = 'K';
    } else if (wx < 0 && wy > 0) {
        fk = 'L';
    } else if (wx > 0 && wy > 0) {
        fk = 'I';
    } else if (wx > 0 && wy < 0) {
        fk = 'J';
    }
    if (wx < 0) {
        wx = -wx;
    }
    if (wy < 0) {
        wy = -wy;
    }
    ix = Math.ceil(wx / 250);
    iy = Math.ceil(wy / 200);
    if (ix.toString().length == 2) {
        xid = '0' + ix.toString();
    } else if (ix.toString().length == 1) {
        xid = '00' + ix.toString();
    } else {
        xid = ix.toString();
    }
    if (iy.toString().length == 2) {
        yid = '0' + iy.toString();
    } else if (iy.toString().length == 1) {
        yid = '00' + iy.toString();
    } else {
        yid = iy.toString();
    }
    gridnum = fk + yid + '_' + xid;
    return gridnum
}
