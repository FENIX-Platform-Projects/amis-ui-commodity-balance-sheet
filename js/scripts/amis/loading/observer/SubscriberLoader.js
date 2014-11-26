define(['jquery', 'amplify'], function($){

    var loadingController

    function SubscriberLoader(){}

    SubscriberLoader.prototype.subscribeOnChangingLoadingModality = function(LoadingController){

        loadingController = LoadingController;

        amplify.subscribe('changeOnAnnualModality', function(preloadingData){
            console.log('annual!!!!')
            loadingController.init(preloadingData.preloadingData,false);
        })

        amplify.subscribe('changeOnMonthlyModality', function(preloadingData){
            console.log('monthly!!!!')
            loadingController.init(preloadingData.preloadingData,true);
        })

    }

    return SubscriberLoader;
})