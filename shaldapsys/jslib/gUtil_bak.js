/**
 * 创建div
 * @param id
 * @param w
 * @param h
 * @param pos
 * @returns {HTMLElement}
 */
gEcnu.Util = {};
gEcnu.Util.createDiv = function (id, w, h, pos) {
	var div = document.createElement('div');
	div.id = id;
	div.style.width = w + 'px';
	div.style.height = h + 'px';
	if (pos) {
		div.style.position = "absolute";
	}
	div.style.zIndex = 1;
	return div;
};
gEcnu.Util.createTextArea = function (id, w, h, pos) {
	var div = document.createElement('textarea');
	div.id = id;
	div.style.width = w + 'px';
	div.style.height = h + 'px';
	if (pos) {
		div.style.position = "absolute";
	}
	div.style.zIndex = 1;
	return div;
};

/**
 * 创建canvas
 * @param id
 * @param w
 * @param h
 * @param pos
 * @returns {HTMLElement}
 */
gEcnu.Util.createCanvas = function (id, w, h, pos) {
	var canvas = document.createElement('canvas');
	if(gEcnu.Util.getIEVersion()!=0){
        canvas=window.G_vmlCanvasManager.initElement(canvas);
    }
	canvas.id = id;
	canvas.width = w;
	canvas.height = h;
	canvas.style.width = w + 'px';
	canvas.style.height = h + 'px';
	if (pos) {
		canvas.style.position = "absolute";
	}
	return canvas;
};

/**
 * 判断元素是否在数组中
 * @returns {boolean}
 */
gEcnu.Util.isInArray = function (arr, val) {
	for (var i in arr) {
		if (arr[i] == val) {
			return true;
		}
	}
	return false;
};
/**
 * 判断对象是否在数组中
 * @param arr 数组
 * @param obj 对象
 * @returns {boolean}
 */
gEcnu.Util.isObjInArray = function (arr, obj) {
	for (var i in arr) {
		/*if (arr[i].id == obj.id && arr[i] == obj) {*/
		if (arr[i].id == obj.id){
			alert('已被添加，请更换图层id');
			return true;
		}
	}
	return false;
};
/**
 * 将上海坐标系的要素对象转换成经纬度坐标
 * @param map 地图对象
 * @param wx 地理坐标x
 * @param wy 地理坐标y
 * @returns {{x: number, y: number}}
 */
gEcnu.Util.transformProj2Geo=function (features){
	var feaLen=features.length;
	var transPoints=[];
	for(var i=0;i<feaLen;i++){
		var curfea=features[i];
		var points=curfea.shape.Points;
		var shpbox=curfea.shape.shpBox;
		var tmprings=curfea._lineRings;
		//var lineRings=curfea._lineRings[0].points;
		curfea.shape.Points=gEcnu.Util.trans2Geo(points);
		curfea.shape.shpBox=gEcnu.Util.transShpbox2Geo(shpbox);
		for(var j=0,len=tmprings.length;j<len;j++){
			var tmpPoints=tmprings[j].points;
			curfea._lineRings[j].points=gEcnu.Util.trans2Geo(tmpPoints);
		}
		// curfea._lineRings[0].points=gEcnu.Util.trans2Geo(lineRings);
	}
	return features;
};
gEcnu.Util.trans2Geo=function(points){
	var len=points.length;
	var ptArr=[];
	for(var i=0;i<len;i++){
		var pt=points[i];
		var latlng=gEcnu.Util.shToLngLat(pt.x,pt.y);
		var obj={x:latlng.lng,y:latlng.lat};
		ptArr.push(obj);
	}
	return ptArr;
};
gEcnu.Util.transShpbox2Geo=function(shpbox){
	var xmin=shpbox[0];
	var ymin=shpbox[1];
	var xmax=shpbox[2];
	var ymax=shpbox[3];
	var latlng1=gEcnu.Util.shToLngLat(xmin,ymin);
	var latlng2=gEcnu.Util.shToLngLat(xmax,ymax);
	var lat_min=latlng1.lat;
	var lat_max=latlng2.lat;
	var lng_min=latlng1.lng;
	var lng_max=latlng2.lng;
	var shpBox=[lng_min,lat_min,lng_max,lat_max];  //console.log('shpBox',shpBox);
	return shpBox;
};
//将经纬度转换成上海坐标
gEcnu.Util.transformGeo2Proj=function (features){
	var feaLen=features.length;
	var transPoints=[];
	for(var i=0;i<feaLen;i++){
		var curfea=features[i];
		var points=curfea.shape.Points;
		var shpbox=curfea.shape.shpBox;
		var tmprings=curfea._lineRings;
		//var lineRings=curfea._lineRings[0].points;
		curfea.shape.Points=gEcnu.Util.trans2Proj(points);
		curfea.shape.shpBox=gEcnu.Util.transShpbox2Proj(shpbox);
		for(var j=0,len=tmprings.length;j<len;j++){
			var tmpPoints=tmprings[j].points;
			curfea._lineRings[j].points=gEcnu.Util.trans2Proj(tmpPoints);
		}
		// curfea._lineRings[0].points=gEcnu.Util.trans2Geo(lineRings);
	}
	return features;

};
gEcnu.Util.trans2Proj=function(points){
	var len=points.length;
	var ptArr=[];
	for(var i=0;i<len;i++){
		var pt=points[i];
		var shxy=gEcnu.Util.lnglatToSh(pt.x,pt.y);
		var obj={x:shxy.x,y:shxy.y};
		ptArr.push(obj);
	}
	return ptArr;
};
gEcnu.Util.transShpbox2Proj=function(shpbox){
	var xmin=shpbox[0];
	var ymin=shpbox[1];
	var xmax=shpbox[2];
	var ymax=shpbox[3];
	var shxy1=gEcnu.Util.lnglatToSh(xmin,ymin);
	var shxy2=gEcnu.Util.lnglatToSh(xmax,ymax);
	var xmin=shxy1.x;
	var xmax=shxy2.x;
	var ymin=shxy1.y;
	var ymax=shxy2.y;
	var shpBox=[xmin,ymin,xmax,ymax];  //console.log('shpBox',shpBox);
	return shpBox;
};
/**
 * 地理坐标转屏幕坐标
 * @param map 地图对象
 * @param wx 地理坐标x
 * @param wy 地理坐标y
 * @returns {{x: number, y: number}}
 */
