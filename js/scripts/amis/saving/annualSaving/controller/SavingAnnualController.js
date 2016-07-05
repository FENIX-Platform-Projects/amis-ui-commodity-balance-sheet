define(['jquery',
        'databaseSaver/annualSaving/model/SavingAnnualModel',
        'databaseSaver/observer/SavingObserver',
        'text!databaseSaver/monthlySaving/template/template_css.html',
        'urlConfigurator',
        'utilities/SupportUtility'],
    function ($, SavingModel, SavingObserver,Template, ServicesURL, SupportUtility) {

        'use strict';

        var handlerAnnual, balanceSheet, modelSaving, observerSaving, actualFilter, servicesURL, urlSaving, supportUtility;

        function SavingAnnualController() {

            modelSaving = new SavingModel;
            observerSaving = new SavingObserver;
            supportUtility = new SupportUtility;
            servicesURL = new ServicesURL;
            servicesURL.init();
            urlSaving = servicesURL.getSavingAnnualData();
        };

        SavingAnnualController.prototype.init = function (BalanceSheet, filterActual, dataFiltered, Handler) {

            handlerAnnual = Handler;
            supportUtility.init(dataFiltered);
            balanceSheet = BalanceSheet;
            actualFilter = filterActual;
            modelSaving.init();
            observerSaving.init(this);

        }

        SavingAnnualController.prototype.onSavingData = function () {

            var allDataOriginal = balanceSheet.getData();
            var tableDataOriginal = balanceSheet.getTableData();
            var newDataOriginal = balanceSheet.getDataToSave();

            var allData = $.extend(true, [], allDataOriginal);
            var tableData = $.extend(true, [], tableDataOriginal);
            var newdata = $.extend(true, [], newDataOriginal);

            var elementsCalculated = balanceSheet.getCalculatedElements(tableData);
            var dataClear = modelSaving.mergeInputDataWithCalculatedElements(elementsCalculated, allData);

            // fino a qui!
            modelSaving.init(supportUtility)
            var dataWithPayload = modelSaving.prepareData(dataClear, tableData, newdata, actualFilter, handlerAnnual);

            this.finalSave(dataWithPayload);

            var data = balanceSheet.getDataToSave();

            data.updatedData.length = 0;
            data.newData.length = 0;
            if (document.getElementById('alertNewValues') != null && document.getElementById('alertNewValues').childNodes.length != 0 && document.getElementById('alertChangeGrid').childNodes.length == 0) {
                var f = document.getElementById('alertNewValues');
                if (f) {
                    f.remove();
                    var alert1 = '<div class="alert alert-info alert-dismissible" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert">' +
                        '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                        '<strong>Attention!</strong> To apply the changes of your selection, <strong>click on load data</strong></div>';
                    $('#alertChangeGrid').append(alert1);
                }
            }
        }

        SavingAnnualController.prototype.finalSave = function (arrayData) {

            var payload =  this.prepareNewPayload(arrayData);
            ($('#loading-saving-data').length === 0)?  $('.bootstrap-dialog-body').append(Template): null;
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
        };


        SavingAnnualController.prototype.prepareNewPayload = function (arrayData) {
            var result = {};
            for(var i= 0,overallLength = arrayData.length; i<overallLength; i++ ) {
                if(i===0) {
                    result['product'] = arrayData[i].filter.product;
                    result['datasource'] = arrayData[i].filter.datasource;
                    result['region'] = arrayData[i].filter.region;
                    result['filters'] =[];
                }
                result['filters'].push({
                    "season":  arrayData[i].filter.season,
                    "year":  arrayData[i].filter.year,
                    "date": arrayData[i].filter.date,
                    "data":  arrayData[i].data
                });
            }

          return result;
        };


        return SavingAnnualController;
    })
