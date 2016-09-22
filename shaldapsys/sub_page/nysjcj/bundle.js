/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./nysjcj/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(23);
	__webpack_require__(6);
	__webpack_require__(26);
	__webpack_require__(13);
	__webpack_require__(29);
	__webpack_require__(32);
	__webpack_require__(35);
	__webpack_require__(7);
	__webpack_require__(39);
	__webpack_require__(8);
	__webpack_require__(42);
	__webpack_require__(14);
	__webpack_require__(11);
	module.exports = __webpack_require__(12);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	__webpack_require__(2);

	var _storage = __webpack_require__(6);

	var _map = __webpack_require__(7);

	var _map2 = _interopRequireDefault(_map);

	var _aaicQuery = __webpack_require__(13);

	var _aaicQuery2 = _interopRequireDefault(_aaicQuery);

	var _data = __webpack_require__(14);

	var _data2 = _interopRequireDefault(_data);

	var _Eventful = __webpack_require__(11);

	var _Eventful2 = _interopRequireDefault(_Eventful);

	var _util = __webpack_require__(12);

	var _util2 = _interopRequireDefault(_util);

	/*获取人员任务分配--PHP*/
	(function getDistsNumHttp() {
		var usrid = sessionStorage.getItem("usrID");
		var _ref = [];
		var _ref$0 = _ref[0];
		var mytasks = _ref$0 === undefined ? [] : _ref$0;
		var _ref$1 = _ref[1];
		var mytasks_sta = _ref$1 === undefined ? [] : _ref$1;
		var method = "GetTaskByUsr";
		var url = "serv/Action.php";

		var params = { method: method, UsrID: usrid };
		$.ajax({ url: url, type: 'GET', data: params, dataType: 'json', async: false }).then(function (remsg) {
			mytasks = remsg.dataget;
			if (mytasks.length > 0) {
				_storage.tasks[0] = mytasks[0];
				sessionStorage.setItem('mytasks', JSON.stringify(mytasks));
			}
			mytasks_sta = remsg.datasta;
			if (mytasks_sta.length > 0) {
				sessionStorage.setItem('mytasks_sta', JSON.stringify(mytasks_sta));
			}
		}, function (err) {
			console.error(JSON.stringify(err));
		});
	})();

	/*初始化地图模块*/
	(function initMap() {
		_map2['default'].init();
		_map2['default'].initTask();
	})();

	/*初始化用地类型数据*/
	(function initLandtype() {
		_data2['default'].initLandtype().then(function () {
			_map2['default'].initFeatureLayer();
			judgeExitData();
		}, function (err) {
			_util2['default'].alertDiv('查询用地类型数据失败！');
		});
	})();

	/*初始化图层控制*/
	(function initLegends() {
		_data2['default'].initLegends()['catch'](function (err) {
			_util2['default'].alertDiv('查询历史、现状、规划图层失败！');
		});
	})();

	/*初始化保单列表,标的地址*/
	(function initList() {
		var connect = _aaicQuery2['default'].createConnect();
		var usrid = sessionStorage.getItem("usrName");
		connect.fuzzyQuery(usrid, function (json) {
			if (json.length > 0) {
				var bdArr = json[0].bdArr;
				if (bdArr.length > 0) {
					_map2['default'].goToInitTown(bdArr[0].bdxq['X'], bdArr[0].bdxq['Y']);
				} else {
					_map2['default'].goToTaskTown();
				}
				_Eventful2['default'].dispatch('refreshList', json);
			} else {
				_map2['default'].goToTaskTown();
			}
		});
	})();

	/*判断是否存在未保存数据*/
	function judgeExitData() {
		var client = localStorage['gmPolygon'];
		var server = localStorage['gmPolygon_SER'];
		if (client || server) {
			/*存在未保存数据，提示用户保存数据*/
			_util2['default'].confirmDiv('存在未保存数据，是否进行保存？', '提示确认', '保存', '取消', function () {
				/*调用保存函数*/
				_map2['default'].submitData();
			}, function () {
				/*清除localstorage*/
				localStorage.removeItem('gmPolygon');
				localStorage.removeItem('gmPolygon_SER');
			}, false);
		}
	}

	/*加载疑问注记*/
	/*(function loadHelpMarkers() {
		Data.getHelpMarkers().then(markers => {
			Map.storeHelpMarkers.concat(markers);
			markers.forEach(marker => {
				marker.regEvent('Rclick', function() {
	    			Map.map.mLayer.removeMarker(this);
	    			Map.removerMarkFromDB([this]);
				});
				Map.map.mLayer.addMarker(marker);
			});
		}).catch(err => {
			toolUtil.alertDiv('页面载入时，加载疑问标注出现问题！');
		});
	}());*/

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./index.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "body {\r\n    margin: 0;\r\n    padding: 0;\r\n    overflow-x: hidden;\r\n    overflow-y: hidden;\r\n    font: 12px/20px \"Microsoft Yahei\", \"\\5FAE\\8F6F\\96C5\\9ED1\", \"SimSun\", \"\\5B8B\\4F53\", \"Arial Narrow\", HELVETICA\r\n}\r\n\r\n#maindiv {\r\n    position: absolute;\r\n    width: 100%;\r\n    height: 100%;\r\n    margin: 0;\r\n}\r\n\r\n#titleMenuDiv {\r\n    position: absolute;\r\n    left: 350px;\r\n    right: 0;\r\n    top: 0px;\r\n    height: 35px;\r\n    background: rgba(245, 245, 245, .96);\r\n    z-index: 998;\r\n}", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	"use strict";

	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "css-base.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports['default'] = Storage = {
		config: {
			dbName: 'ecnugis',
			sysdbName: 'shapgis_aaic',
			policyTab: 'policy',
			bdTab: 'biaodi',
			landRelTab: 'landRel',
			landTab: 'landtype',
			countyTab: 'countyinfo',
			county_townTab: 'county_town',
			villageTab: 'villageinfo',
			landkind: 'landkind_nong',
			lyrlegend: 'layerlengend',
			errTab: 'errorinfo',
			townFtsetId: 199,
			countyFtsetId: 200,
			landtypeFtsetId: 198,
			pansrc: 'img/cursorimg/openhand.bmp',
			editsrc: 'img/cursorimg/edit.png',
			addptsrc: 'img/cursorimg/addpoint.png',
			delptsrc: 'img/cursorimg/editdel.png',
			propsrc: 'img/cursorimg/prop.png',
			errsrc: 'img/editPoly/shp_err.png',
			infosrc: 'img/cursorimg/INFOqry.png',
			edityear: '2014'
		},
		tasks: [],
		landVariable: {
			en_Name2cn_Name: {}, /*形如{'grass':'草地', 'forest':'林地'...}*/
			cn_Name2en_Name: {}, /*形如{'草地':'grass', '林地':'forest'...}*/
			en_Name2checked: {}, /*形如{'grass':true, 'woodland':true}*/
			en_Name2MarkURL: {},
			en_NameLandFilColor: {},
			en_NameLandBorColor: {}
		},
		landLegend: {
			hislegends: "",
			nowlegends: "",
			planlegends: ""
		},
		centCounties: ['徐汇区', '长宁区', '静安区', '普陀区', '闸北区', '虹口区', '杨浦区'],
		landRelFields: ['FID', 'BDID', 'CODING', 'XMIN', 'YMIN', 'XMAX', 'YMAX', 'SHPLEN', 'SHPAREA', 'LANDTYPE', 'LANDTYPE_C', 'LANDNUM'],
		imageYear: [{ title: '2014', src: 'img/choose.png' }, { title: '2013', src: '' }, { title: '2012', src: '' }],
		dataEdit: [{ title: '选择地块', src: 'img/editor/select.png' }, { title: '删除地块', src: 'img/editor/delete.png' }, { title: '添加节点', src: 'img/editor/addpoint.png' }, { title: '删除节点', src: 'img/editor/delpoint.png' }, { title: '修改属性', src: 'img/editor/text.png' }, { title: '撤销', src: 'img/editor/undo.png' }, { title: '保存', src: 'img/editor/save.png' }],
		toolbar: [{ title: '平移', src: 'img/check/move.png' }, { title: '距离', src: 'img/check/distance.png' }, { title: '面积', src: 'img/check/area.png' }, { title: '定位', src: 'img/check/location.png' }, { title: '复位', src: 'img/check/fuwei.png' }, { title: '图查', src: 'img/check/info.png' }],
		propFix: [{ title: '区县', disabled: true, ref: 'county', value: '' }, { title: '乡镇', disabled: true, ref: 'town', value: '' }, { title: '村庄', disabled: false, ref: 'village', value: '' }, { title: '作物', disabled: false, ref: 'crop', value: '' }],
		propShow: [{ title: '区县', value: '' }, { title: '乡镇', value: '' }, { title: '村庄', value: '' }, { title: '用地', value: '' }, { title: '作物', value: '' }, { title: '面积', value: '' }, { title: '编码', value: '' }, { title: '年份', value: '' }],
		dialogRender: {
			POLICY: [{ title: '任务编号', field: 'CODING', type: 'text', disabled: true, value: '', forbidden: true }, { title: '投保人', field: 'POLICYHOLDER', type: 'text', disabled: false, value: '' }, { title: '证件类型', field: 'LICENSECLASS', type: 'select', disabled: false, value: '身份证', option: [{ value: '身份证' }, { value: '学生证' }, { value: '出生证' }] }, { title: '证件号码', field: 'LICENSENUM', type: 'text', disabled: false, value: '' }, { title: '被保险人', field: 'RECEIPTOR', type: 'text', disabled: false, value: '' }, { title: '联系电话', field: 'PHONE', type: 'text', disabled: false, value: '' }, { title: '联系地址', field: 'ADDRESS', type: 'text', disabled: false, value: '' }, { title: '险种名称', field: 'SECURENAME', type: 'text', disabled: false, value: '' }, { title: '起保日期', field: 'START', type: 'text', disabled: false, value: '' }, { title: '终保日期', field: 'END', type: 'text', disabled: false, value: '' }],
			BD: [{ title: '保单编号', field: 'CODING', type: 'text', disabled: true, value: '', forbidden: true }, { title: '标的名称', field: 'BDNAME', type: 'text', disabled: false, value: '' }, { title: '品种名称', field: 'PZNAME', type: 'select', disabled: false, value: '粮田', option: [{ value: '粮田' }, { value: '菜田' }, { value: '经济果林' }, { value: '花卉用地' }, { value: '苗木用地' }, { value: '生态林地' }, { value: '养殖水面' }, { value: '畜禽养殖' }] }, { title: '省', field: 'PROVINCE', type: 'text', disabled: true, value: '上海市', forbidden: true }, { title: '市', field: 'CITY', type: 'text', disabled: true, value: '上海市', forbidden: true }, { title: '区', field: 'COUNTY', type: 'select', disabled: false, value: '', option: [] }, { title: '镇', field: 'TOWN', type: 'select', disabled: false, value: '', option: [] }, { title: '村', field: 'VILLAGE', type: 'select', disabled: false, value: '', option: [] }, { title: '邮编', field: 'POSTCODE', type: 'text', disabled: false, value: '' }, { title: '地址', field: 'ADDRESS', type: 'text', disabled: false, value: '' }]
		}
	};
	module.exports = exports['default'];

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "storage.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _storage = __webpack_require__(6);

	var _maploc = __webpack_require__(8);

	var _maploc2 = _interopRequireDefault(_maploc);

	var _Eventful = __webpack_require__(11);

	var _Eventful2 = _interopRequireDefault(_Eventful);

	var _util = __webpack_require__(12);

	var _util2 = _interopRequireDefault(_util);

	var _aaicQuery = __webpack_require__(13);

	var _aaicQuery2 = _interopRequireDefault(_aaicQuery);

	var _data = __webpack_require__(14);

	var _data2 = _interopRequireDefault(_data);

	var webFeature = _aaicQuery2['default'].createWebFeature();
	var getVectorTimeOut = undefined;

	exports['default'] = Map = {

	    init: function init() {
	        ReactDOM.render(React.createElement(_maploc2['default'], null), document.getElementById('map'));
	        var map = this.map = new gEcnu.Map('map');
	        map.setRulerUnit({ disUnit: '米', areaUnit: '亩' });
	        map.setCursorStyle('pan', _storage.config.pansrc);
	        map.events.on('mousemove', function (e, pos) {
	            _Eventful2['default'].dispatch('showPosition', pos.geoX, pos.geoY);
	        });
	        this.exceptFIDArr = []; /*列表中排除掉的FID数组*/
	        this.curListBdArr = []; /*当前列表所有标的ID*/
	        this.addFeatureID = 0; /*添加的地块ID*/
	        this.LANDTYPE = 'unclear'; /*当前用地类型*/
	        this.tmpAddFeature = null; /*此处的作用为刚绘制完多边形回调使用*/
	        this.serverFeaturesUpdate = []; /*{'feature':,'mType':}*/
	        this.addFeatures = []; /*用于保存刚绘制的但是未保存到服务器的多边形要素{'LANDNUM':,'VILLAGE':'','CROP':'','LANDTYPE':,'ID'}*/
	        this.storeCheckLands = []; /*用于保存标注的标注点，每一个是json对象{'x':geoPoint.x,'y':geoPoint.y,'landtype':tmplandtype,'marker':marker}*/
	        this.storeHelpMarkers = []; /*这个变量用于保存疑问红色标注*/
	        this.curWindowFeatures = []; /*用于保存视窗范围内所有features{'LANDNUM':,'VILLAGE':'','CROP':'','LANDTYPE':,'ID'},{'LANDNUM':,'VILLAGE':'','CROP':'','LANDTYPE':,'FID'}*/
	        this.selectedFeature = undefined; /*保存选中的要素*/
	        this.serverOrCurrent = ""; /*标示选中的多边形是来自服务器还是当前绘制的多边形SERVER  CURRENT*/
	        this.ifreshape = false; /*区别选择编辑多边形还是只是单纯选择多边形不做reshap操作*/
	        this.selectAim = ""; /*选取要素的目的(前提ifreshape==false)*/
	        this.ifShpMark = ""; /*判断操作是否为图形标注还是属性标注*/
	        this.curWindowInsureFeas = []; /*用于保存视窗范围内所有被保险features*/
	        this.locMarker = undefined; /*保存定位过的标注*/
	        this.clientOrServ = []; /*保存客户端/服务器端数据*/
	        this.curImg = '2014'; /*当前影像年份*/
	        this.ifInSubmitProgress = false; /*提交数据至服务器进程中*/
	        this.ctrol = {
	            dyndisplay: false,
	            /*默认情况下不显示基础图层*/
	            hisdatadisplay: false,
	            /*默认情况下不显示历史图层*/
	            plandatadisplay: false,
	            /*默认情况下不显示规划图层*/
	            tiandisplay: false,
	            /*默认情况下不显示天地图图层*/
	            drawcatchable: true,
	            /*默认情况下绘制多边形是打开捕捉功能的*/
	            planlyropen: false /*默认情况下规划图层不显示*/
	        };
	        var scaleControl = new gEcnu.Control.Scale('scale');
	        var zoombarControl = new gEcnu.Control.Zoom('zoombar', { top: 30, right: 15 });

	        this.land_Featurelayer = {};
	        this.drawPolygon = {};
	        this.editPolygon = {};
	        scaleControl.setScalePos({ right: 0, bottom: 0 });
	        var options = { 'opacity': 1.0 };
	        var Lightstyle = new gEcnu.Style({ opacity: 0.5, strokeColor: 'red', lineWeight: 2 });
	        var Lightstyle_qry = new gEcnu.Style({ opacity: 0.5, strokeColor: 'red', lineWeight: 1 });
	        var Planstyle = new gEcnu.Style({ opacity: 0, strokeColor: 'red', lineWeight: 2 });
	        var Instyle = new gEcnu.Style({ opacity: 0.5, fillColor: '', strokeColor: 'red', lineWeight: 4 });

	        this.tileLayer_2012 = new gEcnu.Layer.Tile('tilelayer2012', 'shImg2013a', options);
	        this.tileLayer_2013 = new gEcnu.Layer.Tile('tilelayer2013', 'shImg2012a', options);
	        this.tileLayer_2014 = new gEcnu.Layer.Tile('tilelayer2014', 'shimg2014a', options, 1, 10);
	        this.otherMapLayer = new gEcnu.Layer.Other('tiandi', 'tianditu', options);
	        this.dLayer = new gEcnu.Layer.Dyn(_storage.config.dbName + '/1', 'dyn', 'empty', options);
	        this.dLayer_base = new gEcnu.Layer.Dyn(_storage.config.dbName + '/10', 'dyn2014', '', options);
	        this.hightLightLayer = new gEcnu.Layer.Feature('highlightlyr', Lightstyle, options);
	        this.hightLightLayer_qry = new gEcnu.Layer.Feature('highlightlyr_qry', Lightstyle_qry, options);
	        this.plan_feature_layer = new gEcnu.Layer.Feature('planlyr_feature', Planstyle, options, { 'autoLabel': false, 'lableField': 'INTRO' });
	        this.insure_Featurelayer = new gEcnu.Layer.Feature('insurelyr_feature', Instyle, options);
	        this.marker_obj = new gEcnu.DrawFeature.Marker();
	        this.marker_obj.events.on('added', this.addMarker_completed.bind(this));
	        map.addLayer(this.tileLayer_2012);
	        map.addLayer(this.tileLayer_2013);
	        map.addLayer(this.tileLayer_2014);
	        map.addLayer(this.dLayer);
	        map.addLayer(this.hightLightLayer);
	        map.addLayer(this.plan_feature_layer);
	        map.addLayer(this.insure_Featurelayer);
	        map.addControl(scaleControl);
	        map.addControl(zoombarControl);
	        this.tileLayer_2012.hide();
	        this.tileLayer_2013.hide();
	    },

	    initTask: function initTask() {
	        this.distname = '';
	        this.ifCountyTask = false;
	        if (_storage.tasks.length > 0) {
	            var task = _storage.tasks[0];
	            this.distname = task.distName;
	            if (task.preDistName == "上海市") {
	                this.ifCountyTask = true;
	            }
	        } else {
	            _util2['default'].alertDiv('不存在检查乡镇');
	            parent.document.getElementById("subpageframe").src = "sub_page/menupage/menu.html";
	        }
	        //this.goToTaskTown(); //THIS 4 aaicgis
	    },

	    initFeatureLayer: function initFeatureLayer() {
	        var alllandstyles = [];
	        for (var kk in _storage.landVariable.en_NameLandFilColor) {
	            var tmpfillcolor = _storage.landVariable.en_NameLandFilColor[kk];
	            var tmpbordercolor = _storage.landVariable.en_NameLandBorColor[kk];
	            var landkind_style = new gEcnu.Style({ cirRadius: 5, opacity: 0.5, fillColor: tmpfillcolor, strokeColor: tmpbordercolor, lineWeight: 1, mappingValue: kk });
	            alllandstyles.push(landkind_style);
	        }
	        var options = { 'opacity': 1.0 };
	        var style_ex_lands = new gEcnu.Style_Ex(alllandstyles, 'LANDTYPE');
	        this.land_Featurelayer = new gEcnu.Layer.Feature('polygonland', style_ex_lands, options, { 'autoLabel': false, 'lableField': 'LANDTYPE', 'Mapping': _storage.landVariable.en_Name2cn_Name });
	        this.map.addLayer(this.land_Featurelayer);
	        this.land_Featurelayer.activeLabel();
	        this.drawPolygon = new gEcnu.DrawFeature.Polygon(this.land_Featurelayer, true);
	        this.drawPolygon.events.on('added', this.addpolygon_completed.bind(this));
	        this.editPolygon = new gEcnu.EditFeature.Polygon(this.land_Featurelayer, true);
	        this.editPolygon.events.on('selected', this.selectpolygon_completed.bind(this));
	        this.editPolygon.events.on('updateCompleted', this.updatepolygon_completed.bind(this));
	        /*添加事件监听，当地图范围发生变化时触发*/
	        this.map.events.on('boundsChanged', this.boundsChanged.bind(this));
	    },

	    addpolygon_completed: function addpolygon_completed(e, linerRing) {
	        var _this = this;

	        this.addFeatureID++;
	        var fea_polygon = new gEcnu.Feature.Polygon([linerRing], { 'LANDTYPE': this.LANDTYPE, 'ID': this.addFeatureID, 'SHPAREA': linerRing.getArea(), 'YEARNUM': _storage.config.edityear });
	        this.tmpAddFeature = fea_polygon;
	        this.land_Featurelayer.addFeature(fea_polygon);
	        var centerPoint = this._centerPoint = linerRing.getCenterPoint();
	        /*然后根据这个中心点与镇街道面做一个请求得到区县、乡镇信息*/
	        var params = {
	            geometry: centerPoint,
	            lyrType: gEcnu.layerType.GeoDB,
	            map: _storage.config.dbName,
	            lyr: _storage.config.townFtsetId,
	            tolerance: 1000,
	            shapeFlag_bool: false,
	            returnFields: 'NAME,COUNTY'
	        };
	        _util2['default'].featureQuery(params, function (results) {
	            _this._handlerTownQuery(results);
	        }, function (err) {
	            _util2['default'].alertDiv('查询多边形所在区县、乡镇失败！');
	        });
	    },

	    _handlerTownQuery: function _handlerTownQuery(results) {
	        var _this2 = this;

	        var self = this;
	        if (results.length > 0) {
	            var towninfo = results[0];
	            if (this.ifCountyTask) {
	                if (this.distname != "上海市") {
	                    var _curdist = towninfo.COUNTY;
	                }
	            } else {
	                var _curdist2 = towninfo.NAME;
	            }
	            if (curdist != this.distname && this.distname != "上海市") {
	                /*此时需要进行该地块的取消，因为不属于任务区域*/
	                var allAddFeas = this.land_Featurelayer.getAllFeatures();
	                var lastAddFea = allAddFeas[allAddFeas.length - 1];
	                this.land_Featurelayer.removeFeature(lastAddFea);
	                _util2['default'].alertDiv('请进入‘' + curdist + "’进行数据采集！");
	                this.setPanMode();
	                return;
	            }
	            /*此时进行编码请求*/
	            this.tmpAddFeature.addFields({ 'COUNTY': towninfo.COUNTY, 'TOWN': towninfo.NAME });
	            var Geocoding = new gEcnu.WebGeoCoding({
	                'processCompleted': function processCompleted(results) {
	                    var code = results.code;
	                    self._handlerGeocoding(code);
	                },
	                'processFailed': function processFailed(err) {
	                    _util2['default'].alertDiv('编码失败！');
	                    self._handlerGeocoding(-1);
	                }
	            });
	            Geocoding.geoCoding(this.tmpAddFeature);
	        } else {
	            /*然后根据这个中心点与镇街道面做一个请求得到区县、乡镇信息*/
	            var params = {
	                geometry: this._centerPoint,
	                lyrType: gEcnu.layerType.GeoDB,
	                map: _storage.config.dbName,
	                lyr: _storage.config.countyFtsetId,
	                tolerance: 1000,
	                shapeFlag_bool: false,
	                returnFields: '区县名称'
	            };
	            _util2['default'].featureQuery(params, function (results) {
	                _this2._handlerCountyQuery(results);
	            }, function (err) {
	                _util2['default'].alertDiv('查询多边形所在区县失败！');
	            });
	        }
	    },

	    _handlerCountyQuery: function _handlerCountyQuery(results) {
	        var self = this;
	        var countyname = '上海市';
	        var townname = '无数据';

	        if (results.length > 0) {
	            countyname = results[0]['区县名称'];
	        }
	        this.tmpAddFeature.addFields({ 'COUNTY': countyname, 'TOWN': townname });
	        /*此时进行编码请求*/
	        var Geocoding = new gEcnu.WebGeoCoding({
	            'processCompleted': function processCompleted(results) {
	                var code = results.code;
	                self._handlerGeocoding(code);
	            },
	            'processFailed': function processFailed(err) {
	                _util2['default'].alertDiv('编码失败！');
	                self._handlerGeocoding(-1);
	            }
	        });
	        Geocoding.geoCoding(this.tmpAddFeature);
	    },

	    _handlerGeocoding: function _handlerGeocoding(landnum) {
	        this.tmpAddFeature.addFields({ 'LANDNUM': landnum, 'VILLAGE': '', 'CROP': '', 'YEARNUM': _storage.config.edityear });
	        this.addFeatures.push(this.tmpAddFeature);
	        this.curWindowFeatures.push(this.tmpAddFeature);
	        /*存入到localstorage[gmPolygon]*/
	        this.savePtArr('polygon', { 'feature': this.tmpAddFeature, 'ID': this.tmpAddFeature.fields.ID, 'mType': 'ADD' });
	    },

	    selectpolygon_completed: function selectpolygon_completed(e, selectedfeas) {
	        var _this3 = this;

	        if (selectedfeas.length > 0) {
	            this.selectedFeature = selectedfeas[0];
	            if (typeof this.selectedFeature.fields.ID == "undefined") {
	                this.serverOrCurrent = "SERVER";
	            } else {
	                this.serverOrCurrent = "CURRENT";
	            }
	            if (!this.ifreshape) {
	                switch (this.selectAim) {
	                    case "prochange":
	                        var props_fix = this._getFixProps(this.selectedFeature);
	                        _Eventful2['default'].dispatch('propFix_display', props_fix);
	                        break;
	                    case "prodis":
	                        var props_dis = this._getDispProps(this.selectedFeature);
	                        _Eventful2['default'].dispatch('propShow_display', props_dis);
	                        break;
	                    case "addLand":
	                        if (!this.isInInsureFeas(this.selectedFeature)) {
	                            _Eventful2['default'].dispatch('insertLand', this.selectedFeature);
	                        } else {
	                            _util2['default'].newalertDiv('地块已被承保！');
	                        }
	                        break;
	                    case "landSearch":
	                        var centpt = this.selectedFeature._lineRings[0].getCenterPoint();
	                        var point = new gEcnu.Geometry.Point(parseFloat(centpt.x), parseFloat(centpt.y));
	                        var fid = this.selectedFeature._data.FID;
	                        webFeature.QueryByGeometry(point, function (json) {
	                            if (json.length > 0) {
	                                _Eventful2['default'].dispatch('refreshList', json, fid);
	                            }
	                        });
	                        break;
	                }
	            }
	        } else {
	            if (!this.ifreshape) {
	                if (this.selectAim == "prodis") {
	                    /*说明进行的是属性信息查看，此时需要进行SearchAt查询*/
	                    var mxy = gEcnu.Util.getMouseXY(this.map.getContainer(), e);
	                    var wxy = gEcnu.Util.screenToWorld(mxy.x, mxy.y);
	                    var _point = new gEcnu.Geometry.Point(wxy.x, wxy.y);
	                    var params = {
	                        geometry: _point,
	                        lyrType: gEcnu.layerType.GeoDB,
	                        map: _storage.config.dbName,
	                        lyr: _storage.config.landtypeFtsetId,
	                        tolerance: 1000,
	                        shapeFlag_bool: true,
	                        returnFields: 'COUNTY,TOWN,VILLAGE,LANDTYPE,CROP,SHPAREA,LANDNUM,YEARNUM'
	                    };
	                    _util2['default'].featureQuery(params, function (results) {
	                        var results_len = results.length;
	                        if (results_len > 0) {
	                            var tmpfea = results[0];
	                            _this3.hightLightLayer_qry.removeAllFeatures();
	                            tmpfea.highLight(_this3.hightLightLayer_qry, {}, { isFill: false });
	                            var props = _this3._getDispProps(tmpfea);
	                            _Eventful2['default'].dispatch('propShow_display', props);
	                        }
	                    });
	                }
	            }
	        }
	    },

	    updatepolygon_completed: function updatepolygon_completed(e, updatefeature) {
	        var self = this;
	        this._tmpUpdate = updatefeature;
	        /*重新对要素进行编码*/
	        var Geocoding = new gEcnu.WebGeoCoding({
	            'processCompleted': function processCompleted(results) {
	                var code = results.code;
	                self._handlerGeocoding_up(code);
	            },
	            'processFailed': function processFailed(err) {
	                _util2['default'].alertDiv('进行重新编码失败！');
	                var code = -1;
	                self._handlerGeocoding_up(code);
	            }
	        });
	        Geocoding.geoCoding(updatefeature);
	    },

	    _handlerGeocoding_up: function _handlerGeocoding_up(landnum) {
	        var selectedfea = this.selectedFeature;
	        var updatefeature = this._tmpUpdate;
	        var updatefeature_area = updatefeature.getGeometrys()[0].getArea();
	        updatefeature.addFields({ 'LANDNUM': landnum });
	        updatefeature.addFields({ 'SHPAREA': updatefeature_area });
	        if (this.serverOrCurrent == "SERVER") {
	            this.addFeatureToSevrArr({ 'feature': updatefeature, 'mType': 'UPDATE' });
	            this.curWindowFeatures = this.updateFeaturesInArr(selectedfea, updatefeature, this.curWindowFeatures);
	            this.savePtArr('serpolygon', { 'feature': updatefeature, 'FID': updatefeature.fields.FID, 'mType': 'UPDATE' });
	        } else if (this.serverOrCurrent == "CURRENT") {
	            this.addFeatures = this.updateFeaturesInArr(selectedfea, updatefeature, this.addFeatures);
	            this.curWindowFeatures = this.updateFeaturesInArr(selectedfea, updatefeature, this.curWindowFeatures);
	            this.savePtArr('polygon', { 'feature': updatefeature, 'ID': updatefeature.fields.ID, 'mType': 'UPDATE' });
	        }
	        this.selectedFeature = updatefeature;
	    },

	    boundsChanged: function boundsChanged() {
	        var zl = this.map.getZoom().zl;
	        this.curWindowFeatures = []; /*清空一下视窗范围内数组*/
	        if (zl == 1) {
	            var pre_zl = this.map.getPreZl();
	            if (pre_zl == 2 || pre_zl == 0) {
	                var alllands = _storage.landVariable.en_Name2checked;
	                var dynlyrs = "";
	                for (var kk in alllands) {
	                    dynlyrs = dynlyrs + kk + ",";
	                }
	                this.dLayer.removeLyr(dynlyrs);
	            }
	            if (getVectorTimeOut) {
	                clearTimeout(getVectorTimeOut);
	            }
	            getVectorTimeOut = setTimeout(this.getVectorLandData.bind(this), 250);
	        } else {
	            var pre_zl = this.map.getPreZl();
	            this.land_Featurelayer.removeAllFeatures();
	            if (pre_zl == 1) {
	                var alllands = _storage.landVariable.en_Name2checked;
	                var dynlyrs = "";
	                for (var kk in alllands) {
	                    dynlyrs = dynlyrs + kk + ",";
	                }
	                this.dLayer.addLyr(dynlyrs);
	            }
	        }
	        /*获取用户当前所在位置,在标题栏中显示*/
	        var mapcenter_ = this.map.getCenter();
	        var centerPoint_ = new gEcnu.Geometry.Point(mapcenter_.x, mapcenter_.y);
	        var params = {
	            geometry: centerPoint_,
	            lyrType: gEcnu.layerType.GeoDB,
	            map: _storage.config.dbName,
	            lyr: _storage.config.townFtsetId,
	            tolerance: 1000,
	            shapeFlag_bool: false,
	            returnFields: 'NAME,COUNTY'
	        };
	        _util2['default'].featureQuery(params, function (results) {
	            var towninfo = results[0];
	            if (towninfo && typeof towninfo.NAME != "undefined") {
	                var townname = towninfo.NAME;
	                var countyname = towninfo.COUNTY;
	                parent.document.getElementById('curPositionDiv').innerHTML = "当前位置：" + countyname + "-" + townname;
	            }
	        }, function (err) {
	            _util2['default'].alertDiv('查询当前位置区县、乡镇失败！');
	        });
	    },

	    savePtArr: function savePtArr(type, featureObj) {
	        var tmpfea = featureObj;
	        var tmpArr = [];
	        switch (type) {
	            case 'polygon':
	                var tmpStr = localStorage['gmPolygon'];
	                if (tmpStr) {
	                    tmpArr = JSON.parse(tmpStr);
	                }
	                var len = tmpArr.length;
	                for (var i = len - 1; i >= 0; i--) {
	                    if (tmpfea.ID == tmpArr[i].ID) {
	                        tmpArr.splice(i, 1);
	                    }
	                }
	                if (tmpfea.mType == "DELETE") {
	                    this.upClientOrServArr('CLIENT', tmpfea.ID, true);
	                    if (tmpArr.length == 0) {
	                        /*删除该gmPolygon,item*/
	                        localStorage.removeItem('gmPolygon');
	                        return;
	                    }
	                    var _jsonText = JSON.stringify(tmpArr, "\t");
	                    localStorage['gmPolygon'] = _jsonText;
	                    return;
	                }
	                this.upClientOrServArr('CLIENT', tmpfea.ID, false);
	                var tmpfeature = tmpfea.feature;
	                var tmplinerRings = tmpfeature.getGeometrys();
	                var tmpfields = tmpfeature.fields;
	                var newFields = {};
	                for (var kk in tmpfields) {
	                    if (kk != "ID" && kk != "SHPAREA") {
	                        newFields[kk] = tmpfields[kk];
	                    }
	                }
	                var newJsonObj = { 'linerRings': tmplinerRings, 'fields': newFields, 'ID': tmpfea.ID };
	                tmpArr.push(newJsonObj);
	                var jsonText = JSON.stringify(tmpArr, "\t");
	                localStorage['gmPolygon'] = jsonText;
	                break;
	            case 'serpolygon':
	                var tmpStr_ser = localStorage['gmPolygon_SER'];
	                if (tmpStr_ser) {
	                    tmpArr = JSON.parse(tmpStr_ser);
	                }
	                var leng = tmpArr.length;
	                for (var i = leng - 1; i >= 0; i--) {
	                    if (tmpfea.FID == tmpArr[i].FID) {
	                        tmpArr.splice(i, 1);
	                    }
	                }
	                this.upClientOrServArr('SERVER', tmpfea.FID, false);
	                var tmpfeature_ser = tmpfea.feature;
	                var tmplinerRings_ser = tmpfeature_ser.getGeometrys();
	                var tmpfields_ser = tmpfeature_ser.fields;
	                var newFields_ser = {};
	                for (var kk in tmpfields_ser) {
	                    if (kk != "ID" && kk != "SHPAREA") {
	                        newFields_ser[kk] = tmpfields_ser[kk];
	                    }
	                }
	                var newJsonObj_ser = { 'linerRings': tmplinerRings_ser, 'fields': newFields_ser, 'FID': tmpfea.FID, 'mType': tmpfea.mType };
	                tmpArr.push(newJsonObj_ser);
	                var jsonText_ser = JSON.stringify(tmpArr, "\t");
	                localStorage['gmPolygon_SER'] = jsonText_ser;
	                break;
	        }
	    },

	    upClientOrServArr: function upClientOrServArr(_type, idNum, bDelete) {
	        var clientOrServ_len = this.clientOrServ.length;
	        for (var i = 0; i < this.clientOrServ_len; i++) {
	            var tmpObj = this.clientOrServ[i];
	            if (tmpObj.type == _type && tmpObj.id == idNum) {
	                this.clientOrServ.splice(i, 1);
	                break;
	            }
	        }
	        if (bDelete) return;
	        var _tmpObj = { type: _type, id: idNum };
	        this.clientOrServ.push(_tmpObj);
	    },

	    savePtArr_revoke: function savePtArr_revoke(type) {
	        var tmpArr = [];
	        switch (type) {
	            case 'polygon':
	                var tmpStr = localStorage['gmPolygon'];
	                if (tmpStr) {
	                    tmpArr = JSON.parse(tmpStr);
	                }
	                var len = tmpArr.length;
	                if (len == 0) {
	                    return false;
	                } else {
	                    tmpArr.pop();
	                }
	                if (tmpArr.length == 0) {
	                    localStorage.removeItem('gmPolygon');
	                }
	                this.addFeatures.pop();
	                var jsonText = JSON.stringify(tmpArr, "\t");
	                localStorage['gmPolygon'] = jsonText;
	                return true;
	                break;
	            case 'serpolygon':
	                var tmpStr_ser = localStorage['gmPolygon_SER'];
	                if (tmpStr_ser) {
	                    tmpArr = JSON.parse(tmpStr_ser);
	                }
	                var leng = tmpArr.length;
	                if (leng == 0) {
	                    return false;
	                } else {
	                    tmpArr.pop();
	                }
	                if (tmpArr.length == 0) {
	                    localStorage.removeItem('gmPolygon_SER');
	                }
	                this.serverFeaturesUpdate.pop();
	                var jsonText_ser = JSON.stringify(tmpArr, "\t");
	                localStorage['gmPolygon_SER'] = jsonText_ser;
	                return true;
	                break;
	        }
	    },

	    submitData: function submitData() {
	        if (this.ifInSubmitProgress) {
	            /*说明进入数据保存状态,应该返回*/
	            return;
	        }
	        this.ifInSubmitProgress = true;
	        /*首先需要对属性标注进行判断*/
	        var markers = this.storeCheckLands;
	        var marker_len = markers.length;
	        /*{'x':geoPoint.x,'y':geoPoint.y,'landtype':tmplandtype,'marker':marker}*/
	        var gmpolygons = this.getgmPolygons();
	        var addFeatures_len = gmpolygons.length;
	        var gmSerPolygons = this.getgmSerPolygons();
	        var updatefeas = gmSerPolygons[0];
	        var delfeas = gmSerPolygons[1];
	        var updateFeatures_len = updatefeas.length;
	        var allfeasInwindow = this.curWindowFeatures;
	        var allfeasInwindow_len = allfeasInwindow.length;
	        for (var i = 0; i < marker_len; i++) {
	            var tmpMarkerObj = markers[i];
	            var markerpoint = new gEcnu.Geometry.Point(tmpMarkerObj.x, tmpMarkerObj.y);
	            var ifAddfea = false;
	            var ifother = false;
	            for (var jj = 0; jj < addFeatures_len; jj++) {
	                /*首先判断是否落在addfeatures中*/
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
	                        updatefeas = this.addUpdateFeaToArr(updateFea_, updatefeas);
	                        break;
	                    }
	                }
	            }
	        }
	        /*然后执行构造批量修改参数+提交服务器*/
	        this.saveDataToser(gmpolygons, updatefeas, delfeas);
	    },

	    saveDataToser: function saveDataToser(addfeas, updatefeas, delfeas) {
	        var sqltaskparams = [];
	        var addsqltask = new gEcnu.WebFeatureServices.SQLTasks(gEcnu.ActType.ADD, gEcnu.layerType.GeoDB, _storage.config.landTab, addfeas);
	        var addParams = addsqltask.taskParams;
	        if (addfeas.length > 0) {
	            sqltaskparams.push(addParams);
	        }
	        var updatesqltask = new gEcnu.WebFeatureServices.SQLTasks(gEcnu.ActType.UPDATE, gEcnu.layerType.GeoDB, _storage.config.landTab, updatefeas);
	        var updateParams = updatesqltask.taskParams;
	        if (updatefeas.length > 0) {
	            sqltaskparams.push(updateParams);
	        }
	        var len_delfeas = delfeas.length;
	        var delsql = "";
	        for (var nn = 0; nn < len_delfeas; nn++) {
	            delsql = delsql + "FID=" + delfeas[nn];
	            if (nn < len_delfeas - 1) {
	                delsql = delsql + " or ";
	            }
	        }
	        var delsqltask = new gEcnu.WebFeatureServices.SQLTasks(gEcnu.ActType.DELETE, gEcnu.layerType.GeoDB, _storage.config.landTab, delsql);
	        var delParams = delsqltask.taskParams;
	        if (delsql != "") {
	            sqltaskparams.push(delParams);
	        }
	        /*执行请求服务器进行更新*/
	        var sqltaskFeaServices = new gEcnu.WebFeatureServices.FeatureServices({
	            'processCompleted': this._handlerSubmitData.bind(this),
	            'processFailed': function processFailed() {
	                _util2['default'].alertDiv('提交数据至服务器失败！');
	            }
	        });
	        sqltaskFeaServices.processAscyn(gEcnu.ActType.SQLTask, gEcnu.layerType.GeoDB, _storage.config.dbName, sqltaskparams);
	    },

	    _handlerSubmitData: function _handlerSubmitData() {
	        this.ifInSubmitProgress = false;
	        var allshpmarkers = this.storeCheckLands;
	        var mar_len = allshpmarkers.length;
	        for (var i = 0; i < mar_len; i++) {
	            this.map.mLayer.removeMarker(allshpmarkers[i].marker);
	        }
	        _Eventful2['default'].dispatch('showTipwin', '已保存');
	        this.LANDTYPE = 'unclear';
	        this.tmpAddFeature = null;
	        this.serverFeaturesUpdate = [];
	        this.addFeatures = [];
	        this.storeCheckLands = [];
	        this.curWindowFeatures = [];
	        this.selectedFeature = undefined;
	        this.serverOrCurrent = "";
	        this.clientOrServ = [];
	        this.setPanMode();
	        localStorage.removeItem('gmPolygon');
	        localStorage.removeItem('gmPolygon_SER');
	        this.getVectorLandData();
	    },

	    getgmPolygons: function getgmPolygons() {
	        /*{'linerRings':tmplinerRings,'fields':newFields,'ID':tmpfea.ID}*/
	        var tmpStr = localStorage['gmPolygon'];
	        var tmpArr = [];
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
	    },

	    getgmSerPolygons: function getgmSerPolygons() {
	        /*{'linerRings':tmplinerRings,'fields':newFields,'FID':tmpfea.FID,'mType':tmpfea.mType}*/
	        var tmpStr = localStorage['gmPolygon_SER'];
	        var tmpArr = [];
	        var returnFeas = [[], []]; /*第一个是update要素,第二个是delete要素*/
	        if (tmpStr) {
	            tmpArr = JSON.parse(tmpStr);
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
	    },

	    setPanMode: function setPanMode() {
	        this.map.setMode('map');
	        this.map.setMapTool('pan');
	        this.editPolygon.deactivate();
	        this.map.setCursorStyle('pan', _storage.config.pansrc);
	    },

	    setLandtype: function setLandtype(landtype) {
	        this.LANDTYPE = landtype;
	    },

	    setSelectMode: function setSelectMode() {
	        var zl = this.map.getZoom().zl;
	        if (zl != 1) {
	            _util2['default'].alertDiv('请在影像最高级别下进行编辑、修改！');
	            return;
	        }
	        this.editPolygon.activate(true);
	        this.ifreshape = true;
	        this.map.setCursorStyle('select', _storage.config.editsrc);
	    },

	    _getFixProps: function _getFixProps(feature) {
	        var mapping = {
	            COUNTY: 'county',
	            TOWN: 'town',
	            VILLAGE: 'village',
	            CROP: 'crop'
	        };
	        var fields = feature.fields;

	        var prop = {};
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = Object.keys(fields)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var key = _step.value;

	                mapping[key] && (prop[mapping[key]] = fields[key]);
	            }
	        } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion && _iterator['return']) {
	                    _iterator['return']();
	                }
	            } finally {
	                if (_didIteratorError) {
	                    throw _iteratorError;
	                }
	            }
	        }

	        return prop;
	    },

	    _getDispProps: function _getDispProps(feature) {
	        //TODO 4 shalugis(ALTER)
	        var mapping = {
	            COUNTY: '区县',
	            TOWN: '乡镇',
	            VILLAGE: '村庄',
	            LANDTYPE: '用地',
	            SHPAREA: '面积',
	            CROP: '作物',
	            LANDNUM: '编码',
	            YEARNUM: '年份'
	        };
	        var fields = feature.fields;
	        var shape = feature.shape;

	        var shpbox = shape.shpBox;
	        var propArr = [];
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = Object.keys(fields)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                key === 'SHPAREA' && (fields[key] = _util2['default'].changeTwoDecimal(fields[key] * 0.0015) + "亩");
	                key === 'LANDTYPE' && (fields[key] = _storage.landVariable.en_Name2cn_Name[fields[key]]);
	                mapping[key] && propArr.push({ key: mapping[key], value: fields[key] });
	            }
	        } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                    _iterator2['return']();
	                }
	            } finally {
	                if (_didIteratorError2) {
	                    throw _iteratorError2;
	                }
	            }
	        }

	        return propArr;
	    },

	    revoke: function revoke() {
	        var clientOrServ_len = this.clientOrServ.length;
	        if (clientOrServ_len == 0) {
	            _util2['default'].alertDiv('不存在撤销数据！');
	            return;
	        }
	        var lastEle = this.clientOrServ[clientOrServ_len - 1];
	        if (lastEle.type == "SERVER") {
	            this.savePtArr_revoke('serpolygon');
	        } else if (lastEle.type == "CLIENT") {
	            this.savePtArr_revoke('polygon');
	        }
	        this.clientOrServ.pop();
	        //重新进行绘制
	        this.getVectorLandData();
	    },

	    getVectorLandData: function getVectorLandData() {
	        var _this4 = this;

	        var mapbounds = this.map.getBounds();
	        var nwPoint = new gEcnu.Geometry.Point(mapbounds.nw.x, mapbounds.nw.y);
	        var nePoint = new gEcnu.Geometry.Point(mapbounds.ne.x, mapbounds.ne.y);
	        var swPoint = new gEcnu.Geometry.Point(mapbounds.sw.x, mapbounds.sw.y);
	        var sePoint = new gEcnu.Geometry.Point(mapbounds.se.x, mapbounds.se.y);
	        var boundsPoints = [nwPoint, nePoint, sePoint, swPoint];
	        var rect_geometry = new gEcnu.Geometry.RectRing(boundsPoints);
	        var params = {
	            geometry: rect_geometry,
	            lyrType: gEcnu.layerType.GeoDB,
	            map: _storage.config.dbName,
	            lyr: _storage.config.landtypeFtsetId,
	            tolerance: 1000,
	            shapeFlag_bool: true,
	            returnFields: 'XMIN,YMIN,XMAX,YMAX,SHPLEN,SHPAREA,COUNTY,TOWN,SHPAREA,LANDNUM,VILLAGE,CROP,LANDTYPE,LANDTYPE_C,YEARNUM,LANDNUM'
	        };
	        _util2['default'].featureQuery(params, function (results) {
	            _this4._handlerVectorLand(results);
	        }, function (err) {
	            _util2['default'].alertDiv('获取视窗范围内矢量要素失败！');
	        });
	    },

	    _handlerVectorLand: function _handlerVectorLand(resultFeatures) {
	        var _this5 = this;

	        _data2['default'].getInsureFID().then(function (fidObj) {
	            //THIS 4 aaicgis(ALTER)
	            var zl = _this5.map.getZoom().zl;
	            if (zl != 1) {
	                /*取消绘制,直接返回*/
	                return;
	            }
	            if (_this5.land_Featurelayer) {
	                _this5.land_Featurelayer.removeAllFeatures();
	                _this5.insure_Featurelayer.removeAllFeatures();
	            }
	            _this5.curWindowInsureFeas = [];
	            var tmpserverFeas = _this5.serverFeaturesUpdate;
	            var len_tmpserverFeas = tmpserverFeas.length;
	            var tmpResFeas = [];
	            var len_resultFeatures = resultFeatures.length;
	            for (var kk = 0; kk < len_resultFeatures; kk++) {
	                var tmpfea_ope = resultFeatures[kk];
	                var ifaddTo = true;
	                for (var mm = 0; mm < len_tmpserverFeas; mm++) {
	                    var tmpmmfea_ope = tmpserverFeas[mm];
	                    if (tmpfea_ope.fields.FID == tmpmmfea_ope.feature.fields.FID) {
	                        if (tmpmmfea_ope.mType == "UPDATE") {
	                            /*更新的要素*/
	                            tmpfea_ope = tmpmmfea_ope.feature;
	                        } else if (tmpmmfea_ope.mType == "DELETE") {
	                            /*删除的要素*/
	                            ifaddTo = false;
	                        }
	                        break;
	                    }
	                }
	                if (ifaddTo) {
	                    if (_this5.ifCountyTask) {
	                        /*说明是区县或者全市*/
	                        if (_this5.distname == "上海市") {
	                            /*说明是全市*/
	                            tmpResFeas.push(tmpfea_ope);
	                        } else {
	                            /*说明是区县*/
	                            if (tmpfea_ope.fields.COUNTY == _this5.distname) {
	                                tmpResFeas.push(tmpfea_ope);
	                            }
	                        }
	                    } else {
	                        /*说明是乡镇*/
	                        if (tmpfea_ope.fields.TOWN == _this5.distname) {
	                            tmpResFeas.push(tmpfea_ope);
	                        }
	                    }
	                }
	            }
	            var len_feas = tmpResFeas.length;
	            var tmpchecked = _storage.landVariable.en_Name2checked;

	            for (var ii = 0; ii < len_feas; ii++) {
	                var tmpfea_land = tmpResFeas[ii];
	                var tmpfea_land_type = tmpfea_land.fields.LANDTYPE;
	                if (tmpchecked[tmpfea_land_type]) {
	                    _this5.land_Featurelayer.addFeature(tmpfea_land);
	                    var fields = tmpfea_land.fields;
	                    if (typeof fidObj[fields.FID] == 'object') {
	                        //THIS 4 aaicgis
	                        _this5.curWindowInsureFeas.push(tmpfea_land);
	                        tmpfea_land.addFields({ 'BDID': fidObj[fields.FID].BDID, 'CODING': fidObj[fields.FID].CODING });
	                        if (_util2['default'].isInArr(fields.BDID, _this5.curListBdArr) && !_util2['default'].isInArr(fields.FID, _this5.exceptFIDArr)) {
	                            _this5.insure_Featurelayer.addFeature(tmpfea_land);
	                        }
	                    }
	                }
	            }
	            var alladdfeas = _this5.addFeatures;
	            var len_feas_add = alladdfeas.length;
	            for (var jj = 0; jj < len_feas_add; jj++) {
	                var tmpfea_land_ = alladdfeas[jj];
	                var tmpfea_land_type_ = tmpfea_land_.fields.LANDTYPE;
	                if (tmpchecked[tmpfea_land_type_]) {
	                    _this5.land_Featurelayer.addFeature(tmpfea_land_);
	                }
	            }
	            _this5.curWindowFeatures = tmpResFeas.concat(_this5.addFeatures);
	        });
	    },

	    goToTaskTown: function goToTaskTown() {
	        var myidno = sessionStorage.getItem('usrID');
	        var myposition = _util2['default'].getcookie(myidno);
	        if (_storage.tasks.length > 0) {
	            var _ref = [];
	            var centerx = _ref[0];
	            var centery = _ref[1];

	            if (myposition == "") {
	                centerx = _storage.tasks[0].distX;
	                centery = _storage.tasks[0].distY;
	                centerx = -7713.196422; //hard CODE for aaicgis
	                centery = 48070.68522;
	            } else {
	                var centerxy = myposition.split('_');
	                centerx = centerxy[0];
	                centery = centerxy[1];
	            }
	            this.goToInitTown(centerx, centery);
	            //this.hightLightTown(centerx, centery);
	        }
	    },

	    goToInitTown: function goToInitTown(centerx, centery) {
	        sessionStorage.setItem('curX', centerx);
	        sessionStorage.setItem('curY', centery);
	        this.map.zoomTo(parseFloat(centerx), parseFloat(centery), { 'zl': 1 });
	    },

	    delFeature: function delFeature(selectedfea) {
	        if (!this.ifreshape) return;
	        if (this.serverOrCurrent == "SERVER") {
	            this.addFeatureToSevrArr({ 'feature': this.selectedFeature, 'mType': 'DELETE' });
	            this.curWindowFeatures = this.delFeaturesInArr(selectedfea, this.curWindowFeatures);
	            this.savePtArr('serpolygon', { 'feature': selectedfea, 'FID': selectedfea.fields.FID, 'mType': 'DELETE' });
	            this.selectedFeature = undefined;
	            this.serverOrCurrent = "";
	        } else if (this.serverOrCurrent == "CURRENT") {
	            /*首先需要删除addFeatures中的feature*/
	            this.addFeatures = this.delFeaturesInArr(selectedfea, this.addFeatures);
	            /*其次需要删除curWindowFeatures中的feature*/
	            this.curWindowFeatures = this.delFeaturesInArr(selectedfea, this.curWindowFeatures);
	            /*从localstorage中删除*/
	            this.savePtArr('polygon', { 'feature': selectedfea, 'ID': selectedfea.fields.ID, 'mType': 'DELETE' });
	            this.selectedFeature = undefined;
	            this.serverOrCurrent = "";
	        }
	        /*将命令切换至选择状态*/
	        this.setSelectMode();
	    },

	    addFeatureToSevrArr: function addFeatureToSevrArr(serObj) {
	        //TODO UTIL--too low
	        var tmpfeatures = this.serverFeaturesUpdate;
	        var len_feas = tmpfeatures.length;
	        for (var i = 0; i < len_feas; i++) {
	            var tmpfe = tmpfeatures[i];
	            if (tmpfe.feature.fields.FID == serObj.feature.fields.FID) {
	                this.serverFeaturesUpdate.splice(i, 1);
	                break;
	            }
	        }
	        this.serverFeaturesUpdate.push(serObj);
	    },

	    delFeaturesInArr: function delFeaturesInArr(fea, feasArr) {
	        //TODO UTIL--too low
	        var len_feasArr = feasArr.length;
	        for (var i = len_feasArr - 1; i >= 0; i--) {
	            if (feasArr[i] == fea) {
	                feasArr.splice(i, 1);
	                break;
	            }
	        }
	        return feasArr;
	    },

	    updateFeaturesInArr: function updateFeaturesInArr(oldfea, newfea, feasArr) {
	        //TODO UTIL--too low
	        var len_feasArr = feasArr.length;
	        for (var i = len_feasArr - 1; i >= 0; i--) {
	            if (feasArr[i] == oldfea) {
	                feasArr.splice(i, 1, newfea);
	                break;
	            }
	        }
	        return feasArr;
	    },

	    addUpdateFeaToArr: function addUpdateFeaToArr(upfea, fesarr) {
	        //TODO UTIL--too low
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
	    },

	    isInInsureFeas: function isInInsureFeas(feat) {
	        return this.curWindowInsureFeas.some(function (fea) {
	            return fea === feat;
	        });
	    },

	    addMarker_completed: function addMarker_completed(e, geoPoint) {
	        var _this6 = this;

	        var options = { 'opacity': 1.0 };
	        var x = geoPoint.x;
	        var y = geoPoint.y;

	        if (this.ifShpMark == "propmark") {
	            var tmplandtype = this.LANDTYPE;
	            var src = _storage.landVariable.en_Name2MarkURL[tmplandtype];
	            var marker = new gEcnu.Marker('marker', {
	                'x': x,
	                'y': y,
	                'description': '',
	                'src': src,
	                'offset': { x: -16, y: -32 }
	            }, options);
	            var checkjson = { 'x': x, 'y': y, 'landtype': tmplandtype, 'marker': marker };
	            this.storeCheckLands.push(checkjson);
	            marker.regEvent('Rclick', this.removeMarker.bind(marker));
	            this.map.mLayer.addMarker(marker);
	        } else if (this.ifShpMark == "shpmark") {
	            (function () {
	                /*红色标注图形标注*/
	                var marker = new gEcnu.Marker('marker', {
	                    'x': x,
	                    'y': y,
	                    'description': '',
	                    'src': _storage.config.errsrc,
	                    'offset': { x: -12, y: -24 }
	                }, options);
	                marker.regEvent('Rclick', function () {
	                    _this6.map.mLayer.removeMarker(marker);
	                    _this6.removerMarkFromDB([marker]);
	                });
	                _this6.storeHelpMarkers.push(marker);
	                //此时需要将标注读入到数据库
	                var addmarker = { 'x': parseInt(x, 10), 'y': parseInt(y, 10), 'error': 'marker_shp', 'town': _this6.distname };
	                _this6.readToDB_errorinfo(addmarker);
	                _this6.map.mLayer.addMarker(marker);
	            })();
	        }
	    },

	    removerMarkFromDB: function removerMarkFromDB(markers) {
	        var len_markers = markers.length;
	        var fidSQL = "";
	        var allhelpmarkers = this.storeHelpMarkers;
	        var allhelpmarkers_len = allhelpmarkers.length;
	        for (var i = 0; i < len_markers; i++) {
	            var marker = markers[i];
	            for (var jj = 0; jj < allhelpmarkers_len; jj++) {
	                if (marker == allhelpmarkers[jj]) {
	                    allhelpmarkers.splice(jj, 1);
	                    break;
	                }
	            }
	            var x = marker.x;
	            var y = marker.y;

	            var markerID = x + "_" + y;
	            fidSQL = fidSQL + "'" + markerID + "'";
	            if (i < len_markers - 1) {
	                fidSQL = fidSQL + " or FID=";
	            }
	        }
	        /*在数据库中griddown中对应增加该网格编号*/
	        var gridServices = new gEcnu.WebSQLServices.SQLServices();
	        var SQL = "delete from " + _storage.config.errTab + "where FID=" + fidSQL;
	        gridServices.processAscyn(gEcnu.ActType.SQLEXEC, _storage.config.dbName, SQL);
	    },

	    readToDB_errorinfo: function readToDB_errorinfo(addmarker) {
	        var addfid = addmarker.x + "_" + addmarker.y;
	        var shpmarkADDServices = new gEcnu.WebSQLServices.SQLServices();
	        shpmarkADDServices.processAscyn(gEcnu.ActType.ADD, _storage.config.dbName, _storage.config.errTab, {
	            'Fields': ['FID', 'X', 'Y', 'ERROR', 'TOWN'],
	            'Data': [[addfid, addmarker.x, addmarker.y, addmarker.error, addmarker.town]]
	        });
	    },

	    addMaker: function addMaker(centerx, centery) {
	        var marker = this.locMarker;
	        if (marker) {
	            this.map.mLayer.removeMarker(marker);
	        }
	        marker = this.locMarker = new gEcnu.Marker('marker', {
	            'x': centerx,
	            'y': centery,
	            'description': '',
	            'src': 'img/3.png',
	            'offset': {
	                x: -16,
	                y: -32
	            }
	        }, { 'opacity': 1.0 });
	        marker.regEvent('Rclick', this.removeMarker.bind(marker));
	        this.map.mLayer.addMarker(marker);
	    },

	    removeMarker: function removeMarker() {
	        this.map.mLayer.removeMarker(this);
	        //此时还需要从storeCheckLands删除标注信息
	        var len = this.storeCheckLands.length;
	        for (var j = 0; j < len; j++) {
	            var tmpstoreCheckLand = this.storeCheckLands[j];
	            if (tmpstoreCheckLand.x == this.x && tmpstoreCheckLand.y == this.y) {
	                this.storeCheckLands.splice(j, 1);
	                break;
	            }
	        }
	    },

	    hightLightTown: function hightLightTown(centerx, centery) {
	        var _this7 = this;

	        var geopoint = new gEcnu.Geometry.Point(centerx, centery);
	        var params = {
	            geometry: geopoint,
	            lyrType: gEcnu.layerType.GeoDB,
	            map: _storage.config.dbName,
	            lyr: _storage.config.townFtsetId,
	            tolerance: '100',
	            shapeFlag_bool: true,
	            returnFields: ''
	        };
	        _util2['default'].featureQuery(params, function (resultFea) {
	            _this7.hightLightLayer.removeAllFeatures();
	            for (var i = 0, len = resultFea.length; i < len; i++) {
	                resultFea[i].highLight(_this7.hightLightLayer, { isTwinkle: true, twinkleCount: 2, twinkleInterval: 1000 }, { isFill: false });
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
	                    _this7.map.zoomTo(cx, cy, { zoom: zoom });
	                }
	            }
	        });
	    },

	    changeImgage: function changeImgage(year) {
	        this.curImg = year;
	        this.tileLayer_2012.hide();
	        this.tileLayer_2013.hide();
	        this.tileLayer_2014.hide();
	        switch (year) {
	            case '2012':
	                this.tileLayer_2012.show();
	                break;
	            case '2013':
	                this.tileLayer_2013.show();
	                break;
	            case '2014':
	                this.tileLayer_2014.show();
	                break;
	        }
	    },

	    tianToggle: function tianToggle() {
	        if (!this.ctrol.tiandisplay) {
	            this.map.addLayer(this.otherMapLayer);
	            this.tileLayer_2012.hide();
	            this.tileLayer_2013.hide();
	            this.tileLayer_2014.hide();
	            this.ctrol.tiandisplay = true;
	        } else {
	            var zl = this.map.getZoom().zl;
	            if (zl > 7 || zl < 1) {
	                _util2['default'].alertDiv('当前级别不存在影像，请缩放至指定级别！');
	                return;
	            }
	            this.map.removeLayer(this.otherMapLayer);
	            switch (this.curImg) {
	                case '2012':
	                    this.tileLayer_2012.show();
	                    break;
	                case '2013':
	                    this.tileLayer_2013.show();
	                    break;
	                case '2014':
	                    this.tileLayer_2014.show();
	                    break;
	            }
	            this.ctrol.tiandisplay = false;
	        }
	    }
	};

	window.resizeDocu = function () {
	    Map.map.resize();
	};
	module.exports = exports['default'];

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "map.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	__webpack_require__(9);

	var _Eventful = __webpack_require__(11);

	var _Eventful2 = _interopRequireDefault(_Eventful);

	var Maplocation = (function (_React$Component) {
	  _inherits(Maplocation, _React$Component);

	  function Maplocation(props) {
	    _classCallCheck(this, Maplocation);

	    _get(Object.getPrototypeOf(Maplocation.prototype), 'constructor', this).call(this, props);
	    this.state = {
	      x: '',
	      y: '',
	      grid: ''
	    };
	  }

	  _createClass(Maplocation, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      _Eventful2['default'].subscribe('showPosition', this.showPosition_ex.bind(this));
	    }
	  }, {
	    key: 'showPosition_ex',
	    value: function showPosition_ex(x, y) {
	      var curx = parseInt(x);
	      var cury = parseInt(y);

	      var grid = this.encodegrid(curx, cury);
	      this.setState({ x: curx, y: cury, grid: grid });
	    }
	  }, {
	    key: 'encodegrid',
	    value: function encodegrid(wx, wy) {
	      var _ref = [];
	      var gridnum = _ref[0];
	      var xid = _ref[1];
	      var yid = _ref[2];
	      var ix = _ref[3];
	      var iy = _ref[4];
	      var fk = _ref[5];

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
	      return gridnum;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        { className: 'infohelp' },
	        React.createElement(
	          'table',
	          { className: 'legendCtrl_inftb' },
	          React.createElement(
	            'tbody',
	            null,
	            React.createElement(
	              'tr',
	              null,
	              React.createElement(
	                'td',
	                { className: 'lctb_title' },
	                'X：'
	              ),
	              React.createElement(
	                'td',
	                { id: 'xpos', className: 'lctb_text' },
	                this.state.x
	              ),
	              React.createElement(
	                'td',
	                { className: 'lctb_title' },
	                'Y：'
	              ),
	              React.createElement(
	                'td',
	                { id: 'ypos', className: 'lctb_text' },
	                this.state.y
	              ),
	              React.createElement(
	                'td',
	                { className: 'lctb_title2' },
	                '网格编码：'
	              ),
	              React.createElement(
	                'td',
	                { id: 'gridpos', className: 'lctb_text2' },
	                this.state.grid
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return Maplocation;
	})(React.Component);

	exports['default'] = Maplocation;
	module.exports = exports['default'];

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "maploc.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./maploc.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./maploc.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "\r\n#map {\r\n    position: relative;\r\n    width: 100%;\r\n    height: 100%;\r\n    /* cursor: url(\"../img/cursorimg/openhand.bmp\"), default; */ \r\n}\r\n#map img{\r\n    max-width: none;\r\n}\r\n.infohelp {\r\n    position: absolute;\r\n    bottom: 0px;\r\n    right: 170px;\r\n    height: 30px;\r\n    right: 180px;\r\n    background: rgba(224, 224, 224, 0.7);\r\n    width: 380px;\r\n    z-index: 15;\r\n}\r\n.legendCtrl_inftb {\r\n    margin-left: 33px;\r\n}\r\n.legendCtrl_inftb td {\r\n    line-height: 30px;\r\n    font-family: 宋体, Microsoft YaHei, Verdana, Arial, Helvetica, AppleGothic, sans-serif;\r\n    font-size: 13px;\r\n    overflow: hidden\r\n}\r\n.lctb_title {\r\n    width: 33px;\r\n    height: 30px;\r\n    text-align: center\r\n}\r\n.lctb_title2 {\r\n    width: 80px;\r\n    height: 30px;\r\n    text-align: right\r\n}\r\n.lctb_text {\r\n    text-align: left;\r\n    width: 45px;\r\n}\r\n.lctb_text2 {\r\n    width: 80px;\r\n    text-align: left;\r\n}", ""]);

	// exports


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var EventEmitter = {
	    _events: {},
	    dispatch: function dispatch(evtName) {
	        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	            args[_key - 1] = arguments[_key];
	        }

	        /*触发自定义事件*/
	        if (!this._events[evtName]) {
	            /*没有监听事件*/
	            return;
	        }
	        this._events[evtName].forEach(function (func) {
	            return func.apply(Object.create(null), args);
	        });
	    },
	    subscribe: function subscribe(evtName) {
	        var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

	        /*创建一个新事件数组*/
	        if (!this._events[evtName]) {
	            this._events[evtName] = [];
	        }
	        this._events[evtName].push(callback);
	    },
	    unsubscribe: function unsubscribe(evtName) {
	        /*解绑一个事件*/
	        if (!this._events[evtName]) {
	            /*没有监听事件*/
	            return;
	        }
	        delete this._events[evtName];
	    }
	};

	exports["default"] = EventEmitter;
	module.exports = exports["default"];

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Eventful.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var toolUtil = {
	    /**
	     *添加事件绑定函数
	     *跨浏览器
	     */
	    addHander: function addHander(element, type, hander) {
	        if (element.addEventListener) {
	            element.addEventListener(type, hander, false);
	        } else if (element.attachEvent) {
	            element.attachEvent("on" + type, hander);
	        } else {
	            //element.setAttribute("on"+type, hander);
	            element['on' + type] = hander;
	        }
	    },
	    /**
	     *获取事件对象
	     *跨浏览器
	     */
	    getEvent: function getEvent(event) {
	        return event ? event : window.event;
	    },
	    /**
	     *获取事件元素对象
	     *跨浏览器
	     */
	    getTarget: function getTarget(event) {
	        return event.target || event.srcElement;
	    },
	    /**
	     *取消元素默认行为
	     *跨浏览器，如<a href="" >可以通过在onclick事件中阻止href执行页面跳转的默认行为
	     */
	    preventDefault: function preventDefault(event) {
	        if (event.preventDefault) {
	            event.preventDefault();
	        } else {
	            window.event.returnValue = false;
	        }
	    },
	    getAttr: function getAttr(ele, attr) {
	        var retAttr = "";
	        retAttr = ele.getAttribute(attr);
	        return retAttr;
	    },
	    setAttr: function setAttr(ele, attr, value) {
	        ele.setAttribute(attr, value);
	    },
	    /**
	     *移除对象事件
	     *跨浏览器
	     */
	    removeHander: function removeHander(element, type, hander) {
	        if (element.removeEventListener) {
	            element.removeEventListener(type, hander, false);
	        } else if (element.detachEvent) {
	            element.detachEvent("on" + type, hander);
	        } else {
	            element['on' + type] = null;
	        }
	    },
	    /**
	     *阻止事件冒泡
	     *跨浏览器
	     */
	    stopPropagation: function stopPropagation(event) {
	        if (event.stopPropagation) {
	            event.stopPropagation();
	        } else {
	            window.event.cancelBubble = true;
	        }
	    },
	    setCookie: function setCookie(name, value) {
	        toolUtil.delCookie(name);
	        var Days = 10;
	        var exp = new Date();
	        exp.setTime(exp.getTime() + Days * 24 * 3600 * 1000);
	        var namevalue = name + "=" + escape(value);
	        document.cookie = namevalue + ";expires=" + exp.toGMTString();
	    },
	    delCookie: function delCookie(name) {
	        var exp = new Date(); //当前时间  
	        exp.setTime(exp.getTime() - 10); //删除cookie 只需将cookie设置为过去的时间   
	        var cval = toolUtil.getcookie(name);
	        if (cval != "") document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	    },
	    getcookie: function getcookie(sname) {
	        //获取单个cookies
	        var acookie = document.cookie.split(";");
	        for (var i = 0; i < acookie.length; i++) {
	            var arr = acookie[i].split("=");
	            if (sname == arr[0]) {
	                if (arr.length > 1) return unescape(arr[1]);else return "";
	            }
	        }
	        return "";
	    },
	    /**
	     * 对一个object进行深度拷贝
	     * @memberOf module:zrender/tool/util
	     * @param {*} source 需要进行拷贝的对象
	     * @return {*} 拷贝后的新对象
	     */
	    clone: function clone(source) {
	        var BUILTIN_OBJECT = {
	            '[object Function]': 1,
	            '[object RegExp]': 1,
	            '[object Date]': 1,
	            '[object Error]': 1,
	            '[object CanvasGradient]': 1
	        };
	        if (typeof source == 'object' && source !== null) {
	            var result = source;
	            if (source instanceof Array) {
	                result = [];
	                for (var i = 0, len = source.length; i < len; i++) {
	                    result[i] = this.clone(source[i]);
	                }
	            } else if (!BUILTIN_OBJECT[Object.prototype.toString.call(source)]
	            // 是否为 dom 对象
	             && !this.isDom(source)) {
	                result = {};
	                for (var key in source) {
	                    if (source.hasOwnProperty(key)) {
	                        result[key] = this.clone(source[key]);
	                    }
	                }
	            }

	            return result;
	        }

	        return source;
	    },
	    isDom: function isDom(obj) {
	        return obj && obj.nodeType === 1 && typeof obj.nodeName == 'string';
	    },
	    closeThisDiv: function closeThisDiv(id) {
	        document.getElementById(id).style.display = "none";
	    },
	    openThisDiv: function openThisDiv(id) {
	        document.getElementById(id).style.display = "block";
	    },
	    ifctrl: function ifctrl(e) {
	        //函数:判断键盘Ctrl按键
	        var nav4 = window.Event ? true : false; //初始化变量
	        if (nav4) {
	            //对于Netscape浏览器
	            //判断是否按下Ctrl按键
	            if (typeof e.ctrlKey != 'undefined' ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK > 0) {
	                return true;
	            } else {
	                return false;
	            }
	        } else {
	            //对于IE浏览器，判断是否按下Ctrl按键
	            if (window.event.ctrlKey) {
	                return true;
	            } else {
	                return false;
	            }
	        }
	        return false;
	    },
	    ifshift: function ifshift(e) {
	        //函数:判断键盘Shift按键
	        var nav4 = window.Event ? true : false; //初始化变量
	        if (nav4) {
	            //对于Netscape浏览器
	            //判断是否按下Ctrl按键
	            if (typeof e.shiftKey != 'undefined' ? e.shiftKey : e.modifiers & Event.SHIFT_MASK > 0) {
	                return true;
	            } else {
	                return false;
	            }
	        } else {
	            //对于IE浏览器，判断是否按下Ctrl按键
	            if (window.event.shiftKey) {
	                return true;
	            } else {
	                return false;
	            }
	        }
	        return false;
	    },
	    dragDiv: function dragDiv(id, titleclassName) {
	        var oDiv = document.getElementById(id);
	        oDiv.onmousedown = function (e) {
	            e = e || window.event;
	            var targetEle = e.target || e.srcElement;
	            if (targetEle.className == titleclassName) {
	                var diffx = e.clientX - oDiv.offsetLeft;
	                var diffy = e.clientY - oDiv.offsetTop;
	                document.onmousemove = function (e) {
	                    e = e || window.event;
	                    oDiv.style.left = e.clientX - diffx + "px";
	                    oDiv.style.top = e.clientY - diffy + "px";
	                };
	                document.onmouseup = function (e) {
	                    document.onmousemove = null;
	                    document.onmouseup = null;
	                };
	            }
	        };
	    },
	    loadScript: function loadScript(url, callback) {
	        //此处是异步加载js,但是不适合用户js指向其他文件的例子，如gooleapi baiduapi
	        var script = document.createElement("script");
	        script.type = "text/javascript";
	        if (script.readyState) {
	            //IE
	            script.onreadystatechange = function () {
	                if (script.readyState == "loaded" || script.readyState == "complete") {
	                    script.onreadystatechange = null;
	                    callback();
	                }
	            };
	        } else {
	            //Others: Firefox, Safari, Chrome, and Opera
	            script.onload = function () {
	                callback();
	            };
	        }
	        script.src = url;
	        document.body.appendChild(script);
	    },
	    loadScript_nocall: function loadScript_nocall(url) {
	        //创建script 并加载至body,没有回调
	        var scripts = document.getElementsByTagName("SCRIPT");
	        var scriptlen = scripts.length;
	        for (var i = 0; i < scriptlen; i++) {
	            if (scripts[i].src == url) {
	                return;
	            }
	        }
	        var script = document.createElement("script");
	        script.type = "text/javascript";
	        script.src = url;
	        document.body.appendChild(script);
	    },
	    changeTwoDecimal: function changeTwoDecimal(floatvar) {
	        var f_x = parseFloat(floatvar);
	        if (isNaN(f_x)) {
	            alert('function:changeTwoDecimal->parameter error');
	            return false;
	        }
	        var f_x = Math.round(floatvar * 100) / 100;
	        return f_x;
	    },
	    delTextSpace: function delTextSpace(elem) {
	        var elem_child = elem.childNodes;
	        for (var i = 0; i < elem_child.length; i++) {
	            var node = elem_child[i];
	            if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) {
	                elem.removeChild(node);
	            }
	        }
	    },
	    $_element: function $_element(str) {
	        if (str.indexOf('#') >= 0) {
	            //通过ID
	            str = str.replace(/(^\s*)|(\s*$)/g, "");
	            var id = str.substring(1);
	            var element = document.getElementById(id);
	            return element;
	        } else if (str.indexOf('.') >= 0) {
	            //通过CLASS
	            str = str.replace(/(^\s*)|(\s*$)/g, "");
	            var classNme = str.substring(1);
	            var elements = document.getElementsByClassName(classNme);
	            return elements;
	        } else {
	            //通过TagName
	            str = str.replace(/(^\s*)|(\s*$)/g, "");
	            var tagmne = str.toUpperCase();
	            var elements = document.getElementsByTagName(tagmne);
	            return elements;
	        }
	    },
	    getButton: function getButton(event) {
	        event = event || window.event;
	        if (! +[1]) {
	            switch (event.button) {
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
	        } else {
	            return event.button;
	        }
	    },
	    alertDiv: function alertDiv(strmsg) {
	        var tmpdoc = document;
	        var div = tmpdoc.createElement('div');
	        var bckdiv = div.cloneNode(false);
	        bckdiv.style.position = "absolute";
	        bckdiv.id = "alertmsgDiv_me";
	        bckdiv.style.width = "100%";
	        bckdiv.style.height = "100%";
	        bckdiv.style.left = "0px";
	        bckdiv.style.top = "0px";
	        bckdiv.style.background = "rgba(0,14,12,0.3)";
	        bckdiv.style.zIndex = 200000000000;
	        var frontdiv = div.cloneNode(false);
	        frontdiv.style.width = "360px";
	        frontdiv.style.height = "140px";
	        frontdiv.style.position = "absolute";
	        frontdiv.style.left = "50%";
	        frontdiv.style.top = "50%";
	        frontdiv.style.marginLeft = "-180px";
	        frontdiv.style.marginTop = "-100px";
	        frontdiv.style.zIndex = 200000000001;
	        frontdiv.style.background = "#FFFFFF";
	        frontdiv.style.borderRadius = "2px";
	        frontdiv.style.boxShadow = "0 0 5px #535658";
	        frontdiv.style.border = "1px solid #999";

	        var fronttitle = div.cloneNode(false);
	        fronttitle.style.backgroundColor = "#529f75";
	        fronttitle.style.borderBottom = "1px solid #E5E5E5";
	        fronttitle.style.borderTopLeftRadius = "1px";
	        fronttitle.style.borderTopRightRadius = "1px";
	        fronttitle.style.height = "30px";
	        fronttitle.style.lineHeight = "30px";
	        fronttitle.style.width = "100%";
	        fronttitle.style.color = "#fff";
	        fronttitle.style.fontSize = "12px";
	        fronttitle.style.fontFamily = '微软雅黑';
	        fronttitle.innerHTML = "&nbsp;&nbsp;<img src='img/logo.png' style='vertical-align:sub'>" + "&nbsp;&nbsp;系统提醒";
	        frontdiv.appendChild(fronttitle);

	        var contentDiv = div.cloneNode(false);
	        contentDiv.style.backgroundColor = "#FFFFFF";
	        contentDiv.style.height = "80px";
	        contentDiv.style.width = "100%";

	        var imgalert = tmpdoc.createElement('img');
	        imgalert.style.marginLeft = "15px";
	        imgalert.style.marginTop = "15px";
	        imgalert.src = "img/alert.png";
	        var pmsg = tmpdoc.createElement('p');
	        pmsg.style.position = "relative";
	        pmsg.style.paddingLeft = "10px";
	        pmsg.style.width = "280px";
	        pmsg.style.fontSize = "14px";
	        pmsg.style.textIndent = "2em";
	        pmsg.style.lineHeight = "25px";
	        pmsg.style.color = "#333";
	        pmsg.style.display = "inline-block";
	        pmsg.style.verticalAlign = "bottom";
	        pmsg.style.top = "-10px";
	        pmsg.innerHTML = strmsg;
	        contentDiv.appendChild(imgalert);
	        contentDiv.appendChild(pmsg);
	        frontdiv.appendChild(contentDiv);

	        var footerDiv = div.cloneNode(false);
	        footerDiv.style.backgroundColor = "#fff";
	        footerDiv.style.borderBottom = "1px solid #E5E5E5";
	        footerDiv.style.borderBottomLeftRadius = "2px";
	        footerDiv.style.borderBottomRightRadius = "2px";
	        footerDiv.style.height = "30px";
	        footerDiv.style.lineHeight = "30px";
	        footerDiv.style.width = "100%";
	        footerDiv.style.textAlign = "center";
	        var btnConfirm = div.cloneNode(false);
	        btnConfirm.style.background = "#529f75";
	        btnConfirm.style.background = "-webkit-gradient(linear, left top, left bottom, color-stop(0%,#529f75), color-stop(100%,#529f75))";
	        btnConfirm.style.background = "-webkit-linear-gradient(top, #529f75 0%,#529f75 100%)";
	        btnConfirm.style.border = "1px solid #529f75";
	        btnConfirm.style.color = "#FFFFFF";
	        btnConfirm.style.fontWeight = "bold";
	        btnConfirm.style.textAlign = "center";
	        btnConfirm.style.width = "80px";
	        btnConfirm.style.height = "22px";
	        btnConfirm.style.fontSize = "14px";
	        btnConfirm.style.marginLeft = "250px";
	        btnConfirm.style.lineHeight = "22px";
	        btnConfirm.style.cursor = "pointer";
	        btnConfirm.innerHTML = "确定";
	        btnConfirm.onclick = function () {
	            var obj = tmpdoc.getElementById('alertmsgDiv_me');
	            obj.parentNode.removeChild(obj);
	        };
	        //
	        footerDiv.appendChild(btnConfirm);
	        frontdiv.appendChild(footerDiv);

	        bckdiv.appendChild(frontdiv);
	        tmpdoc.body.appendChild(bckdiv);
	    },
	    confirmDiv: function confirmDiv(strmsg, titlename, confirmName, failName, Success_callback, Fail_callback, ifclose) {
	        var tmpdoc = document;
	        var div = tmpdoc.createElement('div');
	        var bckdiv = div.cloneNode(false);
	        bckdiv.id = "confirm_wode";
	        bckdiv.style.position = "absolute";
	        bckdiv.style.width = "100%";
	        bckdiv.style.height = "100%";
	        bckdiv.style.left = "0px";
	        bckdiv.style.top = "0px";
	        bckdiv.style.background = "rgba(0,14,12,0.3)";
	        bckdiv.style.zIndex = 200000000000;
	        var frontdiv = div.cloneNode(false);
	        frontdiv.style.width = "360px";
	        frontdiv.style.height = "140px";
	        frontdiv.style.position = "absolute";
	        frontdiv.style.left = "50%";
	        frontdiv.style.top = "50%";
	        frontdiv.style.marginLeft = "-180px";
	        frontdiv.style.marginTop = "-70px";
	        frontdiv.style.zIndex = 200000000001;
	        frontdiv.style.background = "#FFFFFF";
	        frontdiv.style.borderRadius = "2px";
	        frontdiv.style.boxShadow = "0 0 5px #535658";
	        frontdiv.style.border = "1px solid #999";

	        var fronttitle = div.cloneNode(false);
	        fronttitle.style.backgroundColor = "#529f75";
	        fronttitle.style.position = "relative";
	        fronttitle.style.borderBottom = "1px solid #E5E5E5";
	        fronttitle.style.borderTopLeftRadius = "1px";
	        fronttitle.style.borderTopRightRadius = "1px";
	        fronttitle.style.height = "30px";
	        fronttitle.style.lineHeight = "30px";
	        fronttitle.style.width = "100%";
	        fronttitle.style.color = "#fff";
	        fronttitle.style.fontSize = "12px";
	        fronttitle.style.fontFamily = '微软雅黑';
	        fronttitle.innerHTML = "&nbsp;&nbsp;<img src='img/logo.png' style='vertical-align:sub'>" + "&nbsp;&nbsp;" + titlename;
	        if (ifclose) {
	            var closeDiv = div.cloneNode(false);
	            closeDiv.style.position = "absolute";
	            closeDiv.style.right = "10px";
	            closeDiv.style.top = "3px";
	            closeDiv.innerHTML = "<img src='img/pop_close.png'>";
	            closeDiv.style.cursor = "pointer";
	            closeDiv.onclick = function () {
	                var obj = tmpdoc.getElementById('confirm_wode');
	                obj.parentNode.removeChild(obj);
	            };
	            fronttitle.appendChild(closeDiv);
	        }
	        frontdiv.appendChild(fronttitle);

	        var contentDiv = div.cloneNode(false);
	        contentDiv.style.backgroundColor = "#FFFFFF";
	        contentDiv.style.height = "80px";
	        contentDiv.style.width = "100%";

	        var imgalert = tmpdoc.createElement('img');
	        imgalert.style.marginLeft = "15px";
	        imgalert.style.marginTop = "15px";
	        imgalert.src = "img/help.png";
	        var pmsg = tmpdoc.createElement('p');
	        pmsg.style.position = "relative";
	        pmsg.style.paddingLeft = "10px";
	        pmsg.style.width = "280px";
	        pmsg.style.fontSize = "14px";
	        pmsg.style.textIndent = "2em";
	        pmsg.style.lineHeight = "25px";
	        pmsg.style.color = "#333";
	        pmsg.style.display = "inline-block";
	        pmsg.style.verticalAlign = "bottom";
	        pmsg.style.top = "-10px";
	        pmsg.innerHTML = strmsg;
	        contentDiv.appendChild(imgalert);
	        contentDiv.appendChild(pmsg);
	        frontdiv.appendChild(contentDiv);

	        var footerDiv = div.cloneNode(false);
	        footerDiv.style.position = "relative";
	        footerDiv.style.backgroundColor = "#fff";
	        footerDiv.style.borderBottom = "1px solid #E5E5E5";
	        footerDiv.style.borderBottomLeftRadius = "2px";
	        footerDiv.style.borderBottomRightRadius = "2px";
	        footerDiv.style.height = "30px";
	        footerDiv.style.lineHeight = "30px";
	        footerDiv.style.width = "100%";
	        footerDiv.style.textAlign = "center";
	        var btnConfirm = div.cloneNode(false);
	        btnConfirm.style.background = "#529f75";
	        btnConfirm.style.background = "-webkit-gradient(linear, left top, left bottom, color-stop(0%,#529f75), color-stop(100%,#529f75))";
	        btnConfirm.style.background = "-webkit-linear-gradient(top, #529f75 0%,#529f75 100%)";
	        btnConfirm.style.border = "1px solid #529f75";
	        btnConfirm.style.color = "#FFFFFF";
	        btnConfirm.style.fontWeight = "bold";
	        btnConfirm.style.textAlign = "center";
	        btnConfirm.style.width = "80px";
	        btnConfirm.style.height = "22px";
	        btnConfirm.style.fontSize = "14px";
	        btnConfirm.style.position = "absolute";
	        btnConfirm.style.left = "150px";
	        btnConfirm.style.top = "3px";
	        btnConfirm.style.lineHeight = "22px";
	        btnConfirm.style.cursor = "pointer";
	        btnConfirm.innerHTML = confirmName;
	        btnConfirm.onclick = function () {
	            var obj = tmpdoc.getElementById('confirm_wode');
	            obj.parentNode.removeChild(obj);
	            Success_callback();
	        };

	        var btnCancle = div.cloneNode(false);
	        btnCancle.style.background = "#529f75";
	        btnCancle.style.background = "-webkit-linear-gradient(top, #529f75 0%,#529f75 100%)";
	        btnCancle.style.background = "linear-gradient(top, #529f75 0%,#dfdede 100%)";
	        btnCancle.style.border = "1px solid #529f75";
	        btnCancle.style.color = "#FFFFFF";
	        btnCancle.style.textAlign = "center";
	        btnCancle.style.width = "80px";
	        btnCancle.style.height = "22px";
	        btnCancle.style.fontSize = "14px";
	        btnCancle.style.fontWeight = "bold";
	        btnCancle.style.position = "absolute";
	        btnCancle.style.right = "20px";
	        btnCancle.style.top = "3px";
	        btnCancle.style.lineHeight = "22px";
	        btnCancle.style.cursor = "pointer";
	        btnCancle.innerHTML = failName;
	        btnCancle.onclick = function () {
	            var obj = tmpdoc.getElementById('confirm_wode');
	            obj.parentNode.removeChild(obj);
	            Fail_callback();
	        };
	        footerDiv.appendChild(btnConfirm);
	        footerDiv.appendChild(btnCancle);
	        frontdiv.appendChild(footerDiv);

	        bckdiv.appendChild(frontdiv);
	        tmpdoc.body.appendChild(bckdiv);
	    },
	    getIndexInarr: function getIndexInarr(ele, arr) {
	        var arr_len = arr.length;
	        for (var i = 0; i < arr_len; i++) {
	            var tmpele = arr[i];
	            if (tmpele == ele) {
	                return i;
	            }
	        }
	        return -1;
	    },
	    isInArr: function isInArr(ele, arr) {
	        return this.getIndexInarr(ele, arr) >= 0 ? true : false;
	    },
	    newalertDiv: function newalertDiv(msg) {
	        var div = document.createElement('div');
	        div.innerHTML = msg;
	        div.id = 'tb-alertdiv';
	        div.style.width = '200px';
	        div.style.height = '40px';
	        div.style.position = 'absolute';
	        div.style.left = '50%';
	        div.style.top = '50%';
	        div.style.color = '#fff';
	        div.style.letterSpacing = '1px';
	        div.style.marginLeft = '-100px';
	        div.style.marginTop = '-20px';
	        div.style.background = '#757575';
	        div.style.fontSize = '15px';
	        div.style.fontFamily = 'Microsoft Yahei';
	        div.style.lineHeight = '40px';
	        div.style.textAlign = 'center';
	        div.style.borderRadius = '20px';
	        div.style.zIndex = 100000000;
	        document.body.appendChild(div);

	        setTimeout(function () {
	            var _alertdiv = document.getElementById('tb-alertdiv');
	            if (_alertdiv) {
	                $(_alertdiv).fadeToggle(1500, function () {
	                    document.body.removeChild(_alertdiv);
	                    _alertdiv = null;
	                });
	            }
	        }, 800);
	    },

	    /*
	     *@describtion 删除表格中的记录
	     *@Params database表示数据库名，tbName表示表格名称，idArr为一维数组，表示要删除行的主键(一般为id号)
	     *@Params params = {'Fields':'id','Data':idArr};
	     */
	    recordDelete: function recordDelete(db, tb, params, succCallback, failCallback) {
	        var succ = arguments.length < 4 ? function () {} : succCallback;
	        var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	            'processCompleted': function processCompleted() {
	                succ();
	            },
	            'processFailed': function processFailed() {
	                if (arguments.length > 4) {
	                    failCallback();
	                }
	            }
	        });
	        sqlservice.processAscyn('DELETE', db, tb, params);
	    },
	    //添加操作
	    //params: {'Fields':["fldname","fldnum"],'Data':[["name1",1],["name2",2]]}
	    recordAdd: function recordAdd(db, tb, params, succ, fail) {
	        var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	            'processCompleted': function processCompleted() {
	                if (typeof succ == 'function') succ();
	            },
	            'processFailed': function processFailed() {
	                if (typeof fail == 'function') fail();
	            }
	        });
	        sqlservice.processAscyn('ADD', db, tb, params);
	    },
	    //更新操作
	    //params: {'Fields':[Array],'Data':[[Array],[Array]]}   Fields中第一个字段为更新标示
	    recordUpdate: function recordUpdate(db, tb, params, succ) {
	        var succCallback = arguments.length > 3 ? succ : function () {};
	        var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	            'processCompleted': function processCompleted() {
	                succCallback();
	            },
	            'processFailed': function processFailed() {}
	        });
	        sqlservice.processAscyn('UPDATE', db, tb, params);
	    },
	    //查询操作
	    //sql:   {'lyr':'表名','fields':'字段','filter':'条件'}
	    recordQuery: function recordQuery(db, sql, succ) {
	        var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	            'processCompleted': function processCompleted(data) {
	                if (typeof succ == 'function') succ(data); //回调函数里返回数据
	            },
	            'processFailed': function processFailed() {}
	        });
	        sqlservice.processAscyn('SQLQUERY', db, sql);
	    },
	    //万能语句
	    //sql:   {'lyr':'表名','fields':'字段','filter':'条件'}
	    recordSQLEXEC: function recordSQLEXEC(db, sql, succ) {
	        var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	            'processCompleted': function processCompleted(msg) {
	                if (typeof succ == 'function') succ(msg);
	            },
	            'processFailed': function processFailed() {}
	        });
	        sqlservice.processAscyn('SQLEXEC', db, sql);
	    },

	    sqlScript: function sqlScript(scriptname, option, callback) {
	        option.scriptname = scriptname;
	        var sqlScript = new gEcnu.WebsqlScript({
	            'processCompleted': function processCompleted(msg) {
	                if (typeof callback == 'function') callback(msg);
	            },
	            'processFailed': function processFailed() {}
	        });
	        sqlScript.processAscyn(option);
	    },

	    featureQuery: function featureQuery(option, succ, fail) {
	        var featservice = new gEcnu.WebFeatureServices.QueryByGeometry({
	            'processCompleted': function processCompleted(msg) {
	                if (typeof succ == 'function') succ(msg);
	            },
	            'processFailed': function processFailed(err) {
	                if (typeof fail == 'function') fail(err);
	            }
	        });
	        featservice.processAscyn(option.geometry, option.lyrType, option.map, option.lyr, option.tolerance, option.shapeFlag_bool, option.returnFields);
	    }
	};

	exports["default"] = toolUtil;
	module.exports = exports["default"];

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "util.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	/*
	 * aaicQuery.js v1.0 | JavaScript 
	 *
	 * :: 2016-04-22 20:00
	 */

	"use strict";

	;
	(function (name, context, factory) {

	    // Supports CMD. AMD, CommonJS/Node.js and browser context
	    if (typeof module !== "undefined" && module.exports) {
	        module.exports = factory();
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        context[name] = factory();
	    }
	})("aaicQuery", undefined, function () {

	    var QueryConfig = {
	        dbname: 'ecnugis',
	        PlTbname: 'policy',
	        BdTbname: 'biaodi',
	        LandTbname: 'landtype',
	        landRelTbname: 'landRel',
	        ftset_id: 198,
	        Plfields: ['usrid', 'coding', 'policyholder', 'licenseclass', 'licensenum', 'receiptor', 'phone', 'address', 'securename', 'area', 'start', 'end'],
	        Bdfields: ['id', 'coding', 'bdname', 'pzname', 'province', 'city', 'county', 'town', 'village', 'postcode', 'address', 'area', 'x', 'y'],
	        Landfields: ['FID', 'XMIN', 'XMAX', 'YMIN', 'YMAX', 'SHPAREA', 'LANDTYPE_C', 'CODING', 'BDID'],
	        shpfields: ['FID', 'shpType', 'xmin', 'ymin', 'xmax', 'ymax', 'shpLen', 'shpArea', 'shpData']
	    };

	    var Util = {
	        merge: function merge() {
	            var merged = {};
	            var argsLen = arguments.length;
	            for (var i = 0; i < argsLen; i++) {
	                var obj = arguments[i];
	                for (var key in obj) {
	                    merged[key] = obj[key];
	                }
	            }
	            return merged;
	        }
	    };

	    var WebFeature = (function FeatureClosure() {

	        function WebFeature() {
	            var config = this._config = Util.merge(QueryConfig, arguments[0] || {});
	            this.dbname = config.dbname;
	            this.ftstab = config.LandTbname;
	            this.ftset_id = config.ftset_id;
	        }

	        WebFeature.prototype = {
	            QueryByGeometry: function QueryByGeometry(geometry, callback) {
	                var ftQuery = new gEcnu.WebFeatureServices.QueryByGeometry({
	                    'processCompleted': function processCompleted(resultFea) {
	                        if (resultFea.length > 0) {
	                            var fid = resultFea[0]['FID'];
	                            var database = new Database(QueryConfig);
	                            database.QueryCodingByFID([fid], function (codArr) {
	                                if (codArr.length > 0) {
	                                    database.QueryByCoding(codArr[0], callback);
	                                } else {
	                                    callback([]);
	                                }
	                            });
	                        } else {
	                            callback([]);
	                        }
	                    },
	                    'processFailed': function processFailed() {}
	                });
	                /*var options = {shape: geometry, queryLyrType: gEcnu.layerType.GeoDB, mapOrGeodb: this.dbname, lyrOrFtset: this.ftset_id, returnFields: 'BDID'};
	                ftQuery.processAscyn(options);*/
	                ftQuery.processAscyn(geometry, gEcnu.layerType.GeoDB, this.dbname, this.ftset_id, 1000, false, '');
	            }
	        };

	        return WebFeature;
	    })();

	    var Database = (function DatabaseClosure() {

	        function fetchKey(sourceArr, key) {
	            var targetArr = [];
	            for (var i = 0, len = sourceArr.length; i < len; i++) {
	                targetArr[i] = sourceArr[i][key];
	            };
	            return targetArr;
	        }

	        function Database() {
	            var config = this._config = Util.merge(QueryConfig, arguments[0] || {});
	            this.dbname = config.dbname;
	            this.PlTbname = config.PlTbname;
	            this.BdTbname = config.BdTbname;
	            this.relTable = config.landRelTbname;
	            this.LandTbname = "f_" + config.LandTbname;
	            this.Plfields = config.Plfields;
	            this.Landfields = config.Landfields;
	        }

	        Database.prototype = {
	            fuzzyQuery: function fuzzyQuery(content, callback) {
	                var self = this;
	                var pTable = this.PlTbname;
	                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	                    'processCompleted': function processCompleted(rst) {
	                        var codArr = [];
	                        if (rst.length > 0) {
	                            codArr = fetchKey(rst, 'CODING');
	                            self.QueryBdByCoding(codArr, function (bd_rst) {
	                                var bdArr = [];
	                                if (bd_rst.length > 0) {
	                                    bdArr = fetchKey(bd_rst, 'ID');
	                                    self.QueryLandByBdid(bdArr, function (ld_rst) {
	                                        self.reStructResult(rst, bd_rst, ld_rst, callback);
	                                    });
	                                } else {
	                                    self.reStructResult(rst, [], [], callback);
	                                }
	                            });
	                        } else {
	                            callback(codArr);
	                        }
	                    },
	                    'processFailed': function processFailed(msg) {
	                        console.log(msg);
	                    }
	                });
	                var sWhere = "(";
	                var fldArr = this.Plfields;
	                for (var i = 0, len = fldArr.length; i < len; i++) {
	                    var fld = fldArr[i];
	                    if (fld === 'area' || fld === 'start' || fld === 'end' || fld === 'licenseclass' || fld === 'address' || fld === 'securename') {
	                        continue;
	                    }
	                    sWhere += pTable + "." + fld + " LIKE '%" + content + "%' OR ";
	                };
	                sWhere = sWhere.substr(0, sWhere.length - 4);
	                sWhere += ')';
	                var qrysql = { 'fields': "*", "lyr": pTable, 'filter': sWhere };
	                sqlservice.processAscyn('SQLQUERY', this.dbname, qrysql);
	            },
	            reStructResult: function reStructResult(plArr, bdArr, landArr, callback) {
	                var json = [];
	                var existCoding = {};
	                var existBdid = {};
	                for (var i = 0, len = plArr.length; i < len; i++) {
	                    json[i] = { policy: plArr[i], bdArr: [] };
	                };
	                for (var i = 0, len = bdArr.length; i < len; i++) {
	                    var target = bdArr[i];
	                    var coding = target['CODING'];
	                    if (!existCoding[coding]) {
	                        for (var k = 0, length = plArr.length; k < length; k++) {
	                            if (plArr[k]['CODING'] === coding) {
	                                break;
	                            }
	                        };
	                        json[k]['bdArr'] = [{ bdxq: target, landArr: [] }];
	                        existCoding[coding] = true;
	                    } else {
	                        json[k]['bdArr'].push({ bdxq: target, landArr: [] });
	                    }
	                };
	                for (var i = 0, len = landArr.length; i < len; i++) {
	                    var land = landArr[i];
	                    var bdid = land['BDID'];
	                    if (!existBdid[bdid]) {
	                        var flag = false;
	                        for (var k = 0, length = json.length; k < length; k++) {
	                            var targetArr = json[k]['bdArr'];
	                            for (var m = 0, leng = targetArr.length; m < leng; m++) {
	                                var target = targetArr[m];
	                                if (target['bdxq']['ID'] === bdid) {
	                                    flag = true;
	                                    break;
	                                }
	                            };
	                            if (flag) {
	                                break;
	                            }
	                        };
	                        json[k]['bdArr'][m]['landArr'] = [land];
	                        existBdid[bdid] = true;
	                    } else {
	                        json[k]['bdArr'][m]['landArr'].push(land);
	                    }
	                };
	                callback(json);
	            },
	            QueryByCoding: function QueryByCoding(coding, callback) {
	                var self = this;
	                var pTable = this.PlTbname;
	                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	                    'processCompleted': function processCompleted(rst) {
	                        if (rst.length > 0) {
	                            self.QueryBdByCoding([coding], function (bd_rst) {
	                                var bdArr = [];
	                                if (bd_rst.length > 0) {
	                                    bdArr = fetchKey(bd_rst, 'ID');
	                                    self.QueryLandByBdid(bdArr, function (ld_rst) {
	                                        self.reStructResult(rst, bd_rst, ld_rst, callback);
	                                    });
	                                } else {
	                                    self.reStructResult(rst, [], [], callback);
	                                }
	                            });
	                        } else {
	                            callback(rst);
	                        }
	                    },
	                    'processFailed': function processFailed(msg) {
	                        alert(msg);
	                    }
	                });
	                var sWhere = pTable + '.coding=' + coding + ' ORDER BY coding';
	                var qrysql = { 'fields': "*", "lyr": pTable, 'filter': sWhere };
	                sqlservice.processAscyn('SQLQUERY', this.dbname, qrysql);
	            },
	            QueryBdByCoding: function QueryBdByCoding(codArr, callback) {
	                var bdTbname = this.BdTbname;
	                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	                    'processCompleted': function processCompleted(msg) {
	                        callback(msg);
	                    },
	                    'processFailed': function processFailed(msg) {
	                        alert(msg);
	                    }
	                });
	                var sWhere = "coding in (" + codArr.join(',') + ") ORDER BY coding";
	                var qrysql = { 'fields': '*', "lyr": bdTbname, 'filter': sWhere };
	                sqlservice.processAscyn('SQLQUERY', this.dbname, qrysql);
	            },
	            QueryLandByBdid: function QueryLandByBdid(bdArr, callback) {
	                var relTable = this.relTable;
	                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	                    'processCompleted': function processCompleted(msg) {
	                        callback(msg);
	                    },
	                    'processFailed': function processFailed(msg) {
	                        alert(msg);
	                    }
	                });
	                var fields = this.Landfields.join(',');
	                var sWhere = "bdid in (" + bdArr.join(',') + ") ORDER BY bdid";
	                var qrysql = { 'fields': fields, "lyr": relTable, 'filter': sWhere };
	                sqlservice.processAscyn('SQLQUERY', this.dbname, qrysql);
	            },
	            QueryCodingByFID: function QueryCodingByFID(fidArr, callback) {
	                var relTable = this.relTable;
	                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	                    'processCompleted': function processCompleted(msg) {
	                        var codArr = [];
	                        if (msg.length > 0) {
	                            for (var i = 0, len = msg.length; i < len; i++) {
	                                codArr[i] = msg[i]['CODING'];
	                            };
	                            callback(codArr);
	                        } else {
	                            callback(codArr);
	                        }
	                    },
	                    'processFailed': function processFailed(msg) {
	                        alert(msg);
	                    }
	                });
	                var sWhere = "fid in (" + fidArr.join(',') + ") ORDER BY coding";
	                var qrysql = { 'fields': 'CODING', "lyr": relTable, 'filter': sWhere };
	                sqlservice.processAscyn('SQLQUERY', this.dbname, qrysql);
	            },
	            deleteBdById: function deleteBdById(bdid, callback) {
	                var bdTbname = this.BdTbname;
	                var relTable = this.relTable;
	                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	                    'processCompleted': function processCompleted(msg) {
	                        callback();
	                    },
	                    'processFailed': function processFailed() {}
	                });
	                var tasks = [{ "mt": "SQLDelete",
	                    "tablename": bdTbname,
	                    "KeyFld": 'id',
	                    "key": [bdid]
	                }, {
	                    "mt": "SQLDelete",
	                    "tablename": relTable,
	                    "KeyFld": 'bdid',
	                    "key": [bdid]
	                }];
	                sqlservice.processAscyn('SQLTask', this.dbname, tasks);
	            },
	            deletePolicyByCoding: function deletePolicyByCoding(coding, callback) {
	                var tmpTbArr = [this.PlTbname, this.BdTbname, this.relTable];
	                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	                    'processCompleted': function processCompleted(msg) {
	                        callback();
	                    },
	                    'processFailed': function processFailed() {}
	                });
	                var tasks = [];
	                for (var i = 0, len = tmpTbArr.length; i < len; i++) {
	                    tasks[i] = {
	                        "mt": "SQLDelete",
	                        "tablename": tmpTbArr[i],
	                        "KeyFld": 'coding',
	                        "key": [coding]
	                    };
	                };
	                sqlservice.processAscyn('SQLTask', this.dbname, tasks);
	            },
	            updateArea4Policy: function updateArea4Policy(coding, area, callback) {
	                var PlTbname = this.PlTbname;
	                var params = { Fields: ['coding', 'area'], Data: [[coding, area]] };
	                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	                    'processCompleted': function processCompleted() {
	                        if (typeof callback == 'function') {
	                            callback();
	                        }
	                    },
	                    'processFailed': function processFailed() {}
	                });
	                sqlservice.processAscyn('UPDATE', this.dbname, PlTbname, params);
	            },
	            updateArea4Bd: function updateArea4Bd(bdid, area, callback) {
	                var bdTbname = this.BdTbname;
	                var params = { Fields: ['id', 'area'], Data: [[bdid, area]] };
	                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
	                    'processCompleted': function processCompleted() {
	                        if (typeof callback == 'function') {
	                            callback();
	                        }
	                    },
	                    'processFailed': function processFailed() {}
	                });
	                sqlservice.processAscyn('UPDATE', this.dbname, bdTbname, params);
	            }

	        };

	        return Database;
	    })();

	    // core
	    var queryFactory = {
	        createWebFeature: function createWebFeature(config) {
	            return new WebFeature(config);
	        },
	        createConnect: function createConnect(config) {
	            return new Database(config);
	        }
	    };

	    return queryFactory;
	});

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "aaicQuery.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _storage = __webpack_require__(6);

	var _util = __webpack_require__(12);

	var _util2 = _interopRequireDefault(_util);

	var Data = {
	  initLandtype: function initLandtype() {
	    return new Promise(function (resolve, reject) {
	      var SQL = { 'lyr': _storage.config.landkind, 'fields': 'CN_NAME,EN_NAME,URL_FIR,URL_SEC,FIL_COLOR,BOR_COLOR', 'filter': '' };
	      _util2['default'].recordQuery(_storage.config.dbName, SQL, function (results) {
	        var len = results.length;
	        for (var i = 0; i < len; i++) {
	          var tmpres = results[i];
	          _storage.landVariable.en_Name2cn_Name[tmpres['EN_NAME']] = tmpres['CN_NAME'];
	          _storage.landVariable.cn_Name2en_Name[tmpres['CN_NAME']] = tmpres['EN_NAME'];
	          _storage.landVariable.en_Name2checked[tmpres['EN_NAME']] = true;
	          _storage.landVariable.en_NameLandFilColor[tmpres['EN_NAME']] = tmpres['FIL_COLOR'];
	          _storage.landVariable.en_NameLandBorColor[tmpres['EN_NAME']] = tmpres['BOR_COLOR'];
	          _storage.landVariable.en_Name2MarkURL[tmpres['EN_NAME']] = tmpres['URL_SEC'];
	        }
	        resolve();
	      });
	    });
	  },

	  initLegends: function initLegends() {
	    return new Promise(function (resolve, reject) {
	      var SQL = { 'lyr': _storage.config.lyrlegend, 'fields': 'name,lyrlegendName', 'filter': '' };
	      _util2['default'].recordQuery(_storage.config.dbName, SQL, function (results) {
	        var len = results.length;
	        for (var i = 0; i < len; i++) {
	          var tmpres = results[i];
	          var legendKind = tmpres['name'];
	          if (legendKind == 'history') {
	            _storage.landLegend.hislegends = _storage.landLegend.hislegends + [tmpres['lyrlegendName']] + ",";
	          } else if (legendKind == 'now') {
	            _storage.landLegend.nowlegends = _storage.landLegend.nowlegends + [tmpres['lyrlegendName']] + ",";
	          } else {
	            _storage.landLegend.planlegends = _storage.landLegend.planlegends + [tmpres['lyrlegendName']] + ",";
	          }
	        }
	        resolve();
	      });
	    });
	  },

	  getHelpMarkers: function getHelpMarkers() {
	    var townName = _storage.tasks[0]['distName'];
	    return new Promise(function (resolve, reject) {
	      var filter = "ERROR='marker_shp' AND TOWN=" + "'" + townName + "'";
	      var SQL = { 'lyr': _storage.config.errTab, 'fields': 'FID', 'filter': filter };
	      _util2['default'].recordQuery(_storage.config.dbName, SQL, function (results) {
	        var len = results.length;
	        var markers = [];
	        for (var i = 0; i < len; i++) {
	          var tmpmarker = results[i].FID;
	          var marker_x = parseInt(tmpmarker.split('_')[0], 10);
	          var marker_y = parseInt(tmpmarker.split('_')[1], 10);
	          var marker = new gEcnu.Marker('marker', {
	            'x': marker_x,
	            'y': marker_y,
	            'description': '',
	            'src': _storage.config.errsrc,
	            'offset': {
	              x: -12,
	              y: -24
	            }
	          }, { 'opacity': 1.0 });
	          markers.push(marker);
	        }
	        resolve(markers);
	      });
	    });
	  },

	  getInsureFID: function getInsureFID() {
	    return new Promise(function (resolve, reject) {
	      var SQL = { 'lyr': _storage.config.landRelTab, 'fields': 'FID,BDID,CODING', 'filter': '1=1' };
	      _util2['default'].recordQuery(_storage.config.dbName, SQL, function (msg) {
	        var obj = {};
	        var i = msg.length;
	        while (i--) {
	          obj[msg[i].FID] = { 'BDID': msg[i].BDID, 'CODING': msg[i].CODING };
	        }
	        resolve(obj);
	      });
	    });
	  }
	};

	exports['default'] = Data;
	module.exports = exports['default'];

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "data.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _storage = __webpack_require__(6);

	var _util = __webpack_require__(12);

	var _util2 = _interopRequireDefault(_util);

	var DISTNAME = '上海市';

	var AreaRange = {
		counties: [],
		countyMap: {},
		townMap: {},

		getCounties: function getCounties() {
			var _this = this;

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			var NAME = 'Name';
			return new Promise(function (resolve, reject) {
				if (_this.counties.length) {
					resolve(_this.counties);
				} else {
					var SQL = { 'fields': NAME + ",X,Y", "lyr": _storage.config.countyTab, 'filter': 'PreDist=' + "'" + DISTNAME + "'" + " and ID<>'310' and class=1" };
					_util2['default'].recordQuery(_storage.config.sysdbName, SQL, function (json) {
						var counties = args[0] === 'all' ? json : _this._trimCentCounties(json);
						_this.addPrimarykey(counties, NAME);
						resolve(counties);
						_this.counties = counties;
					});
				}
			});
		},

		getTownsByCounty: function getTownsByCounty(county) {
			var _this2 = this;

			var NAME = 'town';
			return new Promise(function (resolve, reject) {
				if (_this2.countyMap[county]) {
					resolve(_this2.countyMap[county]);
				} else {
					var SQL = { 'fields': NAME + ",X,Y", "lyr": _storage.config.county_townTab, 'filter': "county='" + county + "' and class=2" };
					_util2['default'].recordQuery(_storage.config.sysdbName, SQL, function (json) {
						_this2.addPrimarykey(json, NAME);
						resolve(json);
						_this2.countyMap[county] = json;
					});
				}
			});
		},

		getVillagesByTown: function getVillagesByTown(town) {
			var _this3 = this;

			var NAME = 'Name';
			return new Promise(function (resolve, reject) {
				if (_this3.townMap[town]) {
					resolve(_this3.townMap[town]);
				} else {
					var SQL = { 'fields': NAME + ",X,Y", "lyr": _storage.config.villageTab, 'filter': "town_name='" + town + "'" };
					_util2['default'].recordQuery(_storage.config.sysdbName, SQL, function (json) {
						_this3.addPrimarykey(json, NAME);
						resolve(json);
						_this3.townMap[town] = json;
					});
				}
			});
		},

		getInitArea: function getInitArea() {
			var _this4 = this;

			var _ref = [];
			var reCounties = _ref[0];
			var reTowns = _ref[1];

			return this.getCounties().then(function (counties) {
				reCounties = counties;
				var countyName = _this4._getJsonValue(counties);
				return _this4.getTownsByCounty(countyName);
			}).then(function (towns) {
				reTowns = towns;
				var townName = _this4._getJsonValue(towns);
				return _this4.getVillagesByTown(townName);
			}).then(function (villages) {
				return Promise.all([reCounties, reTowns, villages]);
			});
		},

		getSubAreaByCounty: function getSubAreaByCounty(county) {
			var _this5 = this;

			var reTowns = [];
			return this.getTownsByCounty(county).then(function (towns) {
				reTowns = towns;
				var townName = _this5._getJsonValue(towns);
				return _this5.getVillagesByTown(townName);
			}).then(function (villages) {
				return Promise.all([reTowns, villages]);
			});
		},

		getInitArea_async: function getInitArea_async() {
			var counties, countyName, towns, townName, villages;
			return regeneratorRuntime.async(function getInitArea_async$(context$1$0) {
				while (1) switch (context$1$0.prev = context$1$0.next) {
					case 0:
						context$1$0.prev = 0;
						context$1$0.next = 3;
						return regeneratorRuntime.awrap(this.getCounties());

					case 3:
						counties = context$1$0.sent;
						countyName = counties[0][counties[0].key];
						context$1$0.next = 7;
						return regeneratorRuntime.awrap(this.getTownsByCounty(countyName));

					case 7:
						towns = context$1$0.sent;
						townName = towns[0][towns[0].key];
						context$1$0.next = 11;
						return regeneratorRuntime.awrap(this.getVillagesByTown(townName));

					case 11:
						villages = context$1$0.sent;
						return context$1$0.abrupt('return', { counties: counties, towns: towns, villages: villages });

					case 15:
						context$1$0.prev = 15;
						context$1$0.t0 = context$1$0['catch'](0);

						console.error(context$1$0.t0);

					case 18:
					case 'end':
						return context$1$0.stop();
				}
			}, null, this, [[0, 15]]);
		},

		getSubAreaByCounty_async: function getSubAreaByCounty_async(county) {
			var towns, townName, villages;
			return regeneratorRuntime.async(function getSubAreaByCounty_async$(context$1$0) {
				while (1) switch (context$1$0.prev = context$1$0.next) {
					case 0:
						context$1$0.prev = 0;
						context$1$0.next = 3;
						return regeneratorRuntime.awrap(this.getTownsByCounty(county));

					case 3:
						towns = context$1$0.sent;
						townName = towns[0][towns[0].key];
						context$1$0.next = 7;
						return regeneratorRuntime.awrap(this.getVillagesByTown(townName));

					case 7:
						villages = context$1$0.sent;
						return context$1$0.abrupt('return', { towns: towns, villages: villages });

					case 11:
						context$1$0.prev = 11;
						context$1$0.t0 = context$1$0['catch'](0);

						console.error(context$1$0.t0);

					case 14:
					case 'end':
						return context$1$0.stop();
				}
			}, null, this, [[0, 11]]);
		},

		addPrimarykey: function addPrimarykey(json, keyName) {
			json.forEach(function (item) {
				return item.key = keyName;
			});
		},

		_getJsonValue: function _getJsonValue(json) {
			var idx = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

			return json[idx][json[idx].key];
		},

		_trimCentCounties: function _trimCentCounties(counties) {
			return counties.filter(function (county) {
				return !_storage.centCounties.some(function (cent) {
					return county.Name === cent;
				});
			});
		}

	};

	exports['default'] = AreaRange;
	module.exports = exports['default'];

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "Area.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	__webpack_require__(17);

	var _storage = __webpack_require__(6);

	var _Eventful = __webpack_require__(11);

	var _Eventful2 = _interopRequireDefault(_Eventful);

	var _map = __webpack_require__(7);

	var _map2 = _interopRequireDefault(_map);

	var _aaicQuery = __webpack_require__(13);

	var _aaicQuery2 = _interopRequireDefault(_aaicQuery);

	var _dialog = __webpack_require__(23);

	var _dialog2 = _interopRequireDefault(_dialog);

	var _util = __webpack_require__(12);

	var _util2 = _interopRequireDefault(_util);

	var connect = _aaicQuery2['default'].createConnect();
	var curcoding = '';
	var curbdid = '';

	var LandMod = (function (_React$Component) {
	    _inherits(LandMod, _React$Component);

	    function LandMod() {
	        _classCallCheck(this, LandMod);

	        _get(Object.getPrototypeOf(LandMod.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(LandMod, [{
	        key: 'handlerChange',
	        value: function handlerChange(event) {
	            var _event$srcElement = event.srcElement;
	            var target = _event$srcElement === undefined ? event.target : _event$srcElement;
	            var fid = this.props.land.FID;

	            var fea = _map2['default'].curWindowInsureFeas.find(function (fea) {
	                return fea.fields.FID == fid;
	            });
	            if (target.checked) {
	                _map2['default'].exceptFIDArr = _map2['default'].exceptFIDArr.filter(function (exfid) {
	                    return exfid !== fid;
	                });
	                fea && _map2['default'].insure_Featurelayer.addFeature(fea);
	            } else {
	                _map2['default'].exceptFIDArr.push(fid);
	                fea && _map2['default'].insure_Featurelayer.removeFeature(fea);
	            }
	        }
	    }, {
	        key: 'handlerLocation',
	        value: function handlerLocation(event) {
	            var point = this.props.land.centerPoint.split(',');
	            _map2['default'].map.zoomTo(parseFloat(point[0]), parseFloat(point[1]), { zl: 1 });
	        }
	    }, {
	        key: 'handlerDelete',
	        value: function handlerDelete(event) {
	            var props = this.props;
	            this.props.deleteLand(props.land.FID, props.bdid, props.coding);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _props = this.props;
	            var land = _props.land;
	            var index = _props.index;

	            var style = land.highlight ? { color: '#e10601' } : { color: 'inherit' };
	            return React.createElement(
	                'li',
	                { className: 'l-item' },
	                React.createElement('input', { type: 'checkbox', className: 'l-check', defaultChecked: 'checked', onChange: this.handlerChange.bind(this) }),
	                React.createElement(
	                    'div',
	                    { className: 'l-detail', onClick: this.handlerLocation.bind(this), style: style },
	                    React.createElement(
	                        'p',
	                        { className: 'l-name' },
	                        ' 地块',
	                        React.createElement(
	                            'span',
	                            { className: 'land-num' },
	                            index + 1
	                        )
	                    ),
	                    React.createElement(
	                        'p',
	                        { className: 'l-i i-area' },
	                        ' 地块面积:',
	                        (parseFloat(land.SHPAREA) / 666.67).toFixed(2),
	                        '亩'
	                    ),
	                    React.createElement(
	                        'p',
	                        { className: 'l-i i-landtype' },
	                        ' 用地类型:',
	                        land.LANDTYPE_C
	                    )
	                ),
	                React.createElement('i', { className: 'i-delbtn', onClick: this.handlerDelete.bind(this) })
	            );
	        }
	    }]);

	    return LandMod;
	})(React.Component);

	var BdMod = (function (_React$Component2) {
	    _inherits(BdMod, _React$Component2);

	    function BdMod() {
	        _classCallCheck(this, BdMod);

	        _get(Object.getPrototypeOf(BdMod.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(BdMod, [{
	        key: 'handlerInsert',
	        value: function handlerInsert(event) {
	            curcoding = this.props.coding;
	            curbdid = this.props.bdxq.ID;
	            _map2['default'].editPolygon.activate();
	            _map2['default'].map.setCursorStyle('select', _storage.config.addptsrc);
	            _map2['default'].ifreshape = false;
	            _map2['default'].selectAim = 'addLand';
	        }
	    }, {
	        key: 'handlerLocation',
	        value: function handlerLocation(event) {
	            var x = this.props.bdxq.X;
	            var y = this.props.bdxq.Y;

	            _map2['default'].map.zoomTo(parseFloat(x), parseFloat(y), { zl: 1 });
	        }
	    }, {
	        key: 'handlerSwitch',
	        value: function handlerSwitch(event) {
	            var _props2 = this.props;
	            var coding = _props2.coding;
	            var bdxq = _props2.bdxq;
	            var isOpen = _props2.isOpen;

	            this.props.handlerFolder(coding, bdxq.ID, isOpen);
	        }
	    }, {
	        key: 'handlerDetail',
	        value: function handlerDetail(event) {
	            var target = 'BD';
	            var type = 'MODIFY';
	            var detail = this.props.bdxq;

	            ReactDOM.render(React.createElement(_dialog2['default'], { target: target, type: type, detail: detail }), document.getElementById(this.props.maskId));
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this = this;

	            var _props3 = this.props;
	            var bdxq = _props3.bdxq;
	            var landArr = _props3.landArr;
	            var index = _props3.index;
	            var isOpen = _props3.isOpen;

	            var _ref = isOpen ? [{ background: 'url(img/m24.png) no-repeat center' }, { display: 'block' }] : [{ background: 'url(img/p24.png) no-repeat center' }, { display: 'none' }];

	            var _ref2 = _slicedToArray(_ref, 2);

	            var folderStyle = _ref2[0];
	            var listStyle = _ref2[1];

	            return React.createElement(
	                'li',
	                { className: 'bd-item clearfix' },
	                React.createElement(
	                    'div',
	                    { className: 'bd-div' },
	                    React.createElement('i', { className: 'bd-openarrow', style: folderStyle, onClick: this.handlerSwitch.bind(this) }),
	                    React.createElement(
	                        'div',
	                        { className: 'bd-detail', title: '定位到标的', onClick: this.handlerLocation.bind(this) },
	                        React.createElement(
	                            'p',
	                            { className: 'bd-title' },
	                            ' 标的',
	                            React.createElement(
	                                'span',
	                                { className: 'bd-num' },
	                                index + 1
	                            ),
	                            ':',
	                            React.createElement(
	                                'span',
	                                { className: 'bd-name' },
	                                bdxq.BDNAME
	                            )
	                        ),
	                        React.createElement(
	                            'p',
	                            { className: 'bd-i' },
	                            ' 标的面积:',
	                            React.createElement(
	                                'span',
	                                { className: 'bd-area' },
	                                bdxq.AREA
	                            ),
	                            '亩'
	                        ),
	                        React.createElement(
	                            'p',
	                            { className: 'bd-i bd-pzname' },
	                            '品种名称:',
	                            React.createElement(
	                                'span',
	                                { className: 'bd-pzname-txt' },
	                                bdxq.PZNAME
	                            )
	                        ),
	                        React.createElement(
	                            'p',
	                            { className: 'bd-i bd-addr' },
	                            '地址:',
	                            React.createElement(
	                                'span',
	                                { className: 'bd-addr-txt' },
	                                bdxq.ADDRESS
	                            )
	                        )
	                    ),
	                    React.createElement('i', { className: 'bd-dt', title: '详情', onClick: this.handlerDetail.bind(this) }),
	                    React.createElement('i', { className: 'land-draw', title: '添加地块', onClick: this.handlerInsert.bind(this) })
	                ),
	                React.createElement(
	                    'ul',
	                    { className: 'bd-land clearfix', style: listStyle },
	                    landArr.map(function (land, idx) {
	                        return React.createElement(LandMod, _extends({ key: 'land-' + land.FID, land: land }, _this.props.handler4land, { coding: _this.props.coding, bdid: _this.props.bdxq.ID, index: idx }));
	                    })
	                )
	            );
	        }
	    }]);

	    return BdMod;
	})(React.Component);

	var PolicyMod = (function (_React$Component3) {
	    _inherits(PolicyMod, _React$Component3);

	    function PolicyMod() {
	        _classCallCheck(this, PolicyMod);

	        _get(Object.getPrototypeOf(PolicyMod.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(PolicyMod, [{
	        key: 'handlerSwitch',
	        value: function handlerSwitch(event) {
	            var _props4 = this.props;
	            var policy = _props4.policy;
	            var isOpen = _props4.isOpen;

	            this.props.handlerArrow(policy.CODING, isOpen);
	        }
	    }, {
	        key: 'handlerDetail',
	        value: function handlerDetail(event) {
	            var target = 'POLICY';
	            var type = 'MODIFY';
	            var detail = this.props.policy;

	            ReactDOM.render(React.createElement(_dialog2['default'], { target: target, type: type, detail: detail }), document.getElementById(this.props.maskId));
	        }
	    }, {
	        key: 'handlerInsert',
	        value: function handlerInsert(event) {
	            var target = 'BD';
	            var type = 'CREATE';
	            var CODING = this.props.policy.CODING;

	            var detail = { CODING: CODING };
	            ReactDOM.render(React.createElement(_dialog2['default'], { target: target, type: type, detail: detail }), document.getElementById(this.props.maskId));
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this2 = this;

	            var _props5 = this.props;
	            var policy = _props5.policy;
	            var bdArr = _props5.bdArr;
	            var isOpen = _props5.isOpen;

	            var _ref3 = isOpen ? [{ background: 'url(img/arrow_up.png) no-repeat center' }, { display: 'block' }] : [{ background: 'url(img/arrow_down.png) no-repeat center' }, { display: 'none' }];

	            var _ref32 = _slicedToArray(_ref3, 2);

	            var arrowStyle = _ref32[0];
	            var listStyle = _ref32[1];

	            return React.createElement(
	                'li',
	                { className: 'p-item clearfix' },
	                React.createElement(
	                    'div',
	                    { className: 'p-title' },
	                    React.createElement('i', { className: 'open-arrow', style: arrowStyle, onClick: this.handlerSwitch.bind(this) }),
	                    React.createElement(
	                        'div',
	                        { className: 'p-detail', onClick: this.handlerSwitch.bind(this) },
	                        React.createElement(
	                            'p',
	                            { className: 'p-name' },
	                            ' 投保人:',
	                            policy.POLICYHOLDER,
	                            ' '
	                        ),
	                        React.createElement(
	                            'p',
	                            { className: 'p-i i-id' },
	                            ' 保单编号:',
	                            policy.CODING,
	                            ' '
	                        ),
	                        React.createElement(
	                            'p',
	                            { className: 'p-i i-name' },
	                            ' 险种名称:',
	                            React.createElement(
	                                'span',
	                                { className: 'i-name-txt' },
	                                policy.SECURENAME
	                            )
	                        ),
	                        React.createElement(
	                            'p',
	                            { className: 'p-i i-area' },
	                            ' 总面积:',
	                            React.createElement(
	                                'span',
	                                { className: 'pl-area' },
	                                ' ',
	                                policy.AREA,
	                                ' '
	                            ),
	                            '亩'
	                        )
	                    ),
	                    React.createElement('i', { className: 'p-detailbtn', title: '详情', onClick: this.handlerDetail.bind(this) }),
	                    React.createElement('i', { className: 'bd-create', title: '添加标的', onClick: this.handlerInsert.bind(this) })
	                ),
	                React.createElement(
	                    'ul',
	                    { className: 'l-items', style: listStyle },
	                    bdArr.map(function (bd, idx) {
	                        return React.createElement(BdMod, _extends({ key: 'bd-' + bd.bdxq.ID }, bd, { coding: policy.CODING, maskId: _this2.props.maskId }, _this2.props.handler4bd, { index: idx }));
	                    })
	                )
	            );
	        }
	    }]);

	    return PolicyMod;
	})(React.Component);

	var ListView = (function (_React$Component4) {
	    _inherits(ListView, _React$Component4);

	    function ListView(props) {
	        _classCallCheck(this, ListView);

	        _get(Object.getPrototypeOf(ListView.prototype), 'constructor', this).call(this, props);
	        this.config = { maskId: 'mask-layer', defaultOpen: true };
	        this.state = {
	            items: [],
	            search: ''
	        };
	    }

	    _createClass(ListView, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            _Eventful2['default'].subscribe('refreshList', this.refreshList.bind(this));
	            _Eventful2['default'].subscribe('insertLand', this.insertLand_ex.bind(this));
	            _Eventful2['default'].subscribe('alterBd', this.alterBd_ex.bind(this));
	            _Eventful2['default'].subscribe('alterPolicy', this.alterPolicy_ex.bind(this));
	            _Eventful2['default'].subscribe('deletePolicy', this.deletePolicy_ex.bind(this));
	            _Eventful2['default'].subscribe('deleteBd', this.deleteBd_ex.bind(this));
	        }
	    }, {
	        key: 'refreshList',
	        value: function refreshList(json, fid) {
	            this.pretreat(json, fid);
	            _map2['default'].getVectorLandData();
	            this.setState({ items: json });
	        }
	    }, {
	        key: 'pretreat',
	        value: function pretreat(items, fid) {
	            _map2['default'].curListBdArr = [];
	            _map2['default'].exceptFIDArr = [];
	            for (var i = 0; i < items.length; i++) {
	                var item = items[i];
	                item.isOpen = this.config.defaultOpen;
	                for (var j = 0; j < item.bdArr.length; j++) {
	                    var bd = item.bdArr[j];
	                    bd.isOpen = this.config.defaultOpen;
	                    _map2['default'].curListBdArr.push(bd.bdxq.ID);
	                    for (var z = 0; z < bd.landArr.length; z++) {
	                        var land = bd.landArr[z];
	                        land.highlight = false;
	                        if (fid && land.FID === fid) {
	                            land.highlight = true;
	                        }
	                        var cp = this._calCenterPoint(land.XMIN, land.XMAX, land.YMIN, land.YMAX);
	                        land.centerPoint = cp.x + ',' + cp.y;
	                    }
	                }
	            }
	        }
	    }, {
	        key: '_handlerDateForm',
	        value: function _handlerDateForm(data) {
	            data['START'] && (data['START'] = parseInt(data['START'].replace(/-/g, '')));
	            data['END'] && (data['END'] = parseInt(data['END'].replace(/-/g, '')));
	        }
	    }, {
	        key: 'alterPolicy_ex',
	        value: function alterPolicy_ex(type, detail) {
	            var _this3 = this;

	            var plTAB = _storage.config.policyTab;
	            this._handlerDateForm(detail);
	            var params = { Fields: [], Data: [[]] };
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = Object.keys(detail)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var key = _step.value;

	                    if (key === 'CODING') {
	                        params.Fields.unshift(key);
	                        params.Data[0].unshift(detail[key]);
	                        continue;
	                    }
	                    params.Fields.push(key);
	                    params.Data[0].push(detail[key]);
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator['return']) {
	                        _iterator['return']();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }

	            if (type === 'INSERT') {
	                detail.USRID = sessionStorage.getItem('usrName');
	                detail.AREA = 0;
	                params.Fields.push('USRID', 'AREA');
	                params.Data[0].push(detail.USRID, detail.AREA);
	                var plJson = { policy: detail, bdArr: [], isOpen: true };
	                this.state.items.push(plJson);
	                _util2['default'].recordAdd(_storage.config.dbName, plTAB, params, function () {
	                    _util2['default'].newalertDiv('添加成功');
	                    _this3.setState({ items: _this3.state.items });
	                });
	            } else {
	                this.state.items.forEach(function (item) {
	                    if (item.policy.CODING === detail.CODING) {
	                        item.policy = detail;
	                    }
	                });
	                _util2['default'].recordUpdate(_storage.config.dbName, plTAB, params, function () {
	                    _util2['default'].newalertDiv('保存成功');
	                    _this3.setState({ items: _this3.state.items });
	                });
	            }
	        }
	    }, {
	        key: 'deletePolicy_ex',
	        value: function deletePolicy_ex(coding) {
	            var curInsFeas = _map2['default'].curWindowInsureFeas;
	            _map2['default'].curWindowInsureFeas = curInsFeas.filter(function (fea) {
	                if (fea.fields.CODING == coding) _map2['default'].insure_Featurelayer.removeFeature(fea);
	                return fea.fields.CODING != coding;
	            });
	            this.state.items = this.state.items.filter(function (item) {
	                return item.policy.CODING !== coding;
	            });
	            this.setState({ items: this.state.items });
	            connect.deletePolicyByCoding(coding, function () {
	                _util2['default'].newalertDiv('删除成功');
	            });
	        }
	    }, {
	        key: 'alterBd_ex',
	        value: function alterBd_ex(type, detail, point) {
	            var _this4 = this;

	            var bdTAB = _storage.config.bdTab;
	            var params = { Fields: [], Data: [[]] };
	            var _iteratorNormalCompletion2 = true;
	            var _didIteratorError2 = false;
	            var _iteratorError2 = undefined;

	            try {
	                for (var _iterator2 = Object.keys(detail)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                    var key = _step2.value;

	                    if (key === 'ID') {
	                        params.Fields.unshift(key);
	                        params.Data[0].unshift(detail[key]);
	                        continue;
	                    }
	                    params.Fields.push(key);
	                    params.Data[0].push(detail[key]);
	                }
	            } catch (err) {
	                _didIteratorError2 = true;
	                _iteratorError2 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                        _iterator2['return']();
	                    }
	                } finally {
	                    if (_didIteratorError2) {
	                        throw _iteratorError2;
	                    }
	                }
	            }

	            if (type === 'INSERT') {
	                (function () {
	                    detail.AREA = 0;
	                    params.Fields.push('AREA');
	                    params.Data[0].push(detail.AREA);
	                    var bdJson = { bdxq: detail, landArr: [], isOpen: true };
	                    _this4.state.items.forEach(function (item) {
	                        if (item.policy.CODING === detail.CODING) {
	                            item.bdArr.push(bdJson);
	                        }
	                    });
	                    _util2['default'].recordAdd(_storage.config.dbName, bdTAB, params, function () {
	                        _util2['default'].newalertDiv('添加成功');
	                        _map2['default'].map.zoomTo(parseFloat(point.X), parseFloat(point.Y), { zl: 1 });
	                        var SQL = { 'fields': 'max(ID)', 'lyr': bdTAB, 'filter': '' };
	                        _util2['default'].recordQuery(_storage.config.dbName, SQL, function (msg) {
	                            bdJson.bdxq.ID = msg[0]['max(ID)'];
	                            _this4.setState({ items: _this4.state.items });
	                        });
	                    });
	                })();
	            } else {
	                this.state.items.forEach(function (item) {
	                    if (item.policy.CODING === detail.CODING) {
	                        var bdArr = item.bdArr;
	                        bdArr.forEach(function (bd) {
	                            if (bd.bdxq.ID === detail.ID) {
	                                bd.bdxq = detail;
	                            }
	                        });
	                    }
	                });
	                _util2['default'].recordUpdate(_storage.config.dbName, bdTAB, params, function () {
	                    _util2['default'].newalertDiv('保存成功');
	                    _map2['default'].map.zoomTo(parseFloat(point.X), parseFloat(point.Y), { zl: 1 });
	                    _this4.setState({ items: _this4.state.items });
	                });
	            }
	        }
	    }, {
	        key: 'deleteBd_ex',
	        value: function deleteBd_ex(coding, bdid, area) {
	            var curInsFeas = _map2['default'].curWindowInsureFeas;
	            _map2['default'].curWindowInsureFeas = curInsFeas.filter(function (fea) {
	                if (fea.fields.BDID === bdid) _map2['default'].insure_Featurelayer.removeFeature(fea);
	                return fea.fields.BDID !== bdid;
	            });
	            this.state.items.forEach(function (item) {
	                if (item.policy.CODING == coding) {
	                    item.bdArr = item.bdArr.filter(function (bd) {
	                        return bd.bdxq.ID !== bdid;
	                    });
	                    item.policy.AREA = (parseFloat(item.policy.AREA) - area).toFixed(2);
	                    connect.updateArea4Policy(coding, item.policy.AREA);
	                }
	            });
	            this.setState({ items: this.state.items });
	            connect.deleteBdById(bdid, function () {
	                _util2['default'].newalertDiv('删除成功');
	            });
	        }
	    }, {
	        key: 'insertLand_ex',
	        value: function insertLand_ex(selectedfea) {
	            var _ref4 = [selectedfea.fields, { Fields: _storage.landRelFields, Data: [[]] }];
	            var fields = _ref4[0];
	            var params = _ref4[1];
	            var _ref4$2 = _ref4[2];
	            var land = _ref4$2 === undefined ? { BDID: curbdid, CODING: curcoding } : _ref4$2;

	            _storage.landRelFields.forEach(function (fid) {
	                if (fields[fid]) {
	                    land[fid] = fields[fid];
	                    params.Data[0].push(fields[fid]);
	                } else {
	                    fid === 'BDID' && params.Data[0].push(curbdid);
	                    fid === 'CODING' && params.Data[0].push(curcoding);
	                }
	            });
	            var cp = this._calCenterPoint(land.XMIN, land.XMAX, land.YMIN, land.YMAX);
	            land.centerPoint = cp.x + ',' + cp.y;

	            selectedfea.addFields({ 'BDID': curbdid, 'CODING': curcoding });
	            _map2['default'].curWindowInsureFeas.push(selectedfea);
	            _map2['default'].curWindowInsureFeas.forEach(function (fea) {
	                if (fea.fields.BDID == curbdid) {
	                    _map2['default'].insure_Featurelayer.addFeature(fea);
	                }
	            });
	            if (!_util2['default'].isInArr(curbdid, _map2['default'].curListBdArr)) {
	                _map2['default'].curListBdArr.push(curbdid);
	            }

	            var area = 0;
	            this.state.items.forEach(function (item) {
	                if (item.policy.CODING === curcoding) {
	                    var bdArr = item.bdArr;
	                    bdArr.forEach(function (bd) {
	                        if (bd.bdxq.ID === curbdid) {
	                            bd.isOpen = true;
	                            bd.landArr.push(land);
	                            area = parseFloat(land.SHPAREA) / 666.67;
	                            bd.bdxq.AREA = (parseFloat(bd.bdxq.AREA) + area).toFixed(2);
	                            connect.updateArea4Bd(bd.bdxq.ID, bd.bdxq.AREA);
	                        }
	                    });
	                    item.policy.AREA = (parseFloat(item.policy.AREA) + area).toFixed(2);
	                    connect.updateArea4Policy(item.policy.CODING, item.policy.AREA);
	                }
	            });
	            this.setState({ items: this.state.items });
	            _util2['default'].recordAdd(_storage.config.dbName, _storage.config.landRelTab, params);
	        }
	    }, {
	        key: '_calCenterPoint',
	        value: function _calCenterPoint(xmin, xmax, ymin, ymax) {
	            return {
	                x: (parseFloat(xmin) + parseFloat(xmax)) / 2,
	                y: (parseFloat(ymin) + parseFloat(ymax)) / 2
	            };
	        }
	    }, {
	        key: 'handlerInputChange',
	        value: function handlerInputChange(event) {
	            var _event$srcElement2 = event.srcElement;
	            var target = _event$srcElement2 === undefined ? event.target : _event$srcElement2;

	            this.setState({ search: target.value });
	        }
	    }, {
	        key: 'handlerKeyDown',
	        value: function handlerKeyDown(event) {
	            var _event$srcElement3 = event.srcElement;
	            var target = _event$srcElement3 === undefined ? event.target : _event$srcElement3;

	            if (event.keyCode === 13) {
	                this.search(target.value);
	            }
	        }
	    }, {
	        key: 'searchItem',
	        value: function searchItem(event) {
	            this.search(this.refs.search.value);
	        }
	    }, {
	        key: 'search',
	        value: function search(val) {
	            var _this5 = this;

	            this.setState({ search: '' });
	            connect.fuzzyQuery(val, function (json) {
	                _this5.refreshList(json);
	                if (json.length > 0 && json[0].bdArr.length > 0) {
	                    var bdxq = json[0].bdArr[0].bdxq;
	                    _map2['default'].map.zoomTo(parseFloat(bdxq['X']), parseFloat(bdxq['Y']), { 'zl': 1 });
	                }
	            });
	        }
	    }, {
	        key: 'handlerNewPolicy',
	        value: function handlerNewPolicy(event) {
	            var target = 'POLICY';
	            var type = 'CREATE';

	            ReactDOM.render(React.createElement(_dialog2['default'], { target: target, type: type }), document.getElementById(this.config.maskId));
	        }
	    }, {
	        key: 'handlerArrow',
	        value: function handlerArrow(coding, isOpen) {
	            var feas = _map2['default'].curWindowInsureFeas;
	            this.state.items.forEach(function (item) {
	                if (item.policy.CODING === coding) {
	                    (function () {
	                        var bdArr = item.bdArr;
	                        if (isOpen) {
	                            _map2['default'].curListBdArr = _map2['default'].curListBdArr.filter(function (curbdid) {
	                                return !bdArr.some(function (bd) {
	                                    return bd.bdxq.ID === curbdid;
	                                });
	                            });
	                            feas.forEach(function (fea) {
	                                var BDID = fea.fields.BDID;
	                                if (bdArr.some(function (bd) {
	                                    return bd.bdxq.ID === BDID;
	                                })) {
	                                    _map2['default'].insure_Featurelayer.removeFeature(fea);
	                                }
	                            });
	                        } else {
	                            bdArr = bdArr.filter(function (bd) {
	                                return bd.isOpen === true;
	                            });
	                            bdArr.forEach(function (bd) {
	                                _map2['default'].curListBdArr.push(bd.bdxq.ID);
	                            });
	                            feas.forEach(function (fea) {
	                                var BDID = fea.fields.BDID;
	                                if (bdArr.some(function (bd) {
	                                    return bd.bdxq.ID === BDID;
	                                }) && !_util2['default'].isInArr(fea.fields.FID, _map2['default'].exceptFIDArr)) {
	                                    _map2['default'].insure_Featurelayer.addFeature(fea);
	                                }
	                            });
	                        }
	                        item.isOpen = !isOpen;
	                    })();
	                }
	            });
	            this.setState({ items: this.state.items });
	        }
	    }, {
	        key: 'handlerFolder',
	        value: function handlerFolder(coding, bdid, isOpen) {
	            var feas = _map2['default'].curWindowInsureFeas;
	            if (isOpen) {
	                _map2['default'].curListBdArr = _map2['default'].curListBdArr.filter(function (_bdid) {
	                    return _bdid !== bdid;
	                });
	                feas.forEach(function (fea) {
	                    if (fea.fields.BDID == bdid) {
	                        _map2['default'].insure_Featurelayer.removeFeature(fea);
	                    }
	                });
	            } else {
	                _map2['default'].curListBdArr.push(bdid);
	                feas.forEach(function (fea) {
	                    if (fea.fields.BDID == bdid && !_util2['default'].isInArr(fea.fields.FID, _map2['default'].exceptFIDArr)) {
	                        _map2['default'].insure_Featurelayer.addFeature(fea);
	                    }
	                });
	            }
	            this.state.items.forEach(function (item) {
	                if (item.policy.CODING === coding) {
	                    var bdArr = item.bdArr;
	                    bdArr.forEach(function (bd) {
	                        if (bd.bdxq.ID === bdid) {
	                            bd.isOpen = !isOpen;
	                        }
	                    });
	                }
	            });
	            this.setState({ items: this.state.items });
	        }
	    }, {
	        key: 'deleteLand',
	        value: function deleteLand(fid, bdid, coding) {
	            var area = 0;
	            _map2['default'].curWindowInsureFeas = _map2['default'].curWindowInsureFeas.filter(function (fea) {
	                if (fea.fields.FID === fid) _map2['default'].insure_Featurelayer.removeFeature(fea);
	                return fea.fields.FID !== fid;
	            });
	            this.state.items.forEach(function (item) {
	                if (item.policy.CODING === coding) {
	                    var bdArr = item.bdArr;
	                    bdArr.forEach(function (bd) {
	                        if (bd.bdxq.ID === bdid) {
	                            bd.landArr = bd.landArr.filter(function (land) {
	                                if (land.FID === fid) area = parseFloat(land.SHPAREA) / 666.67;
	                                return land.FID !== fid;
	                            });
	                            bd.bdxq.AREA = (parseFloat(bd.bdxq.AREA) - area).toFixed(2);
	                            connect.updateArea4Bd(bd.bdxq.ID, bd.bdxq.AREA);
	                        }
	                    });
	                    item.policy.AREA = (parseFloat(item.policy.AREA) - area).toFixed(2);
	                    connect.updateArea4Policy(item.policy.CODING, item.policy.AREA);
	                }
	            });
	            this.setState({ items: this.state.items });
	            var params = {
	                'Fields': 'FID',
	                'Data': [fid]
	            };
	            _util2['default'].recordDelete(_storage.config.dbName, _storage.config.landRelTab, params);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this6 = this;

	            var handler4policy = {
	                handlerArrow: this.handlerArrow.bind(this),
	                handler4bd: {
	                    handlerFolder: this.handlerFolder.bind(this),
	                    handler4land: {
	                        deleteLand: this.deleteLand.bind(this)
	                    }
	                }
	            };
	            return React.createElement(
	                'div',
	                { className: 'item-wrap', style: this.props.css },
	                React.createElement(
	                    'div',
	                    { className: 'item-search-wrap' },
	                    React.createElement('input', { type: 'text', className: 'item-search-input', ref: 'search', value: this.state.search, placeholder: '编号/证件号/姓名/电话', onChange: this.handlerInputChange.bind(this), onKeyDown: this.handlerKeyDown.bind(this) }),
	                    React.createElement(
	                        'div',
	                        { className: 'item-search-btn', onClick: this.searchItem.bind(this) },
	                        React.createElement('img', { className: 'item-search-logo', src: 'img/search.png' })
	                    )
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'policy-add-btn', title: '新建保单', onClick: this.handlerNewPolicy.bind(this) },
	                    React.createElement('img', { className: 'item-insert-logo', src: 'img/add_2.png' }),
	                    React.createElement(
	                        'span',
	                        { className: 'item-insert-txt' },
	                        '新建保单'
	                    )
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'item-contain' },
	                    React.createElement(
	                        'ul',
	                        { className: 'item-ul' },
	                        this.state.items.map(function (item, idx) {
	                            return React.createElement(PolicyMod, _extends({ key: item.policy.CODING }, _this6.config, item, handler4policy, { index: idx }));
	                        })
	                    )
	                )
	            );
	        }
	    }]);

	    return ListView;
	})(React.Component);

	var ListComponent = (function (_React$Component5) {
	    _inherits(ListComponent, _React$Component5);

	    function ListComponent(props) {
	        _classCallCheck(this, ListComponent);

	        _get(Object.getPrototypeOf(ListComponent.prototype), 'constructor', this).call(this, props);
	        this.state = {
	            open: true
	        };
	    }

	    _createClass(ListComponent, [{
	        key: 'handlerVisible',
	        value: function handlerVisible(event) {
	            this.setState({ open: !this.state.open });
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _ref5 = this.state.open ? ['img/closepad.png', { left: 0, opacity: 'show' }] : ['img/openpad.png', { left: '-350px', opacity: 'hidden' }];

	            var _ref52 = _slicedToArray(_ref5, 2);

	            var src = _ref52[0];
	            var style = _ref52[1];

	            return React.createElement(
	                'div',
	                { className: 'item-wraplist' },
	                React.createElement(
	                    'div',
	                    { className: 'i-title' },
	                    React.createElement(
	                        'span',
	                        null,
	                        '保单列表'
	                    ),
	                    React.createElement('img', { className: 'Arrimg', src: src, onClick: this.handlerVisible.bind(this) })
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'itemlist-pannel', style: style },
	                    React.createElement(ListView, { css: style })
	                )
	            );
	        }
	    }]);

	    return ListComponent;
	})(React.Component);

	ReactDOM.render(React.createElement(ListComponent, null), document.getElementById('list-view'));

	$('.item-contain').perfectScrollbar();

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "list.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(18);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./list.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./list.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "\r\n.itemlist-pannel {\r\n    position: absolute;\r\n    left: 0;\r\n    top:35px;\r\n    width: 350px;\r\n    bottom: 0;\r\n    background: #fff;\r\n    border-right: 1px solid #eee;\r\n    font-family: 'Microsoft Yahei';\r\n    z-index: 998;\r\n    transition: all .5s;\r\n    -webkit-transition: all .5s;\r\n}\r\n.item-wrap {\r\n    position: absolute;\r\n    width: 100%;\r\n    height: 100%;\r\n    left: 0;\r\n    top: 0;\r\n    transition: all .8s;\r\n    -webkit-transition: all .8s;\r\n}\r\n\r\n.i-title {\r\n    position: absolute;\r\n    width: 350px;\r\n    height: 35px;\r\n    top:0;\r\n    border-bottom: 1px solid #eee;\r\n    font-size: 16px;\r\n    color: #333;\r\n    font-family: 'SimSun';\r\n    background-color: #fff;\r\n    line-height: 34px;\r\n    text-indent: 10px;\r\n    z-index: 998;\r\n}\r\n.i-title span{\r\n    font-weight: bold;\r\n}\r\n\r\n.Arrimg {\r\n    position: absolute;\r\n    top: 10px;\r\n    right: 20px;\r\n    cursor: pointer;\r\n    z-index: 3;\r\n}\r\n\r\n.close-pannel {\r\n    float: right;\r\n    margin-right: 10px;\r\n    color: #38A800;\r\n}\r\n\r\n.close-pannel:hover {\r\n    cursor: pointer;\r\n    text-decoration: underline;\r\n}\r\n\r\n.item-contain{\r\n    position: absolute;\r\n    width: 100%;\r\n    top: 75px;\r\n    bottom: 0;\r\n    overflow: hidden;    \r\n}\r\n\r\n.item-search-wrap{\r\n\tposition: relative;\r\n    width: 100%;\r\n    overflow: hidden;\r\n\tline-height: 35px;\r\n    text-indent: 10px;\r\n    box-sizing: content-box;\r\n}\r\n.item-search-btn{\r\n\tposition: relative;\r\n    display: inline-block;\r\n    width: 90px;\r\n    margin-left: 4px;\r\n    height: 30px;\r\n    font-size: 13px;\r\n    font-weight: bold;\r\n    color: #444;\r\n    text-shadow: 0 1px 0 rgba(255,255,255,0.9);\r\n    white-space: nowrap;\r\n    background-color: #eaeaea;\r\n    background-image: -moz-linear-gradient(#fafafa, #eaeaea);\r\n    background-image: -webkit-linear-gradient(#fafafa, #eaeaea);\r\n    background-image: linear-gradient(#fafafa, #eaeaea);\r\n    background-repeat: repeat-x;\r\n    border-radius: 3px;\r\n    border: 1px solid #ddd;\r\n    border-bottom-color: #c5c5c5;\r\n    box-shadow: 0 1px 3px rgba(0,0,0,.05);\r\n    vertical-align: middle;\r\n    cursor: pointer;\r\n    -moz-box-sizing: border-box;\r\n    box-sizing: border-box;\r\n    -webkit-touch-callout: none;\r\n    -webkit-user-select: none;\r\n    -khtml-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n    -webkit-appearance: none;\r\n}\r\n.item-search-btn:hover{\r\n  background-position: 0 -15px;\r\n  border-color: #ccc #ccc #b5b5b5;\r\n}\r\n.item-search-btn:active {\r\n  background-color: #dadada;\r\n  border-color: #b5b5b5;\r\n  background-image: none;\r\n  box-shadow: inset 0 3px 5px rgba(0,0,0,.15);\r\n}\r\n.item-search-btn:focus{\r\n  outline: none;\r\n  border-color: #51a7e8;\r\n  box-shadow: inset 0 1px 2px rgba(0,0,0,.075), 0 0 5px rgba(81,167,232,.5);\r\n}\r\n.policy-add-btn{\r\n    position: relative;\r\n    display: inline-block;\r\n    top:5px;\r\n    left:10px;\r\n    width: 324px;\r\n    height: 35px;\r\n    font-size: 13px;\r\n    font-weight: bold;\r\n    color: #444;\r\n    text-shadow: 0 1px 0 rgba(255,255,255,0.9);\r\n    white-space: nowrap;\r\n    background-color: #eaeaea;\r\n    background-image: -moz-linear-gradient(#fafafa, #eaeaea);\r\n    background-image: -webkit-linear-gradient(#fafafa, #eaeaea);\r\n    background-image: linear-gradient(#fafafa, #eaeaea);\r\n    background-repeat: repeat-x;\r\n    border-radius: 3px;\r\n    border: 1px solid #ddd;\r\n    border-bottom-color: #c5c5c5;\r\n    box-shadow: 0 1px 3px rgba(0,0,0,.05);\r\n    vertical-align: middle;\r\n    cursor: pointer;\r\n    -moz-box-sizing: border-box;\r\n    box-sizing: border-box;\r\n    -webkit-touch-callout: none;\r\n    -webkit-user-select: none;\r\n    -khtml-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n    -webkit-appearance: none;\r\n}\r\n.policy-add-btn:hover{\r\n    background-position: 0 -15px;\r\n    border-color: #ccc #ccc #b5b5b5;\r\n}\r\n.policy-add-btn:active{\r\n    background-color: #dadada;\r\n    border-color: #b5b5b5;\r\n    background-image: none;\r\n    box-shadow: inset 0 3px 5px rgba(0,0,0,.15);\r\n}\r\n.policy-add-btn:focus{\r\n    outline: none;\r\n    border-color: #51a7e8;\r\n    box-shadow: inset 0 1px 2px rgba(0,0,0,.075), 0 0 5px rgba(81,167,232,.5);\r\n}\r\n.item-search-input{\r\n\twidth: 230px;\r\n    height: 32px;\r\n    border: 1px solid #999;\r\n    font-size: 14px;\r\n    padding: 0;\r\n    text-indent: 8px;\r\n    line-height: 30px;\r\n    font-family: \"Microsoft Yahei\", Helvetica, Arial, sans-serif;\r\n    min-height: 32px;\r\n    margin: 0;\r\n    padding: 7px 8px;\r\n    outline: none;\r\n    color: #333;\r\n    background-color: #fff;\r\n    background-repeat: no-repeat;\r\n    background-position: right center;\r\n    border: 1px solid #ccc;\r\n    border-radius: 3px;\r\n    box-shadow: inset 0 1px 2px rgba(0,0,0,0.075);\r\n    -moz-box-sizing: border-box;\r\n    box-sizing: border-box;\r\n    transition: all 0.15s ease-in;\r\n    -webkit-transition: all 0.15s ease-in 0;\r\n    vertical-align: middle;\r\n}\r\n.item-search-input:focus{\r\n\toutline: none;\r\n    border-color: #51a7e8;\r\n    box-shadow: inset 0 1px 2px rgba(0,0,0,.075), 0 0 5px rgba(81,167,232,.5);\r\n}\r\n.item-search-logo{\r\n\tposition: absolute;\r\n\theight: 20px;\r\n\twidth: 20px;\r\n\ttop:4px;\r\n\tright: 33px;\r\n}\r\n.item-insert-logo{\r\n    position: absolute;\r\n    height: 24px;\r\n    width: 24px;\r\n    left:115px;\r\n    top:4px;\r\n    opacity: .8;\r\n}\r\n.item-insert-txt{\r\n    position: absolute;\r\n    left:140px;\r\n    top:6px;\r\n    color: #222;\r\n    font-weight: bold;\r\n}\r\n\r\n.p-title{\r\n\twidth: 100%;\r\n    height: 80px;\r\n    background: #fff;\r\n}\r\n.bd-div {\r\n    width: 100%;\r\n    height: 80px;\r\n    border-top: 1px solid #ccc; \r\n    background: #fff;\r\n}\r\n.item-ul span{\r\n    font: inherit;\r\n}\r\n\r\n.open-arrow,\r\n.bd-create,\r\n.bd-openarrow {\r\n    display: inline-block;\r\n    width: 35px;\r\n    height: 80px;\r\n    cursor: pointer;\r\n    float: left;\r\n    line-height: 80px;\r\n}\r\n\r\n.bd-openarrow {\r\n    margin-left: 35px;\r\n}\r\n\r\n.p-detail,\r\n.bd-detail {\r\n    display: inline-block;\r\n    width: 200px;\r\n    height: 100%;\r\n    font-size: 12px;\r\n    cursor: pointer;\r\n    float: left;\r\n}\r\n\r\n.bd-detail {\r\n    width: 165px;\r\n}\r\n.bd-detail:hover{\r\n\topacity: .8;\r\n}\r\n\r\n.p-name,\r\n.l-name,\r\n.bd-title {\r\n    height: 29px;\r\n    font-size: 14px;\r\n    font-weight: bold;\r\n    line-height: 30px;\r\n    text-indent: 0.5em;\r\n}\r\n\r\n.p-i,\r\n.l-i,\r\n.bd-i {\r\n    line-height: 16px;\r\n    text-indent: 0.5em;\r\n    font-size: 12px;\r\n    white-space: nowrap;\r\n    text-overflow:ellipsis;\r\n    width: 190px;\r\n    overflow: hidden;\r\n}\r\n\r\n.p-detailbtn,\r\n.bd-dt {\r\n    display: inline-block;\r\n    height: 100%;\r\n    width: 50px;\r\n    cursor: pointer;\r\n    line-height: 80px;\r\n    text-align: center;\r\n    float: left;\r\n    background: url(" + __webpack_require__(19) + ") no-repeat center; \r\n    background-size: 7px; \r\n}\r\n\r\n.p-detailbtn:hover,\r\n.bd-dt:hover {\r\n\topacity: .6;\r\n}\r\n\r\n.land-draw {\r\n    display: inline-block;\r\n    width: 60px;\r\n    height: 80px;\r\n    background: url(" + __webpack_require__(20) + ") no-repeat center; \r\n    float: left;\r\n    cursor: pointer;\r\n    background-size: 25px;\r\n}\r\n.land-draw:hover{\r\n\topacity: .7;\r\n}\r\n\r\n.bd-create {\r\n    width: 60px;\r\n    background: url(" + __webpack_require__(21) + ") no-repeat center;\r\n    background-size: 25px;\r\n}\r\n\r\n.bd-create:hover {\r\n    opacity: 0.7;\r\n}\r\n\r\n.l-item {\r\n    width: 100%;\r\n    height: 70px;\r\n    cursor: pointer;\r\n    background: #eee;\r\n}\r\n\r\n .l-items {\r\n    border-bottom: 1px solid #ccc;\r\n} \r\n\r\n.l-check,\r\n.i-delbtn,\r\n.i-detailbtn {\r\n    height: 100%;\r\n    display: inline-block;\r\n    float: left;\r\n    cursor: pointer;\r\n}\r\n\r\n.l-check {\r\n\tmargin:24px 5px 0 75px;\r\n    width: 20px;\r\n    height: 20px;\r\n}\r\n\r\n.i-delbtn {\r\n    width: 60px;\r\n    margin-left: 20px;\r\n    background: url(" + __webpack_require__(22) + ") no-repeat center; \r\n}\r\n.i-delbtn:hover{\r\n\topacity: .7;\r\n}\r\n.l-detail {\r\n    display: inline-block;\r\n    float: left;\r\n    width: 165px;\r\n    height: 100%;\r\n}\r\n\r\n\r\n.i-detailbtn {\r\n    width: 60px;\r\n    line-height: 80px;\r\n    text-align: center;\r\n}\r\n\r\n.i-detailbtn:hover {\r\n    color: red;\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n", ""]);

	// exports


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAvCAQAAABNyPLVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAGQAAABkAA+Wxd0AAAIfSURBVEjH5dVLa1NBFMDxf5IaiqgVbIstITU+2hT7sEJc2o0PVNSCgotWCuLWja1k4b4LP4C4Kd0UBIkLRZeKRWhpsaEVHzULbUm1Fnyh1ZqkudNFMrk3d874BTyzuTPz42TuzJkbsEWQ46RYocAakwwQtkrCDLGKqrQfXCMk0wBX+e2hCsUyCVm3cJsm39h2loMi7qVV+LWojONI499kHBDGfjEh4wyOMfaYCXk3Wnjp24tJ2uz7fIw0G2X4hVH221ZXigi9xAmTZZp58vwPYd+NLUTp4ABBnpBG2VPspp97LJFHocjQYYMxksxRqDq/odJUjS/jAFdoNxJE/biWc1zniPgWG9XdNsaMi+S2Gy6s4RKvrVBRoE/TBkb4WR7O81fAK8Q1fkARhSLLKBe4JeCnbNVLWCTAIuPcZQFHLPEZ/ujHCEkOVk7tvpE3x3n5QJp5Z+AlYnq6+sK2EjESvOKTjA/rV/HEFDkJh0gYdJ1pt+PFu+g0cJY3Mt6nC8YT86zKuIdtPqqY8hZR0POUMCpujRlv18U76TYW8YGMjGPsMXCarxXX4MXd1BkrflH+mtZzkxQ9eiLAHaGOzwJ1XOQZRRQP9bXawSFjESH66OIkCWqB94zriXY+/+OuKOY46mY5Id6RUnN4VCliAPpxLPQ7I9RXr29QhEWec9r8Zz1FzqALDNOIEE3Metg6syTZizXO8BYHh4+kuEyzRDYBedcZjce9uU0AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMDctMjVUMjE6NDk6MzYrMDg6MDCNdDHDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE0LTA1LTAxVDIwOjU5OjI2KzA4OjAwTwox1QAAAE50RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNi44LjgtMTAgUTE2IHg4Nl82NCAyMDE1LTA3LTE5IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3JnBQycNQAAACV0RVh0c3ZnOmNvbW1lbnQAIEdlbmVyYXRlZCBieSBJY29Nb29uLmlvIDDLy0gAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADcxMRUA1lUAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMzI5pA71JQAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzk4OTQ5MTY2dUS/ZgAAABN0RVh0VGh1bWI6OlNpemUAOS43M0tCQucbvSgAAABadEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL3NyYy8xMTU3OS8xMTU3OTI5LnBuZwXGrH8AAAAASUVORK5CYII="

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAEbeAABG3gGOJjJbAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAL1QTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAguN3MAAAAD50Uk5TAAEDBAgLDBMYGR0jJCUyNjg+P0BGS1tkZ2hrbnFzeYCKkZSYm56gprK2u72+w8bNztLY3eHl6O/y9Pn7/f7z19sRAAAD9klEQVR42u3XUU/TUBiA4XaDbdAxjGIwhhgN8Ub//1/xBjQxgEYhJGNbWYVR/8G2sKbhfHue+32l57ylp1kGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABpy8PfYa8oBp3n/bSuykklgLQdf+pt8vPF5eVCAAk//qdvNx0xPisjr1A3dgAf3208YjC4FkCqjk4bGLL3OAm8RJ3QARw3MuV9JoBEDzjDRsbsDQSQpv1+M3MOBJCmhvY/9EEp9ivAt/KWHwIRAAJAAAgAASAABIAAEAACQAAIQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAEgAAQANspb/2Kw1FRtJRdZ7+ZOfPHdv7euizHd8ED6Jyc7HjsljRwdfEQOYCdL69s8nKzb/dtXq7b7t19OLbDK/R2b+IGcPg5t8OrFPezsF8Br310rOEo7mfg0O6u4SCPGkAugHX0h1ED6O7a3Zd2MPNS3nICEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEQKoDFgwVfa52iBlBPbe4aqmnUADIBrGNShw3g9sn2rnbT5sW6rd5a1Tm0v6v8/Rk3gGx6MLDDy83OHwMH8HT9NPTlueycfHVWtXrBvPVbHI6KoqUGOvvNzJm39EzWZTm+a3k78siP05uvzcw5+x13jfw/3nICEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAABIAAEgAAQAAJAAAgAASAABIAAEAACQACpqV/YHAG0rGpozkIAaSobKmAigERfAdNGxtzPBZCoP41M+RV5ibqhAyh3RpsPuf0hgGTN+sWmI8bfHwSQrMXNfLTRLS4uzv+FXqE8i65XFINnnnTqqpxUGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8JL9Bz+0ZbCZRyUmAAAAAElFTkSuQmCC"

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAEnSURBVEjH7ZQxSwMxFMd/p8fhIKIUoeIiDi6KOFYobnZ06NDBqfghnB38BAV3pxb8FE7ioF26nYubnKU3tLbitTYuhd57XoKDUof+MiT5570/eUkIzJk9npj5VCmzotQ0hg51bjDZy0WeMKJ90CNR2iMH05QFYbBNTsxjzilwSV+oeXbSm04j7eCWBq+8U+RYRPn2FEmXITCgbQ9xG/yAPzbwVJ+B/02JqHFHAnhE9ICYC64wwCoVTt0GCQ1qvCktJJyMW+yy6S5hkbGjqE+doXcQUCakOak84pkRAVusY4AlTtgjtvtXicWjvWYNyFMX6kv6HNy3YFSfwX9/SDkCYJkNe4i8hbGq9ogz7ilRUFEjm90hofo8EgYMlfbA/jTll7+0ObPhC7y0bG06GR4EAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTA3LTI1VDIxOjUwOjQ3KzA4OjAwHF3HZAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMi0wNi0yMlQyMTo1Mzo0MyswODowMD26pqUAAABOdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDYuOC44LTEwIFExNiB4ODZfNjQgMjAxNS0wNy0xOSBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZwUMnDUAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAXdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADM2L5k87QAAABZ0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAzNtc2/GAAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTM0MDM3MzIyM0Jo0tAAAAATdEVYdFRodW1iOjpTaXplADEuMjRLQkKBw0SGAAAAWnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9zcmMvMTA3NDIvMTA3NDI4Mi5wbmcDdxTRAAAAAElFTkSuQmCC"

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAMAAABFNRROAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGRjE3MUM3OEM2RDExMUU0QjQzMTgzQkREQTAyRDY2QyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGRjE3MUM3OUM2RDExMUU0QjQzMTgzQkREQTAyRDY2QyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkZGMTcxQzc2QzZEMTExRTRCNDMxODNCRERBMDJENjZDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkZGMTcxQzc3QzZEMTExRTRCNDMxODNCRERBMDJENjZDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+TYMUsgAAACdQTFRFz8/P+/v7tLS0dXR0Ly4us7Oz0M/P+vr6Ojk5qaioqKenMC8v////qW0JgQAAAA10Uk5T////////////////AD3oIoYAAABTSURBVHjaTM5JDsAgCAVQnCrIv/95y9RGFoYXJgl3EPD0TDuZGqs4RHlb7ajT3uOdwUDIGUhhzDmAuyYln/nnMqmddu9kOzer0cq/LKqdX7wCDAB7vgb4d0rCdAAAAABJRU5ErkJggg=="

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get2 = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	__webpack_require__(24);

	var _storage = __webpack_require__(6);

	var _Area = __webpack_require__(15);

	var _Area2 = _interopRequireDefault(_Area);

	var _Eventful = __webpack_require__(11);

	var _Eventful2 = _interopRequireDefault(_Eventful);

	var _util = __webpack_require__(12);

	var _util2 = _interopRequireDefault(_util);

	var DialogButton = (function (_React$Component) {
	  _inherits(DialogButton, _React$Component);

	  function DialogButton() {
	    _classCallCheck(this, DialogButton);

	    _get2(Object.getPrototypeOf(DialogButton.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(DialogButton, [{
	    key: 'handlerClick',
	    value: function handlerClick(event) {
	      this.props.buttonClick(this.props.value);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        { className: this.props.className || '',
	          onClick: this.handlerClick.bind(this) },
	        this.props.value
	      );
	    }
	  }]);

	  return DialogButton;
	})(React.Component);

	var DialogInput = (function (_React$Component2) {
	  _inherits(DialogInput, _React$Component2);

	  function DialogInput() {
	    _classCallCheck(this, DialogInput);

	    _get2(Object.getPrototypeOf(DialogInput.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(DialogInput, [{
	    key: 'handlerChange',
	    value: function handlerChange(event) {
	      var title = this.props.title;
	      var _event$srcElement = event.srcElement;
	      var target = _event$srcElement === undefined ? event.target : _event$srcElement;

	      this.props.changeEvent(title, target.value);
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      if (this.props.title === '起保日期' || this.props.title === '终保日期') {
	        $(this.refs.realInput).Zebra_DatePicker(); /*hard code 4 jQuery*/
	      }
	    }
	  }, {
	    key: 'getStyle',
	    value: function getStyle() {
	      return {
	        'width': '188px',
	        'height': '30px',
	        'border': '1px solid #999',
	        'padding': 0,
	        'outline': 'none',
	        'fontFamily': 'Microsoft Yahei',
	        'fontSize': '14px',
	        'borderRadius': '2px'
	      };
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var style = this.getStyle();
	      var enable = this.props.forbidden ? true : this.props.disabled ? true : false;
	      return React.createElement(
	        'li',
	        null,
	        React.createElement(
	          'label',
	          null,
	          this.props.title,
	          ':'
	        ),
	        React.createElement('input', { type: 'text', style: style, disabled: enable, ref: 'realInput', id: this.props.field, value: this.props.value, onChange: this.handlerChange.bind(this) })
	      );
	    }
	  }]);

	  return DialogInput;
	})(React.Component);

	var DialogSelect = (function (_React$Component3) {
	  _inherits(DialogSelect, _React$Component3);

	  function DialogSelect() {
	    _classCallCheck(this, DialogSelect);

	    _get2(Object.getPrototypeOf(DialogSelect.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(DialogSelect, [{
	    key: 'handlerChange',
	    value: function handlerChange(event) {
	      var title = this.props.title;
	      var _event$srcElement2 = event.srcElement;
	      var target = _event$srcElement2 === undefined ? event.target : _event$srcElement2;

	      this.props.changeEvent(title, target.value);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var enable = this.props.forbidden ? true : this.props.disabled ? true : false;
	      return React.createElement(
	        'li',
	        null,
	        React.createElement(
	          'label',
	          null,
	          this.props.title,
	          ':'
	        ),
	        React.createElement(
	          'select',
	          { disabled: enable, value: this.props.value, onChange: this.handlerChange.bind(this) },
	          this.props.option.map(function (opt, idx) {
	            var value = opt.key ? opt[opt.key] : opt.value;
	            return React.createElement(
	              'option',
	              { value: value, key: idx },
	              value
	            );
	          })
	        )
	      );
	    }
	  }]);

	  return DialogSelect;
	})(React.Component);

	var DialogHeader = (function (_React$Component4) {
	  _inherits(DialogHeader, _React$Component4);

	  function DialogHeader() {
	    _classCallCheck(this, DialogHeader);

	    _get2(Object.getPrototypeOf(DialogHeader.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(DialogHeader, [{
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        { className: 'form-title' },
	        this.props.value
	      );
	    }
	  }]);

	  return DialogHeader;
	})(React.Component);

	var DialogMain = (function (_React$Component5) {
	  _inherits(DialogMain, _React$Component5);

	  function DialogMain() {
	    _classCallCheck(this, DialogMain);

	    _get2(Object.getPrototypeOf(DialogMain.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(DialogMain, [{
	    key: 'render',
	    value: function render() {
	      var _this = this;

	      return React.createElement(
	        'div',
	        { className: 'form-content' },
	        React.createElement(
	          'ol',
	          null,
	          this.props.items.map(function (item, idx) {
	            if (item.type === 'text') {
	              return React.createElement(DialogInput, _extends({ key: idx }, item, { changeEvent: _this.props.changeEvent }));
	            }
	            return React.createElement(DialogSelect, _extends({ key: idx }, item, { changeEvent: _this.props.changeEvent }));
	          })
	        )
	      );
	    }
	  }]);

	  return DialogMain;
	})(React.Component);

	var DialogFooter = (function (_React$Component6) {
	  _inherits(DialogFooter, _React$Component6);

	  function DialogFooter() {
	    _classCallCheck(this, DialogFooter);

	    _get2(Object.getPrototypeOf(DialogFooter.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(DialogFooter, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      return React.createElement(
	        'div',
	        { className: 'form-btnwrap' },
	        this.props.buttons.map(function (button, idx) {
	          return React.createElement(DialogButton, _extends({ key: idx }, button, { buttonClick: _this2.props.buttonClick }));
	        })
	      );
	    }
	  }]);

	  return DialogFooter;
	})(React.Component);

	var Mask = (function (_React$Component7) {
	  _inherits(Mask, _React$Component7);

	  function Mask() {
	    _classCallCheck(this, Mask);

	    _get2(Object.getPrototypeOf(Mask.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(Mask, [{
	    key: 'handlerClick',
	    value: function handlerClick(event) {
	      this.props.close();
	    }
	  }, {
	    key: 'getStyle',
	    value: function getStyle() {
	      var scrollHeight = $(document).height(),
	          /*获取文档流的高度*/
	      scrollWidth = $(document).width();
	      return {
	        'position': 'absolute',
	        'left': 0,
	        'top': 0,
	        'width': scrollWidth + 'px',
	        'height': scrollHeight + 'px',
	        'background': '#000',
	        'opacity': '0.75',
	        'filter': 'alpha(opacity=75)',
	        'zIndex': '1000'
	      };
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var maskStyle = this.getStyle();
	      return React.createElement('div', { style: maskStyle, onClick: this.handlerClick.bind(this) });
	    }
	  }]);

	  return Mask;
	})(React.Component);

	var COUNTY = '区';
	var TOWN = '镇';
	var VILLAGE = '村';
	var ADDR = '地址';

	var Dialog = (function (_React$Component8) {
	  _inherits(Dialog, _React$Component8);

	  function Dialog(props) {
	    _classCallCheck(this, Dialog);

	    _get2(Object.getPrototypeOf(Dialog.prototype), 'constructor', this).call(this, props);
	    this.state = { disabled: true, buttons: [], items: [] };
	    this.config = { dialogWidth: 700, dialogHeight: 400, renderDOMId: 'mask-layer', isNoVillage: false };
	    this.defaultButtons = [{ value: '取消', className: 'div-btn cancel-btn' }, { value: '添加', className: 'div-btn ok-btn' }, { value: '编辑', className: 'div-btn ok-btn' }, { value: '删除', className: 'div-btn delete-btn' }];
	  }

	  _createClass(Dialog, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      ReactDOM.findDOMNode(this).parentNode.style.display = 'block';
	      var buttons = this.getButtons();
	      var items = _util2['default'].clone(_storage.dialogRender[this.props.target]);
	      var disabled = this.props.type === 'CREATE' ? false : true;
	      this._pretreat(items, disabled, this.props.detail);
	      this._fillSelectOpt(items);
	      this.setState({
	        buttons: buttons,
	        items: items
	      });
	    }
	  }, {
	    key: '_pretreat',
	    value: function _pretreat(items, disabled) {
	      var _this3 = this;

	      var detail = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	      var ifPolicy = this.props.target === 'POLICY' ? true : false;
	      var ifNewpl = ifPolicy ? this.props.type === 'CREATE' ? true : false : false;
	      items.forEach(function (item) {
	        var field = item.field;
	        item.disabled = disabled;
	        detail[field] && (item.value = detail[field]);
	        if (ifPolicy && (field === 'START' || field === 'END')) _this3._handlerDateForm(item);
	        if (ifNewpl && field === 'CODING') _this3.createCoding(item);
	      });
	    }
	  }, {
	    key: '_handlerDateForm',
	    value: function _handlerDateForm(item) {
	      var value = item.value.toString();
	      value && (item.value = value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6, 2));
	    }
	  }, {
	    key: 'createCoding',
	    value: function createCoding(item) {
	      var employeeID = '00001';
	      var getDate = new Date();
	      var day = getDate.toLocaleDateString().split('/');

	      var h = new Date().getHours(),
	          m = new Date().getMinutes(),
	          s = new Date().getSeconds();

	      var endTimeString = '' + (parseInt(h) < 10 ? '0' + h : h) + (parseInt(m) < 10 ? '0' + m : m) + (parseInt(s) < 10 ? '0' + s : s);
	      var date = day[0] + (parseInt(day[1]) < 10 ? '0' + day[1] : day[1]) + (parseInt(day[2]) < 10 ? '0' + day[2] : day[2]);
	      item.value = date + employeeID + endTimeString;
	    }
	  }, {
	    key: '_fillSelectOpt',
	    value: function _fillSelectOpt(items) {
	      var _this4 = this;

	      if (this.props.target === 'POLICY') return;
	      var itemCounty = items.find(function (item) {
	        return item.title === COUNTY;
	      });
	      var itemTown = items.find(function (item) {
	        return item.title === TOWN;
	      });
	      var itemVillage = items.find(function (item) {
	        return item.title === VILLAGE;
	      });
	      var itemAddr = items.find(function (item) {
	        return item.title === ADDR;
	      });
	      if (this.props.type === 'CREATE') {
	        _Area2['default'].getInitArea().then(function (_ref) {
	          var _ref2 = _slicedToArray(_ref, 3);

	          var counties = _ref2[0];
	          var towns = _ref2[1];
	          var villages = _ref2[2];

	          var _get = _Area2['default']._getJsonValue.bind(Object.create(null));
	          itemCounty.option = counties;
	          itemTown.option = towns;
	          itemVillage.option = villages;
	          var county = itemCounty.value = _get(counties);
	          var town = itemTown.value = _get(towns);
	          var village = itemVillage.value = _get(villages);
	          itemAddr.value = '' + county + town + village;
	          _this4.setState({ items: items });
	        });
	      } else {
	        _Area2['default'].getCounties().then(function (counties) {
	          itemCounty.option = counties;
	          var countyName = itemCounty.value;
	          return _Area2['default'].getTownsByCounty(countyName);
	        }).then(function (towns) {
	          itemTown.option = towns;
	          var townName = itemTown.value;
	          return _Area2['default'].getVillagesByTown(townName);
	        }).then(function (villages) {
	          itemVillage.option = villages;
	          _this4.setState({ items: items });
	        });
	      }
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      ReactDOM.findDOMNode(this).parentNode.style.display = 'none';
	      ReactDOM.unmountComponentAtNode(document.getElementById('mask-layer'));
	    }
	  }, {
	    key: 'changeEvent',
	    value: function changeEvent(title, value) {
	      this.state.items.forEach(function (item) {
	        if (item.title === title) {
	          item.value = value;
	        }
	      });
	      this._handlerAreaChange(title, value);
	      this.setState({ items: this.state.items });
	    }
	  }, {
	    key: '_handlerAreaChange',
	    value: function _handlerAreaChange(title, val) {
	      switch (title) {
	        case '区':
	          this._countyChange(val);
	          break;
	        case '镇':
	          this._townChange(val);
	          break;
	        case '村':
	          this._villageChange(val);
	          break;
	      }
	    }
	  }, {
	    key: '_countyChange',
	    value: function _countyChange(val) {
	      var _this5 = this;

	      var items = this.state.items;
	      var itemTown = items.find(function (item) {
	        return item.title === TOWN;
	      });
	      var itemVillage = items.find(function (item) {
	        return item.title === VILLAGE;
	      });
	      var itemAddr = items.find(function (item) {
	        return item.title === ADDR;
	      });
	      _Area2['default'].getSubAreaByCounty(val).then(function (_ref3) {
	        var _ref32 = _slicedToArray(_ref3, 2);

	        var towns = _ref32[0];
	        var villages = _ref32[1];

	        var _get = _Area2['default']._getJsonValue.bind(Object.create(null));
	        itemTown.option = towns;
	        itemVillage.option = villages;
	        var town = itemTown.value = _get(towns);
	        var village = itemVillage.value = _get(villages);
	        itemAddr.value = '' + val + town + village;
	        _this5.setState({ items: items });
	      });
	    }
	  }, {
	    key: '_townChange',
	    value: function _townChange(val) {
	      var _this6 = this;

	      var items = this.state.items;

	      var _items$find = items.find(function (item) {
	        return item.title === COUNTY;
	      });

	      var county = _items$find.value;

	      var itemVillage = items.find(function (item) {
	        return item.title === VILLAGE;
	      });
	      var itemAddr = items.find(function (item) {
	        return item.title === ADDR;
	      });
	      _Area2['default'].getVillagesByTown(val).then(function (villages) {
	        itemVillage.option = villages;
	        var village = itemVillage.value = _Area2['default']._getJsonValue(villages);
	        itemAddr.value = '' + county + val + village;
	        _this6.setState({ items: items });
	      })['catch'](function (error) {
	        itemVillage.option = [{ value: '暂无数据' }];
	        itemVillage.value = '暂无数据';
	        itemAddr.value = '' + county + val;
	        _this6.setState({ items: items });
	        _this6.config.isNoVillage = true;
	      });
	    }
	  }, {
	    key: '_villageChange',
	    value: function _villageChange(val) {
	      var items = this.state.items;

	      var _items$find2 = items.find(function (item) {
	        return item.title === COUNTY;
	      });

	      var county = _items$find2.value;

	      var _items$find3 = items.find(function (item) {
	        return item.title === TOWN;
	      });

	      var town = _items$find3.value;

	      var itemAddr = items.find(function (item) {
	        return item.title === ADDR;
	      });
	      itemAddr.value = '' + county + town + val;
	    }
	  }, {
	    key: 'buttonClick',
	    value: function buttonClick(val) {
	      switch (val) {
	        case '取消':
	          this.close();
	          break;
	        case '添加':
	          this.alterItem('INSERT');
	          break;
	        case '编辑':
	          this.startEdit();
	          break;
	        case '保存':
	          this.alterItem('UPDATE');
	          break;
	        case '删除':
	          this.deleteItem();
	          break;
	      }
	    }
	  }, {
	    key: 'alterItem',
	    value: function alterItem(type) {
	      var _this7 = this;

	      var _props$detail = this.props.detail;
	      var detail = _props$detail === undefined ? {} : _props$detail;
	      var items = this.state.items;

	      items.forEach(function (item) {
	        var field = item.field;
	        var value = item.value;

	        detail[field] = value;
	      });
	      if (this.props.target === 'POLICY') {
	        detail['START'] = $('#START').val(); /*hard code 4 jQuery*/
	        detail['END'] = $('#END').val();
	        _Eventful2['default'].dispatch('alterPolicy', type, detail);
	      } else {
	        (function () {
	          var locItem = _this7.isNoVillage ? items.find(function (item) {
	            return item.title === COUNTY;
	          }) : items.find(function (item) {
	            return item.title === VILLAGE;
	          });
	          var val = locItem.value;

	          var _locItem$option$find = locItem.option.find(function (opt) {
	            return opt.value === val || opt[opt.key] === val;
	          });

	          var X = _locItem$option$find.X;
	          var Y = _locItem$option$find.Y;

	          detail = _extends({}, detail, { X: X, Y: Y });
	          _Eventful2['default'].dispatch('alterBd', type, detail, { X: X, Y: Y });
	        })();
	      }
	      this.close();
	    }
	  }, {
	    key: 'startEdit',
	    value: function startEdit() {
	      /*日期插件图标激活(jQuery)*/
	      $('.Zebra_DatePicker_Icon').removeClass('Zebra_DatePicker_Icon_Disabled').addClass('Zebra_DatePicker_Icon_enabled');
	      this.state.buttons.forEach(function (button) {
	        if (button.value === '编辑') button.value = '保存';
	      });
	      this.state.items.forEach(function (item) {
	        return item.disabled = false;
	      });
	      this.setState({ buttons: this.state.buttons, items: this.state.items });
	    }
	  }, {
	    key: 'deleteItem',
	    value: function deleteItem() {
	      var detail = this.props.detail;

	      if (this.props.target === 'POLICY') {
	        _Eventful2['default'].dispatch('deletePolicy', detail.CODING);
	      } else {
	        _Eventful2['default'].dispatch('deleteBd', detail.CODING, detail.ID, detail.AREA);
	      }
	      this.close();
	    }
	  }, {
	    key: 'getButtons',
	    value: function getButtons() {
	      var buttons = [];
	      switch (this.props.type) {
	        case 'CREATE':
	          buttons = this.defaultButtons.filter(function (btn) {
	            return btn.value === '取消' || btn.value === '添加';
	          });
	          break;
	        case 'MODIFY':
	          buttons = this.defaultButtons.filter(function (btn) {
	            return btn.value !== '添加';
	          });
	          break;
	      }
	      return buttons;
	    }
	  }, {
	    key: 'getTitle',
	    value: function getTitle() {
	      var _props = this.props;
	      var target = _props.target;
	      var type = _props.type;

	      var title = target === 'POLICY' ? type === 'CREATE' ? '创建承保' : '保单详情' : type === 'CREATE' ? '标的信息录入' : '标的详情';
	      return title;
	    }
	  }, {
	    key: 'getStyle',
	    value: function getStyle() {
	      var clientHeight = $(window).height(),
	          //获取视窗范围的高度
	      clientWidth = $(window).width();
	      var _config = this.config;
	      var dialogWidth = _config.dialogWidth;
	      var dialogHeight = _config.dialogHeight;

	      return {
	        'position': 'fixed',
	        'width': dialogWidth + 'px',
	        'height': dialogHeight + 'px',
	        'left': (clientWidth - dialogWidth) / 2 + 'px',
	        'top': (clientHeight - dialogHeight) / 2 + 'px',
	        'zIndex': '1001',
	        'background': '#eee'
	      };
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var title = this.getTitle();
	      var dialogStyle = this.getStyle();
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { style: dialogStyle },
	          React.createElement(DialogHeader, { value: title }),
	          React.createElement(DialogMain, { items: this.state.items, changeEvent: this.changeEvent.bind(this) }),
	          React.createElement(DialogFooter, { buttons: this.state.buttons, buttonClick: this.buttonClick.bind(this) })
	        ),
	        React.createElement(Mask, { close: this.close.bind(this) })
	      );
	    }
	  }]);

	  return Dialog;
	})(React.Component);

	exports['default'] = Dialog;
	module.exports = exports['default'];

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "dialog.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(25);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./dialog.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./dialog.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "body,html{\r\n\tpadding: 0;\r\n\tmargin: 0;\r\n\tfont-family: 'Microsoft Yahei';\r\n}\r\n#mask-layer{\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    height:  100%;\r\n    z-index: 1000;\r\n    display: none;\r\n}\r\n.content{\r\n\twidth:1000px;\r\n\theight:2000px;\r\n\tborder: 1px solid red;\r\n\tmargin: 0 auto;\r\n}\r\n.form-content{\r\n\tbackground-color: #fff;\r\n\theight:270px;\r\n}\t\t\r\n.form-content ol{\r\n\tpadding: 25px 0;\r\n}\t\r\n.form-content li{\r\n\tdisplay: inline-block;\r\n}\t\t\t\r\n.form-content label{\r\n\tdisplay: inline-block;\r\n\theight: 45px;\r\n\twidth: 116px;\r\n\ttext-align: right;\r\n\tmargin-right: 15px;\r\n\tcolor:#000;\r\n}\r\n.form-content li>input,.form-content li>select{\r\n\twidth: 188px;\r\n\theight: 30px;\r\n\tborder: 1px solid #999;\r\n\tpadding: 0;\r\n\toutline: none;\r\n\tfont-family: 'Microsoft Yahei';\r\n\tfont-size: 14px;\r\n\tborder-radius: 2px;\r\n}\r\n.form-title{\r\n\theight: 50px;\r\n\tline-height: 50px;\r\n\ttext-indent: 28px;\r\n\tcolor: #529F75;\r\n\tfont-size: 16px;\r\n}\r\n.form-btnwrap{\r\n\twidth: 100%;\r\n\theight: 50px;\r\n\ttext-align: center;\t\r\n\tmargin-top: 18px;\r\n}\r\n.div-btn{\r\n\tdisplay: inline-block;\r\n\ttext-align: center;\r\n\tcolor: #fff;\r\n\tcursor:pointer;\r\n\twidth: 100px;\r\n\theight: 40px;\r\n\tline-height: 40px;\r\n\tfont-size: 16px;\r\n\tborder-radius: 3px;\r\n\tmargin-left: 40px;\r\n}\r\n.cancel-btn{\r\n\tbackground: #bbb;\r\n\tmargin-left: 0; \r\n}\r\n.cancel-btn:hover{\r\n\tbackground: #A7A7A7;\r\n}\r\n.ok-btn{\r\n\tbackground: #38A800;\r\n\tmargin-left: 40px;\r\n}\r\n.ok-btn:hover{\r\n\tbackground: #239B1F;\r\n}\r\n.delete-btn{\r\n\tbackground: #d9534f;\r\n}\r\n.delete-btn:hover{\r\n\tbackground: #c9302c;\r\n}\r\n.form-content .input-nomarginright{\r\n\tborder-right-width: 0;\r\n\twidth: 150px;\r\n\tfloat: left;\r\n\tborder-top-right-radius: 0px;\r\n\tborder-bottom-right-radius: 0px;\r\n}\r\n.form-content .unit{\r\n\tdisplay: inline-block;\r\n\twidth: 38px;\r\n\theight: 30px;\r\n\tline-height: 30px;\r\n\tborder: 1px solid #999;\r\n\ttext-align: center;\r\n\tborder-left-width: 0;\r\n\tborder-top-right-radius: 2px;\r\n\tborder-bottom-right-radius: 2px;\r\n}", ""]);

	// exports


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	__webpack_require__(27);

	var _storage = __webpack_require__(6);

	var _util = __webpack_require__(12);

	var _util2 = _interopRequireDefault(_util);

	var _map = __webpack_require__(7);

	var _map2 = _interopRequireDefault(_map);

	var GridLoc = (function (_React$Component) {
		_inherits(GridLoc, _React$Component);

		function GridLoc(props) {
			_classCallCheck(this, GridLoc);

			_get(Object.getPrototypeOf(GridLoc.prototype), 'constructor', this).call(this, props);
			this.state = { input: { grid: '', town: '' } };
		}

		_createClass(GridLoc, [{
			key: 'handlerChange',
			value: function handlerChange(src, event) {
				var target = event.target || event.srcElement;
				this.state.input[src] = target.value;
				this.setState({ input: this.state.input });
			}
		}, {
			key: 'handlerSearch',
			value: function handlerSearch(src, event) {
				var value = this.state.input[src];
				if (value !== '') {
					if (src === 'grid') {
						this.locByGrid(value);
					} else if (src === 'town') {
						this.locByTown(value);
					}
				}
			}
		}, {
			key: 'handlerkeyDown',
			value: function handlerkeyDown(src, event) {
				var _event$srcElement = event.srcElement;
				var target = _event$srcElement === undefined ? event.target : _event$srcElement;

				var value = target.value;
				if (event.keyCode === 13 && value !== '') {
					if (src === 'grid') {
						this.locByGrid(value);
					} else if (src === 'town') {
						this.locByTown(value);
					}
				}
			}
		}, {
			key: 'handlerClose',
			value: function handlerClose(event) {
				this.close();
			}
		}, {
			key: 'locByGrid',
			value: function locByGrid(val) {
				var result = this.DeCodeShGrid(val);
				if (!result.flag) {
					_util2['default'].alertDiv('请检查编码格式是否正确！');
					return;
				}
				_map2['default'].map.zoomTo(result.x, result.y, { zl: 1 });
				this.setState({ input: { grid: '', town: '' } });
			}
		}, {
			key: 'locByTown',
			value: function locByTown(val) {
				this.QueryLocByTown(val).then(function (res) {
					if (res.length == 0) {
						_util2['default'].alertDiv('抱歉，未找到该乡镇！');
						return;
					}
					var firTown = res[0];
					_map2['default'].map.zoomTo(firTown.cx, firTown.cy);
				})['catch'](function (err) {
					_util2['default'].alertDiv('查询失败！');
				});
			}
		}, {
			key: 'DeCodeShGrid',
			value: function DeCodeShGrid(grdNum) {
				var _ref = [];
				var xid = _ref[0];
				var yid = _ref[1];
				var flag = _ref[2];
				var dash = _ref[3];
				var len = _ref[4];
				var ix = _ref[5];
				var iy = _ref[6];
				var x = _ref[7];
				var y = _ref[8];

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
		}, {
			key: 'QueryLocByTown',
			value: function QueryLocByTown(town) {
				return new Promise(function (resolve, reject) {
					var QrySQLSer = new gEcnu.WebFeatureServices.QueryBySQL({
						'processCompleted': function processCompleted(json) {
							resolve(json);
						}, 'processFailed': function processFailed(err) {
							reject(err);
						}
					});
					var SQL = 'NAME=\'' + town + '\'';
					QrySQLSer.processAscyn(SQL, gEcnu.layerType.GeoDB, _storage.config.dbName, _storage.config.townFtsetId, false, '');
				});
			}
		}, {
			key: 'close',
			value: function close() {
				this.props.close();
			}
		}, {
			key: 'render',
			value: function render() {
				var style = this.props.show ? { display: 'block' } : { display: 'none' };
				return React.createElement(
					'div',
					{ className: 'posDiv', style: style },
					React.createElement(
						'div',
						{ className: 'pos_title' },
						React.createElement(
							'span',
							{ className: 'pos_text' },
							'定位'
						),
						React.createElement('img', { className: 'pos_close', src: 'img/pos_close.png', onClick: this.handlerClose.bind(this) })
					),
					React.createElement(
						'div',
						{ className: 'pos_content' },
						React.createElement('input', { className: 'pos_qrytext', type: 'text', placeholder: '网格编码', value: this.state.input.grid, onChange: this.handlerChange.bind(this, 'grid'), onKeyDown: this.handlerkeyDown.bind(this, 'grid') }),
						React.createElement('img', { className: 'pos_qry', src: 'img/pos_qry.png', onClick: this.handlerSearch.bind(this, 'grid') }),
						React.createElement('input', { className: 'pos_qrytown', type: 'text', placeholder: '乡镇名称', value: this.state.input.town, onChange: this.handlerChange.bind(this, 'town'), onKeyDown: this.handlerkeyDown.bind(this, 'town') }),
						React.createElement('img', { className: 'pos_qry2', src: 'img/pos_qry.png', onClick: this.handlerSearch.bind(this, 'town') })
					)
				);
			}
		}]);

		return GridLoc;
	})(React.Component);

	var Toolbar = (function (_React$Component2) {
		_inherits(Toolbar, _React$Component2);

		function Toolbar(props) {
			_classCallCheck(this, Toolbar);

			_get(Object.getPrototypeOf(Toolbar.prototype), 'constructor', this).call(this, props);
			this.state = { locshow: false };
		}

		_createClass(Toolbar, [{
			key: 'handlerClick',
			value: function handlerClick(tool, event) {
				switch (tool) {
					case '平移':
						this.pan();
						break;
					case '距离':
						this.measure('rulerLength');
						break;
					case '面积':
						this.measure('rulerArea');
						break;
					case '定位':
						this.location();
						break;
					case '复位':
						this.reset();
						break;
					case '图查':
						this.mapSearch();
						break;
				}
			}
		}, {
			key: 'pan',
			value: function pan() {
				_map2['default'].map.setMode('map');
				_map2['default'].map.setMapTool('pan');
				_map2['default'].editPolygon.deactivate();
				_map2['default'].map.setCursorStyle('pan', _storage.config.pansrc);
			}
		}, {
			key: 'measure',
			value: function measure(type) {
				var imgsrc = 'img/cursorimg/' + type + '.png';
				_map2['default'].map.setMode('map');
				_map2['default'].map.setMapTool('' + type);
				if (type === 'rulerLength') {
					_map2['default'].map.setCursorStyle('dis', imgsrc);
				} else if (type === 'rulerArea') {
					_map2['default'].map.setCursorStyle('area', imgsrc);
				}
			}
		}, {
			key: 'location',
			value: function location() {
				this.setState({ locshow: !this.state.locshow });
			}
		}, {
			key: 'reset',
			value: function reset() {
				var x = sessionStorage.getItem('curX');
				var y = sessionStorage.getItem('curY');
				_map2['default'].map.zoomTo(parseFloat(x), parseFloat(y));
			}
		}, {
			key: 'mapSearch',
			value: function mapSearch() {
				_map2['default'].editPolygon.deactivate();
				_map2['default'].editPolygon.activate(false);
				_map2['default'].ifreshape = false;
				_map2['default'].selectAim = "landSearch";
				_map2['default'].map.setCursorStyle('select', _storage.config.infosrc);
			}
		}, {
			key: 'hideLocMod',
			value: function hideLocMod() {
				this.setState({ locshow: false });
			}
		}, {
			key: 'render',
			value: function render() {
				var _this = this;

				return React.createElement(
					'table',
					null,
					React.createElement(
						'tbody',
						null,
						React.createElement(
							'tr',
							null,
							_storage.toolbar.map(function (tool, idx) {
								var locComponent = tool.title === '定位' ? React.createElement(GridLoc, { show: _this.state.locshow, close: _this.hideLocMod.bind(_this) }) : '';
								return React.createElement(
									'td',
									{ key: idx },
									React.createElement(
										'div',
										{ className: 'maptoolbar' },
										React.createElement(
											'div',
											{ className: 'tool-logo', onClick: _this.handlerClick.bind(_this, tool.title) },
											React.createElement('img', { type: 'image', src: tool.src }),
											React.createElement(
												'span',
												null,
												tool.title
											)
										),
										locComponent
									)
								);
							})
						)
					)
				);
			}
		}]);

		return Toolbar;
	})(React.Component);

	ReactDOM.render(React.createElement(Toolbar, null), document.getElementById('toolDiv'));

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "toolbar.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(28);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./toolbar.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./toolbar.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "\r\n#toolDiv {\r\n    position: absolute;\r\n    height: 100%;\r\n    left: 0px;\r\n    top: 0px;\r\n    border-right: 1px solid #c5c1c5;\r\n    width: 435px;\r\n    padding-left: 10px;\r\n    font-family: \"SimSun\";\r\n    border-left: 1px solid #c5c1c5;\r\n}\r\n#toolDiv table tbody {\r\n    font-size: 13px;\r\n    color: #333;\r\n    text-align: center;\r\n}\r\n#toolDiv table tbody td {\r\n    padding-right: 10px;\r\n    padding-left: 5px;\r\n}\r\n.maptoolbar {\r\n    height: 25px;\r\n    cursor: pointer;\r\n    line-height: 30px;\r\n    width: 55px;\r\n}\r\n.tool-logo img {\r\n    width: 18px;\r\n    height: 18px;\r\n    margin-top: 5px;\r\n    margin-right: 6px; \r\n}\r\n.tool-logo span {\r\n    vertical-align: top\r\n}\r\n.tool-logo:hover{\r\n    opacity: 0.5;\r\n}\r\n.posDiv {\r\n    position: relative;\r\n    top:6px;\r\n    left: 6px;\r\n    z-index: 10000;\r\n    width: 150px;\r\n    height: 100px;\r\n    background: rgba(0, 14, 12, 0.6);\r\n    border-radius: 2px;\r\n}\r\n.pos_title {\r\n    position: absolute;\r\n    width: 100%;\r\n    top: 0px;\r\n    height: 27px;\r\n    color: #FFFFFF;\r\n    font-size: 13px;\r\n    font-weight: bold;\r\n    border-bottom: 1px solid #AAAAAA;\r\n}\r\n.pos_text {\r\n    position: absolute;\r\n    left: 5px;\r\n}\r\n.pos_close {\r\n    position: absolute;\r\n    right: 5px;\r\n    cursor: pointer;\r\n    top:2px;\r\n}\r\n.pos_close:hover {\r\n    opacity: 0.5\r\n}\r\n.pos_content {\r\n    position: absolute;\r\n    width: 100%;\r\n    bottom: 0px;\r\n    height: 73px;\r\n}\r\n.pos_qrytext {\r\n    width: 107px;\r\n    height: 20px;\r\n    position: absolute;\r\n    left: 5px;\r\n    top: 10px;\r\n}\r\n.pos_qry {\r\n    position: absolute;\r\n    right: 3px;\r\n    top: 10px;\r\n    cursor: pointer;\r\n}\r\n.pos_qry:hover {\r\n    opacity: 0.5\r\n}\r\n.pos_qrytown {\r\n    width: 107px;\r\n    height: 20px;\r\n    position: absolute;\r\n    left: 5px;\r\n    top: 42px;\r\n}\r\n\r\n.pos_qry2 {\r\n    position: absolute;\r\n    right: 3px;\r\n    top: 42px;\r\n    cursor: pointer;\r\n}\r\n.pos_qry2:hover {\r\n    opacity: 0.5\r\n}\r\n@media screen and (max-width: 1025px) {\r\n    #toolDiv {\r\n        width: 320px;\r\n    }\r\n    #toolDiv table tbody td {\r\n        padding-right: 0px;\r\n        padding-left: 0px;\r\n    }\r\n}", ""]);

	// exports


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	__webpack_require__(30);

	var _storage = __webpack_require__(6);

	var _map = __webpack_require__(7);

	var _map2 = _interopRequireDefault(_map);

	var _util = __webpack_require__(12);

	var _util2 = _interopRequireDefault(_util);

	var DataEdit = (function (_React$Component) {
		_inherits(DataEdit, _React$Component);

		function DataEdit() {
			_classCallCheck(this, DataEdit);

			_get(Object.getPrototypeOf(DataEdit.prototype), 'constructor', this).apply(this, arguments);
		}

		_createClass(DataEdit, [{
			key: 'handlerClick',
			value: function handlerClick(edit, event) {
				switch (edit) {
					case '选择地块':
						this.selectLand();
						break;
					case '删除地块':
						this.deleteLand();
						break;
					case '添加节点':
						this.addNode();
						break;
					case '删除节点':
						this.delteNode();
						break;
					case '修改属性':
						this.updateAttr();
						break;
					case '撤销':
						this.revoke();
						break;
					case '保存':
						this.save();
						break;
				}
			}
		}, {
			key: 'selectLand',
			value: function selectLand() {
				var zl = _map2['default'].map.getZoom().zl;
				if (zl != 1) {
					_util2['default'].alertDiv('请在影像最高级别下进行编辑、修改！');
					return;
				}
				_map2['default'].editPolygon.activate(true);
				_map2['default'].ifreshape = true;
				_map2['default'].map.setCursorStyle('select', _storage.config.editsrc);
			}
		}, {
			key: 'deleteLand',
			value: function deleteLand() {
				_map2['default'].editPolygon.deactivate();
				var tmpFeature = _map2['default'].selectedFeature;
				if (typeof tmpFeature == "undefined") return;
				_map2['default'].land_Featurelayer.removeFeature(tmpFeature);
				_map2['default'].delFeature(tmpFeature);
			}
		}, {
			key: 'addNode',
			value: function addNode() {
				_map2['default'].editPolygon.addPoint();
				_map2['default'].map.setCursorStyle('addpoint', _storage.config.addptsrc);
			}
		}, {
			key: 'delteNode',
			value: function delteNode() {
				_map2['default'].editPolygon.delPoint();
				_map2['default'].map.setCursorStyle('delpoint', _storage.config.delptsrc);
			}
		}, {
			key: 'updateAttr',
			value: function updateAttr() {
				var zl = _map2['default'].map.getZoom().zl;
				if (zl != 1) {
					_util2['default'].alertDiv('请在最高级别下进行属性修改！');
					return;
				}
				_map2['default'].editPolygon.deactivate();
				_map2['default'].editPolygon.activate(false);
				_map2['default'].ifreshape = false;
				_map2['default'].selectAim = "prochange";
				_map2['default'].map.setCursorStyle('select', _storage.config.propsrc);
			}
		}, {
			key: 'revoke',
			value: function revoke() {
				_map2['default'].revoke();
			}
		}, {
			key: 'save',
			value: function save() {
				_map2['default'].submitData();
			}
		}, {
			key: 'render',
			value: function render() {
				var _this = this;

				return React.createElement(
					'div',
					null,
					_storage.dataEdit.map(function (data, idx) {
						return React.createElement('img', { key: idx, className: 'dataget_contentlist', src: data.src, title: data.title, onClick: _this.handlerClick.bind(_this, data.title) });
					})
				);
			}
		}]);

		return DataEdit;
	})(React.Component);

	ReactDOM.render(React.createElement(DataEdit, null), document.getElementById('data-edit'));

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "dataEdit.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(31);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./dataEdit.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./dataEdit.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "\r\n#data-edit {\r\n    display: none; \r\n    position: absolute;\r\n    width: 290px;\r\n    left: 440px;\r\n    top: 0;\r\n    height: 100%\r\n}\r\n.dataget_contentlist {\r\n    margin-top: 5px;\r\n    width: 22px;\r\n    height: 22px;\r\n    margin-left: 15px;\r\n    text-align: center;\r\n    line-height: 25px;\r\n    cursor: pointer;\r\n    border-radius: 0px;\r\n}\r\n.dataget_contentlist:hover {\r\n    opacity: 0.6;\r\n}\r\n@media screen and (max-width: 1025px) {\r\n    #data-edit {\r\n        left: 600px;\r\n    }\r\n    .dataget_contentlist {\r\n        margin-left: 8px\r\n    }\r\n}", ""]);

	// exports


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	__webpack_require__(33);

	var _storage = __webpack_require__(6);

	var _map = __webpack_require__(7);

	var _map2 = _interopRequireDefault(_map);

	var ImageTab = (function (_React$Component) {
		_inherits(ImageTab, _React$Component);

		function ImageTab(props) {
			_classCallCheck(this, ImageTab);

			_get(Object.getPrototypeOf(ImageTab.prototype), 'constructor', this).call(this, props);
			this.defaultSrc = 'img/choose.png';
			this.state = {
				show: false,
				years: _storage.imageYear
			};
		}

		_createClass(ImageTab, [{
			key: 'handlerClick',
			value: function handlerClick(event) {
				this.setState({ show: !this.state.show });
			}
		}, {
			key: 'handlerYearChoice',
			value: function handlerYearChoice(year, event) {
				var _this = this;

				_map2['default'].changeImgage(year);
				this.state.years.forEach(function (every) {
					every.src = '';
					if (every.title === year) {
						every.src = _this.defaultSrc;
					}
				});
				this.setState({ years: this.state.years });
				this.hide();
			}
		}, {
			key: 'hide',
			value: function hide() {
				this.setState({ show: false });
			}
		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;

				var style = this.state.show ? { display: 'block' } : { display: 'none' };
				return React.createElement(
					'div',
					null,
					React.createElement(
						'div',
						{ className: 'imgyear-title', onClick: this.handlerClick.bind(this) },
						React.createElement(
							'span',
							{ className: 'imgyear-txt' },
							'影像切换'
						)
					),
					React.createElement(
						'ul',
						{ className: 'imgyearlist', style: style },
						this.state.years.map(function (year, idx) {
							return React.createElement(
								'li',
								{ key: idx, onClick: _this2.handlerYearChoice.bind(_this2, year.title) },
								year.title,
								'年',
								React.createElement('img', { src: year.src, className: 'ygimages' })
							);
						})
					)
				);
			}
		}]);

		return ImageTab;
	})(React.Component);

	ReactDOM.render(React.createElement(ImageTab, null), document.getElementById('changeImg'));

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "image.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(34);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./image.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./image.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "\r\n#changeImg {\r\n    position: absolute;\r\n    font-family: \"SimSun\";\r\n    border-radius: 2px;\r\n    cursor: pointer;\r\n    right: 2px;\r\n    bottom: 0;\r\n    text-align: center;\r\n    line-height: 29px;\r\n    letter-spacing: 1px;\r\n    height: 29px;\r\n    width: 80px;\r\n    border: 1px solid #B4CBDE;\r\n    bottom: 2px;\r\n}\r\n.imgyear-title:hover {\r\n    opacity: 0.7;\r\n}\r\n.ygimages{\r\n    position: relative;\r\n    top:1px;\r\n    left:5px;\r\n}\r\n.imgyear-txt{\r\n\r\n}\r\n.imgyearlist {\r\n    position: absolute;\r\n    top: 35px;\r\n    width: 80px;\r\n    height: 60px;\r\n    list-style: none;\r\n    padding: 0;\r\n    margin: 0;\r\n    z-index: 10000;\r\n    color: #fff;\r\n}\r\n\r\n.imgyearlist li {\r\n    height: 30px;\r\n    text-align: left;\r\n    padding-left: 5px;\r\n    line-height: 30px;\r\n    font-size: 14px;\r\n    font-family: 'Microsoft Yahei';\r\n    border: 1px solid #cccccc;\r\n    background: rgba(0, 14, 12, 0.6)\r\n}\r\n\r\n.imgyearlist li {\r\n    cursor: pointer;\r\n}", ""]);

	// exports


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	__webpack_require__(36);

	var _Area = __webpack_require__(15);

	var _Area2 = _interopRequireDefault(_Area);

	var _map = __webpack_require__(7);

	var _map2 = _interopRequireDefault(_map);

	var sessionJson = JSON.parse(sessionStorage['mytasks']);

	var Location = (function (_React$Component) {
		_inherits(Location, _React$Component);

		function Location(props) {
			_classCallCheck(this, Location);

			_get(Object.getPrototypeOf(Location.prototype), 'constructor', this).call(this, props);
			this.ifshowsub = false;
			this.state = {
				title: '',
				show_main: false,
				show_sub: false,
				mainData: [],
				subData: []
			};
		}

		_createClass(Location, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				var _this = this;

				var _sessionJson$0 = sessionJson[0];
				var prename = _sessionJson$0.preDistName;
				var distname = _sessionJson$0.distName;

				if (prename === '上海市') {
					if (distname === '上海市') {
						this.mainType = 'COUNTY';
						this.ifshowsub = true;
						_Area2['default'].getCounties().then(function (counties) {
							_this.setState({ mainData: counties, title: '--区县定位--' });
						});
					} else {
						this.mainType = 'TOWN';
						_Area2['default'].getTownsByCounty(distname).then(function (towns) {
							_this.setState({ mainData: towns, title: '--乡镇定位--' });
						});
					}
				} else {
					this.mainType = 'VILLAGE';
					_Area2['default'].getVillagesByTown(distname).then(function (villages) {
						_this.setState({ mainData: villages, title: '--村庄定位--' });
					});
				}
			}
		}, {
			key: 'handlerClick',
			value: function handlerClick(event) {
				this.setState({ show_main: !this.state.show_main, show_sub: false });
			}
		}, {
			key: 'handlerChoice',
			value: function handlerChoice(type, data, event) {
				var key = data.key;
				var X = data.X;
				var Y = data.Y;

				this.setState({ title: data[key], show_main: false, show_sub: false });
				if (type === 'TOWN') {
					_map2['default'].hightLightTown(X, Y);
				} else {
					_map2['default'].map.zoomTo(parseFloat(X), parseFloat(Y), { 'zl': 2 });
				}
				_map2['default'].addMaker(X, Y);
			}
		}, {
			key: 'handlerEnter',
			value: function handlerEnter(county, event) {
				var _this2 = this;

				if (this.ifshowsub) {
					_Area2['default'].getTownsByCounty(county).then(function (towns) {
						_this2.setState({ subData: towns, show_sub: true });
					});
				}
			}
		}, {
			key: 'handlerLeave',
			value: function handlerLeave(event) {
				this.setState({ show_sub: false });
			}
		}, {
			key: 'hide',
			value: function hide() {
				this.setState({ show_main: false });
			}
		}, {
			key: 'render',
			value: function render() {
				var _this3 = this;

				var show = { display: 'block' };
				var hide = { display: 'none' };

				var style_main = this.state.show_main ? show : hide;
				var style_sub = this.state.show_sub ? show : hide;
				return React.createElement(
					'div',
					null,
					React.createElement(
						'div',
						{ onClick: this.handlerClick.bind(this) },
						React.createElement(
							'span',
							null,
							this.state.title
						)
					),
					React.createElement(
						'ul',
						{ className: 'sel-lev-main', style: style_main },
						this.state.mainData.map(function (data, idx) {
							return React.createElement(
								'li',
								{ key: idx, onClick: _this3.handlerChoice.bind(_this3, _this3.mainType, data), onMouseEnter: _this3.handlerEnter.bind(_this3, data[data.key]) },
								data[data.key]
							);
						})
					),
					React.createElement(
						'ul',
						{ className: 'sel-lev-sub', style: style_sub, onMouseLeave: this.handlerLeave.bind(this) },
						this.state.subData.map(function (data, idx) {
							return React.createElement(
								'li',
								{ key: idx, onClick: _this3.handlerChoice.bind(_this3, 'TOWN', data) },
								data[data.key]
							);
						})
					)
				);
			}
		}]);

		return Location;
	})(React.Component);

	ReactDOM.render(React.createElement(Location, null), document.getElementById('location-select'));

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "location.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(37);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./location.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./location.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "\r\n#location-select {\r\n    width: 90px;\r\n    position: absolute;\r\n    right: 90px;\r\n    bottom: 2px;\r\n    height: 29px;\r\n    font-family: 'Microsoft YaHei';\r\n    border: 1px solid #B4CBDE;\r\n    line-height: 29px;\r\n    background: #fff 75px center url(" + __webpack_require__(38) + ") no-repeat;\r\n    text-indent: 0.5em;\r\n    cursor: pointer;\r\n}\r\n.sel-lev-main {\r\n    position: relative;\r\n    width: 90px;\r\n    right: 1px;\r\n    top:1px;\r\n    height: 160px;\r\n    font-family: 'Microsoft YaHei';\r\n    border: 1px solid #B4CBDE;\r\n    list-style: none;\r\n    padding: 0;\r\n    margin: 0;\r\n    z-index: 100000000;\r\n    background: #fff;\r\n    overflow-y: auto;\r\n}\r\n.sel-lev-main li {\r\n    width: 100%;\r\n    height: 20px;\r\n    font-size: 13px;\r\n    line-height: 20px;\r\n    overflow: hidden\r\n}\r\n.sel-lev-main li:hover {\r\n    cursor: pointer;\r\n}\r\n.sel-lev-sub {\r\n    width: 90px;\r\n    height: 160px;\r\n    right: 89px;\r\n    top:30px;\r\n    position: absolute;\r\n    font-family: 'Microsoft YaHei';\r\n    border: 1px solid #B4CBDE;\r\n    list-style: none;\r\n    padding: 0;\r\n    margin: 0;\r\n    z-index: 100000000;\r\n    background: #fff;\r\n    overflow-y: auto;\r\n    overflow-x: hidden;\r\n    border: 1px solid #B4CBDE;\r\n    max-height: 400px;\r\n}\r\n.sel-lev-sub:after,\r\n.sel-lev-main:after {\r\n    clear: both;\r\n    content: '';\r\n    display: table;\r\n}\r\n.sel-lev-sub li {\r\n    width: 94px;\r\n    height: 22px;\r\n    font-size: 13px;\r\n    line-height: 20px;\r\n    overflow: hidden\r\n}\r\n.sel-lev-sub li:hover {\r\n    cursor: pointer;\r\n    background: #eee;\r\n}", ""]);

	// exports


/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAPCAIAAABSnclZAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAVklEQVQYlbWP0QmAQAxDe+Je6Wi3WbpZ/FBKe6AgYj/zSNIMSXZ/2wP7jE2SJABVBHDqFyZZMcmGa0BaG86AtEoadbe7m1lEpLLXyjnn8nhzv979Kz4Abr5VOa5MDSUAAAAASUVORK5CYII="

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	__webpack_require__(40);

	var _storage = __webpack_require__(6);

	var _map = __webpack_require__(7);

	var _map2 = _interopRequireDefault(_map);

	var _Eventful = __webpack_require__(11);

	var _Eventful2 = _interopRequireDefault(_Eventful);

	var _util = __webpack_require__(12);

	var _util2 = _interopRequireDefault(_util);

	var PropFixPopup = (function (_React$Component) {
	  _inherits(PropFixPopup, _React$Component);

	  function PropFixPopup(props) {
	    _classCallCheck(this, PropFixPopup);

	    _get(Object.getPrototypeOf(PropFixPopup.prototype), 'constructor', this).call(this, props);
	    this.state = { items: _storage.propFix };
	  }

	  _createClass(PropFixPopup, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      _util2['default'].dragDiv('prop-fix-popup', 'prop-fix-title');
	      _Eventful2['default'].subscribe('propFix_display', this.display.bind(this));
	    }
	  }, {
	    key: 'handlerClose',
	    value: function handlerClose(event) {
	      _map2['default'].map.clearOverlay();
	      _map2['default'].selectedFeature = undefined;
	      _map2['default'].serverOrCurrent = "";
	      this.close();
	    }
	  }, {
	    key: 'handlerSave',
	    value: function handlerSave(event) {
	      var village = this.refs.village.value;
	      var crop = this.refs.crop.value;
	      var selectedfea = _map2['default'].selectedFeature;
	      var newFeaProp = new gEcnu.Feature.Polygon(selectedfea.getGeometrys(), selectedfea.fields);
	      newFeaProp.addFields({ 'VILLAGE': village, 'CROP': crop });
	      if (_map2['default'].serverOrCurrent == "SERVER") {
	        _map2['default'].land_Featurelayer.updateFea(selectedfea, newFeaProp);
	        _map2['default'].addFeatureToSevrArr({ 'feature': newFeaProp, 'mType': 'UPDATE' });
	        _map2['default'].curWindowFeatures = _map2['default'].updateFeaturesInArr(selectedfea, newFeaProp, _map2['default'].curWindowFeatures);
	        _map2['default'].savePtArr('serpolygon', { 'feature': newFeaProp, 'FID': newFeaProp.fields.FID, 'mType': 'UPDATE' });
	      } else if (_map2['default'].serverOrCurrent == "CURRENT") {
	        _map2['default'].land_Featurelayer.updateFea(selectedfea, newFeaProp);
	        _map2['default'].addFeatures = _map2['default'].updateFeaturesInArr(selectedfea, newFeaProp, _map2['default'].addFeatures);
	        _map2['default'].curWindowFeatures = _map2['default'].updateFeaturesInArr(selectedfea, newFeaProp, _map2['default'].curWindowFeatures);
	        _map2['default'].savePtArr('polygon', { 'feature': newFeaProp, 'ID': newFeaProp.fields.ID, 'mType': 'UPDATE' });
	      }
	      _map2['default'].map.clearOverlay();
	      _map2['default'].selectedFeature = undefined;
	      _map2['default'].serverOrCurrent = "";
	      this.close();
	    }

	    //data -> {'village': '**村', 'crop': '**作物'}
	  }, {
	    key: 'display',
	    value: function display(data) {
	      ReactDOM.findDOMNode(this).parentNode.style.display = 'block';
	      this.state.items.forEach(function (item) {
	        item.value = data[item.ref];
	      });
	      this.setState({ items: this.state.items });
	    }
	  }, {
	    key: 'handlerChange',
	    value: function handlerChange(ref, event) {
	      var target = event.target || event.srcElement;
	      this.state.items.forEach(function (item) {
	        item.ref === ref && (item.value = target.value);
	      });
	      this.setState({ items: this.state.items });
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      ReactDOM.findDOMNode(this).parentNode.style.display = 'none';
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this = this;

	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'prop-fix-title' },
	          React.createElement(
	            'span',
	            null,
	            '属性修改'
	          ),
	          React.createElement('img', { className: 'closeprop-fix', src: 'img/closeprop.png', onClick: this.handlerClose.bind(this) })
	        ),
	        React.createElement(
	          'div',
	          { className: 'prop-fix-content' },
	          this.state.items.map(function (item, idx) {
	            return React.createElement(
	              'div',
	              { key: idx },
	              React.createElement(
	                'label',
	                null,
	                item.title,
	                ':  '
	              ),
	              React.createElement('input', { type: 'text', ref: item.ref, value: item.value, disabled: item.disabled, className: 'prop-fix', onChange: _this.handlerChange.bind(_this, item.ref) }),
	              React.createElement('br', null)
	            );
	          }),
	          React.createElement(
	            'div',
	            { className: 'saveProp', onClick: this.handlerSave.bind(this) },
	            '保存'
	          )
	        )
	      );
	    }
	  }]);

	  return PropFixPopup;
	})(React.Component);

	var PropShowPopup = (function (_React$Component2) {
	  _inherits(PropShowPopup, _React$Component2);

	  function PropShowPopup(props) {
	    _classCallCheck(this, PropShowPopup);

	    _get(Object.getPrototypeOf(PropShowPopup.prototype), 'constructor', this).call(this, props);
	    this.state = { items: _storage.propShow };
	  }

	  _createClass(PropShowPopup, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      _util2['default'].dragDiv('prop-show-popup', 'prop-show-title');
	      _Eventful2['default'].subscribe('propShow_display', this.display.bind(this));
	    }
	  }, {
	    key: 'handlerClose',
	    value: function handlerClose(event) {
	      _map2['default'].map.clearOverlay();
	      _map2['default'].selectedFeature = undefined;
	      _map2['default'].serverOrCurrent = "";
	      this.close();
	    }

	    //data -> [{key: '区县', value: '**区'}, {key: '乡镇', value: '**镇'}, {key: '村庄', value: '**村'}...]
	  }, {
	    key: 'display',
	    value: function display(data) {
	      ReactDOM.findDOMNode(this).parentNode.style.display = 'block';
	      this.state.items.forEach(function (item) {
	        item.value = data.find(function (every) {
	          return every.key === item.title;
	        }).value;
	      });
	      this.setState({ items: this.state.items });
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      ReactDOM.findDOMNode(this).parentNode.style.display = 'none';
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'prop-show-title' },
	          React.createElement(
	            'span',
	            null,
	            '属性查看'
	          ),
	          React.createElement('img', { className: 'closeprop-show', src: 'img/closeprop.png', onClick: this.handlerClose.bind(this) })
	        ),
	        React.createElement(
	          'div',
	          { className: 'prop-show-content' },
	          this.state.items.map(function (item, idx) {
	            return React.createElement(
	              'div',
	              { key: idx },
	              React.createElement(
	                'label',
	                null,
	                item.title,
	                '：'
	              ),
	              React.createElement(
	                'div',
	                { className: 'prop-show' },
	                item.value
	              ),
	              React.createElement('br', null)
	            );
	          })
	        )
	      );
	    }
	  }]);

	  return PropShowPopup;
	})(React.Component);

	ReactDOM.render(React.createElement(PropShowPopup, null), document.getElementById('prop-show-popup'));

	ReactDOM.render(React.createElement(PropFixPopup, null), document.getElementById('prop-fix-popup'));

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "property.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(41);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./property.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./property.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "\r\n/******属性信息修改弹窗*******/\r\n\r\n#prop-fix-popup {\r\n    font: 12px/1.125 Arial, Helvetica, sans-serif;\r\n    position: absolute;\r\n    width: 220px;\r\n    height: 210px;\r\n    left: 272px;\r\n    top: 36px;\r\n    z-index: 10000000000; \r\n    color: #333;\r\n    display: none;\r\n}\r\n.prop-fix-title {\r\n    cursor: move;\r\n    background: #f2f2f2;\r\n    height: 30px;\r\n    line-height: 30px;\r\n    padding: 0 0 0 20px;\r\n    font-weight: 700;\r\n    font-size: 12px;\r\n    vertical-align: middle;\r\n    border-top-left-radius: 2px;\r\n    border-top-right-radius: 2px;\r\n}\r\n.prop-fix-content {\r\n    line-height: 33px;\r\n    background: #ffffff;\r\n    height: 180px;\r\n    font-size: 12px;\r\n    border-bottom-left-radius: 2px;\r\n    border-bottom-right-radius: 2px;\r\n}\r\n.prop-fix-content label {\r\n    padding-left: 20px;\r\n    font-size: 13px;\r\n    color: #333;\r\n}\r\n.prop-fix {\r\n    width: 120px;\r\n    height: 18px;\r\n}\r\n.closeprop-fix {\r\n    position: absolute;\r\n    top: 8px;\r\n    right: 15px;\r\n    cursor: pointer;\r\n}\r\n.closeprop-fix:hover {\r\n    opacity: 0.6;\r\n}\r\n.saveProp {\r\n    background: #529f75;\r\n    color: #fff;\r\n    text-align: center;\r\n    font-size: 14px;\r\n    font-family: \"Microsoft Yahei\";\r\n    height: 30px;\r\n    line-height: 28px;\r\n    margin-left: 62px;\r\n    width: 90px;\r\n    margin-top: 10px;\r\n}\r\n.saveProp:hover {\r\n    opacity: .9;\r\n    cursor: pointer;\r\n}\r\n\r\n/******属性信息“展示”弹窗*******/\r\n\r\n#prop-show-popup {\r\n    font: 12px/1.125 Arial, Helvetica, sans-serif;\r\n    position: absolute;\r\n    width: 210px;\r\n    height: 280px;\r\n    right: 2px;\r\n    bottom: 20px;\r\n    z-index: 10000000000; \r\n    color: #333;\r\n    display: none;\r\n}\r\n.prop-show-title {\r\n    cursor: move;\r\n    background: #f2f2f2;\r\n    height: 30px;\r\n    line-height: 30px;\r\n    padding: 0 0 0 20px;\r\n    font-weight: 700;\r\n    font-size: 12px;\r\n    vertical-align: middle;\r\n    border-top-left-radius: 2px;\r\n    border-top-right-radius: 2px;\r\n}\r\n.prop-show-content {\r\n    padding-top: 10px;\r\n    line-height: 28px;\r\n    background: #ffffff;\r\n    height: 240px;\r\n    font-size: 12px;\r\n    border-bottom-left-radius: 2px;\r\n    border-bottom-right-radius: 2px;\r\n}\r\n.prop-show-content label {\r\n    padding-left: 20px;\r\n    font-size: 13px;\r\n    float: left;\r\n    color: #333;\r\n}\r\n.prop-show {\r\n    width: 130px;\r\n    height: 22px;\r\n    border-bottom: 1px solid silver;\r\n    float: left;\r\n}\r\n.closeprop-show {\r\n    position: absolute;\r\n    top: 7px;\r\n    right: 15px;\r\n    cursor: pointer;\r\n}\r\n.closeprop-show:hover {\r\n    opacity: 0.6;\r\n}", ""]);

	// exports


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\node_modules\\react-hot-api\\modules\\index.js"), RootInstanceProvider = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\RootInstanceProvider.js"), ReactMount = require("react/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	__webpack_require__(43);

	var _Eventful = __webpack_require__(11);

	var _Eventful2 = _interopRequireDefault(_Eventful);

	var Tipwin = (function (_React$Component) {
		_inherits(Tipwin, _React$Component);

		function Tipwin(props) {
			_classCallCheck(this, Tipwin);

			_get(Object.getPrototypeOf(Tipwin.prototype), 'constructor', this).call(this, props);
			this.state = {
				content: '',
				opacity: 0.01,
				display: 'none'
			};
		}

		_createClass(Tipwin, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				_Eventful2['default'].subscribe('showTipwin', this.show.bind(this));
			}
		}, {
			key: 'show',
			value: function show(content) {
				var _this = this;

				this.setState({ content: content, display: 'block', opacity: 1 });
				setTimeout(function () {
					_this.setState({ opacity: 0.01 });
				}, 1200);
				setTimeout(function () {
					_this.setState({ display: 'none' });
				}, 2200);
			}
		}, {
			key: 'render',
			value: function render() {
				var style = { opacity: this.state.opacity, display: this.state.display };
				return React.createElement(
					'div',
					{ className: 'tipwin', style: style },
					React.createElement(
						'span',
						null,
						this.state.content
					)
				);
			}
		}]);

		return Tipwin;
	})(React.Component);

	ReactDOM.render(React.createElement(Tipwin, null), document.getElementById('save-tip'));

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("D:\\ecnu\\apm\\Apache2.2\\htdocs\\aaicgis\\node_modules\\react-hot-loader\\makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "tipwin.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(44);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./tipwin.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./tipwin.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "\r\n.tipwin {\r\n    opacity: 0.01;\r\n    position: absolute;\r\n    width: 100px;\r\n    z-index: 20000000;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    text-align: center;\r\n    left: 45%;\r\n    top: 50%;\r\n    border-radius: 3px;\r\n    color: #ffffff;\r\n    font-size: 18px;\r\n    font-family: \"Microsoft YaHei\", \"\\5FAE\\8F6F\\96C5\\9ED1\", \"SimSun\", \"\\5B8B\\4F53\";\r\n    background-color: rgba(0, 14, 12, 0.5);\r\n    transition: all 1s;\r\n    -webkit-transition: all 1s;\r\n}", ""]);

	// exports


/***/ }
/******/ ]);