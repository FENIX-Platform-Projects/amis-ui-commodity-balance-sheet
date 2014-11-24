/**
 * Created by brizi_000 on 20/11/2014.
 */
define(['jquery','annualLoader/controller/HandlerAnnualSelection'], function($){


    function ObserverAnnualSelection(){}

    ObserverAnnualSelection.prototype.registerToEvent = function(){
        $("#annualSelection").on('click', function(e){
            e.preventDefault();
            e.stopImmediatePropagation();

        })
    }
})