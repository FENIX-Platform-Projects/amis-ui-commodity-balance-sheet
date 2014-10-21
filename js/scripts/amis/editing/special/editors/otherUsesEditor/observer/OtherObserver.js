/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "jqwidgets"], function($, Formatter){

    var otherController, formulaToApplyTot, totalValuesModified, singleCropsValuesModified, grid

    var itemClickEvent, afterEditStopEvent
    var idCell;

    function OtherObserver(){}

    OtherObserver.prototype.init = function(Controller){
        otherController = Controller;
        formulaToApplyTot = 'init';
        totalValuesModified = false;
    }

    OtherObserver.prototype.applyListeners = function(Grid){
        grid  = Grid

       // this.listenToCheckboxesTotal();
        this.listenToEditCellTotGrid();
        this.listenToSaveTotalValuesButton()
        this.listenToCloseButton();
        this.listenToCloseModal();
    }

    OtherObserver.prototype.listenToEditCellTotGrid = function() {



        itemClickEvent = grid.attachEvent("onItemClick", function (id, e, node) {
            e.preventDefault();
            e.stopImmediatePropagation()
            idCell = id;
        })



        afterEditStopEvent = grid.attachEvent("onAfterEditStop", function(state, editor, ignoreUpdate){
            console.log('state')
            event.preventDefault();
            event.stopImmediatePropagation();
            debugger;
            // columnIndex
            var columnIndex  = grid.getColumnIndex(idCell.column)-1;
            var numberOfRow = grid.getIndexById(idCell);

            console.log('cellEdit: listener Active')
            totalValuesModified = true;
            var columnValue = editor.column;
            var oldvalue = state.old;
            var value = state.value;
            var rowKey = args.key;


            if ( columnValue == 3) {
                oldvalue = isNaN(oldvalue)? oldvalue : parseFloat(oldvalue)
                value = isNaN(oldvalue)? value : parseFloat(value)
            }
           

            if (columnValue == 3 && (oldvalue != value)) {
                var value2 = parseFloat(value)
                otherController.updateTotGridOnEditing(numberOfRow, value2, formulaToApplyTot, columnValue)
            } else if (columnValue != 3 && (oldvalue != value)) {
                var numberOfRow = event.args.rowindex;
                otherController.updateTotGridOnEditing(numberOfRow, value, formulaToApplyTot, columnValue)
            }
        })
    }


    OtherObserver.prototype.listenToSaveTotalValuesButton = function () {
        $('#saveTotalValues').on('click', function (event) {
            console.log('listenToSaveTotal values')
            event.preventDefault();
            event.stopImmediatePropagation();
            if (totalValuesModified) {
                otherController.saveTotalValues(formulaToApplyTot)
            }
        })
    }

    OtherObserver.prototype.closeEventsBindedToTotGrid = function(){
        grid.detachEvent(itemClickEvent);
        grid.detachEvent(afterEditStopEvent);
        $("#gridTotalValues").off();
        $('#saveTotalValues').off()
    }

    OtherObserver.prototype.listenToCloseModal = function(){
        $('#specialForm').on('hidden.bs.modal', function () {
            otherController.destroyAll()
        })
    }

    OtherObserver.prototype.listenToCloseButton = function(){
        $('#closeModal').on('click', function(){
            otherController.destroyAll()
        })
    }



    return OtherObserver;
})