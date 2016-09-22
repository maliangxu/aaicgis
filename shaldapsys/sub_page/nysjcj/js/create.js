(function ($){
		/**
		 * [createSecurity description]
		 * @param  {[type]} employeeID [员工id号]
		 * @param  {[type]} dbName     [数据库名称]
		 * @param  {[type]} tableName  [数据库表名称]
		 * @return {[type]}            [description]
		 */
		function createSecurity(employeeID , dbName, tableName) {
			this.cacheObj = {
				'secuID'       : '.form-content .secuID',
				'policyholder' : '.form-content .policyholder',
				'cardClass'    : '.form-content .cardClass',
				'cardID'       : '.form-content .cardID',
				'benefitPerson': '.form-content .benefitPerson',
				'phoneNum'     : '.form-content .phoneNum',
				'address'      : '.form-content .address',
				'securityClass': '.form-content .securityClass',
				'totalArea'    : '.form-content .totalArea',
				'startTime'    : '#startTime',
				'endTime'      : '#endTime',

				'cancel_btn'   : '#j-cancelcreate',
				'confirm_btn'  : '#j-create',
				'create_btn'   : '#create-policy',

				'maskObj'      : null,

				'employeeID'   : employeeID,
	//设置dom中获取值与数据库表中的字段对应关系用来添加和删除，键名是数据库中对应的字段名，键值对应dom中的取值,在setMappingVal函数中设置
				'dbTableField' : {},
				'dbName'       : dbName,
				'tableName'    : tableName
			};

			this.init();
		}

		createSecurity.prototype = {
			init: function (){
				this.bindCreateBtn();
			},

			create: function (){
				this.initMask();
				this.setSecurityID();
				this.setMappingVal();
				this.bindEvent();
			},

			bindCreateBtn: function (){
				var self = this;
				$(this.cacheObj.create_btn).click(function (){
					self.create();
				});
			},

			//初始化弹窗
			initMask: function (){
				var t = this.setMaskContentModel();
				this.cacheObj.maskObj = new maskDiv({
					template: t,
					dialogWidth: 700,
					dialogHeight: 400
				});
			},
			//设置弹窗中form表单的内容区
			setMaskContentModel: function(){
				var template = '<div class="securityfrom">'
							+'<div class="form-title">'
							+	'创建承保'
							+'</div>'
							+'<div class="form-content">'
							+	'<dl>'
							+		'<dt>任务编号:</dt>'
							+		'<dd><input type="text" disabled class="secuID"/></dd>'
							+		'<dt>投保人:</dt>'
							+		'<dd><input type="text" class="policyholder"/></dd>'
							+		'<dt>证件类型:</dt>'
							+		'<dd><select class="cardClass"><option value="身份证">身份证</option><option value="学生证">学生证</option><option value="出生证">出生证</option></select></dd>'
							+		'<dt>证件号码:</dt>'
							+		'<dd><input type="text" class="cardID"/></dd>'
							+		'<dt>被保险人:</dt>'
							+		'<dd><input type="text" class="benefitPerson"/></dd>'
							+		'<dt>联系电话:</dt>'
							+		'<dd><input type="text" class="phoneNum"/></dd>'
							+		'<dt>联系地址:</dt>'
							+		'<dd><input type="text" class="address"/></dd>'
							+		'<dt>险种名称:</dt>'
							+		'<dd><input type="text" class="securityClass"/></dd>'
							+		'<dt>起保日期:</dt>'
							+		'<dd><input type="text" id="startTime"/></dd>'
							+		'<dt>终保日期:</dt>'
							+		'<dd><input type="text" id="endTime"/></dd>'
							+	'</dl>'
							+'</div>'
							+'<div class="form-btnwrap"><div class="div-btn cancel-btn" id="j-cancelcreate">取消</div><div class="div-btn okbtn" id="j-create">创建</div></div>'
					  +'</div>';

				return template;
			},

			//生成保险编号
			createSecurityID: function (){
				var getDate = new Date();
				var day = getDate.toLocaleDateString().split('/');

				var h = new Date().getHours(),
					m = new Date().getMinutes(),
					s = new Date().getSeconds();

				var endTimeString = ''+(parseInt(h) < 10 ? '0'+h : h)+(parseInt(m) < 10 ? '0'+m : m)+(parseInt(s) < 10 ? '0'+s : s);

				var d = day[0] + (parseInt(day[1]) < 10 ? '0'+day[1] : day[1]) + (parseInt(day[2]) < 10 ? '0'+day[2] : day[2]);

				return d + this.cacheObj.employeeID + endTimeString;
			},

			//设置保险编号
			setSecurityID: function (){
				var secuid = this.createSecurityID();
				$(this.cacheObj.secuID).val(secuid);
			},

			//关闭弹框
			bindEvent: function (){
				var self = this;

				$(this.cacheObj.cancel_btn).click(function (){
					self.cacheObj.maskObj.close();
				});

				$(this.cacheObj.confirm_btn).click(function (){
					self.submitAddData();
				});

				$(this.cacheObj.startTime).Zebra_DatePicker();

				$(this.cacheObj.endTime).Zebra_DatePicker();
			},


			//手动设置数据库中的字段和表单中的值的对应关系
			setMappingVal: function (){
				var self = this;
				self.cacheObj.dbTableField = {
					'USRID':sessionStorage.getItem("usrName"),
					'CODING': $(self.cacheObj.secuID).val(),
					'POLICYHOLDER': $(self.cacheObj.policyholder).val(),
					'LICENSECLASS': $(self.cacheObj.cardClass).val(),
					'LICENSENUM': $(self.cacheObj.cardID).val(),
					'RECEIPTOR': $(self.cacheObj.benefitPerson).val(),
					'PHONE': $(self.cacheObj.phoneNum).val(),
					'ADDRESS': $(self.cacheObj.address).val(),
					'SECURENAME': $(self.cacheObj.securityClass).val(),
					'START': $(self.cacheObj.startTime).val().replace(/-/g,''),
					'END': $(self.cacheObj.endTime).val().replace(/-/g,'')
				};
			},

			submitAddData: function (){
				var self = this;

				self.setMappingVal();

				var mappingData = self.cacheObj.dbTableField;
				var fields = [], data=[[]];
				for(var key in mappingData){
					fields.push(key);
					data[0].push(mappingData[key]);
				}

				var newPolicy = {policy: mappingData, bd: [], plArea: 0.00};
				Security.items.push(newPolicy);
				Security.addPolicyDom(newPolicy);

				var sqlservice = new gEcnu.WebSQLServices.SQLServices({'processCompleted':function(tmp,fields){
			      	toolUtil.newalertDiv('创建成功!');
			      	self.cacheObj.maskObj.close();
			    },'processFailed':function (){alert('添加失败！');return false;}});
			      
			    var datas = {'Fields':fields, 'Data':data};
			      
			    sqlservice.processAscyn(gEcnu.ActType.ADD, self.cacheObj.dbName, self.cacheObj.tableName, datas);
			},
			//扩展api，用来验证表单提交数据的正确性
			validateFormVal: function (){
				
			}
		};

		window.createSecurity = createSecurity;

	})(jQuery);
