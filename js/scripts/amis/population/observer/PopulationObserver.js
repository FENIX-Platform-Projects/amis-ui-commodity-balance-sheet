define(['jquery'], function($){

    'use strict'


    var controller, iDContainer;

    function PopulationObserver(Controller){
        controller = Controller;
    }

    PopulationObserver.prototype.init = function(Conf){
        if(Conf){
            $.extend(true,Conf,this.o)
            iDContainer = this.o.containerID
        }

    }

    PopulationObserver.prototype.applyListeners = function(){

        this.listenToEditableColumns();
        this.listenToEditPopulationGrid();
        this.createNewPopulationYear()

    }


    PopulationObserver.prototype.listenToEditableColumns = function(){

        $('#'+iDContainer).bind('cellbeginedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            var row = event.args.rowindex;
            var column = event.args.datafield

            if(column == this.o.elementName || column== this.o.UM){
                $("#"+iDContainer).jqxGrid('endcelledit', row, column, true);
            }
        });
    }


    PopulationObserver.prototype.listenToEditPopulationGrid = function() {

        $("#" + iDContainer).on('cellendedit', function (event) {

            event.preventDefault();
            event.stopImmediatePropagation()
            var value = event.args.value;
            var column = event.args.datafield;
            var row = event.args.rowindex;

            controller.updatePopGridOnEditing(row,column,value)
        });
    }

    PopulationObserver.prototype.listenToCloseButton = function () {
        $('#closeModalPopulation').on('click', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            controller.destroyAll()
        })
    }


    PopulationObserver.prototype.createNewPopulationYear = function(){

        $('#createNewPpopulationYear').on('click', function(e){
            e.preventDefault();
            e.stopImmediatePropagation();

            controller.createNewYear()
        })
    }

    return PopulationObserver;
})