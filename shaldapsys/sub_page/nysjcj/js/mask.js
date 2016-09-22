;(function ($){

	var default_option = {
		dialogWidth: 700,
		dialogHeight: 400,
		template: '<div></div>'
	};

	var maskDiv = function (options){

		var _opts = $.extend({}, default_option, options);

		this.dialogWidth = _opts.dialogWidth;
		this.dialogHeight = _opts.dialogHeight;

		this.template = _opts.template;

		this.init();
	};	

	maskDiv.prototype.init = function (){
		var self = this;
		var scrollHeight = $(document).height(),//获取文档流的高度
			scrollWidth = $(document).width();

		var clientHeight = $(window).height(),//获取视窗范围的高度
			clientWidth = $(window).width();
	
		var maskDom = $('<div id="maskDiv"></div>').css({
			'position': 'absolute',
			'left': '0',
			'top': '0',
			'width': scrollWidth+'px',
			'height':  scrollHeight+'px',
			'background': '#000',
			'opacity': '0.75',
			'filter': 'alpha(opacity=75)',
			'z-index': '1000'
		});
		$('body').append(maskDom);

		var dialogdiv = $('<div id="dialogdiv"></div>').css({
			'position': 'fixed',
			'width': self.dialogWidth + 'px',
			'height': self.dialogHeight + 'px',
			'left': (clientWidth - self.dialogWidth)/2 + 'px',
			'top': (clientHeight - self.dialogHeight)/2 + 'px',
			'z-index': '1001',
			'background': '#eee'
		});
		dialogdiv.html(self.template);
		$('body').append(dialogdiv);

		this.bindEvent();
	};

	maskDiv.prototype.close = function (){
		$('#maskDiv').remove();
		$('#dialogdiv').remove();
	};

	maskDiv.prototype.bindEvent = function (){
		var self = this;
		$('#maskDiv').click(function (){
			self.close();
		});
	};

	window.maskDiv = maskDiv;

})(jQuery);