define(['jquery', 'databaseSaver/monthlySaving/model/SavingModel',
    'databaseSaver/observer/SavingObserver',
    'text!databaseSaver/monthlySaving/template/template_css.html',
    'urlConfigurator',
    'utilities/SupportUtility'], function ($, SavingModel, SavingObserver, Template, ServicesURL, SupportUtility) {

    var balanceSheet, modelSaving, observerSaving, actualFilter, realPreviousYearDate, servicesURL, urlSaving, urlSavingActualYear, supportUtility;

    function SavingController() {
        supportUtility = new SupportUtility
        servicesURL = new ServicesURL;
        servicesURL.init()
        urlSaving = servicesURL.getSavingAnnualData()

/*
        urlSavingPreviousYear = servicesURL.getSavingDataUrlWithDate();
*/
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
        var newDataOriginal = balanceSheet.getDataToSave();

        var allData = $.extend(true, [], allDataOriginal);
        var tableData = $.extend(true, [], tableDataOriginal);
        var newdata = $.extend(true, [], newDataOriginal);

        var elementsCalculated = balanceSheet.getCalculatedElements(tableData);
        var dataClear = modelSaving.mergeInputDataWithCalculatedElements(elementsCalculated, allData);

        modelSaving.init(supportUtility)
        modelSaving.prepareData(dataClear, tableData, newdata, actualFilter, realPreviousYearDate);

        var payloadActual = modelSaving.preparePutPayload(true);

        var payloadPrevious = modelSaving.preparePutPayload(false);


        var payload = this.createDatesMap(payloadActual, payloadPrevious);
       /* debugger;

        this.finalSave(payloadActual, true)
        this.finalSave(payloadPrevious, false)*/

        this.finalSave(payload)

        var data = balanceSheet.getDataToSave();
        data.updatedData.length = 0
        data.newData.length = 0;

        if (document.getElementById('alertNewValues') != null && document.getElementById('alertNewValues').childNodes.length != 0 && document.getElementById('alertChangeGrid').childNodes.length == 0) {
            var f = document.getElementById('alertNewValues');
            if (f) {
                f.remove()
                var alert1 = '<div class="alert alert-info alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                    '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>Attention!</strong> To apply the changes of your selection, <strong>click on load data</strong></div>';
                $('#alertChangeGrid').append(alert1);
            }
        }

    }


    SavingController.prototype.finalSave = function (payload) {

        ($('#loading-saving-data').length === 0) ? $('.bootstrap-dialog-body').append(Template) : null;

        debugger;
        $.ajax({
            async: false,
            url: urlSaving,
            type: 'PUT',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(payload)
        }).done(function (result) {
            alert('saved')
        });

    }

    SavingController.prototype.createDatesMap = function( actualPayload, previousPayload) {

        var datesMap = {};
        var season = actualPayload.filter.season;
        var year = actualPayload.filter.year;

        for(var i= 0, l= actualPayload.data.length; i<l; i++) {
            // if date exists and is different from null
            if(actualPayload.data[i][2] && actualPayload.data[i][2] != null) {
                // if exists
                if(datesMap[actualPayload.data[i][2]] && datesMap[actualPayload.data[i][2]].data){
                    datesMap[actualPayload.data[i][2]].data.push(actualPayload.data[i]);

                }else
                {
                    datesMap[actualPayload.data[i][2]] = {
                        "season" : season,
                        "year": year,
                        "date": actualPayload.data[i][2],
                        "data" : [actualPayload.data[i]]
                    };

                }
            }
        }

        // add previous year

        datesMap['PREV -'+previousPayload.filter.date] = {
            "season" : previousPayload.filter.season,
            "year" : previousPayload.filter.year,
            "date": previousPayload.filter.date,
            "data" : previousPayload.data
        }

        // create the commone filter:
        var resultPayload = {
            "product": actualPayload.filter.product,
            "region" : actualPayload.filter.region,
            "datasource" : actualPayload.filter.datasource,
            "filters" : []
        };

        for(var prop in datesMap) {
            resultPayload.filters.push(datesMap[prop]);
        }
        return resultPayload;

    }

    return SavingController;

})
