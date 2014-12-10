/**
 * Created by fabrizio on 10/4/14.
 */
define(['jquery', 'databaseSaver/monthlySaving/model/SavingModel', 'databaseSaver/observer/SavingObserver', 'urlConfigurator',
    'utilities/SupportUtility'], function ($, SavingModel, SavingObserver, ServicesURL, SupportUtility) {

    var balanceSheet, modelSaving, observerSaving, actualFilter, realPreviousYearDate, servicesURL, urlSavingPreviousYear, urlSavingActualYear, supportUtility;

    function SavingController() {
        supportUtility = new SupportUtility
        servicesURL = new ServicesURL;
        servicesURL.init()
        urlSavingActualYear = servicesURL.getSavingDataUrlWithoutDate();
        urlSavingPreviousYear = servicesURL.getSavingDataUrlWithDate();
    }

    SavingController.prototype.init = function (BalanceSheet, filterActual, previousDate, dataFiltered) {
        supportUtility.init(dataFiltered)
        realPreviousYearDate = previousDate
        balanceSheet = BalanceSheet;
        modelSaving = new SavingModel;
        observerSaving = new SavingObserver;
        actualFilter = filterActual;
        modelSaving.init()
        observerSaving.init(this)
    }

    SavingController.prototype.onSavingData = function () {

        var allDataOriginal = balanceSheet.getData()
        var tableDataOriginal = balanceSheet.getTableData()
        var newDataOriginal = balanceSheet.getDataToSave()
        console.log('DATA TO SAVE~~')
        console.log(newDataOriginal)
        debugger;
        var allData = $.extend(true, [], allDataOriginal);
        var tableData = $.extend(true, [], tableDataOriginal);
        var newdata = $.extend(true, [], newDataOriginal);

        modelSaving.init(supportUtility)
        modelSaving.prepareData(allData, tableData, newdata, actualFilter, realPreviousYearDate);

        var payloadActual = modelSaving.preparePutPayload(true)
        var payloadPrevious = modelSaving.preparePutPayload(false)

        this.finalSave(payloadActual, true)
        this.finalSave(payloadPrevious, false)

        // clean updated Data
    }


    SavingController.prototype.finalSave = function (payload, isActualYear) {

        var urlSaving = (isActualYear) ? urlSavingActualYear : urlSavingPreviousYear
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