gEcnu.Util.worldToScreen = function (wx, wy) {  
	var cxy = gSelf.getCenter();  
	var wcx = cxy.x;
	var wcy = cxy.y;
	var scx = parseInt(gSelf.w) / 2;
	var scy = parseInt(gSelf.h) / 2;
	var scale = gSelf.zoom / parseInt(gSelf.w);
	var sx = parseFloat(scx) + parseFloat((wx - wcx) / scale) + 0.5;
	var sy = parseFloat(scy) - parseFloat((wy - wcy) / scale) + 0.5;  
	// var sx = scx + (wx - wcx) / scale + 0.5;
	// var sy = scy - (wy - wcy) / scale + 0.5;  
	return {
		x: sx,
		y: sy
	};
};
/**
 * 屏幕坐标转地理坐标
 * @param map 地图对象
 * @param sx 屏幕坐标x
 * @param sy 屏幕坐标y
 * @returns {{x: number, y: number}}
 */
gEcnu.Util.screenToWorld = function (sx, sy) {
	var cxy = gSelf.getCenter();
	var wcx = cxy.x;
	var wcy = cxy.y;
	var scx = parseInt(gSelf.w) / 2;
	var scy = parseInt(gSelf.h) / 2;
	//要加载过动态图层或切片图层，才能直接获取正确的zoom值，若只有第三方地图图层，则需在前端换算坐标...
	var scale = gSelf.zoom / parseInt(gSelf.w);
	var wx = parseFloat(wcx) + parseFloat((sx - scx) * scale);
	var wy = parseFloat(wcy)- parseFloat((sy - scy) * scale);
	return {
		x: wx,
		y: wy
	};
};
gEcnu.Util.worldToScreen_geo = function (wx, wy) {
	var cxy = gSelf.getCenter();
	var wcx = cxy.x;
	var wcy = cxy.y;
	var scx = parseInt(gSelf.w) / 2;
	var scy = parseInt(gSelf.h) / 2;
	var scale = gSelf.zoom / parseInt(gSelf.w);

	if(gSelf.coordsFlag == "GEOGRAPHIC"){
     var lon = cxy.x;
	 var lat = cxy.y;
	 wcx=lon*111000*Math.cos(lat);  
	 wcy=lat*111000; 
      var actualZoom=gSelf.zoom*111.31955*1000;
      scale = actualZoom / parseInt(gSelf.w);
    }
	var sx = scx + (wx - wcx) / scale + 0.5;
	var sy = scy - (wy - wcy) / scale + 0.5;
	return {
		x: sx,
		y: sy
	};
};
gEcnu.Util.screenToWorld_geo = function (sx, sy) {
	var cxy = gSelf.getCenter();
	var wcx = cxy.x;
	var wcy = cxy.y;
	var scx = parseInt(gSelf.w) / 2;
	var scy = parseInt(gSelf.h) / 2;
	//要加载过动态图层或切片图层，才能直接获取正确的zoom值，若只有第三方地图图层，则需在前端换算坐标...
	var scale = gSelf.zoom / parseInt(gSelf.w);

	 if(gSelf.coordsFlag == "GEOGRAPHIC"){ 
	 var lon = cxy.x;
	 var lat = cxy.y;   //console.log("经纬度",lon,lat);
	 wcx=lon*111000*Math.cos(lat);  //假设此纬线的纬度为α 经度1°对应的实际弧长大约为111cosαkm
	 wcy=lat*111000;  //全球各地纬度1°的间隔长度都相等（因为所有经线的长度都相等），大约是111km/1°
	 var actualZoom=gSelf.zoom*111.31955*1000;
     scale = actualZoom / parseInt(gSelf.w);
	 }
	var wx = wcx + (sx - scx) * scale;
	var wy = wcy - (sy - scy) * scale;
	return {
		x: wx,
		y: wy
	};
};
/**
 * 获取鼠标位置坐标
 * @param e 鼠标事件
 * @returns {{x: number, y: number}}
 */
