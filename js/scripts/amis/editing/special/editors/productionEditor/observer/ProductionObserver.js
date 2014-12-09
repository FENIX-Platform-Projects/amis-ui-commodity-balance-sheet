/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter"], function ($, Formatter) {

    var editorProduction, formulaToApplyTot, formulaToApplySingle, controllerProduction,
        totalValuesModified, singleCropsValuesModified, isAreaHarvestedSelected;

    function ProductionObserver() {
    }

    // ------------ Support method ------------------//
    var checkAll = function (object) {
        return typeof object !== 'undefined' && object != null && object != '';
    }
    // ---------------------------------------------//

    ProductionObserver.prototype.applyListeners = function (EditorProduction, EditorController) {
        controllerProduction = EditorController;
        formulaToApplyTot = 'init';
        formulaToApplySingle = 'init';
        isAreaHarvestedSelected = true;
        editorProduction = EditorProduction;
        totalValuesModified = false;
        singleCropsValuesModified = false;
        this.listenToCheckboxesTotal();
        this.listenToCheckboxesSingleCrops()
        this.listenToRecalculateButtonTotalValues();
        this.listenToRecalculateButtonSingleCrops();
        this.listenToTabs();
        this.listenToEditCellTotGrid()
        this.listenToEditCellSingleCropsGrid()
        this.listenToSaveTotalValuesButton();
        this.listenToTotalEditable()
        this.listenToSingleCropsEditable()
        this.listenToCloseModal()
        this.listenToCloseButton()
        this.listenToChangeRadioButton()
    }

    ProductionObserver.prototype.listenToCheckboxesTotal = function () {

        var that = this;

        $("#firstCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(1) : that.onUncheckBoxTotal([2, 3]);
        })
        $("#secondCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(2) : that.onUncheckBoxTotal([1, 3]);
        })
        $("#thirdCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(3) : that.onUncheckBoxTotal([1, 2]);
        })


    }

    ProductionObserver.prototype.listenToCheckboxesSingleCrops = function () {

        var that = this;

        $("#firstCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(1) : that.onUncheckBoxSingleCrops([2, 3]);
        })
        $("#secondCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(2) : that.onUncheckBoxSingleCrops([1, 3]);
        })
        $("#thirdCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(3) : that.onUncheckBoxSingleCrops([1, 2]);
        })
    }

    ProductionObserver.prototype.onCheckBoxTotal = function (clicked) {
        var result = []
        switch (clicked) {
            case 1:
                if ($("#secondCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'yield';

                }
                else if ($("#thirdCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#secondCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'areaHarvested';
                }
                break;

            case 2:
                if ($("#firstCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'yield';

                } else if ($("#thirdCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#firstCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'production'
                }
                break;

            case 3:
                if ($("#firstCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#secondCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'areaHarvested';

                }
                else if ($("#secondCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#firstCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'production'

                }
                break;


        }
    }

    ProductionObserver.prototype.onCheckBoxSingleCrops = function (clicked) {
        var result = []
        switch (clicked) {
            case 1:
                if ($("#secondCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'yield';

                }
                else if ($("#thirdCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#secondCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'areaHarvested';
                }
                break;

            case 2:
                if ($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'yield';

                } else if ($("#thirdCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#firstCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'production'
                }
                break;

            case 3:
                if ($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#secondCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'areaHarvested';

                }
                else if ($("#secondCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#firstCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'production'

                }
                break;
        }
    }

    ProductionObserver.prototype.onUncheckBoxTotal = function (others) {
        for (var i = 0; i < others.length; i++) {
            switch (others[i]) {
                case 1:
                    if ($("#firstCheckBoxTotVal").attr("aria-disabled") == 'true') {
                        $("#firstCheckBoxTotVal").jqxCheckBox('enable');
                    }
                    break;
                case 2:
                    if ($("#secondCheckBoxTotVal").attr("aria-disabled") == 'true') {
                        $("#secondCheckBoxTotVal").jqxCheckBox('enable');
                    }
                    break;
                case 3:
                    if ($("#thirdCheckBoxTotVal").attr("aria-disabled") == 'true') {
                        $("#thirdCheckBoxTotVal").jqxCheckBox('enable');
                    }
                    break;
            }
        }
    }

    ProductionObserver.prototype.onUncheckBoxSingleCrops = function (others) {
        for (var i = 0; i < others.length; i++) {
            switch (others[i]) {
                case 1:
                    if ($("#firstCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                        $("#firstCheckBoxSingleCrops").jqxCheckBox('enable');
                    }
                    break;
                case 2:
                    if ($("#secondCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                        $("#secondCheckBoxSingleCrops").jqxCheckBox('enable');
                    }
                    break;
                case 3:
                    if ($("#thirdCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                        $("#thirdCheckBoxSingleCrops").jqxCheckBox('enable');
                    }
                    break;
            }
        }
    }

    ProductionObserver.prototype.listenToRecalculateButtonTotalValues = function () {
        $('#applyRulesFormulaTot').on('click', function (evt) {
            // third is disabled on default
            evt.preventDefault();
            evt.stopImmediatePropagation();
            console.log('recalucalteButtonTotalValues')
            var counter = 0;
            counter += $("#firstCheckBoxTotVal").val() ? 1 : 0;
            counter += $("#secondCheckBoxTotVal").val() ? 1 : 0;
            counter += $("#thirdCheckBoxTotVal").val() ? 1 : 0;
            totalValuesModified = true;
            if (counter == 2) { //OK

                var typeOfForm = (isAreaHarvestedSelected)? 'totalValues': 'totalValuesAPlanted';
                controllerProduction.updateTotGridOnFormulaChanges(formulaToApplyTot,typeOfForm);
            } else {
                var alert = '<div class="alert alert-danger alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                    '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>Attention!</strong> You have to select <strong>2 elements</strong></div>';
                $('#alertTotal').append(alert)
            }
        })
    }

    ProductionObserver.prototype.listenToRecalculateButtonSingleCrops = function () {
        $('#applyRulesFormulaSingle').on('click', function (evt) {
            console.log('click')
            // third is disabled on default
            evt.preventDefault();
            evt.stopImmediatePropagation();
            var counter = 0;
            counter += $("#firstCheckBoxSingleCrops").val() ? 1 : 0;
            counter += $("#secondCheckBoxSingleCrops").val() ? 1 : 0;
            counter += $("#thirdCheckBoxSingleCrops").val() ? 1 : 0;
            singleCropsValuesModified = true;
            console.log(counter)
            if (counter == 2) { //OK
                controllerProduction.updateSingleCropsGridOnFormulaChanges(formulaToApplySingle);
            } else {
                var alert = '<div class="alert alert-danger alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                    '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>Attention!</strong> You have to select <strong>2 elements</strong></div>';
                $('#alertSingle').append(alert)
            }
        })
    }

    ProductionObserver.prototype.listenToTabs = function () {
        $('#productionTabs').on('tabclick', function (event) {

            event.preventDefault()
            event.stopImmediatePropagation();
            debugger;
            var clickedItem = event.args.item;
            if (clickedItem == 0 && singleCropsValuesModified) { // from single crops to total values
                controllerProduction.onSwitchingCropsValues(formulaToApplySingle)
            }else if(clickedItem == 0 && !singleCropsValuesModified){
                controllerProduction.onSwitchingSimpleTotal(formulaToApplyTot)
            }else if(clickedItem ==1){
                controllerProduction.onSwitchingSimpleSingle(formulaToApplySingle)
            }
        });
    }

    ProductionObserver.prototype.listenToChangeRadioButton = function(){
        $('#radioBtnAreaPlanted').on('change', function(event){
            event.preventDefault();
            event.stopImmediatePropagation();

            console.log("EVENT")
            console.log(event.args.checked)
            debugger;

            console.log(isAreaHarvestedSelected)

            if(event.args.checked == isAreaHarvestedSelected){
                isAreaHarvestedSelected = !event.args.checked;
                controllerProduction.onChangeAreaSelected(formulaToApplyTot, isAreaHarvestedSelected)

            }
        })
    }


    ProductionObserver.prototype.listenToEditCellTotGrid = function () {

        $("#gridTotalValues").on('cellendedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            totalValuesModified = true;
            var columnValue = event.args.datafield;
            var oldvalue = event.args.oldvalue;
            var value = event.args.value;
            if (checkAll(oldvalue)&& columnValue == 3) {
                oldvalue = parseFloat(oldvalue)
            }
            if (checkAll(value)&& columnValue == 3) {
                value = parseFloat(value)
            }

            if (columnValue == 3 && (oldvalue != value)) {
                var numberOfRow = event.args.rowindex;
                var value2 = parseFloat(value)
                controllerProduction.updateTotGridOnEditing(numberOfRow, value2, formulaToApplyTot, columnValue, isAreaHarvestedSelected)
            } else if (columnValue != 3 && (oldvalue != value)) { // if modified only flag/notes
                var numberOfRow = event.args.rowindex;
                controllerProduction.updateTotGridOnEditing(numberOfRow, value, formulaToApplyTot, columnValue, isAreaHarvestedSelected)
            }
        })

    }

    ProductionObserver.prototype.listenToEditCellSingleCropsGrid = function () {
        $("#gridSingleCrops").on('cellendedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            singleCropsValuesModified = true;
            var columnValue = event.args.datafield;
            var oldvalue = event.args.oldvalue;
            var value = event.args.value;

            if (checkAll(oldvalue)&& columnValue == 3) {
                oldvalue = parseFloat(oldvalue)
            }
            if (checkAll(value)&& columnValue == 3) {
                value = parseFloat(value)
            }

            if (columnValue == 3 && (oldvalue != value)) {
                var numberOfRow = event.args.rowindex;
                var value2 = parseFloat(value)
                controllerProduction.updateSingleCropsGridOnEditing(numberOfRow, value2, formulaToApplyTot, columnValue)
            } else if (columnValue != 3 && (oldvalue != value)) { // if modified only flag/notes
                var numberOfRow = event.args.rowindex;
                controllerProduction.updateSingleCropsGridOnEditing(numberOfRow, value, formulaToApplyTot, columnValue)
            }
        })
    }

    ProductionObserver.prototype.listenToSaveTotalValuesButton = function () {
        $('#saveTotalValues').on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (totalValuesModified) {
                controllerProduction.saveTotalValues(formulaToApplyTot)
            }
        })
    }

    ProductionObserver.prototype.setTotalValuesModified = function () {
        totalValuesModified = true;
    }

    ProductionObserver.prototype.unbindEventsFromTotalValues = function(){

        $('#saveTotalValues').off()
        $('#gridTotalValues').off()
    }

    ProductionObserver.prototype.reBindEventsFromTotalValues = function(){
        this.listenToEditCellTotGrid(); //edit
        this.listenToCheckboxesTotal(); //checkboxes
        this.listenToRecalculateButtonTotalValues(); //formulas
        this.listenToSaveTotalValuesButton(); // saving
        this.listenToTotalEditable()
    }

    ProductionObserver.prototype.listenToTotalEditable = function () {
        $("#gridTotalValues").bind('cellbeginedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            var toBlock = false;
            var row = event.args.rowindex;
            var column = event.args.datafield


            switch (formulaToApplyTot) {

                case 'init':
                    if (row == 1 ) {
                        toBlock = true;
                    }
                    break;

                case 'production':
                    if (row == 2) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvested':
                    if (row == 0 ) {
                        toBlock = true;
                    }
                    break;

                case 'yield':
                    if (row == 1 ) {
                        toBlock = true;
                    }
                    break;
            }
            if(column == 6){
                toBlock = true;
            }

            // condition follows
            if (toBlock) {
                $("#gridTotalValues").jqxGrid('endcelledit', row, column, true);
            }
        });
    }

    ProductionObserver.prototype.listenToSingleCropsEditable = function () {
        $("#gridSingleCrops").bind('cellbeginedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            var toBlock = false;
            var row = event.args.rowindex;
            var column = event.args.datafield

            switch (formulaToApplyTot) {

                case 'init':
                    if (row == 1 ) {
                        toBlock = true;
                    }
                    break;

                case 'production':
                    if (row == 2) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvested':
                    if (row == 0 ) {
                        toBlock = true;
                    }
                    break;

                case 'yield':
                    if (row == 1 ) {
                        toBlock = true;
                    }
                    break;
            }
            if(column == 6 || column == 7){
                toBlock = true;
            }
            // condition follows
            if (toBlock) {
                $("#gridSingleCrops").jqxGrid('endcelledit', row, column, true);
            }
        });
    }

    ProductionObserver.prototype.listenToCloseModal = function(){
        $('#specialForm').on('hidden.bs.modal', function () {
            controllerProduction.destroyAll()
        })
    }

    ProductionObserver.prototype.listenToCloseButton = function(){
        $('closeModal').on('click', function(){
            controllerProduction.destroyAll()
        })
    }

    return ProductionObserver;

})