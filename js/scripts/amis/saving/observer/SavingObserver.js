/**
 * Created by fabrizio on 10/4/14.
 */
define(['jquery', "bootstrap-dialog"], function($, BootstrapDialog){

    var savingController, bootstrapDialog

    function SavingObserver(){}

    SavingObserver.prototype.init = function(Controller){
        savingController = Controller;
        bootstrapDialog = BootstrapDialog;
        this.applyListener()
    }


    SavingObserver.prototype.applyListener = function(){

        $('#saveFinalData').on('click', function(event){
            event.preventDefault();
            event.stopImmediatePropagation();
            bootstrapDialog.confirm('Are you sure to save the data ?', function(result){
                if(result) {
                   savingController.onSavingData()
                }
            });

        })
    }

    return SavingObserver;
})
