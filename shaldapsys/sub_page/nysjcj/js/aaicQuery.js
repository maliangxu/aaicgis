/*
 * aaicQuery.js v1.0 | JavaScript 
 *
 * :: 2016-04-22 20:00
 */

;
(function(name, context, factory) {

    // Supports CMD. AMD, CommonJS/Node.js and browser context
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        context[name] = factory();
    }

})("aaicQuery", this, function() {

    var QueryConfig = {
        dbname: 'ecnugis',
        PlTbname: 'policy',
        BdTbname: 'biaodi',
        LandTbname: 'landtype',
        landRelTbname: 'landRel',
        ftset_id: 198,
        Plfields: ['usrid', 'coding', 'policyholder', 'licenseclass', 'licensenum', 'receiptor', 'phone', 'address', 'securename', 'start', 'end'],
        Bdfields: ['id', 'coding', 'bdname', 'pzname', 'province', 'city', 'county', 'town', 'village', 'postcode', 'address', 'x', 'y'],
        Landfields: ['FID', 'XMIN', 'XMAX', 'YMIN', 'YMAX', 'SHPAREA', 'LANDTYPE_CN', 'CODING', 'BDID'],
        shpfields: ['FID', 'shpType', 'xmin', 'ymin', 'xmax', 'ymax', 'shpLen', 'shpArea', 'shpData']
    };

    var Util = {
        merge: function() {
            var merged = {};
            var argsLen = arguments.length;
            for (var i = 0; i < argsLen; i++) {
                var obj = arguments[i]
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
            QueryByGeometry: function(geometry, callback) {
                var ftQuery = new gEcnu.WebFeatureServices.QueryByGeometry({
                    'processCompleted': function(resultFea) {
                        if (resultFea.length > 0) {
                            var fid = resultFea[0]['FID'];
                            var database = new Database(QueryConfig);
                            database.QueryCodingByFID([fid], function(codArr) {
                                if(codArr.length > 0) {
                                    database.QueryByCoding(codArr[0], callback);
                                } else{
                                    callback([]);
                                }
                            });
                        } else {
                            callback([]);
                        }
                    },
                    'processFailed': function() {}
                });
                /*var options = {shape: geometry, queryLyrType: gEcnu.layerType.GeoDB, mapOrGeodb: this.dbname, lyrOrFtset: this.ftset_id, returnFields: 'BDID'};
                ftQuery.processAscyn(options);*/
                ftQuery.processAscyn(geometry, gEcnu.layerType.GeoDB, this.dbname, this.ftset_id, 1000, false, '');
            }
        }

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
            fuzzyQuery: function(content, callback) {
                var self = this;
                var pTable = this.PlTbname;
                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
                    'processCompleted': function(rst) {
                        var codArr = [];
                        if (rst.length > 0) {
                            codArr = fetchKey(rst, 'CODING');
                            self.QueryBdByCoding(codArr, function(bd_rst) {
                                var bdArr = [];
                                if (bd_rst.length > 0) {
                                    bdArr = fetchKey(bd_rst, 'ID');
                                    self.QueryLandByBdid(bdArr, function(ld_rst) {
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
                    'processFailed': function(msg) { console.log(msg); }
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
            reStructResult: function(plArr, bdArr, landArr, callback) {
                var json = [];
                var existCoding = {};
                var existBdid = {};
                for (var i = 0, len = plArr.length; i < len; i++) {
                    json[i] = { policy: plArr[i], bd: [] };
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
                        json[k]['bd'] = [{ bdxq: target, land: [] }];
                        existCoding[coding] = true;
                    } else {
                        json[k]['bd'].push({ bdxq: target, land: [] });
                    }
                };
                for (var i = 0, len = landArr.length; i < len; i++) {
                    var land = landArr[i];
                    var bdid = land['BDID'];
                    if (!existBdid[bdid]) {
                        var flag = false;
                        for (var k = 0, length = json.length; k < length; k++) {
                            var targetArr = json[k]['bd']
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
                        json[k]['bd'][m]['land'] = [land];
                        existBdid[bdid] = true;
                    } else {
                        json[k]['bd'][m]['land'].push(land);
                    }
                };
                callback(json);
            },
            QueryByCoding: function(coding, callback) {
                var self = this;
                var pTable = this.PlTbname;
                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
                    'processCompleted': function(rst) {
                        if (rst.length > 0) {
                            self.QueryBdByCoding([coding], function(bd_rst) {
                                var bdArr = [];
                                if (bd_rst.length > 0) {
                                    bdArr = fetchKey(bd_rst, 'ID');
                                    self.QueryLandByBdid(bdArr, function(ld_rst) {
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
                    'processFailed': function(msg) { alert(msg); }
                });
                var sWhere = pTable + '.coding=' + coding + ' ORDER BY coding';
                var qrysql = { 'fields': "*", "lyr": pTable, 'filter': sWhere };
                sqlservice.processAscyn('SQLQUERY', this.dbname, qrysql);
            },
            QueryBdByCoding: function(codArr, callback) {
                var bdTbname = this.BdTbname;
                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
                    'processCompleted': function(msg) {
                        callback(msg);
                    },
                    'processFailed': function(msg) { alert(msg); }
                });
                var sWhere = "coding in (" + codArr.join(',') + ") ORDER BY coding";
                var qrysql = { 'fields': '*', "lyr": bdTbname, 'filter': sWhere };
                sqlservice.processAscyn('SQLQUERY', this.dbname, qrysql);
            },
            QueryLandByBdid: function(bdArr, callback) {
                var relTable = this.relTable;
                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
                    'processCompleted': function(msg) {
                        callback(msg);
                    },
                    'processFailed': function(msg) { alert(msg); }
                });
                var fields = this.Landfields.join(',');
                var sWhere = "bdid in (" + bdArr.join(',') + ") ORDER BY id";
                var qrysql = { 'fields': fields, "lyr": relTable, 'filter': sWhere };
                sqlservice.processAscyn('SQLQUERY', this.dbname, qrysql);
            },
            QueryCodingByFID: function(fidArr, callback) {
                var relTable = this.relTable;
                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
                    'processCompleted': function(msg) {
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
                    'processFailed': function(msg) { alert(msg); }
                });
                var sWhere = "fid in (" + fidArr.join(',') + ") ORDER BY coding";
                var qrysql = { 'fields': 'CODING', "lyr": relTable, 'filter': sWhere };
                sqlservice.processAscyn('SQLQUERY', this.dbname, qrysql);
            },
            deleteBdById: function(bdid, callback) {
                var bdTbname = this.BdTbname;
                var relTable = this.relTable;
                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
                    'processCompleted': function(msg) {
                        callback();
                    },
                    'processFailed': function() {}
                });
                var tasks = [
                    {   "mt":"SQLDelete",
                        "tablename":bdTbname,
                        "KeyFld":'id',
                        "key":[bdid]
                    },
                    {
                        "mt":"SQLDelete",
                        "tablename":relTable,
                        "KeyFld":'bdid',
                        "key":[bdid]
                    }
                ];
                sqlservice.processAscyn('SQLTask', this.dbname, tasks);
            },
            deletePolicyByCoding: function(coding, callback){
                var tmpTbArr = [this.PlTbname, this.BdTbname, this.relTable];
                var sqlservice = new gEcnu.WebSQLServices.SQLServices({
                    'processCompleted': function(msg) {
                        callback();
                    },
                    'processFailed': function() {}
                });
                var tasks = [];
                for (var i = 0, len = tmpTbArr.length; i < len; i++) {
                    tasks[i] = {
                        "mt":"SQLDelete",
                        "tablename":tmpTbArr[i],
                        "KeyFld":'coding',
                        "key":[coding]
                    }
                };
                sqlservice.processAscyn('SQLTask', this.dbname, tasks);
            },
        }

        return Database;

    })();


    // core
    var queryFactory = {
        createWebFeature: function(config) {
            return new WebFeature(config);
        },
        createConnect: function(config) {
            return new Database(config);
        }
    };

    return queryFactory;


});