gEcnu.Util.getMouseXY = function (ele,e) {
	var x = 0,
		y = 0;
	/*x = e.layerX;
     y = e.layerY;*/
	var obj = e.srcElement ? e.srcElement : e.target;
	if (!document.attachEvent) {
		//获取事件源
		while (obj && obj != ele) {
			var btw = gEcnu.Util.getEleStyle(obj, 'border-top-width') == 'medium' ? 0 : gEcnu.Util.delpx(gEcnu.Util.getEleStyle(obj, 'border-top-width'));
			var blw = gEcnu.Util.getEleStyle(obj, 'border-left-width') == 'medium' ? 0 : gEcnu.Util.delpx(gEcnu.Util.getEleStyle(obj, 'border-left-width'));
			x += obj.offsetLeft + blw;
			y += obj.offsetTop + btw;
			obj = obj.offsetParent;
		}
		/*x = e.clientX - x + document.body.scrollLeft;
		y = e.clientY - y + document.body.scrollTop;*/
		x = e.offsetX + x + document.body.scrollLeft;
		y = e.offsetY + y + document.body.scrollTop;
		//x = e.clientX + x + document.body.scrollLeft;
		//y = e.clientY + y + document.body.scrollTop;
		
	} else {	
		var btw = gEcnu.Util.getEleStyle(obj, 'border-top-width') == 'medium' ? 0 : gEcnu.Util.delpx(gEcnu.Util.getEleStyle(obj, 'border-top-width'));
		var blw = gEcnu.Util.getEleStyle(obj, 'border-left-width') == 'medium' ? 0 : gEcnu.Util.delpx(gEcnu.Util.getEleStyle(obj, 'border-left-width'));
		x = e.layerX - blw;
		y = e.layerY - btw;
	}
	return {
		x: x,
		y: y
	};
};

/**
 * 获取触点坐标
 * @param evt
 * @returns {{x: (number|*), y: (number|*)}}
 */
gEcnu.Util.getTouchXY = function (evt) {
	for (var i = 0; i < evt.targetTouches.length; i++) {
		var touch = evt.targetTouches[i];
		ox = touch.pageX;
		oy = touch.pageY;
	}
	x = ox - gSelf.mapLeft;
	y = oy - gSelf.mapTop;
	return {
		x: x,
		y: y
	};
};

/**
 * 获取触点屏幕坐标
 * @param event
 * @returns {{x: number, y: number}}
 */
gEcnu.Util.getTouchPos = function (event) {
	var touchxy = {
		'x': 0,
		'y': 0
	};
	//console.log(event);
	try {
		touchxy.x = event.touches[0].screenX;
		touchxy.y = event.touches[0].screenY;
	} catch (e) {
		console.log(e.toString());
	}
	return touchxy;
};
/**
 * 获取最小外接矩形
 * @param event
 * @returns {{x: number, y: number}}
 */
gEcnu.Util.getShpBox = function (points) {  
   var len=points.length;
   if(len>=1){
   	 var shpbox=[]; 
     var xmin= points[0].x;
     var ymin= points[0].y;
     var xmax= points[0].x;
     var ymax= points[0].y;
     if(len>=2){
     	for(var j=1;j<len;j++){
           var tmppoint=points[j];
           if(xmin>=tmppoint.x){
               xmin=tmppoint.x;
           }
           if(xmax<=tmppoint.x){
               xmax=tmppoint.x;
           }
           if(ymin>=tmppoint.y){
               ymin=tmppoint.y;
           }
           if(ymax<=tmppoint.y){
               ymax=tmppoint.y;
           }
     	}
     }
     shpbox=[xmin,ymin,xmax,ymax];
     return shpbox;
   }else{
   	  alert('获取最小外接矩形失败！');return;
   }
};
gEcnu.Util.getType=function(o){
    var _t;
    return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
};
gEcnu.Util.extend=function(destination,source){
    for(var p in source)
    {
        if(gEcnu.Util.getType(source[p])=="array"||gEcnu.Util.getType(source[p])=="object")
        {
            destination[p]=gEcnu.Util.getType(source[p])=="array"?[]:{};
            arguments.callee(destination[p],source[p]);
        }
        else
        {
            destination[p]=source[p];
        }
    }
};
/**
 *获取触点
 * @param touch
 * @returns {{x: number, y: number}}
 */
