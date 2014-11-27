/**
 * Created by fabrizio on 5/20/14.
 */
define(["jquery", "balanceSheet/BalanceSheet", "monthlyLoader/controller/HandlerSelection",
        "annualLoader/controller/HandlerAnnualSelection",
        "databaseSaver/monthlySaving/controller/SavingController",
        "subscriberLoader","nprogress", "amplify"],
    function ($, BalanceSheet, HandlerMonthlySelection,HandlerAnnualSelection, SavingController,SubscriberLoader, Nprogress) {

        var urlDSD = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructure.json'
        var urlDSDRice = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructureRice.json'
        var ulrDSDSoyBean = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructureSoybeans.json'
        var balanceSheet, dataFiltered, handlerMonthlySelection,handlerAnnualSelection, firstIstance,
            product, savingController, NProgress, subscriberLoader;

        function LoadingController() {
            NProgress = Nprogress

            balanceSheet = new BalanceSheet
            handlerAnnualSelection = new HandlerAnnualSelection;
            handlerMonthlySelection = new HandlerMonthlySelection;
            firstIstance = false;
            savingController = new SavingController;
            subscriberLoader = new SubscriberLoader;
        }

        LoadingController.prototype.init = function (preloadingData, isMonthlySelection) {

            subscriberLoader.subscribeOnChangingLoadingModality(this)
            NProgress.start()

            console.log(preloadingData)

            // prepare all filters to make queries
            var region = parseInt(preloadingData.post.regionCode);
             product = parseInt(preloadingData.post.productCode);
            var isExport = true;
            dataFiltered = preloadingData;

            if(isMonthlySelection){
                var totalForecast= handlerMonthlySelection.init(dataFiltered, region, product, isExport)
                amplify.store('isMonthlyModality',true)
                this.createBalanceSheet(totalForecast, handlerMonthlySelection)

            }else{
                debugger;
                var totalForecast= handlerAnnualSelection.init(dataFiltered, region, product, isExport)
                amplify.store('isMonthlyModality',false)
                this.createBalanceSheet(totalForecast, handlerAnnualSelection)
            }
        }


        LoadingController.prototype.createBalanceSheet = function (totalForecast, Selector) {
            var url;

            // choice of DSD
            switch (product) {

                case 4:
                    url = urlDSDRice;
                    break;

                case 6:
                    url = ulrDSDSoyBean;
                    break;

                default :
                    url = urlDSD;
            }

            if (!firstIstance) {
                firstIstance = true
                // Choice of DSD dependent on the product (if rice has been chosen)
                balanceSheet.init(totalForecast, url, dataFiltered, NProgress)
            } else {
                balanceSheet.init(totalForecast, url, dataFiltered, NProgress)
            }

            var realPreviousYear = Selector.getRealPreviousYear()
            var filterActual = Selector.getPreloadingData();
            savingController.init(balanceSheet, filterActual, realPreviousYear, dataFiltered)
        };


        LoadingController.prototype.getFilterData = function () {
            return dataFiltered;
        }

        LoadingController.prototype.checkIfNewValues = function () {
            if (balanceSheet) {
                console.log('blaanceSheet exists')
                var data = balanceSheet.getDataToSave()
                console.log(data)
                return (data.updatedData.length > 0 || data.newData.length > 0)
            } else {
                return false;
            }
        }

        return LoadingController;
    });