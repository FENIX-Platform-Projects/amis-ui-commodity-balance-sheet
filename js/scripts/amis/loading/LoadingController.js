/**
 * Created by fabrizio on 5/20/14.
 */
define(["jquery", "balanceSheet/BalanceSheet", "monthlyLoader/controller/HandlerSelection", "databaseSaver/controller/SavingController", "nprogress"],
    function ($, BalanceSheet, HandlerMonthlySelection, SavingController, Nprogress) {

        var urlDSD = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructure.json'
        var urlDSDRice = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructureRice.json'
        var ulrDSDSoyBean = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructureSoybeans.json'
        var balanceSheet, dataFiltered, handlerMonthlySelection, firstIstance, savingController, NProgress;

        function LoadingController() {
            NProgress = Nprogress

            balanceSheet = new BalanceSheet
            handlerMonthlySelection = new HandlerMonthlySelection;
            firstIstance = false;
            savingController = new SavingController;
        }

        LoadingController.prototype.init = function (preloadingData) {
            NProgress.start()


            // prepare all filters to make queries
            var region = parseInt(preloadingData.post.regionCode);
            var product = parseInt(preloadingData.post.productCode);
            var isExport = true;
            dataFiltered = preloadingData;

            var totalForecast = handlerMonthlySelection.init(dataFiltered, region, product, isExport)
            this.createBalanceSheet(totalForecast, handlerMonthlySelection)
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