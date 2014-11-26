/**
 * Created by fabrizio on 9/25/14.
 */
define(['jquery', 'jqwidgets', 'amplify'], function($){

    var generalController

    function GeneralObserver(){}


    GeneralObserver.prototype.init = function(GeneralController, initThousand, initElement){
        generalController = GeneralController;
        console.log('observer.init()')
        this.listenToVisualizationOptions(initThousand);
        this.listenToElementsOptions(initElement);
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

            console.log('click of on changing modality')
            e.preventDefault();
            e.stopImmediatePropagation();
            var storeValue = amplify.store();
            var isMonthly = storeValue.isMonthlyModality
            if(isMonthly){
                amplify.publish("changeOnAnnualModality",{preloadingData: filterData})
            }else{
                amplify.publish("changeOnMonthlyModality",{preloadingData: filterData})
            }
        })
    }


    GeneralObserver.prototype.updateCheckingBox = function(mode,check){
        if(mode == 'separator') {

            console.log('UPDATE SEPARATOR, el: '+check)
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
            console.log('UPDATE ELEMENTS, el: '+check)

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

    return GeneralObserver;
})