gEcnu.Util.getTouchPt = function (touch) {
	var x = touch.pageX - gSelf.mapLeft;
	var y = touch.pageY - gSelf.mapTop;
	return {
		x: x,
		y: y
	};
};

/**
 * 获取鼠标屏幕坐标
 * @returns {{x: Number, y: Number}}
 */
gEcnu.Util.getMousePos = function (event) {
	var e = event || window.event;
	return {
		'x': e.screenX,
		'y': e.screenY
	};
}

/**
 * 获取两点间距
 * @param p1
 * @param p2
 * @returns {Number}
 */
gEcnu.Util.p1top2Dis = function (p1, p2) {
	var dx = parseInt(p1.x - p2.x);
	var dy = parseInt(p1.y - p2.y);
	var dis = parseInt(Math.sqrt(dx * dx + dy * dy));
	return dis;
}

/**
 * 获取元素样式计算值
 * @param obj
 * @param attribute
 * @returns {*}
 */
gEcnu.Util.getEleStyle = function (obj, attribute) {
	// 返回最终样式函数，兼容IE和DOM，设置参数：元素对象、样式特性
	var arr = attribute.split('-');
	var attr = arr[0];
	if (attr.length > 1) {
		for (var i = 1; i < arr.length; i++) {
			attr += arr[i].substring(0, 1).toUpperCase() + arr[i].substring(1);
			//除第一个单词外，其余单词首字母转为大写，并拼接起来
		}
	} else {
		attr = attribute;
	}
	return obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr];
}
/**
 * 配置信息
 * @param obj
 * @param options
 * @returns {{}}
 */
gEcnu.Util.setOptions = function (obj, options) {
	var tmpObj = gEcnu.Util.cloneObj(obj.options);
	for (var k in options) {
		if (options[k] != null || options[k] != undefined || options[k] != '') {
			tmpObj[k] = options[k];
		}
	}
	return tmpObj;
};


/**
 * 上海市坐标转经纬度
 * @param x
 * @param y
 * @returns {{lat: number, lng: number}}
 */
gEcnu.Util.shToLngLat = function (x, y) {
	var A = 95418.0172735741;
	var B = 48.3052839794785;
	var C = -11592069.1853624;
	var D = 63.9932503167748;
	var E = 110821.847990882;
	var F = -3469087.15690168;
	var lat = (D * x - A * y - (C * D - A * F)) / (B * D - A * E);
	var lng = (E * x - B * y - (C * E - B * F)) / (A * E - B * D);
	return {
		lat: lat,
		lng: lng
	};
}
/**
 * 经纬度转上海坐标
 * @param lat
 * @param lng
 * @returns {{x: number, y: number}}
 */
gEcnu.Util.lnglatToSh = function (lng,lat) {
  var A = 95418.0172735741;
  var B = 48.3052839794785;
  var C = -11592069.1853624;
  var D = 63.9932503167748;
  var E = 110821.847990882;
  var F = -3469087.15690168;
  var x = A * lng + B * lat + C-50+470;
  var y = D * lng + E * lat + F-50-235;
  return {x:x,y:y};
}

/**
 * 去除px字样
 * @param value
 * @returns {*}
 */
gEcnu.Util.delpx = function (value) {
	if (value == "")
		return 0;
	return parseInt(value.substring(0, value.length - 2));
};
/**
 * Ajax请求
 * @param method
 * @param url
 * @param data
 * @param async
 * @param callback
 *otherParams主要为了给callback函数
 */
