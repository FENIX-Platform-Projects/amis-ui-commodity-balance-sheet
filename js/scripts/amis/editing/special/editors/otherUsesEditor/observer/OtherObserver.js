/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "jqwidgets"], function ($, Formatter) {

    var otherController, formulaToApplyTot, totalValuesModified, singleCropsValuesModified, grid

    var itemClickEvent, afterEditStopEvent ,rowNumber
    var idCell;

    function OtherObserver() {
    }

    OtherObserver.prototype.init = function (Controller) {
        otherController = Controller;
        formulaToApplyTot = 'init';
        totalValuesModified = false;
    }




    OtherObserver.prototype.applyListeners = function (Grid) {
        grid = Grid

        this.listenToEditCellTotGrid();
        this.listenToSaveTotalValuesButton()
   //     this.listenToCloseButton();
   //     this.listenToCloseModal();
    }

    OtherObserver.prototype.listenToEditCellTotGrid = function () {

        itemClickEvent = grid.attachEvent("onItemClick", function (id, e, node) {
            e.preventDefault();
            e.stopImmediatePropagation()
            var row = grid.getIndexById(idCell)
            idCell = id;
            otherController.sendToObs(row);
        })

        afterEditStopEvent = grid.attachEvent("onAfterEditStop", function (state, editor, ignoreUpdate) {
            // columnIndex
            var columnIndex = grid.getColumnIndex(idCell.column) - 1;
            var numberOfRow = grid.getIndexById(idCell);

            console.log('cellEdit: listener Active')
            totalValuesModified = true;
            var columnValue = editor.column;
            var oldvalue = state.old;
            var value = state.value;

            if (oldvalue != value) {
                if (columnValue == 3) {
                    var value2 = isNaN(value) ? value : parseFloat(value)
                    otherController.updateTotGridOnEditing(numberOfRow, value2, formulaToApplyTot, columnValue)
                } else {
                    otherController.simpleUpdateOnEditing(numberOfRow, value, formulaToApplyTot, columnValue)
                }
            }
        })
    }


    OtherObserver.prototype.listenToSaveTotalValuesButton = function () {
        $('#saveTotalValues').on('click', function (event) {
            console.log('listenToSaveTotal values')
            event.preventDefault();
            event.stopImmediatePropagation();
            if (totalValuesModified) {
                otherController.saveTotalValues()
            }
        })
    }

    OtherObserver.prototype.closeEventsBindedToTotGrid = function () {
        grid.detachEvent(itemClickEvent);
        grid.detachEvent(afterEditStopEvent);
        $("#gridTotalValues").off();
        $('#saveTotalValues').off()
    }

    OtherObserver.prototype.listenToCloseModal = function () {
        $('#specialForm').on('hidden.bs.modal', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            otherController.destroyAll()
        })
    }

    OtherObserver.prototype.listenToCloseButton = function () {
        $('#closeModal').on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            otherController.destroyModal()
        })
    }


    return OtherObserver;
})