/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter"], function ($, Formatter) {

    var editorProduction, formulaToApplyTot, formulaToApplySingle, controllerProduction,
        totalValuesModified, singleCropsValuesModified, isAreaHarvestedSelectedTot, isAreaHarvestedSelectedSingle, isTotalSelectionModified,
        isSingleCropsModified;

    function ProductionObserver() {
        isTotalSelectionModified = true;
        isSingleCropsModified = true;
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
        isAreaHarvestedSelectedTot = true;
        isAreaHarvestedSelectedSingle = true;
        editorProduction = EditorProduction;
        totalValuesModified = false;
        singleCropsValuesModified = false;
        this.listenToCheckboxesTotal();
        this.listenToCheckboxesSingleCrops()
        this.listenToRecalculateButtonTotalValues();
        this.listenToRecalculateButtonSingleCrops();
        this.listenToTabs();
        this.listenToEditCellTotGrid();
        this.listenToEditCellSingleCropsGrid();
        this.listenToSaveTotalValuesButton();
        this.listenToTotalEditable();
        this.listenToSingleCropsEditable()
        this.listenToCloseModal();
        this.listenToCloseButton();
        this.listenToChangeRadioButtonValue();
    }

    ProductionObserver.prototype.listenToCheckboxesTotal = function () {

        var that = this;

        $("#firstCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            isTotalSelectionModified = true;
            (event.args.checked) ? that.onCheckBoxTotal(1) : that.onUncheckBoxTotal([2, 3]);
            controllerProduction.showAlertTotal()
        })
        $("#secondCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            isTotalSelectionModified = true;
            (event.args.checked) ? that.onCheckBoxTotal(2) : that.onUncheckBoxTotal([1, 3]);
            controllerProduction.showAlertTotal()

        })
        $("#thirdCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            isTotalSelectionModified = true;
            (event.args.checked) ? that.onCheckBoxTotal(3) : that.onUncheckBoxTotal([1, 2]);
            controllerProduction.showAlertTotal()
        })
    }

    ProductionObserver.prototype.listenToCheckboxesSingleCrops = function () {

        var that = this;

        $("#firstCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            isSingleCropsModified = true;
            (event.args.checked) ? that.onCheckBoxSingleCrops(1) : that.onUncheckBoxSingleCrops([2, 3]);
            controllerProduction.showAlertSingle()

        })
        $("#secondCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            isSingleCropsModified = true;
            (event.args.checked) ? that.onCheckBoxSingleCrops(2) : that.onUncheckBoxSingleCrops([1, 3]);
            controllerProduction.showAlertSingle()

        })
        $("#thirdCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            isSingleCropsModified = true;
            (event.args.checked) ? that.onCheckBoxSingleCrops(3) : that.onUncheckBoxSingleCrops([1, 2]);
            controllerProduction.showAlertSingle()

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

                isTotalSelectionModified = false;

                var typeOfForm = (isAreaHarvestedSelectedTot) ? 'totalValues' : 'totalValuesAPlanted';
                controllerProduction.cancelAllAlerts(true)
                controllerProduction.updateTotGridOnFormulaChanges(formulaToApplyTot, typeOfForm);
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
                isTotalSelectionModified = false;
                var typeOfForm = (isAreaHarvestedSelectedTot) ? 'singleCrops' : 'singleCropsAPlanted';
                controllerProduction.cancelAllAlerts(false)
                controllerProduction.updateSingleCropsGridOnFormulaChanges(formulaToApplySingle, typeOfForm);
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
            var clickedItem = event.args.item;


            if (clickedItem == 0 && singleCropsValuesModified) { // from single crops to total values
                var typeOfForm = (isAreaHarvestedSelectedTot) ? 'totalValues' : 'totalValuesAPlanted';

                controllerProduction.onSwitchingCropsValues(formulaToApplyTot, typeOfForm)
            } else if (clickedItem == 0 && !singleCropsValuesModified) {
                var typeOfForm = (isAreaHarvestedSelectedTot) ? 'totalValues' : 'totalValuesAPlanted';

                controllerProduction.onSwitchingSimpleTotal(formulaToApplyTot, typeOfForm)
            } else if (clickedItem == 1) {
                var typeOfForm = (isAreaHarvestedSelectedSingle) ? 'singleCrops' : 'singleCropsAPlanted';

                controllerProduction.onSwitchingSimpleSingle(formulaToApplySingle, typeOfForm)
            }
        });
    }

    ProductionObserver.prototype.listenToChangeRadioButtonValue = function () {
        $('#radioBtnAreaPlanted').on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            if (event.args.checked == isAreaHarvestedSelectedTot) {
                isAreaHarvestedSelectedTot = !event.args.checked;
                controllerProduction.onChangeAreaSelected(formulaToApplyTot, isAreaHarvestedSelectedTot, true)

            }
        })

        $('#radioBtnAreaPltdSingleCrops').on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            if (event.args.checked == isAreaHarvestedSelectedSingle) {
                isAreaHarvestedSelectedSingle = !event.args.checked;
                controllerProduction.onChangeAreaSelected(formulaToApplySingle, isAreaHarvestedSelectedSingle, false)

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
            if (checkAll(oldvalue) && columnValue == 3) {
                oldvalue = parseFloat(oldvalue)
            }
            if (checkAll(value) && columnValue == 3) {
                value = parseFloat(value)
            }

            if (columnValue == 3 && (oldvalue != value)) {
                var numberOfRow = event.args.rowindex;
                var value2 = parseFloat(value)
                controllerProduction.updateTotGridOnEditing(numberOfRow, value2, formulaToApplyTot, columnValue, isAreaHarvestedSelectedTot)
            } else if (columnValue != 3 && (oldvalue != value)) { // if modified only flag/notes
                var numberOfRow = event.args.rowindex;
                controllerProduction.updateTotGridOnEditing(numberOfRow, value, formulaToApplyTot, columnValue, isAreaHarvestedSelectedTot)
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

            if (checkAll(oldvalue) && columnValue == 3) {
                oldvalue = parseFloat(oldvalue)
            }
            if (checkAll(value) && columnValue == 3) {
                value = parseFloat(value)
            }


            if (columnValue == 3 && (oldvalue != value)) {
                var numberOfRow = event.args.rowindex;
                var value2 = parseFloat(value)
                console.log('formulaTOApply on edit Single grid:')
                console.log(formulaToApplySingle)

                controllerProduction.updateSingleCropsGridOnEditing(numberOfRow, value2, formulaToApplySingle, columnValue, isAreaHarvestedSelectedSingle)
            } else if (columnValue != 3 && (oldvalue != value)) { // if modified only flag/notes
                var numberOfRow = event.args.rowindex;
                console.log('formulaTOApply on edit Single grid:')
                console.log(formulaToApplySingle)

                controllerProduction.updateSingleCropsGridOnEditing(numberOfRow, value, formulaToApplySingle, columnValue, isAreaHarvestedSelectedSingle)
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

    ProductionObserver.prototype.unbindEventsFromTotalValues = function () {

        $('#saveTotalValues').off()
        $('#gridTotalValues').off()
    }

    ProductionObserver.prototype.reBindEventsFromTotalValues = function () {
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

            var conditionDisable = ((row === 0 && !isAreaHarvestedSelectedTot) || ((row == 3 && isAreaHarvestedSelectedTot)) ||
                ((row === 0 + (4 * 1) && !isAreaHarvestedSelectedTot) || ((row == 3 + (4 * 1) && isAreaHarvestedSelectedTot))) ||
                ((row === 0 + (4 * 2) && !isAreaHarvestedSelectedTot) || ((row == 3 + (4 * 2) && isAreaHarvestedSelectedTot))));

            switch (formulaToApplyTot) {
                case 'yield':
                case 'init':
                    var conditionCalculated = ((row == 1) || row == 1 + (4 * 1) || row == 1 + (4 * 2) || row == 1 + (4 * 3) )

                    if (conditionCalculated || conditionDisable) {
                        toBlock = true;
                    }
                    break;

                case 'production':
                    var conditionCalculated = (row == 2 || row == 2 + 4 * 1 || row == 2 + 4 * 1)

                    if (conditionCalculated || conditionDisable) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvested':
                    var conditionCalculated = ((row == 0 && isAreaHarvestedSelectedTot) || (row == 3 && !isAreaHarvestedSelectedTot) ||
                        (row == 0 + 4 * 1 && isAreaHarvestedSelectedTot) || (row == 3 + 4 * 1 && !isAreaHarvestedSelectedTot) ||
                        (row == 0 + 4 * 2 && isAreaHarvestedSelectedTot) || (row == 3 + 4 * 2 && !isAreaHarvestedSelectedTot))


                    if (conditionCalculated || conditionDisable) {
                        toBlock = true;
                    }
                    break;
            }
            if (column == 6) {
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

            var conditionDisable = ((row === 0 && !isAreaHarvestedSelectedSingle) || ((row == 3 && isAreaHarvestedSelectedSingle)) ||
                ((row === 0 + (4 * 1) && !isAreaHarvestedSelectedSingle) || ((row == 3 + (4 * 1) && isAreaHarvestedSelectedSingle))) ||
                ((row === 0 + (4 * 2) && !isAreaHarvestedSelectedSingle) || ((row == 3 + (4 * 2) && isAreaHarvestedSelectedSingle))));

            switch (formulaToApplySingle) {
                case 'yield':
                case 'init':
                    var conditionCalculated = ((row == 1) || row == 1 + (4 * 1) || row == 1 + (4 * 2) || row == 1 + (4 * 3) )

                    if (conditionCalculated || conditionDisable) {
                        toBlock = true;
                    }
                    break;

                case 'production':
                    var conditionCalculated = (row == 2 || row == 2 + 4 * 1 || row == 2 + 4 * 1)

                    if (conditionCalculated || conditionDisable) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvested':
                    var conditionCalculated = ((row == 0 && isAreaHarvestedSelectedSingle) || (row == 3 && !isAreaHarvestedSelectedSingle) ||
                        (row == 0 + 4 * 1 && isAreaHarvestedSelectedSingle) || (row == 3 + 4 * 1 && !isAreaHarvestedSelectedSingle) ||
                        (row == 0 + 4 * 2 && isAreaHarvestedSelectedSingle) || (row == 3 + 4 * 2 && !isAreaHarvestedSelectedSingle))


                    if (conditionCalculated || conditionDisable) {
                        toBlock = true;
                    }
                    break;
            }
            if (column == 6 || column == 7) {
                toBlock = true;
            }
            // condition follows
            if (toBlock) {
                $("#gridSingleCrops").jqxGrid('endcelledit', row, column, true);
            }
        });
    }

    ProductionObserver.prototype.listenToCloseModal = function () {
        $('#specialForm').on('hidden.bs.modal', function () {
            controllerProduction.destroyAll()
        })
    }

    ProductionObserver.prototype.listenToCloseButton = function () {
        $('closeModal').on('click', function () {
            controllerProduction.destroyAll()
        })
    }

    return ProductionObserver;

})