gEcnu.Util.ajax = function (method, url, data, async, callback,timoutFunc,timeout,otherParams) {
	var timer_out;//设置超时id
	var parames_len=arguments.length;
	if(arguments.length==7||arguments.length==8){
		//创建计时器
		timer_out=setTimeout(function(){
			if (xdr){  
                xdr.abort(); 
            }else if(xhr){
            	alert(typeof xhr);
            	alert(xhr);
            	xhr.abort(); 
            }
			timoutFunc();
		},timeout);  
	}
	var xhr = null;
	var xdr = null;
	if (data instanceof Object) {  
		var str = "";
		for (k in data) { 
			str += k + "=" + encodeURIComponent(data[k]) + "&";
			//str += k + "=" + escape(data[k]) + "&";
		}
		data = str;   
	}
	if (window.XDomainRequest) {
		xdr = new XDomainRequest();
		if (xdr) {
			xdr.onerror = showerr;
			xdr.onload = function () {
				if (timer_out){  
                   clearTimeout(timer_out);  
                }
                if(arguments.length==8){
                    callback(xdr.responseText,otherParams);
                }else{
                	callback(xdr.responseText);
                }
				
			};
			if ("get" == method.toLowerCase()) {
				if (data == null || data == "") {
					xdr.open("get", url);
				} else {
					xdr.open("get", url + "?" + data);
				}
				xdr.send();
			} else if ("post" == method.toLowerCase()) {
				xdr.open("post", url);
				xdr.setRequestHeader("content-Type", "application/x-www-form-urlencoded");
				xdr.send(data);
			}
		}
	} else {
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xhr.onreadystatechange = function (e) {
			if (4 == xhr.readyState) {
				if (200 == xhr.status) {
					if (callback) {
						if (timer_out){
                           clearTimeout(timer_out);  
                        }
                        if(parames_len==8){
                            callback(xhr.responseText,otherParams);
                        }else{
                        	callback(xhr.responseText);
                        }
					}
				} else if (404 == xhr.status) {
					if (hander404) {
						hander404();
					}
				} else if (500 == xhr.status) {
					if (hander500) {
						hander500();
					}
				}
			}
		}

		if ("get" == method.toLowerCase()) {
			if (data == null || data == "") {
				xhr.open("get", url, async);
			} else {
				xhr.open("get", url + "?" + data, async);
			}
			xhr.send(null);
		} else if ("post" == method.toLowerCase()) {
			xhr.open("post", url, async);
			xhr.setRequestHeader("content-Type", "application/x-www-form-urlencoded");
			xhr.send(data);
		}
	}
	function handler404() {
		alert("ReqUrl：not found");
	}

	function handler500() {
		alert("服务器错误，请稍后再试");
	}

	function showerr(e){

	}
}
/*gEcnu.Util.ajax = function (method, url, data, async, callback,timoutFunc,timeout) {
	var timer_out;//设置超时id
	if(arguments.length==7){
		//创建计时器
		timer_out=setTimeout(function(){
			if (xdr){  
                xdr.abort(); 
            }else if(xhr){
            	xhr.abort(); 
            }
			timoutFunc();
		},timeout);  
	}
	var xhr = null;
	var xdr = null;

	if (data instanceof Object) {
		var str = "";
		for (k in data) {
			str += k + "=" + escape(data[k]) + "&";
		}
		data = str;
	}
	if (window.XDomainRequest) {
		xdr = new XDomainRequest();
		if (xdr) {

			xdr.onprogress = function(e){
				//alert("Loading...");
			};
			xdr.onerror = function(e){
				alert(JSON.stringify(e));
			};
			xdr.onload = function () {
				if (timer_out){  
                   clearTimeout(timer_out);  
                }
				callback(xdr.responseText);
			};

			if ("get" == method.toLowerCase()) {
				if (data == null || data == "") {
					xdr.open("get", url);
				} else {
					xdr.open("get", url + "?" + data);
				}
				xdr.send(null);
			} else if ("post" == method.toLowerCase()) {
				xdr.open("post", url);
				xdr.setRequestHeader("content-Type", "application/x-www-form-urlencoded");
				xdr.send(data);
			}
		}
	} else {
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xhr.onreadystatechange = function (e) {
			//console.log(xhr);
			if (4 == xhr.readyState) {
				if (200 == xhr.status) {
					if (callback) {
						if (timer_out){
                           clearTimeout(timer_out);  
                        }
						callback(xhr.responseText);
					}
				} else if (404 == xhr.status) {
					if (hander404) {
						hander404();
					}
				} else if (500 == xhr.status) {
					if (hander500) {
						hander500();
					}
				}
			} else {
				if (loading) {
					loading();
				}
			}
		}

		if ("get" == method.toLowerCase()) {
			if (data == null || data == "") {
				xhr.open("get", url, async);
			} else {
				xhr.open("get", url + "?" + data, async);
			}
			xhr.send(null);
		} else if ("post" == method.toLowerCase()) {
			xhr.open("post", url, async);
			xhr.setRequestHeader("content-Type", "application/x-www-form-urlencoded");
			//xhr.setRequestHeader("Charset","UTF-8");
			xhr.send(data);
		}
	}
	function handler404() {
		alert("ReqUrl：not found");
	}

	function handler500() {
		alert("服务器错误，请稍后再试");
	}

	function showerr(e){

	}
}*/

