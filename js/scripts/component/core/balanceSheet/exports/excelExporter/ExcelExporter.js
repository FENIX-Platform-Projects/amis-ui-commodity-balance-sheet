define(['jquery', "monthlyLoader/controller/HandlerSelection"], function($, HandlerSelection) {


    var handlerSelection, supportUtility
    var COMMODITY_CODES = [1, 4, 5, 6]

    function ExcelExporter() {
        handlerSelection = new HandlerSelection;
    }

    ExcelExporter.prototype.init = function (SupportUtility) {
        supportUtility = SupportUtility;

        var totalValues = [];
        var preloadingData = supportUtility.getPreloadingData();

        for (var i = 0; i < COMMODITY_CODES.length; i++) {
            var commodity = COMMODITY_CODES[i];
            var forecastCommodity = this.createForecastForCommodity(commodity, preloadingData);
            totalValues = totalValues.concat(forecastCommodity);
            console.log('**********************************')
            console.log('Tforecast for comm')
            console.log(forecastCommodity)

        }
        console.log('**********************************')
        console.log('TOTAL VALUES')
        console.log(totalValues)
        console.log(JSON.stringify(totalValues))

    }


    ExcelExporter.prototype.createForecastForCommodity = function (commodity, dataFiltered){

      var forecast;
      var copyDataFiltered = $.extend(true,{}, dataFiltered)
      copyDataFiltered.post.productCode = commodity;
      var isExport = true;
      var productCode =copyDataFiltered.post.productCode;
      var regionCode= copyDataFiltered.post.regionCode;
      forecast = handlerSelection.init(copyDataFiltered, regionCode, productCode, isExport);

        for(var i = 0, length = forecast.length; i<length;i++){
            forecast[i].unshift(commodity);
        }



      return forecast;
    }


    return ExcelExporter;
})