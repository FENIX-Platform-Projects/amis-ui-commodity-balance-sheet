/**
 * Created by fabrizio on 10/4/14.
 */
define(['jquery','databaseSaver/model/SavingModel', 'databaseSaver/observer/SavingObserver', 'urlConfigurator'],
    function($, SavingModel, SavingObserver, ServicesURL){

    var balanceSheet, modelSaving, observerSaving, actualFilter, realPreviousYearDate, servicesURL, urlSaving;

    function SavingController(){
        servicesURL = new ServicesURL;
        servicesURL.init()
        urlSaving = servicesURL.getSavingDataUrl()
    }

    SavingController.prototype.init= function(BalanceSheet, filterActual, previousDate){
        realPreviousYearDate = previousDate
        balanceSheet = BalanceSheet;
        modelSaving = new SavingModel;
        observerSaving = new SavingObserver;
        actualFilter = filterActual;
        modelSaving.init()
        observerSaving.init(this)
    }

    SavingController.prototype.onSavingData = function(){

        var allDataOriginal = balanceSheet.getData()
        var tableDataOriginal = balanceSheet.getTableData()
        var newDataOriginal = balanceSheet.getDataToSave()
        var allData =  $.extend(true, [],allDataOriginal);
        var tableData =  $.extend(true, [],tableDataOriginal);
        var newdata =  $.extend(true, [],newDataOriginal);

        modelSaving.prepareData(allData,tableData,newdata, actualFilter,realPreviousYearDate);

        var payload = modelSaving.preparePutPayload()
        debugger;
    }


    SavingController.prototype.finalSave = function(payload){
        $.ajax({
            async: false,
            url: urlSaving,
            type: 'PUT',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(payload)

        }).done(function (result) {
            alert('saved')
        })
    }

    return SavingController;

})