/**
 * 对象复制(含数组\JSON数据）
 * @param obj
 * @returns {{}}
 */
gEcnu.Util.cloneObj = function (obj) {
	var newobj, s;
	if (typeof obj !== 'object') {
		return;
	}
	newobj = obj.constructor === Object ? {} : [];
	if (window.JSON) {
		s = JSON.stringify(obj), //序列化对象
		newobj = JSON.parse(s);
		//反序列化（还原）
	} else {
		if (newobj.constructor === Array) {
			newobj.concat(obj);
		} else {
			for (var i in obj) {
				newobj[i] = obj[i];
			}
		}
	}
	return newobj;
};



gEcnu.Util.drawLine = function (ctx, x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.closePath();
	ctx.stroke();
};
gEcnu.Util.getPolylineLength = function (polyPtArr) {
	var len = polyPtArr.length;
	var totalDis = 0;
	for (var j = 0; j < (len - 1); j++) {
		var mdis = Math.sqrt((polyPtArr[j].x - polyPtArr[j + 1].x) * (polyPtArr[j].x - polyPtArr[j + 1].x) + (polyPtArr[j].y - polyPtArr[j + 1].y) * (polyPtArr[j].y - polyPtArr[j + 1].y));
		totalDis = totalDis + mdis;
	}
	return totalDis;
};

/**
 * 面积计算
 * @param PtArr
 * @returns {Number}
 */
gEcnu.Util.calcAreaMap = function (PtArr) {
	var ta = 0;
	var ax = PtArr;
	for (var i = 0; i < ax.length; i++) {
		ta = ta + (ax[i].x * ax[(i + 1) % ax.length].y - ax[(i + 1) % ax.length].x * ax[i].y);
	}
	var meter2 = parseInt(Math.abs(0.5 * ta));
	return meter2;
};

/**
 * 周长计算
 * @param ctx
 * @param ptArr
 */
gEcnu.Util.drawCalPolyline = function (ctx, ptArr) {
	gEcnu.Util.setStyle(ctx);
	var len = ptArr.length;
	ctx.beginPath();
	var sxy = gEcnu.Util.worldToScreen(ptArr[0].x, ptArr[0].y);
	if(gSelf.coordsFlag=="GEOGRAPHIC"){
		sxy =gEcnu.Util.worldToScreen_geo(ptArr[0].x, ptArr[0].y);
	}
	ctx.moveTo(sxy.x, sxy.y);
	for (var i = 1; i < ptArr.length; i++) {
		sxy = gEcnu.Util.worldToScreen(ptArr[i].x, ptArr[i].y);
		if(gSelf.coordsFlag=="GEOGRAPHIC"){
		   sxy =gEcnu.Util.worldToScreen_geo(ptArr[i].x, ptArr[i].y);
	    }
		ctx.lineTo(sxy.x, sxy.y);
	}
	ctx.stroke();
	//ctx.closePath();
};

/**
 * 样式设置
 * @param ctx
 * @returns {{fillColor: string, strokeColor: string, lineWeight: number, borderStatus: boolean, fillStatus: boolean, vtxStatus: boolean, vtxRadius: number, tlr: number}}
 */
gEcnu.Util.setStyle = function (ctx,style) {  
	var tmpOpt = {
		'fillColor': 'blue',
		'strokeColor': 'blue',
		'lineWeight': 2,
		'borderStatus': true,
		'fillStatus': true,
		'vtxStatus': false,
		'vtxRadius': 3,
		'tlr': 5,
		'opacity':1
	}
	if(arguments.length>1){tmpOpt=style;}
	ctx.fillStyle = tmpOpt.fillColor;  
	ctx.strokeStyle = tmpOpt.strokeColor;  
	ctx.lineWidth = tmpOpt.lineWeight;
	ctx.globalAlpha=tmpOpt.opacity;
	return tmpOpt;//无用
};

/**
 * 按一定时间间隔执行函数
 * @param func 欲执行函数
 * @param threshold 时间间隔
 * @param execAsap 在事件初始还是结束时执行
 * @returns {Function}
 */
gEcnu.Util.debounce = function (func, threshold, execAsap, fun) {
	//console.log("OK");
	var timeout;
	return function debounced() {
		var obj = this,
			args = arguments;

		function delayed() {
			if (!execAsap)
				func.apply(obj, args);
			timeout = null;
		};
		if (timeout)
			clearTimeout(timeout);
		else if (execAsap)
			func.apply(obj, args);
		timeout = setTimeout(delayed, threshold || 100);
		fun();
	};
};

