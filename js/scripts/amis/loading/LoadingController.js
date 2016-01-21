define(["jquery", "balanceSheet/BalanceSheet", "loading/proxyFactory/SelectionFactory",
        "databaseSaver/proxyFactory/SavingFactory",
        "subscriberLoader", "nprogress", "amplify"],
    function ($, BalanceSheet, SelectionFactory, SavingFactory, SubscriberLoader, Nprogress) {

        var urlDSD = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructure.json'
        var urlDSDRice = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructureRice.json'
        var ulrDSDSoyBean = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructureSoybeans.json'
        var balanceSheet, dataFiltered, handlerSelection, selectionFactory , firstIstance,
            product, savingController, savingFactory, NProgress, subscriberLoader, isMonthlyLoading;

        function LoadingController() {
            NProgress = Nprogress

            balanceSheet = new BalanceSheet
            selectionFactory = new SelectionFactory
            firstIstance = false;
            savingFactory = new SavingFactory;
            subscriberLoader = new SubscriberLoader;
        }

        LoadingController.prototype.init = function (preloadingData, isMonthlySelection) {

            subscriberLoader.subscribeOnChangingLoadingModality(this)
            NProgress.start()

            // prepare all filters to make queries
            var region = parseInt(preloadingData.post.regionCode);
            product = parseInt(preloadingData.post.productCode);
            var isExport = true;
            dataFiltered = preloadingData;
            isMonthlyLoading = isMonthlySelection

            // Inside of selectionFactory module stored the global value on session storage variable
            handlerSelection = selectionFactory.init(isMonthlyLoading);
            var totalForecast = handlerSelection.init(dataFiltered, region, product, isExport);

            debugger;
            if(totalForecast && totalForecast.length >0) {
                this.createBalanceSheet(totalForecast, handlerSelection)
            }else{
                NProgress.done();
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

            savingController = savingFactory.getSavingController();

            if (isMonthlyLoading) {
                var realPreviousYear = Selector.getRealPreviousYear()
                var filterActual = Selector.getPreloadingData();
                savingController.init(balanceSheet, filterActual, realPreviousYear, dataFiltered)
            } else {
                var filterActual = Selector.getPreloadingData();
                savingController.init(balanceSheet, filterActual, dataFiltered, handlerSelection)
            }

        };

        LoadingController.prototype.getFilterData = function () {
            return dataFiltered;
        }

        LoadingController.prototype.checkIfNewValues = function () {
            if (balanceSheet) {
                var data = balanceSheet.getDataToSave()
                return (data.updatedData.length > 0 || data.newData.length > 0)
            } else {
                return false;
            }
        }

        return LoadingController;
    });