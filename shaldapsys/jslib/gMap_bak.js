/**
*@name gEcnu.Map
*@class
*@param {String} containerId 容器ID
*@property {String} name 地图对象名称
*@property {String} mapTool 地图工具
*@gEcnu.Map类
*@example 
*var gMap = new gEcnu.Map('map');
*/
var gSelf;
gEcnu.Map = gClass.extend(
	/**
	* @lends gEcnu.Map.prototype
	*/
{
	 /**
	 * 地图配置信息初始化_私有函数
	 * @param {String} containerId 容器ID
	 * @public
	 */
	init: function (containerId) {
		gSelf = this;
		this._initContainer(containerId);
		this._initProp();
		this.overLayer = new gEcnu.Layer.Overlay('overlay');
		this.mLayer = new gEcnu.Layer.Marker('markerLayer');
		this.addLayer(this.mLayer);
		this.addLayer(this.overLayer);
		this._initEvent();
		this.activeLayer = null;
		document.ondragstart = function () {
			return false;
		};
	},
	/**
	 * 地图容器初始化_私有函数
	 * @param {String} containerId 容器ID
	 * @public 
	 */
	_initContainer: function (containerId) {
		// this._container = $('#' + containerId);
		this._container = document.getElementById(containerId);
		this.w = this._container.clientWidth;
		this.h = this._container.clientHeight;
		this._container.style.overflow = 'hidden';
	},
	/**
	 * 地图对象属性初始化_私有函数
	 * @public
	 */
	_initProp: function () {
		this.oLayers = [];
		this.mode = "map";
		this.mapTool = "pan";
		this.dragging = false;
		this.isTouch = false;
		this.coordsFlag="PROJECTED";  //投影坐标系 or 地理坐标系
		this.oLayers = [];
		this.cx = 0;
		this.cy = 0;
		this.zl = 1;
		this.zl_pre=1;
		this.zoom =parseInt(1*this.w);
		this.ownDyn = false;
		this.ownTile = false;
		this.ownOther = false;
		this.maxLevel = gEcnu.config.maxLevel;
		this.minLevel = gEcnu.config.minLevel;
		this.tileWidth = gEcnu.config.tileWidth;
		this.tileHeight = gEcnu.config.tileHeight;
		this.cusEvtArr = [];

		this.cursorStyle={'pan':'default','dis':'default','area':'default','select':'default','addpoint':'default','delpoint':'default','mark':'default','draw':'default'};

		this.mapLeft = this._container.offsetLeft;
		this.mapTop = this._container.offsetTop;

		this.disMinus = 0;
		this.pinchPt1;
		this.pinchPt2;
		this.startDis;
		this.endDis;

		this.startX = 0;
		this.startY = 0;
		this.startScrX = 0;
		this.startSrcY = 0;

		this.lengthPtArr = [];
		this.areaPtArr = [];

		this.oControls = [];

		this.resizeTimer = null;
		this.forbidPan_ex=false;//用来判断是否屏蔽地图平移、缩放操作

		this.curScrPolys = [];
		this.tlr = 5;

		//this.webHost = "http://" + window.location.hostname;
		this.webHost = 'http://' + gEcnu.config.webHostIP;
		this.serverURL = this.webHost + ":" + gEcnu.config.port + "/";
		this.webMapURL = this.serverURL + "WebMap";
		this.webFeatureUrl=this.serverURL + "WebFeature";
		this.tileMapURL = this.serverURL + "TileMap";
		this.fileServer = this.serverURL + "FileServer?fn=";
	},
	/**
	 * 事件监听注册_私有函数
	 * @public
	 */
	_initEvent: function () {

		var startName = "ontouchstart";
		var doc = document.documentElement;
		var ctn;
		if (gEcnu.Util.getIEVersion() == 0) {
			ctn = this.mLayer.getLayerContainer();
		} else {
			ctn = this._container;
		}
		//var ctn = this.mLayer.getLayerContainer();
		if (startName in doc) {
			ctn.ontouchstart = mapMouseDownEvt_pan;
			ctn.ontouchmove = mapMouseMoveEvt;
			ctn.ontouchend = mapMouseUpEvt;
		}
		
		//ctn.onmousedown=mapMouseDownEvt_pan;
		//gEcnu.Util.addEvtHandler(ctn, 'mousedown', mapMouseDownEvt);
		gEcnu.Util.addEvtHandler(ctn, 'mousedown', mapMouseDownEvt_pan);
		gEcnu.Util.addEvtHandler(ctn, 'mousemove', mapMouseMoveEvt);
		gEcnu.Util.addEvtHandler(ctn, 'mouseup', mapMouseUpEvt);
		gEcnu.Util.addEvtHandler(ctn, 'mousewheel', mapMouseWheelEvt);
		gEcnu.Util.addEvtHandler(ctn, 'dblclick', mapMouseDblEvt);


		function mapMouseDblEvt(e) {
			if (gSelf.mode == 'map') {
				calLenAreMouseDblClickEvt(e);
			} else {
				gSelf.mousedblclickCustom(e);
			}
		}


	

        function mapMouseDownEvt_pan(e){
        	var e = e ? e : window.event;
            if(!window.event) {e.preventDefault();}   //
            gSelf.tmpMapmode=gSelf.mode;
            gSelf.tmpMaptool=gSelf.mapTool;
            if(gEcnu.Util.ifctrl(e)){
               gSelf.mode = 'map';
               gSelf.mapTool="pan";
            }
            if(gSelf.mode == 'map'&&(gSelf.mapTool != "rulerLength")&&(gSelf.mapTool != "rulerArea")){                     //  mapTool==pan时
                //地图浏览
                if(gSelf.forbidPan_ex){
                	gSelf.mode=gSelf.tmpMapmode;
                    gSelf.mapTool=gSelf.tmpMaptool;
                	return;
                }
                mapMouseDown_pan(e);
                document.onmousemove=function(e){
            	    if(gSelf.forbidPan_ex){
                	    gSelf.mode=gSelf.tmpMapmode;
                        gSelf.mapTool=gSelf.tmpMaptool;
                	    return;
                    }
                    mapMouseMove_pan(e);
                }
                document.onmouseup=function(e){
                	if(gSelf.forbidPan_ex){
                	    gSelf.mode=gSelf.tmpMapmode;
                        gSelf.mapTool=gSelf.tmpMaptool;
                	    return;
                    }
                	document.onmousemove=null;
                    document.onmouseup=null;
                	mapMouseUp_pan(e);  
                }
            }else{  //非浏览模式（地图绘制或者地图量算）
            	mapMouseDown_pan(e);   //  ??????
                mapMouseDownEvt(e);
            }

           
        }
		function mapMouseDown_pan(e) {
			//gEcnu.Util.preventDefault(e);
			//gEcnu.Util.stopPropagation(e);
			if (gSelf.mode == 'map') {
				if (e.type == 'touchstart' && e.touches.length == 2) {
					var tp1 = gEcnu.Util.getTouchPt(e.touches[0]);
					var tp2 = gEcnu.Util.getTouchPt(e.touches[1]);
					gSelf.pinchPt1 = tp1;
					gSelf.pinchPt2 = tp2;
					gSelf.startDis = gEcnu.Util.p1top2Dis(tp1, tp2);
				} else {
					if (gSelf.mapTool == 'pan') {
						gSelf.dragging = true;
					}
					var mxy, scrxy;
					if (e.type == 'touchstart') {
						mxy = gEcnu.Util.getTouchXY(e);
						scrxy = gEcnu.Util.getTouchPos(e);
						
					} else {
						mxy = gEcnu.Util.getMouseXY(gSelf._container,e);
						scrxy = gEcnu.Util.getMousePos(e);
					}
					gSelf.startX = mxy.x;
					gSelf.startY = mxy.y;
					gSelf.startScrX = scrxy.x;
					gSelf.startScrY = scrxy.y;
					var oLayers = gSelf.getAllLayers();
					for (var i = 0; i < oLayers.length; i++) {
						if (oLayers[i].oClass == 'tileLayer') {
							oLayers[i].startLeft = gEcnu.Util.delpx(oLayers[i].baseMap.style.left);
							oLayers[i].startTop = gEcnu.Util.delpx(oLayers[i].baseMap.style.top);
						} else {
                            oLayers[i].startLeft = gEcnu.Util.delpx(oLayers[i]._layerContainer.style.left);
							oLayers[i].startTop = gEcnu.Util.delpx(oLayers[i]._layerContainer.style.top);
							// oLayers[i].startLeft = gEcnu.Util.delpx(oLayers[i]._layerContainer.style.left);
							// oLayers[i].startTop = gEcnu.Util.delpx(oLayers[i]._layerContainer.style.top);  //????
						}
					}
				}
			} 
		}
		function mapMouseDownEvt(e) {
			gEcnu.Util.preventDefault(e);
			gEcnu.Util.stopPropagation(e);
            if (gSelf.mode == 'map') { 
            	calLenAreMouseDownEvt(e);	
			}else{
				gSelf.mousedownCustom(e);
			}
		}
		function mapMouseMove_pan(e) {
			gEcnu.Util.preventDefault(e);
            if (gSelf.mode == 'map'&&gSelf.mapTool == 'pan') {
				var mxy, scrxy;
				if (e.type == 'touchmove' && e.touches.length == 2) {
					var tp1 = gEcnu.Util.getTouchPt(e.touches[0]);
					var tp2 = gEcnu.Util.getTouchPt(e.touches[1]);
					gSelf.pinchPt1 = tp1;
					gSelf.pinchPt2 = tp2;
					gSelf.endDis = gEcnu.Util.p1top2Dis(tp1, tp2);
					gSelf.disMinus = gSelf.endDis - gSelf.startDis;
					//console.log(gSelf.startDis);
				} else {
					if (e.type == 'touchmove') {
						mxy = gEcnu.Util.getTouchXY(e);
						scrxy = gEcnu.Util.getTouchPos(e);

						gSelf.endScrX = scrxy.x;
						gSelf.endScrY = scrxy.y;
					} else {
						mxy = gEcnu.Util.getMouseXY(gSelf._container,e);
						scrxy = gEcnu.Util.getMousePos(e);
					}
					gSelf.currentX = mxy.x;
					gSelf.currentY = mxy.y;
					if (gSelf.dragging && gSelf.mapTool == 'pan') {
						var dltx = scrxy.x - gSelf.startScrX;
						var dlty = scrxy.y - gSelf.startScrY;
						var oLayers = gSelf.getAllLayers();
						if (Math.abs(dltx) > 0 || Math.abs(dlty) > 0) {
						    for (var i = 0; i < oLayers.length; i++) {
						    	if (oLayers[i].visible) {
						    		oLayers[i].onDrag(dltx, dlty);
						    	}
						    	if(oLayers[i].oClass=="dynLayer"){
                                    //oLayers[i]._mapImg.src=gEcnu.config.imgPath+"empty.png";
						    	}
						    }
					    }
					}
				}
			}
		}
		function mapMouseMoveEvt(e) {
			gEcnu.Util.preventDefault(e);
			if (gSelf.mode == 'map') {
				var mxy;
				if (e.type == 'touchmove') {
					mxy = gEcnu.Util.getTouchXY(e);
				}else{
					mxy = gEcnu.Util.getMouseXY(gSelf._container,e);
				}
	            var maptool=gSelf.mapTool;
	            switch(maptool){
	            	case 'pan':
	            	    gSelf.mLayer.getLayerContainer().style.cursor = gSelf.cursorStyle['pan'];
	            	break;
	            	case 'rulerLength':
	            	    gSelf.mLayer.getLayerContainer().style.cursor = gSelf.cursorStyle['dis'];
	            	break;
	            	case 'rulerArea':
	            	    gSelf.mLayer.getLayerContainer().style.cursor = gSelf.cursorStyle['area'];
	            	break;
	            }
	        

				gSelf.currentX = mxy.x;
				gSelf.currentY = mxy.y;
				calLenAreMouseMoveEvt(e);
			}else{
                gSelf.mousemoveCustom(e);
			}
		}
		function mapMouseUp_pan(e) {
			if (gSelf.mode == 'map' && gSelf.mapTool == 'pan') {
				var mxy, scrxy;
				if (Math.abs(gSelf.disMinus) > 0) { //多点触摸
					if (gSelf.disMinus > 0) {
						gSelf.zoomIn();
					} else {
						gSelf.zoomOut();
					}
					gSelf.disMinus = 0;
				} else {
					if (e.type == 'touchend') {
						scrxy = {
							x: gSelf.endScrX,
							y: gSelf.endScrY
						};
					} else {
						mxy = gEcnu.Util.getMouseXY(gSelf._container,e);
						scrxy = gEcnu.Util.getMousePos(e);
					}
					if (gSelf.mapTool == 'pan') {

						var dltx = scrxy.x - gSelf.startScrX;
						var dlty = scrxy.y - gSelf.startScrY;

						if (Math.abs(dltx) > 0 || Math.abs(dlty) > 0) {
						    var scxy = gSelf.getScreenCenter();
						    var nscx = scxy.x - dltx;
						    var nscy = scxy.y - dlty;

						    var wxy = gEcnu.Util.screenToWorld(nscx, nscy);
						   /* if(gSelf.coordsFlag=="GEOGRAPHIC"){
						    	wxy = gEcnu.Util.screenTolnglat(nscx, nscy);
						    }*/
						    gSelf.setCenter(wxy.x, wxy.y);
						    var oLayers = gSelf.getAllLayers();
						    var lyrs_len=oLayers.length;
						    for (var i = 0; i <lyrs_len ; i++) {
						    	if (oLayers[i].oClass == 'tileLayer' && oLayers[i].visible) {
						    		oLayers[i].xOffset = oLayers[i].xOffset + dltx;
						    		oLayers[i].yOffset = oLayers[i].yOffset + dlty;
						    		oLayers[i].baseMap.style.left = oLayers[i].startLeft + dltx + 'px';
						    		oLayers[i].baseMap.style.top = oLayers[i].startTop + dlty + 'px';
						    	}
						    	if (oLayers[i].visible) {
						    		if(oLayers[i].oClass != 'dynLayer'){  //请求tilemap后，紧接着请求了dynlayer 所以在此处不再重复请求
						    	        oLayers[i].renew();
						    	    }else if(!(gSelf.ownTile)){  //如果没有切片的话，需要请求动态图   
                                        oLayers[i].renew();
						    	    }
						    	}
						    }
						    gSelf.dragging = false;
						    gSelf.zl_pre=gSelf.zl;
						    gSelf._boundsChanged();
					    }
					}
				}
			}
			gSelf.mode=gSelf.tmpMapmode;
            gSelf.mapTool=gSelf.tmpMaptool;
		}
		function mapMouseUpEvt(e) {
			if (gSelf.mode == 'map'){
				//gSelf._qryAndMarker(e);
			}else{
				gSelf.mouseupCustom(e);
			}
		}
		var mousewheel_timer;
		function mapMouseWheelEvt(e) {
			gEcnu.Util.preventDefault(e);
			if(gSelf.forbidPan_ex) return;
			clearTimeout(mousewheel_timer);
			mousewheel_timer=setTimeout(function(){
			    if (gSelf.mode == 'map'&&gSelf.mapTool== 'pan') {
			    	//var e = window.event || e;
			    	var delta = e.wheelDelta || -e.detail; 	
			    	if (delta > 0) {
			    		if (gSelf.ownTile) {
		                	if (gSelf.zl <= gSelf.minLevel) {
		                		gSelf._boundsChanged({'error':'zoomin'});
		                		return;
		                	}
		                }
		                gSelf.zl_pre=gSelf.zl;
		                var mouseXY = gEcnu.Util.getMouseXY(gSelf._container,e);
	    	    		//计算新的中心点坐标  
	    	    		//1计算改点对应的地理坐标	
	    	    		var wxy = gEcnu.Util.screenToWorld(mouseXY.x, mouseXY.y);
	    	    		/*if(gSelf.coordsFlag=="GEOGRAPHIC"){
						    	wxy = gEcnu.Util.screenTolnglat(mouseXY.x, mouseXY.y);
						    }*/
	    	    		var halfwdltx=(wxy.x-gSelf.cx)/2;
	    	    		var halfwdlty=(wxy.y-gSelf.cy)/2;
	    	    		var newcx=wxy.x-halfwdltx;
	    	    		var newcy=wxy.y-halfwdlty;
	    	    		gSelf.setCenter(newcx, newcy);
	    	    		//console.log(newcx, newcy);
			    		gSelf.zoomIn(mouseXY);   //mouseXY是为了使模糊层能够正常显示
			    	} else {
			    		if (gSelf.ownTile) {
		                	if (gSelf.zl >= gSelf.maxLevel) {
		                		gSelf._boundsChanged({'error':'zoomout'});
		                		return;
		                	}
		                }
		                
			    		var mouseXY = gEcnu.Util.getMouseXY(gSelf._container,e);
	    	    		//计算新的中心点坐标  
	    	    		//1计算改点对应的地理坐标	
	    	    		var wxy = gEcnu.Util.screenToWorld(mouseXY.x, mouseXY.y);
	    	    		var halfwdltx=(wxy.x-gSelf.cx)*2;
	    	    		var halfwdlty=(wxy.y-gSelf.cy)*2;
	    	    		var newcx=wxy.x-halfwdltx;
	    	    		var newcy=wxy.y-halfwdlty;
	    	    		gSelf.setCenter(newcx, newcy);
			    		gSelf.zoomOut(mouseXY);
			    	}
			    } else {
			    	gSelf.mousewheelCustom(e);
			    }
			},280);
		}

		function calLenAreMouseDownEvt(e) {
			/****进行量算****/
			var ctx = gSelf.overLayer.getCtx();
			if (gSelf.mapTool == "rulerLength") {
				console.log(gSelf.startX, gSelf.startY);
				var wxy = gEcnu.Util.screenToWorld(gSelf.startX, gSelf.startY);
				if(gSelf.coordsFlag=="GEOGRAPHIC"){
				  wxy = gEcnu.Util.screenToWorld_geo(gSelf.startX, gSelf.startY);
				}
				var measurepoint = {
					x: wxy.x,
					y: wxy.y
				};
				gSelf.lengthPtArr.push(measurepoint);

				if (gSelf.lengthPtArr.length > 1) {
					//G.gEcnu.Graph.setStyle(ctx,'rulerLine');
					console.log(gSelf.lengthPtArr);
					gEcnu.Util.drawCalPolyline(ctx, gSelf.lengthPtArr)
				}
			} else if (gSelf.mapTool == "rulerArea") {
				var wxy = gEcnu.Util.screenToWorld(gSelf.startX, gSelf.startY);
				if(gSelf.coordsFlag=="GEOGRAPHIC"){
					wxy = gEcnu.Util.screenToWorld_geo(gSelf.startX, gSelf.startY);
				}
				var measurepoint = {
					x: wxy.x,
					y: wxy.y
				};
				gSelf.areaPtArr.push(measurepoint);
				if (gSelf.areaPtArr.length > 1) {
					//G.gEcnu.Graph.setStyle(ctx,'rulerLine');
					gEcnu.Util.drawCalPolyline(ctx, gSelf.areaPtArr);
				}
			} else {
				gSelf.overLayer.clear();
			}

			/*********量算************/
		}

		function calLenAreMouseMoveEvt(e) {
			var ctx = gSelf.overLayer.getCtx();
			if (gSelf.mapTool == "rulerLength") {
				if (gSelf.lengthPtArr.length > 0) {
					gSelf.overLayer.clear();
					//G.gEcnu.Graph.setStyle(ctx,'rulerLine');
					var pt = {
						x: gSelf.lengthPtArr[gSelf.lengthPtArr.length - 1].x,
						y: gSelf.lengthPtArr[gSelf.lengthPtArr.length - 1].y
					};
					var sxy = gEcnu.Util.worldToScreen(pt.x, pt.y);
					if(gSelf.coordsFlag=="GEOGRAPHIC"){
						sxy =gEcnu.Util.worldToScreen_geo(pt.x, pt.y);
					}
					gEcnu.Util.drawLine(ctx, sxy.x, sxy.y, gSelf.currentX, gSelf.currentY);
					gEcnu.Util.drawCalPolyline(ctx, gSelf.lengthPtArr);
					if (gSelf.lengthPtArr.length == 1) {
						var currDis = 0; //当前距离
						var wxy = gEcnu.Util.screenToWorld(gSelf.currentX, gSelf.currentY);
						if(gSelf.coordsFlag=="GEOGRAPHIC"){
					    wxy = gEcnu.Util.screenToWorld_geo(gSelf.currentX, gSelf.currentY);
				        }
						currDis = Math.sqrt((wxy.x - gSelf.lengthPtArr[0].x) * (wxy.x - gSelf.lengthPtArr[0].x) + (wxy.y - gSelf.lengthPtArr[0].y) * (wxy.y - gSelf.lengthPtArr[0].y));
						var msgText = "当前距离：" + Math.round(currDis) + "米" + ";" + "总距离：" + Math.round(currDis) + "米";
						
						//ctx.font = 'bold 15px 幼圆';
						//ctx.fillText(msgText, gSelf.currentX, gSelf.currentY);
						var msgText1 = "当前距离：" + gSelf.convertUnit('dis',Math.round(currDis));
						var msgText2 = "总距离:" + gSelf.convertUnit('dis',Math.round(currDis));
						ctx.font = ' 13px 幼圆';
						ctx.fillStyle='#fff';
						//ctx.globalAlpha=0.6;
						ctx.fillRect(gSelf.currentX,gSelf.currentY-40,160,50);
						//ctx.globalAlpha=1;
						ctx.strokeStyle='#eaeaea';
						ctx.lineWidth=1;
						ctx.strokeRect(gSelf.currentX,gSelf.currentY-40,160,50);
						ctx.fillStyle='blue';
						ctx.fillText(msgText1, gSelf.currentX, gSelf.currentY-20);
						ctx.fillText(msgText2, gSelf.currentX, gSelf.currentY);
					} else {
						var currDis = 0; //当前距离
						var totalDis = 0; //总距离
						//当前距离
						var i = (gSelf.lengthPtArr.length - 1);
						var currDis = ""; //当前距离
						var wxy = gEcnu.Util.screenToWorld(gSelf.currentX, gSelf.currentY);
						if(gSelf.coordsFlag=="GEOGRAPHIC"){
							wxy=gEcnu.Util.screenToWorld_geo(gSelf.currentX, gSelf.currentY);
						}
						currDis = Math.sqrt((wxy.x - gSelf.lengthPtArr[i].x) * (wxy.x - gSelf.lengthPtArr[i].x) + (wxy.y - gSelf.lengthPtArr[i].y) * (wxy.y - gSelf.lengthPtArr[i].y));
						//总距离
						totalDis = gEcnu.Util.getPolylineLength(gSelf.lengthPtArr);
						totalDis = totalDis + currDis;
						// var msgText = "当前距离：" + Math.round(currDis) + "米" + ";" + "总距离:" + Math.round(totalDis) + "米";
						var msgText1 = "当前距离：" + gSelf.convertUnit('dis',Math.round(currDis)) ;
						var msgText2 = "总距离:" + gSelf.convertUnit('dis',Math.round(totalDis)) ;
						//ctx.font = 'bold 15px 幼圆';
						ctx.font = ' 13px 幼圆';
						ctx.fillStyle='#fff';
						ctx.fillRect(gSelf.currentX,gSelf.currentY-40,160,50);
						ctx.strokeStyle='#333';
						ctx.lineWidth=1;
						ctx.strokeRect(gSelf.currentX,gSelf.currentY-40,160,50);
						ctx.fillStyle='blue';
						ctx.fillText(msgText1, gSelf.currentX+5, gSelf.currentY-20);
						ctx.fillText(msgText2, gSelf.currentX+5, gSelf.currentY);
					}
				}
			} else if (gSelf.mapTool == "rulerArea") {
				if (gSelf.areaPtArr.length > 0) {
					gSelf.overLayer.clear();
					//G.gEcnu.Graph.setStyle(ctx,'rulerLine');
					var maxi = gSelf.areaPtArr.length - 1;
					var sxy = gEcnu.Util.worldToScreen(gSelf.areaPtArr[maxi].x, gSelf.areaPtArr[maxi].y);
					if(gSelf.coordsFlag=="GEOGRAPHIC"){
						sxy =gEcnu.Util.worldToScreen_geo(gSelf.areaPtArr[maxi].x, gSelf.areaPtArr[maxi].y);
					}
					gEcnu.Util.drawLine(ctx, sxy.x, sxy.y, gSelf.currentX, gSelf.currentY);
					if (gSelf.areaPtArr.length > 1) {
						gEcnu.Util.drawCalPolyline(ctx, gSelf.areaPtArr);
						var sxy = gEcnu.Util.worldToScreen(gSelf.areaPtArr[0].x, gSelf.areaPtArr[0].y);
						if(gSelf.coordsFlag=="GEOGRAPHIC"){
						sxy =gEcnu.Util.worldToScreen_geo(gSelf.areaPtArr[0].x, gSelf.areaPtArr[0].y);
					  }
						gEcnu.Util.drawLine(ctx, sxy.x, sxy.y, gSelf.currentX, gSelf.currentY);
						//计算周长
						var perimeter = 0;
						var totalDis = gEcnu.Util.getPolylineLength(gSelf.areaPtArr);
						var worldXY = gEcnu.Util.screenToWorld(gSelf.currentX, gSelf.currentY);
						if(gSelf.coordsFlag=="GEOGRAPHIC"){
							worldXY=gEcnu.Util.screenToWorld_geo(gSelf.currentX, gSelf.currentY);
						}
						var dis1 = Math.sqrt((worldXY.x - gSelf.areaPtArr[maxi].x) * (worldXY.x - gSelf.areaPtArr[maxi].x) + (worldXY.y - gSelf.areaPtArr[maxi].y) * (worldXY.y - gSelf.areaPtArr[maxi].y));
						var dis2 = Math.sqrt((worldXY.x - gSelf.areaPtArr[0].x) * (worldXY.x - gSelf.areaPtArr[0].x) + (worldXY.y - gSelf.areaPtArr[0].y) * (worldXY.y - gSelf.areaPtArr[0].y));
						perimeter = totalDis + dis1 + dis2;
						//计算面积
						var temgareaPtArr;
						temgareaPtArr = gSelf.areaPtArr.concat();
						var temmouseXY = {
							x: worldXY.x,
							y: worldXY.y
						};
						temgareaPtArr.push(temmouseXY);
						//计算面积
						var area = gEcnu.Util.calcAreaMap(temgareaPtArr);
						//var msgText = "周长：" + Math.round(perimeter) + "米" + "面积：" + area + "平方米";
						var msgText1 = "周长：" + gSelf.convertUnit('dis',Math.round(perimeter)); 
						var msgText2 = "面积：" + gSelf.convertUnit('area',area);
						//ctx.font = 'bold 15px 幼圆';
						ctx.font = ' 13px 幼圆';
						ctx.fillStyle='#fff';
						ctx.fillRect(gSelf.currentX,gSelf.currentY-40,190,50);
						ctx.strokeStyle='#333';
						ctx.lineWidth=1;
						ctx.strokeRect(gSelf.currentX,gSelf.currentY-40,190,50);
						ctx.fillStyle='blue';
						ctx.fillText(msgText1, gSelf.currentX+5, gSelf.currentY-20);
						ctx.fillText(msgText2, gSelf.currentX+5, gSelf.currentY);
					}
				}
			}
		}

		function calLenAreMouseDblClickEvt(e) {
			var ctx = gSelf.overLayer.getCtx();
			var returnLenArea = "";
			if (gSelf.mapTool == "rulerLength") {
				gSelf.lengthPtArr.pop();
				var totalDis = gEcnu.Util.getPolylineLength(gSelf.lengthPtArr);
				//执行重绘
				gSelf.overLayer.clear();
				gEcnu.Util.drawCalPolyline(ctx, gSelf.lengthPtArr);
				//gSelf.maptool = "zoomto";
				var len = gSelf.lengthPtArr.length;
				var sxy = gEcnu.Util.worldToScreen(gSelf.lengthPtArr[len - 1].x, gSelf.lengthPtArr[len - 1].y);
				if(gSelf.coordsFlag=="GEOGRAPHIC"){
					sxy =gEcnu.Util.worldToScreen_geo(gSelf.lengthPtArr[len - 1].x, gSelf.lengthPtArr[len - 1].y);
				}
				var endx = sxy.x;
				var endy = sxy.y;
				gSelf.lengthPtArr = [];
				returnLenArea = "总距离：" + gSelf.convertUnit('dis',Math.round(totalDis));
				ctx.font = ' 13px 幼圆';
				ctx.fillStyle='#fff';
				ctx.strokeStyle='#333';
				ctx.lineWidth=1;
				ctx.fillRect(endx,endy-15,160,25);
				ctx.strokeRect(endx,endy-15,160,25);
				ctx.fillStyle='blue';
				ctx.fillText(returnLenArea, endx+5, endy);
			} else if (gSelf.mapTool == "rulerArea") {
				gSelf.areaPtArr.pop();
				if (gSelf.areaPtArr.length < 3) {
					alert("绘制节点至少三个！");
					return returnLenArea;
				}
				var totalDis = gEcnu.Util.getPolylineLength(gSelf.areaPtArr);
				//计算起始点和终止点的距离
				var perimeter = 0;
				var max = gSelf.areaPtArr.length - 1;
				var dis = Math.sqrt((gSelf.areaPtArr[max].x - gSelf.areaPtArr[0].x) * (gSelf.areaPtArr[max].x - gSelf.areaPtArr[0].x) + (gSelf.areaPtArr[max].y - gSelf.areaPtArr[0].y) * (gSelf.areaPtArr[max].y - gSelf.areaPtArr[0].y));
				perimeter = totalDis + dis;
				//计算面积
				var area = gEcnu.Util.calcAreaMap(gSelf.areaPtArr);
				//执行重绘
				gSelf.overLayer.clear();
				gEcnu.Util.drawCalPolyline(ctx, gSelf.areaPtArr);
				var sxy1 = gEcnu.Util.worldToScreen(gSelf.areaPtArr[0].x, gSelf.areaPtArr[0].y);
				var sxy2 = gEcnu.Util.worldToScreen(gSelf.areaPtArr[max].x, gSelf.areaPtArr[max].y);
				if(gSelf.coordsFlag=="GEOGRAPHIC"){
					sxy1 =gEcnu.Util.worldToScreen_geo(gSelf.areaPtArr[0].x, gSelf.areaPtArr[0].y);
					sxy2 =gEcnu.Util.worldToScreen_geo(gSelf.areaPtArr[max].x, gSelf.areaPtArr[max].y);
				}
				gEcnu.Util.drawLine(ctx, sxy1.x, sxy1.y, sxy2.x, sxy2.y);
				var sxy = gEcnu.Util.worldToScreen(gSelf.areaPtArr[gSelf.areaPtArr.length - 1].x, gSelf.areaPtArr[gSelf.areaPtArr.length - 1].y);
				if(gSelf.coordsFlag=="GEOGRAPHIC"){
					sxy =gEcnu.Util.worldToScreen_geo(gSelf.areaPtArr[gSelf.areaPtArr.length - 1].x, gSelf.areaPtArr[gSelf.areaPtArr.length - 1].y);
				}
				gSelf.areaPtArr = [];
				returnLenArea = "周长：" + Math.round(perimeter) + "米" + "；" + "面积：" + Math.round(area) + "平方米";
				returnLenArea1 = "周长：" + gSelf.convertUnit('dis',Math.round(perimeter));
				returnLenArea2 = "面积：" + gSelf.convertUnit('area',Math.round(area));
				ctx.font = ' 13px 幼圆';
				//ctx.fillText(returnLenArea, sxy.x, sxy.y);
				ctx.fillStyle='#fff';
				ctx.fillRect(sxy.x, sxy.y-40,190,50);
				ctx.strokeStyle='#333';
				ctx.lineWidth=1;
				ctx.strokeRect(sxy.x, sxy.y-40,190,50);
				ctx.fillStyle='blue';
				ctx.fillText(returnLenArea1, sxy.x+5, sxy.y-20);
				ctx.fillText(returnLenArea2, sxy.x+5, sxy.y);
			}
			return returnLenArea;
		}
	},
	/**
	 * 添加图层
	 * @param {Object} layer
	 */
	addLayer: function (layer) {
		var oLayers = this.oLayers;
		if (!gEcnu.Util.isObjInArray(oLayers, layer)) {
			layer.onAdd(this);
			oLayers.push(layer);
		}
	},
	/**
	 * 移除图层
	 * @param layer
	 */
	removeLayer: function (layer) {  
		var oLayer = [];
		var oLayers = this.oLayers;
		this.ownTile=false;
		this.ownOther=false;
		for (var i = 0, a = 0; i < oLayers.length; i++) {
			if (oLayers[i] != layer) {
				oLayer[a] = oLayers[i];
				if(oLayer[a].oClass == "tileLayer"){
					this.ownTile=true;
				}
				if(oLayer[a].oClass == "otherLayer"){
					this.ownOther=true;  
				}
				a++;
			} else {
				layer.onRemove(this);
				
			}
		}
		this.oLayers = oLayer;
	},
	/**
	 * 通过图层id移除图层
	 * @param layerid
	 */
	removeLayerById: function (layerid) {
		var oLayer = [];
		var oLayers = this.oLayers;
		this.ownTile=false;
		for (var i = 0, a = 0; i < oLayers.length; i++) {
			if (oLayers[i].id != layerid) {
				oLayer[a] = oLayers[i];
				if(oLayer[a].oClass == "tileLayer"){
					this.ownTile=true;
				}
				a++;
			} else {
				oLayers[i].onRemove(this);
			}
		}
		this.oLayers = oLayer;
	},
		/**
	 * 通过图层id移除图层
	 * @param layerid
	 */
	getLayerById: function (layerid) {
		var oLayer = [];
		var oLayers = this.oLayers;
		console.log(this.oLayers);
		console.log(layerid);
		for (var i = 0, a = 0; i < oLayers.length; i++) {
			if (oLayers[i].id == layerid) {
				console.log(oLayers[i]);
                return oLayers[i];
			} 
		}
	},
	/**
	 *  添加图层组
	 * @param layers 图层数组
	 */
	addLayers: function (layers) {
		var oLayers = this.oLayers;
		for (var i in layers) {
			if (!gEcnu.Util.isObjInArray(oLayers, layers[i])) {
				layers[i].onAdd(this);
				oLayers.push(layers[i]);
			}
		}
	},
	/**
	 *  移除图层组
	 * @param layers 图层数组
	 */
	removeLayers: function (layers) {
		var oLayer = [];
		var oLayers = this.oLayers;
		this.ownTile=false;
		for (var k in layers) {
			for (var i = 0, a = 0; i < oLayers.length; i++) {
				if (oLayers[i] != layers[k]) {
					oLayer[a] = oLayers[i];
					if(oLayer[a].oClass == "tileLayer"){
						this.ownTile=true;
					}
					a++;
				} else {
					layers[k].onRemove(this);
				}
			}
		}
		oLayers = oLayer;
	},
	/**
	 * 控制图层是否可见
	 * @param layers 图层数组
	 */
	showLayer: function (layer) {
		layer.show();
	},
	/**
	 * 控制图层是否可见
	 * @param layers 图层数组
	 */
	hideLayer: function (layer) {
		layer.hide();
	},
	/**
	 * 添加控件（ZoomBar或者Scale）
	 * @param layers 图层数组
	 */
	addControl: function (control) {
		var oControls = this.getAllControls();
		if (!gEcnu.Util.isObjInArray(oControls, control)) {
			control.onAdd(this);
			oControls.push(control);
		}
		//console.log(oControls);
	},
	/**
	 * 获取全部图层
	 * @returns {Array}
	 */
	getAllLayers: function () {
		return this.oLayers;
	},
	/**
	 * 获取全部控件
	 * @returns {Array}
	 */
	getAllControls: function () {
		return this.oControls;
	},
	/**
	 * 视野放大操作
	 */
	zoomIn: function (mouseXY) {
		if (this.ownTile) {
			if (this.zl <= this.minLevel) {
				return;
			}
		}
		var coordsys=gSelf.coordsFlag;
		var oLayers = this.getAllLayers();
		if(this.ownOther){  //判断如果有第三方地图时  其也有缩放级别限制
			if(coordsys=='PROJECTED'){
				var curoMaplevel=gSelf.activeLayer.oMap.MaxLevel-this.zl; //第三方地图的当前所处缩放级别
			if(curoMaplevel>=gSelf.activeLayer.oMap.MaxLevel){  
				alert("已经放大至最大级别");
					return;
				}
		 }else{
		 	var otherZoomlevel=Math.floor(10-Math.log(gSelf.zoom/1.1)/Math.log(2));
		 	if(otherZoomlevel>=gSelf.activeLayer.oMap.MaxLevel){
		 		alert("已经放大至最大级别");
					return;
		 	}
		 }	
		}
		this.zoom = (this.zoom) / 2;
		var tmpzl=this.zl;
		this.zl_pre=tmpzl;
		this.zl--;
		for (var i = 0; i < oLayers.length; i++) {
			if (oLayers[i].visible) {
				oLayers[i].zoomIn(mouseXY);
			}
		}
		var oControls = this.getAllControls();
		for (var j = 0; j < oControls.length; j++) {
			oControls[j].renew();
		}
		gSelf._boundsChanged();
	},
	/**
	 * 视野缩小操作
	 */
	zoomOut: function (mouseXY) {  
		if (this.ownTile) {
			if (this.zl >= this.maxLevel) {
				return;
			}
		}
		var coordsys=gSelf.coordsFlag;
		var oLayers = this.getAllLayers();
		//判断如果有第三方地图时  其也有缩放级别限制
		if(this.ownOther){
			if(coordsys=='PROJECTED'){
			var curoMaplevel=gSelf.activeLayer.oMap.MaxLevel-this.zl;
			if(curoMaplevel<=gSelf.activeLayer.oMap.Minlevel+1){ 
			    alert("已经缩小至最小级别");
					return;
				 }
			}else{
				var otherZoomlevel=Math.floor(10-Math.log(gSelf.zoom/1.1)/Math.log(2));
		 		if(otherZoomlevel<=gSelf.activeLayer.oMap.Minlevel){
		 		alert("已经缩小至最小级别");
					return;
		 	}

			}
		  }	
		this.zoom = (this.zoom) * 2;
		var tmpzl=this.zl;
		this.zl_pre=tmpzl;
		this.zl++;
		for (var i = 0; i < oLayers.length; i++) {
			if (oLayers[i].visible) {
				oLayers[i].zoomOut(mouseXY);
			}
		}
		var oControls = this.getAllControls();
		for (var j = 0; j < oControls.length; j++) {
			oControls[j].renew();
		}
		gSelf._boundsChanged();
	},
	/**
	 * 平移地图
	 * @param cx 地理中心点x坐标
	 * @param cy 地理中心点y坐标
	 * @param zl 视野范围
	 */
	zoomTo: function (cx, cy, z) {
		this.setCenter(cx, cy);
		var oLayers = this.getAllLayers();
		if(typeof z=="undefined"){
			for (var i = 0; i < oLayers.length; i++) {
				oLayers[i].zoomTo();
			}
		}else{
		    if (z.hasOwnProperty("zl")) {
		    	this.zl = z.zl;
		    	//this.zl_pre=this.zl+1;
		        var MeterPerPx=Math.pow(2,(this.zl-1));
		    	var w = this._container.clientWidth;
		    	this.zoom=MeterPerPx*w;
		    	for (var i = 0; i < oLayers.length; i++) {
		    		if (oLayers[i].oClass == 'tileLayer') {
		    			oLayers[i].zoomTo();
		    		}
		    	}
		    	for (var i = 0; i < oLayers.length; i++) {
		    		if (oLayers[i].oClass != 'tileLayer') {
		    			oLayers[i].zoomTo();
		    		}
		    	}
		    } else if (z.hasOwnProperty("zoom")) {
		    	this.zoom = z.zoom;
		    	if(gSelf.ownTile){  //如果有切片
		    		var w = this._container.clientWidth;
		    	    var MeterPerPx=this.zoom/w;
		    	    this.zl=parseInt(Math.log(MeterPerPx)/Math.log(2))+1;
		    	    var MeterPerPx=Math.pow(2,(this.zl-1));
		    	    this.zoom=MeterPerPx*w;
		    	    for (var i = 0; i < oLayers.length; i++) {
		    		if (oLayers[i].oClass != 'dynLayer') {
		    			oLayers[i].zoomTo();
		    		}
		    	  }
		    	}else{
		    		for (var i = 0; i < oLayers.length; i++) {		
		    			oLayers[i].zoomTo();
		    	 }
		    	}	
		    }
		}
		var oControls = this.getAllControls();
		for (var j = 0; j < oControls.length; j++) {
			oControls[j].renew();
		}
		gSelf._boundsChanged();
	},
	/**
	 * 地图resize操作_私有函数
	 */
	resize: function () {
		var prew = this.w;
		var curZoom=this.zoom;
		var MeterPerPx=curZoom/prew;//这里的作用是为了党resize的时候记住每个像素代表实际距离，然后再dynLayer的resize中利用
		var preh = this.h;
		var w = this._container.clientWidth;
		var h = this._container.clientHeight;
		this.zoom=MeterPerPx*w;
		var wxy = gEcnu.Util.screenToWorld(w / 2, h / 2);
		this.cx = wxy.x;
		this.cy = wxy.y;
		this.w = w;
		this.h = h;
		var oLayers = this.getAllLayers();
		for (var i = 0; i < oLayers.length; i++) {
			oLayers[i].resize();
		}
		var oControls = this.getAllControls();
		for (var j = 0; j < oControls.length; j++) {
			oControls[j].renew();
		}
		gSelf._boundsChanged();
	},
	/**
	 * 获取地图容器
	 * @returns {*|jQuery|HTMLElement|_container}
	 */
	getContainer: function () {
		return this._container;
	},
	/**
	 * 获取地图宽高
	 * @returns {{w: *, h: *}}
	 */
	getSize: function () {
		return {
			w: this.w,
			h: this.h
		};
	},
	/**
	 * 获取视野范围
	 * @returns {{z: number, zl: *}}
	 */
	getZoom: function () {
		return {
			z: this.zoom,
			zl: this.zl
		}
	},
	/**
	 * 获取缩放时上一级别
	 * @returns {{z: number, zl: *}}
	 */
	getPreZl: function () {
		return this.zl_pre;
	},
	/**
	 * 设定视野范围
	 * @param zoom
	 */
	setZoom: function (zoom) {
		this.zoom = zoom;
	},
	/**
	 * 设定视野范围_暂时未写
	 * @param zl
	 */
	setZoomLevel: function (zl) {

	},
	/**
	 * 获取地图中心点
	 * @returns {{x: number, y: number}}
	 */
	getCenter: function () {
		return {
			x: this.cx,
			y: this.cy
		}
	},
	clearOverlay:function(){
		this.overLayer.clear();
	},
	/**
	 * 禁止地图平移
	 * @param cx
	 * @param cy
	 */
	forbidPan:function(){
      this.forbidPan_ex=true;
	},
	activePan:function(){
      this.forbidPan_ex=false;
	},
	/**
	 * 设定中心点
	 * @param cx
	 * @param cy
	 */
	setCenter: function (cx, cy) {
		this.cx = cx;
		this.cy = cy;
	},
	/**
	 * 获取屏幕中心点
	 * @returns {{x: number, y: number}}
	 */
	getScreenCenter: function () {
		return {
			x: this.w / 2,
			y: this.h / 2
		}
	},
	/**
	 * 获取地图范围
	 * @returns {{
			'nw': {
				'x': wl,
				'y': ht
			},
			'ne': {
				'x': wr,
				'y': ht
			},
			'sw': {
				'x': wl,
				'y': hb
			},
			'se': {
				'x': wr,
				'y': hb
			}
		}}
	 */
	getBounds: function () {
		var cxy = this.getCenter();
		var size = this.getSize();
		var z = this.getZoom();
		var wl = cxy.x - z.z / 2;
		var wr = cxy.x + z.z / 2;
		var scale = z.z/size.w  ;
		var ht = cxy.y - size.h * scale / 2;
		var hb = cxy.y + size.h * scale / 2;
		return {
			'nw': {
				'x': wl,
				'y': hb
			},
			'ne': {
				'x': wr,
				'y': hb
			},
			'sw': {
				'x': wl,
				'y': ht
			},
			'se': {
				'x': wr,
				'y': ht
			}
		}
	},
	/**
	 * 获取地图状态_私有函数
	 * @returns map.mode
	 */
	getMode: function () {
		return this.mode;
	},
	/**
	 * 设置地图状态_私有函数
	 *  @param mode
	 */
	setMode: function (mode) {
		this.mode = mode;
	},
	/**
	 * 获取地图mapTool
	 * @returns map.mapTool
	 */
	getMapTool: function () {
		return this.mapTool;
	},
	/**
	 * 设置地图状态
	 */
	setMapTool: function (maptool) {
		this.mapTool=maptool;
	},
	/**
	 * 设置地图状态
	 */
	setCursorStyle: function (opekind,cururl) {
		this.cursorStyle[opekind]="url("+"'"+cururl+"'"+"),default";
	},
	/**
	 * 为map对象注册监听事件
	 * @example
	 * map.events.on('boundsChanged',callback);
	 */
    events:{
        on:function(eventType,callback){
           switch (eventType){
           	  case 'boundsChanged':
                  gEcnu.Map.prototype._boundsChanged_EX = function (result) {
                  	  callback(result);
                  }
           	  break;
           }
        }
    },
    /**
	 * 地图可视范围发生变化后触发事件_私有函数
	 * @public
	 */
    _boundsChanged:function(){
    	var oControls = this.getAllControls();
		for (var j = 0; j < oControls.length; j++) { 
			if(oControls[j].oClass=="eagleMapControl"){  //更新鹰眼中矩形框的位置
				oControls[j].renew();
			}
		}
		if(arguments.length>0){
			var params1=arguments[0];
            this._boundsChanged_EX(params1);
		}else{
           this._boundsChanged_EX();
        }
    },
    _boundsChanged_EX:function(){

    },
	/**
	 * map拓展mousedown事件响应函数_内部调用
	 * @param e
	 */
	mousedownCustom: function (e) {
        gEcnu.Edit.graphMouseDownEvt(e,gSelf);
	},
	/**
	 * map拓展mousemove事件响应函数_内部调用
	 * @param e
	 */
	mousemoveCustom: function (e) {
        gEcnu.Edit.graphMouseMoveEvt(e,gSelf);
	},
	/**
	 * map拓展mouseup事件响应函数_内部调用
	 * @param e
	 */
	mouseupCustom: function (e) {
        gEcnu.Edit.graphMouseUpEvt(e,gSelf);
	},
	/**
	 * map拓展mousewheel事件响应函数_内部调用
	 * @param e
	 */
	mousewheelCustom: function (e) {

	},
	/**
	 * map拓展mousedblclickCustom事件响应函数_内部调用
	 * @param e
	 */
	mousedblclickCustom: function (e) {
        gEcnu.Edit.graphMouseDblClickEvt(e,gSelf);
	},
	setProjCoordsFlag:function (){
		gSelf.coordsFlag="PROJECTED";
	},
	setGeoCoordsFlag:function (){
		gSelf.coordsFlag="GEOGRAPHIC";
	},
		/**
	 * 设置地图量算单位
	 * @param unit  米/千米  平方米/亩/公顷
	 */
	setRulerUnit:function (option){
		this.disUnit = option.disUnit || '米';
		this.areaUnit = option.areaUnit || '平方米';
	},
	convertUnit:function (type,disOrArea){
		var disUnit=this.disUnit;
		var areaUnit=this.areaUnit;
		if(type=='dis'){
			switch(disUnit){
				case "千米":
				return disOrArea/1000 +"千米";
				break;
				case "公里":
				return disOrArea/1000 + "公里";
				break;
				default:
				return disOrArea +"米";
			}
		}else{
			switch(areaUnit){
				case "平方千米":
				return (disOrArea/1000000).toFixed(2) +"平方千米";
				break;
				case "平方公里":
				return (disOrArea/1000000).toFixed(2) + "平方公里";
				break;
				case "亩":
				return (disOrArea*0.0015).toFixed(2) +"亩";
				break;
				case "公顷":
				return (disOrArea/10000).toFixed(2) +"公顷";
				break;
				default:
				return (disOrArea).toFixed(2) +"平方米";
			}

		}

	},
		/**
	 * websql接口 查询数据库
	 * @param  object   tmpdatastr 请求参数
	 * @param  {Function} callback  回调函数
	 * @return {[type]}              [description]
	 */
	webSQL: function(tmpdatastr,callback) {
	var datastr=JSON.stringify(tmpdatastr);
	var params={req:datastr};
	var sqlurl="http://"+gEcnu.config.webHostIP+":81/WebSQL";
    try {
        gEcnu.Util.ajax("POST", sqlurl, params, false, function(data) {
        	var jsonparase=JSON.parse(data);
           callback(jsonparase);
        });
    } catch (e) {
        alert("出现异常在：" + e);
    }
   }


});