gEcnu.Util.addEvtHandler = function (element, evt, func) {
	if (element.addEventListener) {
		element.addEventListener(evt, func, false);
	} else if (element.attachEvent) {
		element.attachEvent("on" + evt, func);
	} else {
		element['on' + evt] = func;
	}
	if (evt == 'mousewheel' && gEcnu.Util.getIEVersion() ==0) { //对于mousewheel事件单独处理
		element.addEventListener("DOMMouseScroll", func, false);
	}
};

gEcnu.Util.removeEvtHandler = function (element, evt, func) {
	if (element.removeEventListener) {
		element.removeEventListener(evt, func, false);
	} else if (element.detachEvent) {
		element.detachEvent("on" + evt, func);
	} else {
		element['on' + evt] = func;
	}
	if (evt == 'mousewheel') { //对于mousewheel事件单独处理
		element.removeEventListener("DOMMouseScroll", func, false);
	}
};

gEcnu.Util.preventDefault = function(event)
{
    if (event.preventDefault)
        {event.preventDefault();}
     else
      { window.event.returnValue=false;}
};

gEcnu.Util.stopPropagation = function(event)
{
    if (event.stopPropagation)
    {
        event.stopPropagation();
    }else
    {
        window.event.cancelBubble=true;
    }
};





/**
 * 自定义事件绑定
 * @param ele
 * @param customEvt
 * @param callback
 */
gEcnu.Util.bindCusEvt = function (ele, customEvt, callback) {
	var e = document.createEvent('Event'); //创建一个Event对象e
	e.initEvent(customEvt, false, false); //进行事件初始化，第二个参数表示事件是否可以起泡，第三个表示是否可用preventDefault阻止事件
	gSelf.cusEvtArr[customEvt] = e;
	ele.addEventListener(customEvt, callback, false); //绑定监听器
};

gEcnu.Util.triggerCusEvt = function (ele, custom) {
	ele.dispatchEvent(gSelf.cusEvtArr[custom]);
};
gEcnu.Util.ifctrl=function(e){ //函数:判断键盘Ctrl按键
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
};
gEcnu.Util.ifshift=function(e){ //函数:判断键盘Shift按键
    var nav4 = window.Event ? true : false; //初始化变量
    if(nav4) { //对于Netscape浏览器
      //判断是否按下shift按键
      if((typeof e.shiftKey != 'undefined') ? e.shiftKey : e.modifiers & Event.SHIFT_MASK > 0) { 
        return true;
      } else {
         return false;
      }
    } else {
      //对于IE浏览器，判断是否按下shift按键
      if(window.event.shiftKey) {
          return true;
      } else {
          return false;
      }
    }
    return false;
};
gEcnu.Util.getIEVersion = function(){
	var userAgent = window.navigator.userAgent.toLowerCase();
    //if(/msie 10\.0/i.test(userAgent)) return 10;
    //if(/msie 9\.0/i.test(userAgent)) return 9;
    if(/msie 8\.0/i.test(userAgent)) return 8;
    if(/msie 7\.0/i.test(userAgent)) return 7;
    if(/msie 6\.0/i.test(userAgent)) return 6;
    return 0;
};
if(!Array.indexOf) 
{ 
    Array.prototype.indexOf = function(obj) 
    {                
        for(var i=0; i<this.length; i++) 
        { 
            if(this[i]==obj) 
            { 
                return i; 
            } 
        } 
        return -1; 
    } 
};
gEcnu.Util.getButton=function (event){
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
}
/**
 * 改变执行环境：在指定对象上执行操作
 * @param  {[type]} obj  指定的对象
 * @param  {[type]} func 操作函数
 * @return {[type]}      [description]
 */
gEcnu.Util.bindFunction=function(obj,func){
	return function(){   //匿名函数改变执行环境 
		func.apply(obj,arguments);  console.log('util',arguments);
	};

};

//十六进制颜色值的正则表达式  
var gEcnu_reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; 
gEcnu.Util.colorRgb = function(strColor,opacity){  
    var sColor = strColor.toLowerCase();  
    if(sColor && gEcnu_reg.test(sColor)){  
        if(sColor.length === 4){  
            var sColorNew = "#";  
            for(var i=1; i<4; i+=1){  
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
            }  
            sColor = sColorNew;  
        }  
        //处理六位的颜色值  
        var sColorChange = [];  
        for(var i=1; i<7; i+=2){  
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
        }  
        return "RGBA(" + sColorChange.join(",") +","+opacity+")";  
    }else{  
        return sColor;    
    }  
};
 
