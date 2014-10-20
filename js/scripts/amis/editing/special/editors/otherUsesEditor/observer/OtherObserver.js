/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "jqwidgets"], function($, Formatter){

    var controllerPaddy, formulaToApplyTot, formulaToApplySingle, totalValuesModified, singleCropsValuesModified

    // ------------ Support method ------------------//
    var checkAll = function(object){
        return typeof object!=='undefined' && object != null && object != '';}
    // ---------------------------------------------//

    function OtherObserver(){}

    OtherObserver.prototype.init = function(Controller){
        controllerPaddy = Controller;
        formulaToApplyTot = 'init';
        formulaToApplySingle = 'init';
        totalValuesModified = false;
        singleCropsValuesModified =false;
    }

    OtherObserver.prototype.applyListeners = function(){

       // this.listenToCheckboxesTotal();
        this.listenToEditCellTotGrid();
        this.listenToSaveTotalValuesButton()
        this.listenToCloseButton();
        this.listenToCloseModal();
    }

    OtherObserver.prototype.listenToEditCellTotGrid = function() {

        $("#gridTotalValues").on('cellBeginEdit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            debugger;

            console.log('cellEdit: listener Active')
            totalValuesModified = true;
            var columnValue = event.args.datafield;
            var oldvalue = event.args.oldvalue;
            var value = event.args.value;
            var rowKey = args.key;


            switch(rowKey ){
                case 0:
                    break;
                default :
                    break;

            }
            if (checkAll(oldvalue) && columnValue == 3) {
                oldvalue = parseFloat(oldvalue)
            }
            if (checkAll(value) && columnValue == 3) {
                value = parseFloat(value)
            }

            if (columnValue == 3 && (oldvalue != value)) {
                var numberOfRow = event.args.rowindex;
                var value2 = parseFloat(value)
                controllerPaddy.updateTotGridOnEditing(numberOfRow, value2, formulaToApplyTot, columnValue)
            } else if (columnValue != 3 && (oldvalue != value)) {
                var numberOfRow = event.args.rowindex;
                controllerPaddy.updateTotGridOnEditing(numberOfRow, value, formulaToApplyTot, columnValue)
            }
        })
    }


    OtherObserver.prototype.listenToSaveTotalValuesButton = function () {
        $('#saveTotalValues').on('click', function (event) {
            console.log('listenToSaveTotal values')
            event.preventDefault();
            event.stopImmediatePropagation();
            if (totalValuesModified) {
                controllerPaddy.saveTotalValues(formulaToApplyTot)
            }
        })
    }

    OtherObserver.prototype.closeEventsBindedToTotGrid = function(){
        $("#gridTotalValues").off();

        $('#saveTotalValues').off()
    }

    OtherObserver.prototype.listenToCloseModal = function(){
        $('#specialForm').on('hidden.bs.modal', function () {
            controllerPaddy.destroyAll()
        })
    }

    OtherObserver.prototype.listenToCloseButton = function(){
        $('#closeModal').on('click', function(){
            controllerPaddy.destroyAll()
        })
    }



    return OtherObserver;
})