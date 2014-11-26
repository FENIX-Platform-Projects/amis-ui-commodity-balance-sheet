/**
 * Created by brizi_000 on 20/11/2014.
 */
define(['jquery','annualLoader/controller/HandlerAnnualSelection', 'amplify'], function($){


    function ObserverAnnualSelection(){}

    ObserverAnnualSelection.prototype.init = function(){

       amplify.subscribe('annual-added', function(data){
            alert(dat);
        });
    }

    return ObserverAnnualSelection;
})