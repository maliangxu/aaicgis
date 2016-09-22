//gEcnu.Feature = {};
gEcnu.Feature = gClass.extend({
  init:function(name){
    this.name = name;
  },
  getVertices: function(){
    
  },
  getBounds: function(){
    
  },
  calcBounds: function(){
    
  }
  
});
/**
   * 点要素
   * @param ID
   * @param x
   * @param y
   * @returns {{}}
   * @constructor
   */
  
  gEcnu.Feature.Point=gEcnu.Feature.extend({
    init:function(gpoints,data){ 
      this._gpoints=gpoints;
      this.shape = {};
      this.shape.shpType=8;//此时暂时定为8,（multiPoints）;1代表单个点
      this.shape.shpBox=gEcnu.Util.getShpBox(gpoints);
      var len_point=gpoints.length;
      this.shape.NumPoints=len_point;
      this.shape.Points=[];
      for(var j=0;j<len_point;j++){
         var opepoint= gpoints[j];
         var tmppoint={"X":opepoint.x,"Y":opepoint.y};
         this.shape.Points.push(tmppoint);
      }
      this.fields ={};
      if((typeof data)=="object"){
        this.fields =data;
      }
    },
    onAdd: function (layer) {
      this._layer = layer;
      this.onDraw(layer);
    },
    onRemove: function (layer) {

    },
    addFields:function(jsonObj){
      for(var mm in jsonObj){
         this.fields[mm]=jsonObj[mm];
      }
    },
    delFields:function(fieldsArr){
      var fieldsArr_len=fieldsArr.length; 
      var tmpfields={};
      for(var i=0;i<fieldsArr_len;i++){
        var tmpfield=fieldsArr[i];
        delete this.fields[tmpfield];  
      }
    },
    delAllFields:function(){
      this.fields={};
    },
    onDraw: function (layer) {
      var ctx = layer.getCtx();
      var _style=layer.style;
      var resetFlag=layer.resetStyle;
      if(typeof (this.style) =="undefined" || resetFlag){
         if(_style instanceof gEcnu.Style_Ex){
            var mapfield=_style.mappingField;
            var fea_fields=this.fields;

            var mapvalue="default";

            for(var key in fea_fields){  
               if(key==mapfield){
                  //mapfield[key];//明天继续做，2014-07-22  丁扬
                  mapvalue=fea_fields[key];
                  break;
               }
            }

            var stylearr=_style.styles;
            var len_style=stylearr.length;
            for(var j=0;j<len_style;j++){
               var tmpstyle=stylearr[j];
               if(tmpstyle.mappingValue==mapvalue){
                 this.style=tmpstyle;
                 continue;
               }         
            }
         }else if(_style instanceof gEcnu.Style){
            this.style=_style;
         }else{
           alert('style样式有问题！');return;
         }
      }
      var opt = gEcnu.Util.setStyle(ctx,this.style);
      var map = layer.getMap();
      var parts_len = this.shape.NumPoints;
      for(var l=0;l<parts_len;l++){
          var tmppoint=this._gpoints[l];
          var sxy = gEcnu.Util.worldToScreen(tmppoint.x,tmppoint.y);
          ctx.beginPath();
          ctx.arc(sxy.x,sxy.y,this.style.cirRadius,0,2*Math.PI);
          ctx.stroke();
          ctx.fill();
      }
    },
    onSelect:function (){
      var points=this._gpoints;
      var map=gSelf;
      if(gEcnu.Edit.selectedPoint!=null){
         gEcnu.Edit.selectedPoint=null;
         map.overLayer.clear();
      }
      var point_style=new gEcnu.Style({cirRadius:6,opacity:1,fillColor:'#00FFFF',strokeColor:'#00FFFF',lineWeight:1});
      map.overLayer.setStyle(point_style);
      var ctx=map.overLayer._ctx;
      gEcnu.Util.setStyle(ctx,point_style);
      gEcnu.Graph.drawPoints_geo(ctx,points);
    },
    /**
     * 获取所在图层
     * @returns {*}
     */
    getLayer: function () {
      return this._layer;
    }
  });
  gEcnu.Feature.Polyline =gEcnu.Feature.extend({
    init:function(lineStrings,data){
      this.shape = {};
      this.shape.shpType=3;//3代表线
      this._lineStrings=lineStrings;
      //this._data=data;
      var linstring_len=lineStrings.length;
      var points=[];
      this.shape.Parts=[];
      for(var j=0;j<linstring_len;j++){
        var tmppoints= lineStrings[j].points;
        var next_value=points.length;
        this.shape.Parts.push(next_value);
        points=points.concat(tmppoints);
      }
      this.shape.shpBox=gEcnu.Util.getShpBox(points);
      var pointslen=points.length;
      this.shape.NumPoints=pointslen;
      this.shape.NumParts=linstring_len;  
      this.shape.Points=[];
      for(var i=0;i<pointslen;i++){
        var tmpPoint=points[i];
        var _tmpPoint={"x":tmpPoint.x,"y":tmpPoint.y};
        this.shape.Points.push(_tmpPoint);
      }
      /*this.fields =[];
      for (k in data) {
        var str={};
        str[k]=data[k];
        this.fields.push(str);
      }*/
      this.fields ={};
      if((typeof data)=="object"){
         for (k in data) {
           this.fields[k]=data[k];
        }
      }
      this._data=this.fields;
    },
    onAdd: function (layer) {
      this._layerID = layer.id;
      this.onDraw(layer);
    },
    onRemove: function (layer) {

    },
    addFields:function(jsonObj){
      for(var mm in jsonObj){
         this.fields[mm]=jsonObj[mm];
      }
    },
    delFields:function(fieldsArr){
      var fieldsArr_len=fieldsArr.length; 
      var tmpfields={};
      for(var i=0;i<fieldsArr_len;i++){
        var tmpfield=fieldsArr[i];
        delete this.fields[tmpfield];  
      }
    },
    delAllFields:function(){
      this.fields={};
    },
    onDraw: function (layer) {
      var ctx = layer.getCtx();
      var _style=layer.style;
      var resetFlag=layer.resetStyle; 
      if(typeof (this.style) =="undefined" || resetFlag){
         if(_style instanceof gEcnu.Style_Ex){
            var mapfield=_style.mappingField;
            var fea_fields=this.fields;

            var mapvalue="default";

               for(var key in fea_fields){  
                  if(key==mapfield){
                     //mapfield[key];//明天继续做，2014-07-22  丁扬
                     mapvalue=fea_fields[key];
                     break;
                  }
               }

            var stylearr=_style.styles;
            var len_style=stylearr.length;
            var ifexit=false;
            for(var j=0;j<len_style;j++){
               var tmpstyle=stylearr[j];
               if(tmpstyle.mappingValue==mapvalue){
                 this.style=tmpstyle;
                 ifexit=true;
                 continue;
               }         
            }
            if(!ifexit){
              var defaultStyle=new gEcnu.Style({});
              this.style=defaultStyle;
            }
         }else if(_style instanceof gEcnu.Style){
            this.style=_style;
         }else{
           alert('style样式有问题！');return;
         }
      }
      var opt = gEcnu.Util.setStyle(ctx,this.style);
      var map = layer.getMap();
      var parts_len = this.shape.NumParts;
      for(var l=0;l<parts_len;l++){
          var tmplineStr=this._lineStrings[l];
          var len=tmplineStr.points.length;
          if (len >= 2) {
            ctx.beginPath();
            var sxy = gEcnu.Util.worldToScreen(tmplineStr.points[0].x, tmplineStr.points[0].y);
            ctx.moveTo(sxy.x, sxy.y); //设置起点
            for (var i = 1; i < len; i++) {
              sxy = gEcnu.Util.worldToScreen(tmplineStr.points[i].x, tmplineStr.points[i].y);
              ctx.lineTo(sxy.x, sxy.y);
            }
            //ctx.closePath();
          }
          ctx.stroke();
      }
    },
    onSelect:function(){
      var len=this._lineStrings.length;
      var map=gSelf;
      map.overLayer.clear();
      for(var j=0;j<len;j++){
          var points=this._lineStrings[j].points;
          //进行端点与边界的重绘操作
          var line_point_style=new gEcnu.Style({cirRadius:3,opacity:1,fillColor:'#118811',strokeColor:'#118811',lineWeight:1});
          map.overLayer.setStyle(line_point_style);
          var ctx=map.overLayer._ctx;
          gEcnu.Util.setStyle(ctx,line_point_style);
          gEcnu.Graph.drawPoints_geo(ctx,points);
  
          var line_style=new gEcnu.Style({ opacity:1,fillColor:'red',strokeColor:'red',lineWeight:1});
          map.overLayer.setStyle(line_style);
          var ctx=map.overLayer._ctx;
          gEcnu.Util.setStyle(ctx,line_style);
          gEcnu.Graph.drawLines_geo(ctx,points);
        }
    },
    onSelect_ex:function(){
      var len=this._lineStrings.length;
      var map=gSelf;
      if(gEcnu.Edit.selectedLine!=null)
      {
         gEcnu.Edit.selectedLine=null;
         map.overLayer.clear();
      }
      for(var j=0;j<len;j++){
          var points=this._lineStrings[j].points;
          //进行端点与边界的重绘操作
          var ctx=map.overLayer._ctx;
          var line_style=new gEcnu.Style({ opacity:1,fillColor:'red',strokeColor:'red',lineWeight:1});
          map.overLayer.setStyle(line_style);
          var ctx=map.overLayer._ctx;
          gEcnu.Util.setStyle(ctx,line_style);
          gEcnu.Graph.drawLines_geo(ctx,points);
        }
    },
    /**
     * 获取所在图层
     * @returns {*}
     */
    getLayer: function () {
      return this._layerID;
    }
  });
  gEcnu.Feature.Polygon =gEcnu.Feature.extend({
    init:function(lineRings,data){
      this.shape = {};
      this.shape.shpType=5;//3代表面
      this._lineRings=lineRings;
      //this._data=data;
      var linering_len=lineRings.length;
      var points=[];
      this.shape.Parts=[];
      for(var j=0;j<linering_len;j++){
        var tmppoints= lineRings[j].points;
        var next_value=points.length;
        this.shape.Parts.push(next_value);
        points=points.concat(tmppoints);
      }
      this.shape.shpBox=gEcnu.Util.getShpBox(points);
      var pointslen=points.length;
      this.shape.NumPoints=pointslen;
      this.shape.NumParts=linering_len;  
      this.shape.Points=[];
      for(var i=0;i<pointslen;i++){
        var tmpPoint=points[i];
        var _tmpPoint={"x":tmpPoint.x,"y":tmpPoint.y};
        this.shape.Points.push(_tmpPoint);
      }
      this.fields ={};
      if((typeof data)=="object"){
           for (k in data) {
           this.fields[k]=data[k];
        }
      }
      this._data=this.fields;
      /*for (k in data) {
        var str={};
        str[k]=data[k];
        this.fields.push(str);
      }*/
    },
    onAdd: function (layer) {
      this._layerID = layer.id;
      this.onDraw(layer);
    },
    onRemove: function (layer) {

    },
    addFields:function(jsonObj){
      for(var mm in jsonObj){
         this.fields[mm]=jsonObj[mm];
      }
    },
    delFields:function(fieldsArr){
      var fieldsArr_len=fieldsArr.length; 
      var tmpfields={};
      for(var i=0;i<fieldsArr_len;i++){
        var tmpfield=fieldsArr[i];
        delete this.fields[tmpfield];  
      }
    },
    delAllFields:function(){
      this.fields={};
    },
    onDraw: function (layer) {   
      var ctx = layer.getCtx();
      var _style=layer.style; 
      var resetFlag=layer.resetStyle; 
      if(typeof (this.style) =="undefined" || resetFlag){  //重设样式
         if(_style instanceof gEcnu.Style_Ex){
            var mapfield=_style.mappingField;
            var fea_fields=this.fields;
            var mapvalue="default";
            for(var key in fea_fields){  
               if(key==mapfield){
                  //mapfield[key];//明天继续做，2014-07-22  丁扬
                  mapvalue=fea_fields[key];
                  break;
               }
            }

            var stylearr=_style.styles;
            var len_style=stylearr.length;
            for(var j=0;j<len_style;j++){
               var tmpstyle=stylearr[j];
               if(tmpstyle.mappingValue==mapvalue){
                 this.style=tmpstyle;
                 continue;
               }         
            }
         }else if(_style instanceof gEcnu.Style){   
            this.style=_style; 
         }else{
           alert('style样式有问题！');return;
         }
      }
    
      var opt = gEcnu.Util.setStyle(ctx,this.style);
      
      var map = layer.getMap();
      var parts_len = this.shape.NumParts;
      ctx.globalAlpha = 1;
      for(var l=0;l<parts_len;l++){
          var tmplineRin=this._lineRings[l];
          var len=tmplineRin.points.length;
          if (len >= 2) {
            ctx.beginPath();
            var sxy = gEcnu.Util.worldToScreen(tmplineRin.points[0].x, tmplineRin.points[0].y);
            ctx.moveTo(sxy.x, sxy.y); //设置起点
            for (var i = 1; i < len; i++) {
              sxy = gEcnu.Util.worldToScreen(tmplineRin.points[i].x, tmplineRin.points[i].y);
              ctx.lineTo(sxy.x, sxy.y);
            }
            ctx.closePath();
          }
          ctx.stroke();
          if(layer._opacity){
             ctx.globalAlpha=0.1;
          }else{
            ctx.globalAlpha=opt.opacity;
		      }
          ctx.fill();
          if(layer._autoLabel){ //自动标注
            ctx.globalAlpha = 1;
            var filltext="null";
            var tmpfield=this.fields;
            if((typeof layer._labelFieldMapping)=="undefined"){
             
                 //此时的标注只是针对字段进行标注
                 if((typeof tmpfield[layer._labelField])!="undefined"){
                   filltext=tmpfield[layer._labelField];
                 }
      
            }else{
                 //此时需要做映射字段的标注
                 if((typeof tmpfield[layer._labelField])!="undefined"){
                   var tmpfilltext=tmpfield[layer._labelField];
                   if((typeof layer._labelFieldMapping[tmpfilltext])!="undefined"){
                     filltext=layer._labelFieldMapping[tmpfilltext]; //找到映射标注
                   }
                 }
            }
            var pointx=(this.shape.shpBox[0]+this.shape.shpBox[2])/2;
            var pointy=(this.shape.shpBox[1]+this.shape.shpBox[3])/2;
            var scrcxy=gEcnu.Util.worldToScreen(pointx,pointy);
            ctx.font = '11px serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(filltext,scrcxy.x-20,scrcxy.y);//IE不支持
          }
      }
    },
    onSelect:function(){
      var len=this._lineRings.length;
      var map=gSelf;
      map.overLayer.clear();
      for(var j=0;j<len;j++){
          var points=this._lineRings[j].points;
          //进行端点与边界的重绘操作
          var line_point_style=new gEcnu.Style({cirRadius:3,opacity:1,fillColor:'#82D900',strokeColor:'#82D900',lineWeight:1});
          map.overLayer.setStyle(line_point_style);
          var ctx=map.overLayer._ctx;
          gEcnu.Util.setStyle(ctx,line_point_style);
          gEcnu.Graph.drawPoints_geo(ctx,points);
  
          var line_style=new gEcnu.Style({ opacity:1,fillColor:'red',strokeColor:'red',lineWeight:1});
          map.overLayer.setStyle(line_style);
          var ctx=map.overLayer._ctx;
          gEcnu.Util.setStyle(ctx,line_style);
          gEcnu.Graph.drawLines_geo(ctx,points);
        }
    },
    onSelect_ex:function(){  
      var len=this._lineRings.length;
      var map=gSelf;
      if(gEcnu.Edit.selectedPolygon!=null)
      {
         gEcnu.Edit.selectedPolygon=null;
         map.overLayer.clear();
      }
      for(var j=0;j<len;j++){
          var points=this._lineRings[j].points;
          //进行端点与边界的重绘操作
          var ctx=map.overLayer._ctx;
          var line_style=new gEcnu.Style({ opacity:1,fillColor:'red',strokeColor:'red',lineWeight:1});
          map.overLayer.setStyle(line_style);
          var ctx=map.overLayer._ctx;
          gEcnu.Util.setStyle(ctx,line_style);
          gEcnu.Graph.drawLines_geo(ctx,points);
        }
    },
    /**
     * 获取所在图层
     * @returns {*}
     */
    getLayer: function () {
      return this._layerID;
    },
    getGeometrys:function(){
    	return this._lineRings;
    },

    pointInFeature:function(geometry_point){
      var len=this._lineRings.length;
      for(var j=0;j<len;j++){
        var tmppoints=this._lineRings[j].points;
        if (gEcnu.Graph.pointInPoly(geometry_point, tmppoints)) {
           return true;
        }
      }
      return false;
    }    
  });
  