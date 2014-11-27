define(['jquery', 'savingAnnual/model/SavingAnnualModel', 'generalSaving/observer/SavingObserver', 'urlConfigurator',
        'utilities/SupportUtility'],
    function ($, SavingModel, SavingObserver, ServicesURL, SupportUtility) {

        var handlerAnnual
        var balanceSheet, modelSaving, observerSaving, actualFilter, realPreviousYearDate, servicesURL, urlSaving, supportUtility;

        function SavingAnnualController() {
            console.log('saving Annual Controller')
            console.log('initSavingController')
            supportUtility = new SupportUtility
            servicesURL = new ServicesURL;
            servicesURL.init()
            urlSaving = servicesURL.getSavingDataUrl()
        }

        SavingAnnualController.prototype.init = function (BalanceSheet, filterActual, previousDate, dataFiltered, Handler) {

            handlerAnnual = Handler

            supportUtility.init(dataFiltered)
            realPreviousYearDate = previousDate
            balanceSheet = BalanceSheet;
            modelSaving = new SavingModel;
            observerSaving = new SavingObserver;
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

            modelSaving.prepareData(allData, tableData, newdata, actualFilter, realPreviousYearDate, handlerAnnual);

            var payloadActual = modelSaving.preparePutPayload(true)
            var payloadPrevious = modelSaving.preparePutPayload(false)

            this.finalSave(payloadActual)
            this.finalSave(payloadPrevious)

            // clean updated Data
        }

        return SavingAnnualController;

    })
