define(['jquery', "monthlyLoader/controller/HandlerSelection", "text!exporter/form/_formExcel"], function($, HandlerSelection, FormEXCEL) {


    var handlerSelection, supportUtility, formExcel;
    var COMMODITY_CODES = [1, 4, 5, 6]

    function ExcelExporter() {
        handlerSelection = new HandlerSelection;
        formExcel = FormEXCEL;
        $("#exportExcelTrue").append(formExcel);

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
       // console.log(JSON.stringify(totalValues))
        debugger;
        var filterData = supportUtility.getFilterData();
        console.log('=====================  FILTER DATA ==========================')
        console.log(filterData)

        var season  =filterData.season
        var region  =filterData.country;
        var product = filterData.product;
        var dataSource  =filterData.dataSource

        console.log('TOTLA VALUES');
        console.log(totalValues);
        this.createFormAndExport(totalValues,season, region, product, dataSource)

    }


    ExcelExporter.prototype.createForecastForCommodity = function (commodity, dataFiltered){

      var forecast;
      var copyDataFiltered = $.extend(true,{}, dataFiltered)
      copyDataFiltered.post.productCode = commodity;
      var isExport = false;
      var productCode =copyDataFiltered.post.productCode;
      var regionCode= copyDataFiltered.post.regionCode;
      forecast = handlerSelection.init(copyDataFiltered, regionCode, productCode, isExport);

        for(var i = 0, length = forecast.length; i<length;i++){
            forecast[i].unshift(commodity);
        }



      return forecast;
    }


    ExcelExporter.prototype.createFormAndExport = function(totalValues,season, region, product, dataSource){

        var stringToappend = '  <input id="regionIDForm" type="text" name="region" value="'+region+'"/>'+
            '<input id="datasourceIDForm" type="text" name="datasource" value="'+dataSource+'"/>'+
            '<input id="seasonIDForm" type="text" name="season" value="'+season+'"/>'+
            '<input id="productIDForm" type="text" name="product" value="'+product+'"/>'


        for(var i = 0, length = totalValues.length;i<length; i++){
            stringToappend += '<input type="text" name="data" value="' + totalValues[i] + '"/>';
        }
        $("#formAction").append(stringToappend);

        document.getElementById('submitButton').click(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
        });

        var f= document.getElementById('formExcel')
        f.remove();


    }


    return ExcelExporter;
})