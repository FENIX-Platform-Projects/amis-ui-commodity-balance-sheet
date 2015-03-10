define(['jquery', 'amplify'], function ($) {

    var loadingController

    function SubscriberLoader() {
    }

    SubscriberLoader.prototype.subscribeOnChangingLoadingModality = function (LoadingController) {

        loadingController = LoadingController;

        amplify.subscribe('changeOnAnnualModality', function (preloadingData) {
            loadingController.init(preloadingData.preloadingData, false);
            return false
        })

        amplify.subscribe('changeOnMonthlyModality', function (preloadingData) {
            loadingController.init(preloadingData.preloadingData, true);
            return false
        })

    }

    return SubscriberLoader;
})