var EventUtil={
    /**
    *添加事件绑定函数
    *跨浏览器
    */
    addHander:function(element,type,hander)
    {
       if (element.addEventListener)
       {
       	 element.addEventListener(type,hander,false);
       }else if (element.attachEvent) {
         element.attachEvent("on"+type, hander);
       }else{
        //element.setAttribute("on"+type, hander);
       	 element['on'+type]=hander;
       }
    },
    /**
    *获取事件对象
    *跨浏览器
    */
    getEvent:function(event)
    {
      return event?event:window.event;
    },
    /**
    *获取事件元素对象
    *跨浏览器
    */
    getTarget:function(event)
    {
      return event.target||event.srcElement;
    },
    /**
    *取消元素默认行为
    *跨浏览器，如<a href="" >可以通过在onclick事件中阻止href执行页面跳转的默认行为
    */
    preventDefault:function(event)
    {
      if (event.preventDefault)
        {event.preventDefault();}
      else
      { window.event.returnValue=false;}
    },
    /**
    *移除对象事件
    *跨浏览器
    */
    removeHander:function(element,type,hander)
    {
       if (element.removeEventListener)
       {
       	 element.removeEventListener(type,hander,false);
       }else if (element.detachEvent) {
         element.detachEvent("on"+type, hander);
       }else{
       	element['on'+type]=null;
       }
    },
    /**
    *阻止事件冒泡
    *跨浏览器
    */
    stopPropagation:function(event)
    {
       if (event.stopPropagation)
       {
        event.stopPropagation();
       }else
       {
        window.event.cancelBubble=true;
       }
    },
    /**
    *获取触发事件的键位（左键-0，中键-1，右键-2）
    *跨浏览器
    */
    getButton:function (event)
    {
      if (document.implementation.hasFeature('MouseEvents','2.0'))
      {
        return event.button;
      }
      else
      {
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
    },
    /**
    *获得字符编码
    *在返回的字符编码，可以进一步通过String.fromCharCode()，将其转换成实际的字符显示
    */
    getCharCode:function(event)
    {
      if (typeof event.charCode=="number"){
        return event.charCode;
      }
      else
      {
        return event.keyCode;
      }
    }
};