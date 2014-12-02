define(['jquery', "exportLoader/controller/HandlerExportSelection", "text!exporter/form/_formExcel.html", "urlConfigurator"],
    function($, HandlerSelection, FormEXCEL, URLConfigurator) {


    var handlerSelection, supportUtility, formExcel, urlConfigurator;
    var COMMODITY_CODES = [1, 4, 5, 6]

    function ExcelExporter() {
        urlConfigurator = new URLConfigurator;
        handlerSelection = new HandlerSelection;
        formExcel = FormEXCEL;
        $("#exportExcelTrue").append(formExcel);

    }

    ExcelExporter.prototype.init = function (SupportUtility) {
        supportUtility = SupportUtility;
        var url = urlConfigurator.getExportingUrl()
        document.getElementById('formAction').setAttribute('action',url)

        var totalValues = [];
        var preloadingData = supportUtility.getPreloadingData();

        for (var i = 0; i < COMMODITY_CODES.length; i++) {
            var commodity = COMMODITY_CODES[i];
            var forecastCommodity = this.createForecastForCommodity(commodity, preloadingData);
            totalValues = totalValues.concat(forecastCommodity);

        }

        var filterData = supportUtility.getFilterData();

        var season  =filterData.season
        var region  =filterData.country;
        var product = filterData.product;
        var dataSource  =filterData.dataSource

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

        var stringToappend = '<input id="regionIDForm" type="text" name="region" value="'+region+'"/>'+
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