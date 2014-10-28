/**
 * Created by fabrizio on 9/25/14.
 */
define(['jquery'], function($){

    var generalController

    function GeneralObserver(){}


    GeneralObserver.prototype.init = function(GeneralController){
        generalController = GeneralController;
        console.log('observer.init()')

           /* console.log('OBSERVER LISTENer')/*
             event.preventDefault();
             event.stopImmediatePropagation()
             generalController.updateWithNewForecast();*/

       // this.listenToNewForecastButton()

    }

    GeneralObserver.prototype.listenToNewForecastButton = function(){
     $('#')
    }
    return GeneralObserver;
})