/*RGB颜色转换为16进制*/  
gEcnu.Util.colorHex = function(strColor){  
    var that = strColor;  
    if(/^(rgb|RGB)/.test(that)){  
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");  
        var strHex = "#";  
        for(var i=0; i<aColor.length; i++){  
            var hex = Number(aColor[i]).toString(16);  
            if(hex === "0"){  
                hex += hex;   
            }  
            strHex += hex;  
        }  
        if(strHex.length !== 7){  
            strHex = that;    
        }  
        return strHex;  
    }else if(gEcnu_reg.test(that)){  
        var aNum = that.replace(/#/,"").split("");  
        if(aNum.length === 6){  
            return that;      
        }else if(aNum.length === 3){  
            var numHex = "#";  
            for(var i=0; i<aNum.length; i+=1){  
                numHex += (aNum[i]+aNum[i]);  
            }  
            return numHex;  
        }  
    }else{  
        return that;      
    }  
}; 
gEcnu.Util.resizeDivByContent=function(fontSize,content,w){
    var rowNum=parseInt(w/fontSize);
    var realContentNum=content.length;
    var rows=parseInt(realContentNum/rowNum)+1;
    var newh=fontSize*rows+3*rows;
    if(rows==1){
      var neww=realContentNum*fontSize;
    }else{
      var neww=w;
    }
    return {w:neww,h:newh};
}
/**
 * 根据指定比例尺计算要打印的地图的宽高：  根据当前的高度计算请求图层的zoom值
 * @param  {[type]} map   [description]
 * @param  {[type]} scale [description]
 * @return {[string]}    whRate   横向（）或纵向(false)  
 */
gEcnu.Util.getMapParamByScale = function (map,scale,whRate){
	var size = map.getSize();
	var center  = map.getCenter();
	var x = center.x ,y = center.y;
	var w0 = size.w;
	var h0 = size.h;
	//最大 打印上海市全市范围 120KM * 140KM 根据高度,计算宽度
	var zoom_w = map.getZoom().z;
	var zoom_h = (zoom_w/w0)* h0;
	if(zoom_h > 140000){
		zoom_h = 140000;
		// x = 0;
		// y = 0;
	}

	zoom_w =  zoom_h*whRate;
	var meterPerCm = scale/100;      //1cm代表的实际距离(m)
	var h_cm = zoom_w/meterPerCm; 
	var height_px = parseInt((h_cm/2.54)*96); //96dpi
	var width_px = parseInt(height_px *whRate); 
	
	// var width_cm = zoom_w/meterPerCm;   //打印的地图的宽度 cm
	// var width_px = parseInt((width_cm/2.54)*96); //96dpi
	// var height_px = parseInt(width_px / whRate);       //parseInt(width_px*h0/w0); 
    return { w:width_px, h: height_px,zoom:zoom_w,cx:x,cy:y};
};
gEcnu.Util.getMapParamByScale_bak = function (map,scale,whRate){
	var size = map.getSize();
	var center  = map.getCenter();
	var x = center.x ,y = center.y;
	var w0 = size.w;
	var h0 = size.h;
	//最大 打印上海市全市范围 120KM * 140KM 根据高度,计算宽度
	var zoom_w = map.getZoom().z;
	var zoom_h = (zoom_w/w0)* h0;
/*	if(zoom_h > 140000){
		zoom_h = 140000;
		// x = 0;
		// y = 0;
	}*/

	
	var meterPerCm = scale/100;      //1cm代表的实际距离(m)
	if(whRate){ 
		if(zoom_h > 140000){
			zoom_h = 140000;
			// x = 0;
			// y = 0;
		}
		var width_cm = zoom_w/meterPerCm;   //打印的地图的宽度 cm
	 	var width_px = parseInt((width_cm/2.54)*96); //96dpi
	 	var height_px = parseInt(width_px*h0/w0); 
	}else{
		var height_cm = zoom_h/meterPerCm; 
		var height_px = parseInt((height_cm/2.54)*96); //96dpi
		var width_px = parseInt(height_px*w0/h0);
	}

	/*zoom_w =  zoom_h*whRate;
	var meterPerCm = scale/100;      //1cm代表的实际距离(m)
	var h_cm = zoom_w/meterPerCm; 
	var height_px = parseInt((h_cm/2.54)*96); //96dpi
	var width_px = parseInt(height_px *whRate); */

	
	
	// var width_cm = zoom_w/meterPerCm;   //打印的地图的宽度 cm
	// var width_px = parseInt((width_cm/2.54)*96); //96dpi
	// var height_px = parseInt(width_px / whRate);       //parseInt(width_px*h0/w0); 
    return { w:width_px, h: height_px,zoom:zoom_w,cx:x,cy:y};
};
gEcnu.Util.getTimeInfo = function (){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
	return {'year':year,'month':month,'day':day};
}
