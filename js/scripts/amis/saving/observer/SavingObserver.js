/**
 * Created by fabrizio on 10/4/14.
 */
define(['jquery', "bootstrap-dialog",
    'text!databaseSaver/monthlySaving/template/template_css.html'],
    function ($, BootstrapDialog, Template) {

    var savingController, bootstrapDialog

    function SavingObserver() {
    }

    SavingObserver.prototype.init = function (Controller) {

        savingController = Controller;
        bootstrapDialog = BootstrapDialog;
        this.applyListener()
    }


    SavingObserver.prototype.applyListener = function () {

        $('#saveFinalData').on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            bootstrapDialog.confirm('Are you sure to save the data ?', function (result) {
                if (result) {
                    console.log("first")
                    var bootstrapRegion  = $('.bootstrap-dialog')
                    var buttons  = $('button',bootstrapRegion)
                    console.log(buttons)
                    if(buttons)
                        buttons.prop('disabled', true);

                    ($('#loading-saving-data',bootstrapRegion).length === 0)?  $('.bootstrap-dialog-body',bootstrapRegion).append(Template): null;

                    /*if($('.btn',region_dialog)) {
                        console.log("bootstrap dialog")

                        $.each($('.btn',region_dialog), function(index, value){
                            console.log(index);
                            console.log(value)

                            console.log("BTN clicked on bootstrap dialg",value )
                            $(value, reg).prop('disabled',true);
                        });
                    }*/
                    savingController.onSavingData()
                }
            });

        })
    }

    return SavingObserver;
})
