curcoding = 0;
curbdid = -1;
searchkind = 0; //有两个值0和1,0是属性查，1是图查
curval = '';
curWinBdArr = [];
exceptFIDArr = [];
(function($) {
    function createSecurityList(items, fid) {

        // var items_test = [
        //  {
        //      policy: {'CODING': '1111',
        //          'POLICYHOLDER': '李四农场',
        //          'LICENSECLASS': '省份证',
        //          'LICENSENUM': '444',
        //          'RECEIPTOR': '张三',
        //          'PHONE': '666',
        //          'ADDRESS': '彭浦新村110号',
        //          'SECURENAME': '果树',
        //          'AREA': '99',
        //          'START': '20160415',
        //          'END': '20160423'},

        //      bd:[{
        //          bdxq: {
        //              'ID': 1,
        //              'CODING': 1111,
        //              'BDNAME': '仁果类',
        //              'PZNAME': '核桃',
        //              'PROVINCE': '上海市',
        //              'CITY': '上海市',
        //              'COUNTY': '宝山区',
        //              'TOWN': '张庙街道',
        //              'VILLAGE': '虎林二居委会',
        //              'POSTCODE': '201102',
        //              'ADDRESS': '110号'
        //          },
        //          land: [
        //              {
        //              'FID': '1',
        //              'XMIN': '-32146.0',
        //              'YMIN': '-45534.5',
        //              'XMAX': '-31940.0',
        //              'YMAX': '-45393.5',
        //              'SHPAREA': '500',
        //              'BDNAME': '仁果类',
        //              'PZNAME': '核桃',
        //              'PROVINCE': '上海市',
        //              'CITY': '上海市',
        //              'COUNTY': '宝山区',
        //              'TOWN': '张庙街道',
        //              'VILLAGE': '虎林二居委会',
        //              'POSTCODE': '201102',
        //              'ADDRESS': '110号',
        //              'CODING': '111111',
        //              'BDID': 1
        //              }
        //          ]
        //      }]
        //  }
        // ];

        //this.items = items;
        this.items = items;
        //this.drawObj = drawpolygon_obj;
        this.editObj = editpolygon;

        this.fid = fid;

        ifPolicyEdit = false;
        ifLandEdit = false;

        curPolicyCode = -1;
        curbdID = -1;

        //this.ifscrollbar = false;

        this.cacheObj = {
            itemOuterWrap: '.item-contain',
            listWrap: '.item-ul',
            policyDetail: '.policy-detailWin',
            landDetail: '.policy-landdtWin',

            policyDetailInfo: '.p-detail',
            policyShowDetailBtn: '.p-detailbtn',
            landShowDetailBtn: '.i-detailbtn',
            DrawlandBtn: '.land-draw',
            landEditBtn: '.i-editbtn',
            landDelBtn: '.i-delbtn',
            arrow: '.open-arrow',
            landcheck: '.l-check',
            landDetailInfo: '.l-detail',

            policyFieldEditBtn: '#j-changecomfirm',
            bdFieldEditBtn: '#j-changeBdComfirm',

            deletePolicyBtn: '#j-deletepolicy',
            deleteBdBtn: '#j-deleteBd',

            policycancel: '#j-cancelchange',
            bdcancel: '#j-cancelBdChange',

            bdbtn: '.bd-create',
            bdcancelbtn: '#wp-cancel',
            bdokbtn: '#wp-ok',
            bdshowDetailbtn: '.bd-dt',
            bdarrow: '.bd-openarrow',
            bdvillagesel: '#bd-village-sel',
            bdtownsel: '#bd-town-sel',
            bdcountysel: '#bd-county-sel',

            bddetailvillagesel: '#bd-detail-village-sel',
            bddetailtownsel: '#bd-detail-town-sel',
            bddetailcountysel: '#bd-detail-county-sel',
            bdlocationTo: '.bd-detail',

            bdwrite: '#writeProperty',

            landNumClass: '.land-num',
            bdNumClass: '.bd-num',

            policyMapping: {
                'CODING': '保单编号',
                'POLICYHOLDER': '投保人',
                'LICENSECLASS': '证件类型',
                'LICENSENUM': '证件号码',
                'RECEIPTOR': '被保险人',
                'PHONE': '联系电话',
                'ADDRESS': '联系地址',
                'SECURENAME': '险种名称',
                'AREA': '总面积',
                'START': '起保日期',
                'END': '终保日期'
            },
            bdMapping: {
                'SHPAREA': '标的面积'
            },

            landMapping: {
                'FID': '',
                'XMIN': '',
                'YMIN': '',
                'XMAX': '',
                'YMAX': '',
                'LANDTYPE': '用地类型',
                'SHPAREA': '地块面积',
                'BDNAME': '标的名称',
                'PZNAME': '品种名称',
                'PROVINCE': '省',
                'CITY': '市',
                'COUNTY': '区',
                'TOWN': '镇',
                'VILLAGE': '村',
                'POSTCODE': '邮编',
                'ADDRESS': '地址',
                'CODING': '保单编号'
            }
        };

        var itemstpl = document.getElementById('items-tpl').innerHTML;
        this.itemsTpl = juicer(itemstpl);

        var pltpl = document.getElementById('policy-tpl').innerHTML;
        this.plTpl = juicer(pltpl);

        var bdtpl = document.getElementById('biaodi-tpl').innerHTML;
        this.bdTpl = juicer(bdtpl);

        var landtpl = document.getElementById('land-tpl').innerHTML;
        this.landTpl = juicer(landtpl);

        this.init();
    }

    createSecurityList.prototype = {

        init: function() {
            curWinBdArr = [];
            exceptFIDArr = [];
            this.createList();
            this.unbindEvent();
            this.bindEvent();
        },

        refreshItems: function() {

        },

        unbindEvent: function() {
            $(this.cacheObj.listWrap).off();
        },

        createList: function() {
            var self = this;
            var itm = this.items;
            var mp = this.cacheObj.policyMapping;
            var ml = this.cacheObj.landMapping;
            var bd = this.cacheObj.bdMapping;
            var itemDom = '';
            $(self.cacheObj.itemOuterWrap).perfectScrollbar('destroy');
            $(self.cacheObj.listWrap).empty();
            $(self.cacheObj.itemOuterWrap).removeClass('ps-container');

            for (var i = 0; i < itm.length; i++) {
                var plArea = 0;
                for (var j = 0; j < itm[i].bd.length; j++) {
                    var bdArea = 0;
                    curWinBdArr.push(itm[i].bd[j].bdxq.ID);
                    for (var z = 0; z < itm[i].bd[j].land.length; z++) {
                        var landArea = (parseFloat(itm[i].bd[j].land[z].SHPAREA) / 666.67).toFixed(2);
                        bdArea += parseFloat(landArea);
                        var cp = self._calCenterPoint(itm[i].bd[j].land[z].XMIN, itm[i].bd[j].land[z].XMAX, itm[i].bd[j].land[z].YMIN, itm[i].bd[j].land[z].YMAX);
                        itm[i].bd[j].land[z].centerPoint = '' + cp.x + ',' + cp.y;
                    }
                    itm[i].bd[j].bdArea = bdArea.toFixed(2);
                    plArea += parseFloat(bdArea);
                }
                itm[i].plArea = plArea.toFixed(2);
            }

            getVectorLandData();

            itemDom = this.itemsTpl.render({ 'items': itm });
            $(this.cacheObj.listWrap).html(itemDom);

            if (this.fid) {
                $('.l-item[data-id=' + this.fid + ']').addClass('colorred-land');
            }

            $(self.cacheObj.itemOuterWrap).perfectScrollbar();

        },

        addPolicyDom: function(policyData) {
            var plDom = this.plTpl.render({ 'item': policyData });
            var root = $(this.cacheObj.listWrap);
            if (root.children('li').length) {
                root.children('li:last').after(plDom);
            } else {
                root.append(plDom);
            }
            $(this.cacheObj.itemOuterWrap).perfectScrollbar('update');
        },

        addBdDom: function(coding, bdData, idx) {
            var bdDom = this.bdTpl.render({ 'bd': bdData, 'index': idx });
            var root = $('.p-item[data-code=' + coding + ']').find('.l-items');
            if (root.children('li').length) {
                root.children('li:last').after(bdDom);
            } else {
                root.append(bdDom);
            }
            $(this.cacheObj.itemOuterWrap).perfectScrollbar('update');
        },

        addLandDom: function(bdid, landData, idx) {
            var landDom = this.landTpl.render({ 'land': landData, 'landIndex': idx });
            var root = $('.bd-item[data-bdid=' + bdid + ']').find('.bd-land');
            root.slideDown('fast');
            root.prev().children(this.cacheObj.bdarrow).removeClass('bd-close').addClass('bd-open');
            otherVarible.curWindowInsureFeas.forEach(function(fea) {
                if(fea.fields.BDID == bdid) {
                    insure_Featurelayer.addFeature(fea);
                }
            });
            if(!toolUtil.isInArr(bdid, curWinBdArr)) {
                curWinBdArr.push(bdid);
            }
            if (root.children('li').length) {
                root.children('li:last').after(landDom);
            } else {
                root.append(landDom);
            }
            $(this.cacheObj.itemOuterWrap).perfectScrollbar('update');
        },

        updateOrder: function(dom, numClass) {
            while (dom.next().length) {
                dom = dom.next();
                var numDom = dom.find(numClass);
                var num = parseInt(numDom.html()) - 1;
                numDom.html(num);
            }
        },

        updateArea: function(area, bdid, coding, type) {
            var bdArea = 0, plArea = 0;
            var bdChange = false;
            area = type === 'PLUS' ? area : -area;
            this.items.forEach(function(item) {
                if (item.policy.CODING == coding) {
                    item.plArea = (parseFloat(item.plArea) + area).toFixed(2);
                    plArea = item.plArea;
                    var bdArr = item.bd;
                    bdArr.forEach(function(bd) {
                        if (bd.bdxq.ID == bdid) {
                            bd.bdArea = (parseFloat(bd.bdArea) + area).toFixed(2);
                            bdArea = bd.bdArea;
                            bdChange = true;
                        }
                    });
                }
            });
            this._updateAreaDom(bdid, coding, bdArea, plArea, bdChange);
        },

        _updateAreaDom: function(bdid, coding, bdArea, plArea, ifchange) {
            $('.p-item[data-code=' + coding + ']').find('.pl-area').html(plArea);
            if(ifchange) {
                $('.bd-item[data-bdid=' + bdid + ']').find('.bd-area').html(bdArea);
            }
        },

        getBdArrByCoding: function(coding) {
            var curbdArr = [];
            this.items.forEach(function(item) {
                if (item.policy.CODING == coding) {
                    var bdArr = item.bd;
                    bdArr.forEach(function(bd) {
                        curbdArr.push(bd.bdxq.ID); 
                    });
                }
            });
            return curbdArr;
        },

        getBdArrByCoding_vis: function(coding) {
            var cache = this.cacheObj;
            var curbdArr = [];
            var root = $('.p-item[data-code=' + coding + ']').children('ul');
            if(root.children('li').length > 0) {
                var li = root.children('li:first');
                while(li.length > 0) {
                    if(li.find(cache.bdarrow).hasClass('bd-open')) {
                        var bdid = li.data('bdid');
                        curbdArr.push(bdid);
                    }
                    li = li.next();
                }
            }
            return curbdArr;
        },

        _hidelandsByCoding: function(coding) {
            var feas = otherVarible.curWindowInsureFeas;
            var bdArr = this.getBdArrByCoding(coding);
            curWinBdArr = curWinBdArr.filter(function(curbdid) {
                var isExist = bdArr.some(function(bdid) {
                    return bdid == curbdid;
                });
                return !isExist;
            });
            feas.forEach(function(fea) {
                if (toolUtil.isInArr(fea.fields.BDID, bdArr)) {
                    insure_Featurelayer.removeFeature(fea);
                }
            });
        },

        _showlandsByCoding: function(coding) {
            var feas = otherVarible.curWindowInsureFeas;
            var bdArr = this.getBdArrByCoding_vis(coding);
            curWinBdArr = curWinBdArr.concat(bdArr);
            feas.forEach(function(fea) {
                if (toolUtil.isInArr(fea.fields.BDID, bdArr) && !toolUtil.isInArr(fea.fields.FID, exceptFIDArr)) {
                    insure_Featurelayer.addFeature(fea);
                }
            });
        },

        bindEvent: function() {
            var self = this;

            var cache = self.cacheObj;

            var listWrap = cache.listWrap;

            $(listWrap).on('click', cache.policyShowDetailBtn, function() {
                $(cache.landDetail).hide();
                $(cache.policyDetail).show();
                showMaskLayer(); //显示遮罩层
                $(cache.policyFieldEditBtn).text('编辑');
                self.ifPolicyEdit = false;
                var code = self.curPolicyCode = $(this).parent().parent().data('code');
                var data = self.items;
                var d = {};
                for (var i = 0; i < data.length; i++) {
                    if (data[i].policy.CODING === code) {
                        d = data[i].policy;
                    }
                }
                self.curPolicyData = d;
                self.policyDetailBindData(d);
            });

            $(listWrap).on('click', cache.bdshowDetailbtn, function() {
                var fid = self.curbdID = $(this).parent().parent().data('bdid');
                $(cache.policyDetail).hide();
                $(cache.landDetail).show();
                showMaskLayer(); //显示遮罩层
                $(cache.bdFieldEditBtn).text('编辑');
                self.ifLandEdit = false;
                var code = $(this).parent().parent().parent().parent().data('code') + '';
                self.curPolicyCode = code;
                var data = self.items;

                var d = {};
                for (var i = 0; i < data.length; i++) {
                    if (data[i].policy.CODING == code) {
                        for (var j = 0; j < data[i].bd.length; j++) {
                            if (data[i].bd[j].bdxq.ID == fid) {
                                d = data[i].bd[j].bdxq;
                            }
                        }
                    }
                }

                self.curbdData = d;

                self.landDetailBindData(d);
            });

            $(listWrap).on('click', cache.arrow, function() {
                var coding = $(this).parent().parent().data('code');
                if ($(this).hasClass('arrow-up')) {
                    $(this).removeClass('arrow-up').addClass('arrow-down');
                    $(this).parent().next().slideUp('fast');
                    self._hidelandsByCoding(coding);
                } else {
                    $(this).removeClass('arrow-down').addClass('arrow-up');
                    $(this).parent().next().slideDown('fast');
                    self._showlandsByCoding(coding);
                }
            });

            $(listWrap).on('click', cache.policyDetailInfo, function() {
                var coding = $(this).parent().parent().data('code');
                var feas = otherVarible.curWindowInsureFeas;
                if ($(this).prev().hasClass('arrow-up')) {
                    $(this).prev().removeClass('arrow-up').addClass('arrow-down');
                    $(this).parent().next().slideUp('fast');
                    self._hidelandsByCoding(coding);
                } else {
                    $(this).prev().removeClass('arrow-down').addClass('arrow-up');
                    $(this).parent().next().slideDown('fast');
                    self._showlandsByCoding(coding);
                }
            });

            $(listWrap).on('click', cache.bdarrow, function() {
                var bdid = $(this).parent().parent().data('bdid');
                var feas = otherVarible.curWindowInsureFeas;
                if ($(this).hasClass('bd-open')) {
                    $(this).removeClass('bd-open').addClass('bd-close');
                    $(this).parent().next().slideUp('fast');
                    curWinBdArr = curWinBdArr.filter(function(_bdid) {
                        return _bdid !== bdid;
                    });
                    feas.forEach(function(fea) {
                        if (fea.fields.BDID == bdid) {
                            insure_Featurelayer.removeFeature(fea);
                        }
                    });
                } else {
                    $(this).removeClass('bd-close').addClass('bd-open');
                    $(this).parent().next().slideDown('fast');
                    curWinBdArr.push(bdid);
                    feas.forEach(function(fea) {
                        if (fea.fields.BDID == bdid && !toolUtil.isInArr(fea.fields.FID, exceptFIDArr)) {
                            insure_Featurelayer.addFeature(fea);
                        }
                    });
                }
            });

            $(cache.policycancel).on('click', function() {
                $(cache.policyDetail).hide();
                $(cache.policyDetail).find('input,select').prop('disabled', true);
            });

            $(cache.bdcancel).on('click', function() {
                $(cache.landDetail).hide();
                $(cache.landDetail).find('input,select').prop('disabled', true);
            });

            $(cache.deletePolicyBtn).on('click', function() {
                self.deletePolicy();
            });

            $(cache.deleteBdBtn).on('click', function() {
                self.deleteBd();
            });

            $(cache.policyFieldEditBtn).on('click', function() {
                if (!self.ifPolicyEdit) {
                    self.ifPolicyEdit = !self.ifPolicyEdit;
                    $(this).text('保存');
                    $(cache.policyDetail).find('input,select').not('.win-secuID').prop('disabled', false);
                } else {
                    self.ifPolicyEdit = !self.ifPolicyEdit;

                    $(cache.policyDetail).find('input,select').not('.win-secuID').prop('disabled', true);

                    var fields = ['CODING', 'POLICYHOLDER', 'LICENSECLASS', 'LICENSENUM', 'RECEIPTOR', 'PHONE', 'ADDRESS', 'SECURENAME', 'START', 'END'];
                    var data = self.policycoldata();
                    var tb = 'policy';
                    self.updateDetail(tb, fields, data, 'POLICY');

                    $(this).text('编辑');
                }
            });

            $(cache.bdFieldEditBtn).on('click', function() {
                if (!self.ifLandEdit) {
                    self.ifLandEdit = !self.ifLandEdit;
                    $(this).text('保存');
                    $(cache.landDetail).find('input,select').not('.win2-secuID,.win2-province,.win2-city').prop('disabled', false);
                } else {
                    self.ifLandEdit = !self.ifLandEdit;

                    $(cache.landDetail).find('input,select').not('.win2-secuID,.win2-province,.win2-city').prop('disabled', true);

                    var fields = ['ID', 'BDNAME', 'PZNAME', 'COUNTY', 'TOWN', 'VILLAGE', 'POSTCODE', 'ADDRESS', 'X', 'Y'];
                    var tb = 'biaodi';
                    var point = self.colbdpoint('UPDATE');
                    var data = self.landcoldata(self.curbdID, point);
                    self.updateDetail(tb, fields, data, 'BD', point);

                    $(this).text('编辑');
                }
            });

            $(listWrap).on('click', cache.landcheck, function() {
                var fea;
                var fid = $(this).parent().data('id');
                var feas = otherVarible.curWindowInsureFeas;
                for (var i = 0, len = feas.length; i < len; i++) {
                    if (feas[i].fields.FID == fid) {
                        fea = feas[i];
                        break;
                    }
                };
                if ($(this).is(':checked')) {
                    exceptFIDArr = exceptFIDArr.filter(function(item) {
                        return item !== fid;
                    });
                    insure_Featurelayer.addFeature(fea);
                } else {
                    exceptFIDArr.push(fid);
                    insure_Featurelayer.removeFeature(fea);
                }
            });

            $(listWrap).on('click', cache.landDetailInfo, function() {
                var l = ($(this).parent().data('center') + '').split(',');
                self.locationToPt(l[0], l[1]);
            });

            $(listWrap).on('click', cache.landEditBtn, function() {
                var l = ($(this).parent().data('center') + '').split(',');
                self.editLand(l[0], l[1]);
            });

            $(listWrap).on('click', cache.landDelBtn, function() {
                self.deleteLand($(this));
            });

            $(listWrap).on('click', cache.DrawlandBtn, function() {
                curcoding = $(this).parent().parent().parent().parent().data('code');
                curbdid = $(this).parent().parent().data('bdid');
                self.editObj.activate();
                gmap.setCursorStyle('select', 'img/cursorimg/addpoint.png');
                otherVarible.ifPropChange = 'addLand';
                $('.bd-title').addClass('colororange');
            });


            $(listWrap).on('click', cache.bdbtn, function() {
                var c = self.curPolicyCode = $(this).parent().parent().data('code');
                $('.l-wp').find('input[name=bdbh]').val(c);
                $(cache.bdwrite).show();
                showMaskLayer(); //显示遮罩层
            });

            $(cache.bdcancelbtn).on('click', function() {
                $(cache.bdwrite).hide();
            });

            $(listWrap).on('click', cache.bdlocationTo, function() {
                var point = ($(this).parent().parent().data('center') + '').split(',');
                self.locationToPt(point[0], point[1]);
            });

            $(cache.bdokbtn).on('click', function() {
                var tb = 'biaodi';
                var fields = ['CODING', 'BDNAME', 'PZNAME', 'PROVINCE', 'CITY', 'COUNTY', 'TOWN', 'VILLAGE', 'POSTCODE', 'ADDRESS', 'X', 'Y'];
                var point = self.colbdpoint('INSERT');
                var d = self.colbddata(point);
                self.InsertDetail(tb, fields, d, point);
            });

            $('#win-startTime').Zebra_DatePicker();
            $('#win-endTime').Zebra_DatePicker();

            $('.mask-layer').click(function() {
                $(this).hide();
                $('.wincenter').hide();
            });
            $('.div-btn').click(function() {
                var text = $(this).text();
                if (text != '保存') {
                    $('.mask-layer').hide();
                }
            });

            function showMaskLayer() {
                $('.mask-layer').show();
            }
        },

        colbddata: function(pt) {
            return [
                [
                    $('.l-wp').find('input[name=bdbh]').val(),
                    $('.l-wp').find('input[name=bdmc]').val(),
                    $('.l-wp').find('select[name=pzmc]').val(),
                    $('.l-wp').find('input[name=sheng]').val(),
                    $('.l-wp').find('input[name=shi]').val(),
                    $('.l-wp').find('select[name=qu]').val(),
                    $('.l-wp').find('select[name=z]').val(),
                    $('.l-wp').find('select[name=c]').val(),
                    $('.l-wp').find('input[name=yb]').val(),
                    $('.l-wp').find('input[name=dz]').val(),
                    pt.x,
                    pt.y
                ]
            ];
        },

        colbdpoint: function(type) {
            var cache = this.cacheObj;
            var centerx, centery, root;
            if (type === 'INSERT') {
                if ($(cache.bdvillagesel).val()) {
                    root = cache.bdvillagesel;
                } else if ($(cache.bdtownsel).val()) {
                    root = cache.bdtownsel;
                } else {
                    root = cache.bdcountysel;
                }
            } else {
                if ($(cache.bddetailvillagesel).val()) {
                    root = cache.bddetailvillagesel;
                } else if ($(cache.bddetailtownsel).val()) {
                    root = cache.bddetailtownsel;
                } else {
                    root = cache.bddetailcountysel;
                }
            }
            centerx = parseFloat($(root).find('option:selected').attr('centerx'));
            centery = parseFloat($(root).find('option:selected').attr('centery'));
            return { x: centerx, y: centery };
        },

        policycoldata: function() {
            return [
                [
                    $('.win-secuID').val(),
                    $('.win-policyholder').val(),
                    $('.win-cardClass').val(),
                    $('.win-cardID').val(),
                    $('.win-benefitPerson').val(),
                    $('.win-phoneNum').val(),
                    $('.win-address').val(),
                    $('.win-securityClass').val(),
                    $('#win-startTime').val().replace(/-/g, ''),
                    $('#win-endTime').val().replace(/-/g, '')
                ]
            ];
        },

        landcoldata: function(fid, point) {
            return [
                [
                    fid,
                    $('.win2-bdmc').val(),
                    $('.win2-pzmc').val(),
                    $('.win2-county').val(),
                    $('.win2-town').val(),
                    $('.win2-village').val(),
                    $('.win2-yb').val(),
                    $('.win2-address').val(),
                    point.x,
                    point.y
                ]
            ];
        },

        updateDetail: function(tb, f, d, type, point) {
            var self = this;
            var cache = self.cacheObj;
            if (type === 'POLICY') {
                var curpl = self.curPolicyData;
                f.forEach(function(key, idx) {
                    curpl[key] = d[0][idx];
                });
                $('.p-item[data-code=' + self.curPolicyCode + ']').find('.i-name-txt').html(curpl.SECURENAME);
            } else {
                var curbd = self.curbdData;
                f.forEach(function(key, idx) {
                    curbd[key] = d[0][idx];
                });
                var bdDom = $('.bd-item[data-bdid=' + self.curbdID + ']');
                bdDom.find('.bd-name').html(curbd.BDNAME);
                bdDom.find('.bd-pzname-txt').html(curbd.PZNAME);
                bdDom.find('.bd-addr-txt').html(curbd.ADDRESS);
                //$('.bd-item[data-bdid=' + self.curbdID + ']').find('.bd-pzname-txt').html(curbd.PZNAME).parent().next().children('.bd-addr-txt').html(curbd.ADDRESS);
            }
            var landsServices = new gEcnu.WebSQLServices.SQLServices({
                'processCompleted': function(ss) {
                    $(cache.policyDetail).hide();
                    $(cache.landDetail).hide();
                    toolUtil.newalertDiv('保存成功');
                    if (type === 'BD') gmap.zoomTo(point.x, point.y, { zl: 1 });
                },
                'processFailed': function() {}
            });
            var qryjson = { Fields: f, Data: d };
            landsServices.processAscyn(gEcnu.ActType.UPDATE, config.dbName, tb, qryjson);
        },

        InsertDetail: function(tb, f, d, point) {
            var self = this;
            var coding = self.curPolicyCode;
            var bdxq = {},
                index = 0;
            f.forEach(function(fld, idx) {
                bdxq[fld] = d[0][idx];
            });
            var bdJson = { bdxq: bdxq, land: [], bdArea: 0.00 };
            this.items.forEach(function(item) {
                if (item.policy.CODING == coding) {
                    index = item.bd.length;
                    item.bd.push(bdJson);
                }
            });
            var qryjson = { 'Fields': f, 'Data': d };
            toolUtil.recordAdd(config.dbName, tb, qryjson, function(ss) {
                $(self.cacheObj.bdwrite).hide();
                toolUtil.newalertDiv('添加成功');
                gmap.zoomTo(point.x, point.y, { zl: 1 });
                var qrysql = { 'fields': 'max(ID)', 'lyr': tb, 'filter': '' };
                toolUtil.recordQuery(config.dbName, qrysql, function(msg) {
                    bdJson.bdxq.ID = msg[0]['max(ID)'];
                    self.addBdDom(coding, bdJson, index);
                })
            });
        },

        deletePolicy: function() {
            var self = this;
            var cache = self.cacheObj;
            var coding = this.curPolicyCode;

            var curInsFeas = otherVarible.curWindowInsureFeas;
            otherVarible.curWindowInsureFeas = curInsFeas.filter(function(fea) {
                if (fea.fields.CODING == coding) insure_Featurelayer.removeFeature(fea);
                return (fea.fields.CODING != coding);
            });
            this.items = this.items.filter(function(item) {
                return item.policy.CODING != coding;
            });
            var dom = $('.p-item[data-code=' + coding + ']');
            dom.remove();

            connect.deletePolicyByCoding(coding, function() {
                $(cache.policyDetail).hide();
                toolUtil.newalertDiv('删除成功');
            });
        },

        //标的数据删除接口      
        deleteBd: function() {
            var self = this;
            var cache = this.cacheObj;
            var bdid = this.curbdID;
            var coding = this.curPolicyCode;
            var area = 0;

            var curInsFeas = otherVarible.curWindowInsureFeas;
            otherVarible.curWindowInsureFeas = curInsFeas.filter(function(fea) {
                if (fea.fields.BDID == bdid) insure_Featurelayer.removeFeature(fea);
                return (fea.fields.BDID != bdid);
            });
            this.items.forEach(function(item) {
                if (item.policy.CODING == coding) {
                    item.bd = item.bd.filter(function(bd) {
                        if (bd.bdxq.ID == bdid) area = bd.bdArea;
                        return bd.bdxq.ID != bdid;
                    });
                }
            });
            var dom = $('.bd-item[data-bdid=' + bdid + ']');
            this.updateOrder(dom, this.cacheObj.bdNumClass);
            dom.remove();
            this.updateArea(area, bdid, coding, 'MINUS');

            connect.deleteBdById(bdid, function() {
                $(cache.landDetail).hide();
                toolUtil.newalertDiv('删除成功');
            });
        },

        //地块数据删除接口
        deleteLand: function(root) {
            var curInsFeas = otherVarible.curWindowInsureFeas;
            var fid = root.parent().data('id');
            var bdid = root.parent().parent().parent().data('bdid');
            var coding = root.parent().parent().parent().parent().parent().data('code');
            var area = 0;

            otherVarible.curWindowInsureFeas = curInsFeas.filter(function(fea) {
                if (fea.fields.FID == fid) insure_Featurelayer.removeFeature(fea);
                return (fea.fields.FID != fid);
            });
            this.items.forEach(function(item) {
                if (item.policy.CODING == coding) {
                    var bdArr = item.bd;
                    bdArr.forEach(function(bd) {
                        if (bd.bdxq.ID == bdid) {
                            bd.land = bd.land.filter(function(land) {
                                if (land.FID == fid) area = parseFloat(land.SHPAREA) / 666.67;
                                return land.FID != fid;
                            });
                        }
                    });
                }
            });
            this.updateOrder(root.parent(), this.cacheObj.landNumClass);
            root.parent().remove();
            this.updateArea(area, bdid, coding, 'MINUS');
            var params = {
                'Fields': 'FID',
                'Data': [fid]
            };
            toolUtil.recordDelete(config.dbName, 'landRel', params);
        },

        //定位到地块
        locationToPt: function(x, y) {
            var self = this;
            gmap.zoomTo(parseFloat(x), parseFloat(y), { zl: 1 });
        },

        Completed_pl: function(d) {
            d[0].highLight(hightLightLayer, { isTwinkle: true, twinkleCount: 3, twinkleInterval: 800 }, { isFill: false });
        },

        //编辑地块
        editLand: function(x, y) {

        },

        policyDetailBindData: function(data) {
            $('.win-secuID').val(data.CODING);
            $('.win-policyholder').val(data.POLICYHOLDER);
            $('.win-cardClass').val(data.LICENSECLASS);
            $('.win-cardID').val(data.LICENSENUM);
            $('.win-benefitPerson').val(data.RECEIPTOR);
            $('.win-phoneNum').val(data.PHONE);
            $('.win-address').val(data.ADDRESS);
            $('.win-securityClass').val(data.SECURENAME);
            $('#win-startTime').val(data.START.substring(0, 4) + '-' + data.START.substring(4, 6) + '-' + data.START.substring(6));
            $('#win-endTime').val(data.END.substring(0, 4) + '-' + data.END.substring(4, 6) + '-' + data.END.substring(6));
        },

        landDetailBindData: function(data) {
            $('.win2-secuID').val(data.CODING);
            $('.win2-bdmc').val(data.BDNAME);
            $('.win2-pzmc').val(data.PZNAME);
            $('.win2-province').val(data.PROVINCE);
            $('.win2-city').val(data.CITY);
            $('.win2-county').val(data.COUNTY);
            $('.win2-yb').val(data.POSTCODE);
            $('.win2-address').val(data.ADDRESS);
            this.landDetailBindAddr(data.COUNTY, data.TOWN, data.VILLAGE);
        },

        landDetailBindAddr: function(county, town, village) {
            fillTowns4bd(county, 'bd-detail-town-sel', false, town);
            fillVillage4bd(town, 'bd-detail-village-sel', village);
        },

        _calCenterPoint: function(xmin, xmax, ymin, ymax) {
            return {
                x: (parseFloat(xmin) + parseFloat(xmax)) / 2,
                y: (parseFloat(ymin) + parseFloat(ymax)) / 2
            };
        }
    };

    window.createSecurityList = createSecurityList;
})(jQuery);
