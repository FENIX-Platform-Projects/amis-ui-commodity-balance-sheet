define(['jquery', "urlConfigurator", "FenixReports"],
    function ($, URLConfigurator, FenixExport) {

        var handlerSelection, supportUtility, formExcel, urlConfigurator, commodityCodeSelected, fenixExporter, url;
        var COMMODITY_CODES = [1, 4, 5, 6]

        function ExcelExporter() {
            urlConfigurator = new URLConfigurator;
       //     handlerSelection = new HandlerSelection;
            fenixExporter = new FenixExport;

        }

        ExcelExporter.prototype.init = function (SupportUtility) {
            supportUtility = SupportUtility;
            url = urlConfigurator.getExportingUrl()

            var totalValues;

            var preloadingData = supportUtility.getPreloadingData();

            /*

            var items = $("#selectionYear").jqxComboBox('getItems');
            var selectedIndex = $("#selectionYear").jqxComboBox('getSelectedIndex');

            commodityCodeSelected = $("#selectionCommodity").jqxComboBox('getSelectedItem').value;

            for (var i = 0; i < COMMODITY_CODES.length; i++) {
                var commodity = COMMODITY_CODES[i];
                var forecastCommodity = this.createForecastForCommodity(commodity, preloadingData, items, selectedIndex);
                totalValues = totalValues.concat(forecastCommodity);

            }
            debugger;

            */

debugger;

            var filterData = supportUtility.getFilterData();

            var season = filterData.season
            var region = filterData.country;
            var product = filterData.product;
            var dataSource = filterData.dataSource

            $.ajax({
                async: false,
                url: urlConfigurator.getExportDataServiceUrl(),
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify({"regionCode": preloadingData.post.regionCode})

            }).done(function (result) {
                totalValues = result;
            })

            console.log(totalValues)

            this.createFormAndExport(totalValues, season, region, product, dataSource)

        }

/*
        ExcelExporter.prototype.createForecastForCommodity = function (commodity, dataFiltered ,items, selectedIndex) {

            var forecast;
            var isDifferentCommodity = false;
            var copyDataFiltered = $.extend(true, {}, dataFiltered)
            if( commodityCodeSelected !=  commodity) {
                copyDataFiltered.post.productCode = commodity;
                isDifferentCommodity = true;
            }

            var isExport = false;

            forecast = handlerSelection.init(copyDataFiltered,  isExport, items, selectedIndex,isDifferentCommodity);

            console.log('commodity: '+commodity + '  , and forecast :')
            console.log(forecast)


            for (var i = 0, length = forecast.length; i < length; i++) {
                forecast[i].unshift(commodity);
            }

            return forecast;
        }

        */


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
                        }
                    }

                }
            }

            fenixExporter.exportData(payload,url);




        }


        return ExcelExporter;
    })