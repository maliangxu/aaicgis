  /**
   * Marker要素
   * @type {*}
   */
 gEcnu.Marker = gClass.extend({
    init: function (name, info, options) {
      this.name = name;
      this._img = new Image();
      this._img.src = info.src;
      this.src=info.src;
      this._img.style.position = 'absolute';
      this._img.style.zIndex = 100;
      this.info = info;
    },
    onAdd: function (layer) {
      this._layer = layer;
      var map = layer.getMap();
      var container = this._container = layer.getLayerContainer();
      this.x=this.info.x;
      this.y=this.info.y;
      var sxy = gEcnu.Util.worldToScreen(this.info.x, this.info.y);
      this._img.style.left = sxy.x+this.info.offset.x+ 'px';
      this._img.style.top = sxy.y+this.info.offset.y + 'px';
      this._img.style.cursor="pointer";
      container.appendChild(this._img);
    },
    onRemove: function () {
      this._container.removeChild(this._img);
    },
    getContainer: function () {
      return this._img;
    },
    regEvent:function(evt,callback){
          if(evt=="click"){
              var self=this;
              this.getContainer().onmousedown=function(e){   
                  gEcnu.Util.preventDefault(e);
                  gEcnu.Util.stopPropagation(e);  
                  callback.apply(self,arguments);   
              };
              this._img.onmouseup=function(e){
                  gEcnu.Util.preventDefault(e);
                  gEcnu.Util.stopPropagation(e);
              };
              this._img.onclick=function(e){
                  gEcnu.Util.preventDefault(e);
                  gEcnu.Util.stopPropagation(e);
              };
          }else if(evt=="Rclick"){
              var self=this;
              this.getContainer().onmousedown=function(e){
              	//this._img.onmousedown=function(e){
                  gEcnu.Util.preventDefault(e);
                  gEcnu.Util.stopPropagation(e);
                  if(gEcnu.Util.getButton(e)==2){
                  callback.apply(self,arguments);}
              };
              this._img.onmouseup=function(e){
                  gEcnu.Util.preventDefault(e);
                  gEcnu.Util.stopPropagation(e);
              };
              this._img.onclick=function(e){
                  gEcnu.Util.preventDefault(e);
                  gEcnu.Util.stopPropagation(e);
              };
          }
     },
    renew: function () {
      var map = this._layer.getMap();
      var sxy = gEcnu.Util.worldToScreen(this.info.x, this.info.y);
      this._img.style.left = sxy.x +this.info.offset.x+ 'px';
      this._img.style.top = sxy.y +this.info.offset.y+ 'px';
    },
    showInfo: function () {
      console.log("Hello WebGIS");
    }
  });