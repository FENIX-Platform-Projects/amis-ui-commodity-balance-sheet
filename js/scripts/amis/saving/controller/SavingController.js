/**
 * Created by fabrizio on 10/4/14.
 */
define(['jquery','databaseSaver/model/SavingModel', 'databaseSaver/observer/SavingObserver', 'urlConfigurator',
        'utilities/SupportUtility'],
    function($, SavingModel, SavingObserver, ServicesURL, SupportUtility){

    var balanceSheet, modelSaving, observerSaving, actualFilter, realPreviousYearDate, servicesURL, urlSaving, supportUtility;

    function SavingController(){
        supportUtility = new SupportUtility
        servicesURL = new ServicesURL;
        servicesURL.init()
        urlSaving = servicesURL.getSavingDataUrl()
    }

    SavingController.prototype.init= function(BalanceSheet, filterActual, previousDate, dataFiltered){
        supportUtility.init(dataFiltered)
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

        modelSaving.init(supportUtility)
        modelSaving.prepareData(allData,tableData,newdata, actualFilter,realPreviousYearDate);

        var payloadActual = modelSaving.preparePutPayload(true)
        var payloadPrevious = modelSaving.preparePutPayload(true)
        debugger;

        console.log('+++++++++++++++++++++++++++++++++++++++++++++++')
        console.log('payloadPrevious')
        console.log(payloadPrevious)
        console.log('PayloadActual')
        console.log(payloadActual)
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++')

        this.finalSave(payloadActual)
        this.finalSave(payloadPrevious)

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
