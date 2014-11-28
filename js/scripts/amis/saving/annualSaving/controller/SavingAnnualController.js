define(['jquery', 'databaseSaver/annualSaving/model/SavingAnnualModel', 'databaseSaver/observer/SavingObserver', 'urlConfigurator',
        'utilities/SupportUtility'],
    function ($, SavingModel, SavingObserver, ServicesURL, SupportUtility) {

        var handlerAnnual
        var balanceSheet, modelSaving, observerSaving, actualFilter, realPreviousYearDate, servicesURL, urlSaving, supportUtility;

        function SavingAnnualController() {
            console.log('saving Annual Controller')
            console.log('initSavingController')
            modelSaving = new SavingModel;
            observerSaving = new SavingObserver;
            supportUtility = new SupportUtility
            servicesURL = new ServicesURL;
            servicesURL.init()
            urlSaving = servicesURL.getSavingDataUrlWithDate()
        }

        SavingAnnualController.prototype.init = function (BalanceSheet, filterActual, dataFiltered, Handler) {


            handlerAnnual = Handler

            supportUtility.init(dataFiltered)
            balanceSheet = BalanceSheet;

            actualFilter = filterActual;
            modelSaving.init()
            observerSaving.init(this)

        }

        SavingAnnualController.prototype.onSavingData = function () {

            var allDataOriginal = balanceSheet.getData()
            var tableDataOriginal = balanceSheet.getTableData()
            var newDataOriginal = balanceSheet.getDataToSave()
            var allData = $.extend(true, [], allDataOriginal);
            var tableData = $.extend(true, [], tableDataOriginal);
            var newdata = $.extend(true, [], newDataOriginal);

            // fino a qui!
            modelSaving.init(supportUtility)
            var dataWithPayload = modelSaving.prepareData(allData, tableData, newdata, actualFilter, handlerAnnual);



            debugger;
           // this.finalSave(dataWithPayload)

            // clean updated Data
        }

        SavingAnnualController.prototype.finalSave = function(arrayData){
            for(var i = 0,length = arrayData.length; i<length; i++){
                $.ajax({
                    async: false,
                    url: urlSaving,
                    type: 'PUT',
                    contentType: "application/json",
                    dataType: 'json',
                    data: JSON.stringify(arrayData[i])
                }).done(function (result) {
                    alert('saved')
                })
            }
        }

        return SavingAnnualController;

    })