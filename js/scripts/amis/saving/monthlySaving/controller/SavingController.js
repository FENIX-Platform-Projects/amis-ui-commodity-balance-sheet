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

        var allData = $.extend(true, [], allDataOriginal);
        var tableData = $.extend(true, [], tableDataOriginal);
        var newdata = $.extend(true, [], newDataOriginal);

        modelSaving.init(supportUtility)
        modelSaving.prepareData(allData, tableData, newdata, actualFilter, realPreviousYearDate);

        var payloadActual = modelSaving.preparePutPayload(true)
        var payloadPrevious = modelSaving.preparePutPayload(false)

        this.finalSave(payloadActual, true)
        this.finalSave(payloadPrevious, false)

        var data = balanceSheet.getDataToSave();
        data.updatedData.length = 0
        data.newData.length = 0;

        if (document.getElementById('alertNewValues')!= null && document.getElementById('alertNewValues').childNodes.length != 0 && document.getElementById('alertChangeGrid').childNodes.length == 0) {
            var f = document.getElementById('alertNewValues');
            if(f){
                f.remove()
                var alert1 = '<div class="alert alert-info alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                    '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>Attention!</strong> To apply the changes of your selection, <strong>click on load data</strong></div>';
                $('#alertChangeGrid').append(alert1);
            }
        }





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
