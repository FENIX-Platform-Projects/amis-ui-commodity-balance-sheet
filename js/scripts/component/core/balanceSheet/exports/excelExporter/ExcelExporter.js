define(['jquery', "urlConfigurator", "FenixReports"],
    function ($, URLConfigurator, FenixExport) {

        var handlerSelection, supportUtility, formExcel,results, urlConfigurator, commodityCodeSelected, fenixExporter, url;

        function ExcelExporter() {
            urlConfigurator = new URLConfigurator;
            fenixExporter = new FenixExport;

        }

        ExcelExporter.prototype.init = function (SupportUtility) {

            results = this.getWdsRequest(SupportUtility.getPreloadingData().post.regionCode);
            supportUtility = SupportUtility;
            url = urlConfigurator.getExportingUrl()

            var totalValues;

            var preloadingData = supportUtility.getPreloadingData();

            var filterData = supportUtility.getFilterData();

            var season = filterData.season
            var region = filterData.country;
            var product = filterData.product;
            var dataSource = filterData.dataSource


            var dataRegionCodes = []
            for(var i =0; i<5; i++){
                dataRegionCodes.push(parseInt(preloadingData.post.regionCode))
            }


            $.ajax({
                async: false,
                url: urlConfigurator.getExportDataServiceUrl(),
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify({"regionCode": dataRegionCodes})

            }).done(function (result) {
                totalValues = result;
            })


            this.createFormAndExport(totalValues, season, region, product, dataSource)
        }


        ExcelExporter.prototype.createFormAndExport = function (totalValues, season, region, product, dataSource) {

            var payload = {};

            payload = {
                "resource": {
                    "data": totalValues,
                    "metadata": {}
                },
                "input": {
                    "plugin": "inputAmisCBS"
                },
                "output": {
                    "plugin":"outputAmisCBS",
                    "config": {
                        "fileName": "amisExport.xls",
                        "filterData": {
                            "season": season,
                            "region": region,
                            "product": product,
                            "datasource": dataSource
                        },
                        "marketingYear": results
                    }

                }
            }

            fenixExporter.exportData(payload,url, results);
        }



        ExcelExporter.prototype.getWdsRequest = function( season) {


            var result;
            var URL = "http://statistics.amis-outlook.org/wds/rest/table/json";
            var FIRSTQUERY = "select tablename from customdataset where code ='AMIS_MARKET_TRADE_YEAR'";
            var DS = "FENIX";

            var obj = {};
            obj.query = FIRSTQUERY;

            var data = {};
            data.datasource = DS;
            data.json = JSON.stringify(obj);
            $.ajax({
                async: false,
                type: 'POST',
                url: URL,
                data: data,
                success: function (response) {
                    obj.query =
                        "select "+
                        "product_code, "+
                        "COALESCE(national_marketing_year,'-1'), "+
                        "COALESCE(nmy_starting_year,'-1'), "+
                        "COALESCE(nmy_finishing_year,'-1'), "+
                        "COALESCE(international_trade_year,'-1'), "+
                        "COALESCE(ity_starting_year,'-1'), "+
                        "COALESCE(ity_finishing_year,'-1'), "+
                        "COALESCE(beginning_of_harvest,'-1'), "+
                        "COALESCE(beginning_of_harvest_starting_year,'-1'), "+
                        "COALESCE(end_of_harvest,'-1'), "+
                        "COALESCE(end_of_harvest_starting_year,'-1') "+
                        " from " +  response[0] + " where region_code='"+season+"' and database='NATIONAL' order by product_code";
                    data.json = JSON.stringify(obj);
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: URL,
                        data: data,
                        success: function (finalResponse) {
                            result= finalResponse;
                        },
                        error: function (err, b, c) {
                        }
                    });
                }
            });

            return result;
        }


        return ExcelExporter;
    })