
define(['jquery', 'bootstrap-dialog',
    'amis_population/controller/PopulationController','' +
        'jqwidgets', 'amplify' ], function($, BootstrapDialog, PopController){

    var generalController, bootstrapDialog, popController;

    function GeneralObserver(){
        bootstrapDialog = BootstrapDialog;
        popController = new PopController;
    }


    GeneralObserver.prototype.init = function(GeneralController, initThousand, initElement){
        generalController = GeneralController;
        this.listenToVisualizationOptions(initThousand);
        this.listenToElementsOptions(initElement);
        this.listenToResetButton();
    }


    GeneralObserver.prototype.listenToResetButton = function(){
        $('#resetGrid').on('click', function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            debugger;
            $('#loadData').click();

        })
    }


    GeneralObserver.prototype.listenToElementsOptions = function(check) {

        this.updateCheckingBox('elements',check)
        $('#everyElButtons').on('checked', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            generalController.onChangeVisualizationOption('elements',1)

        });

        $('#flagButton').on('checked', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            generalController.onChangeVisualizationOption('elements',2)
        });

        $('#noteButton').on('checked', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            generalController.onChangeVisualizationOption('elements',3)
        });

        $('#valueButton').on('checked', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            generalController.onChangeVisualizationOption('elements',4)
        });
    }


    GeneralObserver.prototype.listenToVisualizationOptions = function(check) {

        this.updateCheckingBox('separator',check)
        $('#commaButton').on('checked', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            generalController.onChangeVisualizationOption('separator',1)

        });

        $('#periodButton').on('checked', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            generalController.onChangeVisualizationOption('separator',2)

        });

        $('#spaceButton').on('checked', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            generalController.onChangeVisualizationOption('separator',3)

        });
    }


    GeneralObserver.prototype.onChangingLoadingModality = function(filterData){
        $('#changeModality').on('click', function(e){

            e.preventDefault();
            e.stopImmediatePropagation();
            var storeValue = amplify.store();
            var isMonthly = storeValue.isMonthlyModality

            if(generalController.lookIfEditedSomeValues()) {

                bootstrapDialog.confirm('ATTENTION: you edited some values. ' +
                    'Are you sure to change modality and lose every changes ?', function (result) {
                    if(result){

                        var data = generalController.getDataToSaveFromController();
                        data.updatedData.length = 0
                        data.newData.length = 0;

                        if (isMonthly) {
                            amplify.publish("changeOnAnnualModality", {preloadingData: filterData})
                        } else {
                            amplify.publish("changeOnMonthlyModality", {preloadingData: filterData})
                        }

                    }
                })
            }

            else{
                if (isMonthly) {
                    amplify.publish("changeOnAnnualModality", {preloadingData: filterData})
                } else {
                    amplify.publish("changeOnMonthlyModality", {preloadingData: filterData})
                }
            }
        })

    }


    GeneralObserver.prototype.updateCheckingBox = function(mode,check){
        if(mode == 'separator') {

            switch (check) {
                case 1:
                    $('#commaButton').jqxRadioButton('check', function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation()
                    });
                    break;

                case 2:
                    $('#periodButton').jqxRadioButton('check', function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation()
                    });
                    break;

                case 3:
                    $('#spaceButton').jqxRadioButton('check', function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation()
                    });
                    break;
            }
        }else{

            switch (check) {
                case 1:
                    $('#everyElButtons').jqxRadioButton('check', function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation()
                    });
                    break;

                case 2:
                    $('#flagButton').jqxRadioButton('check', function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation()
                    });
                    break;

                case 3:
                    $('#noteButton').jqxRadioButton('check', function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation()
                    });
                    break;

                case 4:
                    $('#valueButton').jqxRadioButton('check', function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation()
                    });
                    break;
            }
        }
    }


    GeneralObserver.prototype.listenToPopulationForm = function(){
        var self = this;
        var idBtnPopulation;
        $('#'+idBtnPopulation).on('click', function(e){
            e.preventDefault();
            e.stopImmediatePropagation();

            popController.init();

        })
    }

    GeneralObserver.prototype.reloadNewDataFromPopulationForm = function(){
        var idReset = 'resetButton'
        $('#'+idReset).click(function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
        })
    }


    return GeneralObserver;
})
