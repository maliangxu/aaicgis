
/**
*编辑动态图中各图层的样式 2015-3-3 by Lc
*/

gEcnu.DynLayerStyle=gClass.extend({
	init:function (ws,lyrname,style){
		this.ws=ws;
		this.lyrName=lyrname;
	},
	update:function (){

	}
});
/**
*编辑点图层的样式 
*/
//  数据库默认是ecnugis  其他的通过ws: publicdb/mapname
gEcnu.DynLayerStyle.PointStyle=gEcnu.DynLayerStyle.extend({
	init:function (ws,lyrname,style){
		this._super(ws,lyrname);
		this.ptStyle=style;
		this._getmapName();
	},
	_getmapName:function (){
		var ws=this.ws;
		if(ws.indexOf('/')>0){
			this.dbName=ws.split("/")[0];
			this.mapName=ws.split("/")[1];
		}else{
			this.dbName="ecnugis";
			this.mapName=ws;
		}
	},
	//ptstyle {color:,size:} option{success:,fail:}
	update:function (option){
		var self=this;
		var dbname=this.dbName;
		var mapname=this.mapName;
		var lyrname=this.lyrName;
		this.succCallback=option ? option.success : function (){};
		this.failCallback=option ? option.fail : function (){};
		var queryService=new gEcnu.WebSQLServices.SQLServices({'processCompleted':function (data){
			var mapid=data[0]['g_layers.map_id']; 
			var updStyle=self._getNewStyle(data);
			self._exec(mapid,lyrname,updStyle);
        	 },'processFailed':function (){ }});
    	var params={'lyr':'g_layers,g_map','fields':'lyr_style,g_layers.map_id','filter'	:'lyr_name='+"'"+lyrname+"'"+"and g_map.map_id=g_layers.map_id and g_map.map_name="+"'"+mapname+"'"};
    	queryService.processAscyn(gEcnu.ActType.SQLQUERY,dbname,params);
	},
	_getNewStyle:function (data){
		var ptStyle=this.ptStyle;
		var color=ptStyle.color;  // ?? 颜色值需要进一步处理
		var ptSize=ptStyle.size;
		var oldStyle=data[0]['lyr_style'];
		var mapid=data[0]['g_layers.map_id'];
		var arr=oldStyle.split(",");
		var newColor=arr[2];
		var newSize=arr[3];
		if(color!=undefined){
			newColor=this._webColor2dbcolor(color);
		}
		if(ptSize!=undefined){
			newSize=ptSize;
		}
		arr[2]=newColor;
		arr[3]=newSize;
		var updStyle=arr.join(","); 
		return updStyle;
	},
	_exec:function (mapid,lyrname,updStyle){
		var succ=this.succCallback;
		var fail=this.failCallback;
		var dbname=this.dbName;
		var sqlService_upd=new gEcnu.WebSQLServices.SQLServices({'processCompleted':function (msg){ 
 			if(succ!=undefined){
 				succ();
 			}
		},'processFailed':function (){
			if(fail!=undefined){
				fail();
			}
		 }});
		var sql="update g_layers set lyr_style="+"'"+updStyle+"'"+" where map_id="+mapid+" and lyr_name="+"'"+lyrname+"'"; 
        sqlService_upd.processAscyn(gEcnu.ActType.SQLEXEC,dbname,sql);
	},
	//color $0058ff
	_webColor2dbcolor:function (color){
		var rgb=color.substring(1);
		var rr=rgb.substr(0,2);
		var gg=rgb.substr(2,2);
		var bb=rgb.substr(4,2);
		newColor="$00"+bb+gg+rr;   //  clRed形式
		return newColor;
	},
	//针对16进制颜色和字符串颜色（red，green。。。转换）
	_getColor:function (color){

	}
});
/**
*编辑线图层的样式 
*/
gEcnu.DynLayerStyle.LineStyle=gEcnu.DynLayerStyle.extend({
	init:function (ws,lyrname,style){
		this._super(ws,lyrname);
		this.lineStyle=style;
		this._getmapName();
	},
	_getmapName:function (){
		var ws=this.ws;
		if(ws.indexOf('/')>0){
			this.dbName=ws.split("/")[0];
			this.mapName=ws.split("/")[1];
		}else{
			this.dbName="ecnugis";
			this.mapName=ws;
		}
	},
	//linestyle {lineType:,strokeColor:,lineWidth:}
	update:function (option){
		var self=this;
		var dbname=this.dbName;
		var mapname=this.mapName;
		var lyrname=this.lyrName;
		this.succCallback=option ? option.success : function (){};
		this.failCallback=option ? option.fail : function (){};
		var queryService=new gEcnu.WebSQLServices.SQLServices({'processCompleted':function (data){
			var mapid=data[0]['g_layers.map_id']; 
			var updStyle=self._getNewStyle(data); 
			self._exec(mapid,lyrname,updStyle);
        	 },'processFailed':function (){ }});
    	var params={'lyr':'g_layers,g_map','fields':'lyr_style,g_layers.map_id','filter'	:'lyr_name='+"'"+lyrname+"'"+"and g_map.map_id=g_layers.map_id and g_map.map_name="+"'"+mapname+"'"};
    	queryService.processAscyn(gEcnu.ActType.SQLQUERY,dbname,params);
	},
	_getNewStyle:function (data){
		var self=this;
		var lineStyle=this.lineStyle;
		var linetype=lineStyle.lineType;  
		var linecolor=lineStyle.strokeColor;
		var linewidth=lineStyle.lineWidth;
		var oldStyle=data[0]['lyr_style'];
		var mapid=data[0]['g_layers.map_id'];
		var arr=oldStyle.split(",");
		var newType;
		var newColor;
		var newWidth;
		if(linecolor!=undefined){
			newColor=this._webColor2dbcolor(linecolor);
		}else{
			newColor=arr[1];
		}
		newType=(linetype!=undefined) ? linetype : arr[0];
		newWidth=(linewidth!=undefined) ? linewidth : arr[2];

		arr[0]=newType;
		arr[1]=newColor;
		arr[2]=newWidth;
		var updStyle=arr.join(",");  
		return updStyle;
	},
	_exec:function (mapid,lyrname,updStyle){
		var succ=this.succCallback;
		var fail=this.failCallback;
		var dbname=this.dbName;
		var sqlService_upd=new gEcnu.WebSQLServices.SQLServices({'processCompleted':function (msg){
			if(succ!=undefined){
 				succ();
 			}
		},'processFailed':function (){
			if(fail!=undefined){
				fail();
			}
		 }});
		var sql="update g_layers set lyr_style="+"'"+updStyle+"'"+" where map_id="+mapid+" and lyr_name="+"'"+lyrname+"'"; 
        sqlService_upd.processAscyn(gEcnu.ActType.SQLEXEC,dbname,sql);
	},
	//color $0058ff
	_webColor2dbcolor:function (color){
		var rgb=color.substring(1);
		var rr=rgb.substr(0,2);
		var gg=rgb.substr(2,2);
		var bb=rgb.substr(4,2);
		newColor="$00"+bb+gg+rr;
		return newColor;
	},
	//针对16进制颜色和字符串颜色（red，green。。。转换）
	_getColor:function (color){

	}
});
/**
*编辑面图层的样式 
*/
//polystyle {borderType:,strokeColor:,borderWidth:,fillType:,fillColor:}
gEcnu.DynLayerStyle.PolygonStyle=gEcnu.DynLayerStyle.extend({
	init:function (ws,lyrname,style){
		this._super(ws,lyrname);
		this.polyStyle=style;
		this._getmapName();
	},
	_getmapName:function (){
		var ws=this.ws;
		if(ws.indexOf('/')>0){
			this.dbName=ws.split("/")[0];
			this.mapName=ws.split("/")[1];
		}else{
			this.dbName="ecnugis";
			this.mapName=ws;
		}
	},
	update:function (option){
		var self=this;
		var dbname=this.dbName;
		var mapname=this.mapName;
		var lyrname=this.lyrName;
		this.succCallback=option ? option.success : function (){};
		this.failCallback=option ? option.fail : function (){};
		var queryService=new gEcnu.WebSQLServices.SQLServices({'processCompleted':function (data){
			var mapid=data[0]['g_layers.map_id']; 
			var updStyle=self._getNewStyle(data); 
			self._exec(mapid,lyrname,updStyle);
        	 },'processFailed':function (){ }});
    	var params={'lyr':'g_layers,g_map','fields':'lyr_style,g_layers.map_id','filter'	:'lyr_name='+"'"+lyrname+"'"+"and g_map.map_id=g_layers.map_id and g_map.map_name="+"'"+mapname+"'"};
    	queryService.processAscyn(gEcnu.ActType.SQLQUERY,dbname,params);
	},
	_getNewStyle:function (data){
		var self=this;
		var polyStyle=this.polyStyle;
		var borderType=polyStyle.borderType;
		var strokeColor=polyStyle.strokeColor;
		var borderWidth=polyStyle.borderWidth;
		var fillType=polyStyle.fillType;
		var fillColor=polyStyle.fillColor;
		var oldStyle=data[0]['lyr_style'];
		var mapid=data[0]['g_layers.map_id'];
		var arr=oldStyle.split(",");
		var newBorderType,newStrokColor,newBorderWid,newFillType,newFillColor;
		newBorderType=(borderType!=undefined) ? borderType : arr[0];
		newStrokColor=strokeColor ? this._webColor2dbcolor(strokeColor) : arr[1];
		newBorderWid=(borderWidth!=undefined) ? borderWidth : arr[2];
		newFillType=(fillType!=undefined) ? fillType : arr[3]; 
		newFillColor=fillColor ? this._webColor2dbcolor(fillColor) : arr[4];
		arr[0]=newBorderType;
		arr[1]=newStrokColor;
		arr[2]=newBorderWid;
		arr[3]=newFillType;
		arr[4]=newFillColor;
		var updStyle=arr.join(","); 
		return updStyle;
	},
	_exec:function (mapid,lyrname,updStyle){
		var dbname=this.dbName;
		var succ=this.succCallback;
		var fail=this.failCallback;
		var sqlService_upd=new gEcnu.WebSQLServices.SQLServices({'processCompleted':function (msg){ 
			if(succ!=undefined){
 				succ();
 			}
		},'processFailed':function (){
			if(fail!=undefined){
				fail();
			}
		 }});
		var sql="update g_layers set lyr_style="+"'"+updStyle+"'"+" where map_id="+mapid+" and lyr_name="+"'"+lyrname+"'"; 
        sqlService_upd.processAscyn(gEcnu.ActType.SQLEXEC,dbname,sql);
	},
	/**
	*web中的html颜色与数据库中颜色格式之间的转换
	*@param color:#0058ff  
	*/
	_webColor2dbcolor:function (color){
		var rgb=color.substring(1);
		var rr=rgb.substr(0,2);
		var gg=rgb.substr(2,2);
		var bb=rgb.substr(4,2);
		newColor="$00"+bb+gg+rr;
		return newColor;
	},
	/**
	*返回16进制颜色值 六位编码 针对16进制颜色和字符串颜色（#ff0000, #f00,red 三种格式的统一）
	*/
	_get16Color:function (color){

	}
});
