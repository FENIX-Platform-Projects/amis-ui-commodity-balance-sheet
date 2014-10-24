/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "jqwidgets"], function ($, Formatter) {

    var controllerPaddy, formulaToApplyTot, formulaToApplySingle, totalValuesModified, singleCropsValuesModified

    // ------------ Support method ------------------//
    var checkAll = function (object) {
        return typeof object !== 'undefined' && object != null && object != '';
    }
    // ---------------------------------------------//

    function PaddyObserver() {
    }

    PaddyObserver.prototype.init = function (Controller) {
        controllerPaddy = Controller;
        formulaToApplyTot = 'init';
        formulaToApplySingle = 'init';
        totalValuesModified = false;
        singleCropsValuesModified = false;
    }

    PaddyObserver.prototype.applyListeners = function () {

        this.listenToCheckboxesTotal();
        this.listenToCheckboxesSingleCrops();
        this.listenToEditCellTotGrid();
        this.listenToEditCellSingleGrid();
        this.listenToTotalEditable()
        this.listenToSingleCropsEditable();
        this.listenToRecalculateButtonSingleCrops();
        this.listenToRecalculateButtonTotalValues()
        this.listenToSaveTotalValuesButton();
        this.listenToTabs()
        this.listenToCloseModal()
        this.listenToCloseButton()
    }

    PaddyObserver.prototype.listenToCheckboxesSingleCrops = function () {

        var that = this;
        $("#firstCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(1) : that.onUncheckBoxSingleCrops(1);
        })
        $("#secondCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(2) : that.onUncheckBoxSingleCrops(2);
        })
        $("#thirdCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(3) : that.onUncheckBoxSingleCrops(3);
        })
        $("#fourthCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(4) : that.onUncheckBoxSingleCrops(4);
        })

    }

    PaddyObserver.prototype.onCheckBoxSingleCrops = function (number) {
        switch (number) {
            case 1:
                if ($('#secondCheckBoxSingleCrops').attr("aria-checked") == 'true') {
                    $("#secondCheckBoxSingleCrops").jqxCheckBox('uncheck');
                }
                if ($('#secondCheckBoxSingleCrops').attr("aria-disabled") != 'true') {
                    $("#secondCheckBoxSingleCrops").jqxCheckBox('disable');
                }

                if ($('#thirdCheckBoxSingleCrops').attr("aria-checked") == 'true'
                    && $('#fourthCheckBoxSingleCrops').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'milled'
                }
                else if ($('#fourthCheckBoxSingleCrops').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxSingleCrops').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'productionMilled'
                }
                else if ($('#thirdCheckBoxSingleCrops').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxSingleCrops').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'areaHarvestedMilled'
                }
                break;

            case 2:
                // milled
                if ($('#firstCheckBoxSingleCrops').attr("aria-checked") == 'true') {
                    $("#firstCheckBoxSingleCrops").jqxCheckBox('uncheck');
                }
                if ($('#firstCheckBoxSingleCrops').attr("aria-disabled") != 'true') {
                    $("#firstCheckBoxSingleCrops").jqxCheckBox('disable');
                }
                if ($('#thirdCheckBoxSingleCrops').attr("aria-checked") == 'true'
                    && $('#fourthCheckBoxSingleCrops').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'yieldPaddy'
                }
                else if ($('#fourthCheckBoxSingleCrops').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxSingleCrops').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'productionPaddy'
                }
                else if ($('#thirdCheckBoxSingleCrops').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxSingleCrops').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'areaHarvestedPaddy'
                }

                break;

            case 3:
                if ($("#fourthCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#fifthCheckBoxSingleCrops").jqxCheckBox('disable');
                    if ($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                        formulaToApplyTot = 'yieldPaddy';
                    } else {
                        formulaToApplyTot = 'milled';
                    }
                }
                else if ($("#fifthCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('disable');
                    if ($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                        formulaToApplyTot = 'areaHarvestedPaddy';
                    } else {
                        formulaToApplyTot = 'areaHarvestedMilled';
                    }
                }
                break;

            case 4:
                if ($("#thirdCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#fifthCheckBoxSingleCrops").jqxCheckBox('uncheck');
                    $("#fifthCheckBoxSingleCrops").jqxCheckBox('disable');
                    if ($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                        formulaToApplyTot = 'yieldPaddy';
                    } else {
                        formulaToApplyTot = 'milled';
                    }

                } else if ($("#fifthCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxSingleCrops").jqxCheckBox('disable');
                    if ($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                        formulaToApplyTot = 'productionPaddy';
                    } else {
                        formulaToApplyTot = 'productionMilled';
                    }
                }
                break;

            case 5:
                if ($("#thirdCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('uncheck');
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('disable');

                    if ($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                        formulaToApplyTot = 'areaHarvestedPaddy';
                    } else {
                        formulaToApplyTot = 'areaHarvestedMilled';
                    }

                }
                else if ($("#fourthCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxSingleCrops").jqxCheckBox('disable');
                    if ($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                        formulaToApplyTot = 'productionPaddy';
                    } else {
                        formulaToApplyTot = 'productionMilled';
                    }

                }
                break;
        }
    }

    PaddyObserver.prototype.onUncheckBoxSingleCrops = function (number) {
        switch (number) {
            case 1:
                if ($('#secondCheckBoxSingleCrops').attr("aria-disabled") == 'true') {
                    $("#secondCheckBoxSingleCrops").jqxCheckBox('enable');
                    $("#secondCheckBoxSingleCrops").jqxCheckBox('check');

                }
                if ($('#thirdCheckBoxSingleCrops').attr("aria-checked") == 'true'&& $('#fourthCheckBoxSingleCrops').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'milled'
                }
                else if ( $('#fourthCheckBoxSingleCrops').attr("aria-checked") == 'true' && $('#fifthCheckBoxSingleCrops').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'productionMilled'
                }
                else if ($('#thirdCheckBoxSingleCrops').attr("aria-checked") == 'true' && $('#fifthCheckBoxSingleCrops').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'areaHarvestedMilled'
                }

                break;

            case 2:
                // milled\
                if ($('#firstCheckBoxSingleCrops').attr("aria-disabled") == 'true') {
                    $("#firstCheckBoxSingleCrops").jqxCheckBox('enable');
                    $("#firstCheckBoxSingleCrops").jqxCheckBox('check');

                }
                if ($('#thirdCheckBoxSingleCrops').attr("aria-checked") == 'true'
                    && $('#fourthCheckBoxSingleCrops').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'yieldPaddy'
                }
                else if ($('#fourthCheckBoxSingleCrops').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxSingleCrops').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'productionPaddy'
                }
                else if ($('#thirdCheckBoxSingleCrops').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxSingleCrops').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'areaHarvestedPaddy'
                }

                break;

            case 3:
                if ($("#fourthCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('enable');
                }
                if ($("#fifthCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                    $("#fifthCheckBoxSingleCrops").jqxCheckBox('enable');
                }
                break;

            case 4:
                if ($("#thirdCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                    $("#thirdCheckBoxSingleCrops").jqxCheckBox('enable');
                }
                if ($("#fifthCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                    $("#fifthCheckBoxSingleCrops").jqxCheckBox('enable');
                }
                break;
            case 5:
                if ($("#thirdCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                    $("#thirdCheckBoxSingleCrops").jqxCheckBox('enable');
                }
                if ($("#fourthCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('enable');
                }
                break;

        }
    }

    PaddyObserver.prototype.listenToCheckboxesTotal = function () {
        var that = this;
        $("#firstCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(1) : that.onUncheckBoxTotal(1);
        })
        $("#secondCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(2) : that.onUncheckBoxTotal(2);
        })
        $("#thirdCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(3) : that.onUncheckBoxTotal(3);
        })
        $("#fourthCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(4) : that.onUncheckBoxTotal(4);
        })
        $("#fifthCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(5) : that.onUncheckBoxTotal(5);
        })
    }

    PaddyObserver.prototype.onCheckBoxTotal = function (number) {
        switch (number) {
            case 1:
                if ($('#secondCheckBoxTotVal').attr("aria-checked") == 'true') {
                    $("#secondCheckBoxTotVal").jqxCheckBox('uncheck');
                }
                if ($('#secondCheckBoxTotVal').attr("aria-disabled") != 'true') {
                        $("#secondCheckBoxTotVal").jqxCheckBox('disable');
                }

                if ($('#thirdCheckBoxTotVal').attr("aria-checked") == 'true'
                    && $('#fourthCheckBoxTotVal').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'milled'
                }
                else if ($('#fourthCheckBoxTotVal').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxTotVal').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'productionMilled'
                }
                else if ($('#thirdCheckBoxTotVal').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxTotVal').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'areaHarvestedMilled'
                }
                break;

            case 2:
                // milled
                if ($('#firstCheckBoxTotVal').attr("aria-checked") == 'true') {
                    $("#firstCheckBoxTotVal").jqxCheckBox('uncheck');
                }
                if ($('#firstCheckBoxTotVal').attr("aria-disabled") != 'true') {
                    $("#firstCheckBoxTotVal").jqxCheckBox('disable');
                }
                if ($('#thirdCheckBoxTotVal').attr("aria-checked") == 'true'
                    && $('#fourthCheckBoxTotVal').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'yieldPaddy'
                }
                else if ($('#fourthCheckBoxTotVal').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxTotVal').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'productionPaddy'
                }
                else if ($('#thirdCheckBoxTotVal').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxTotVal').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'areaHarvestedPaddy'
                }

                break;

            case 3:
                if ($("#fourthCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#fifthCheckBoxTotVal").jqxCheckBox('disable');
                    if ($("#firstCheckBoxTotVal").attr("aria-checked") == 'true') {
                        formulaToApplyTot = 'yieldPaddy';
                    } else {
                        formulaToApplyTot = 'milled';
                    }
                }
                else if ($("#fifthCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#fourthCheckBoxTotVal").jqxCheckBox('disable');
                    if ($("#firstCheckBoxTotVal").attr("aria-checked") == 'true') {
                        formulaToApplyTot = 'areaHarvestedPaddy';
                    } else {
                        formulaToApplyTot = 'areaHarvestedMilled';
                    }
                }
                break;

            case 4:
                if ($("#thirdCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#fifthCheckBoxTotVal").jqxCheckBox('uncheck');
                    $("#fifthCheckBoxTotVal").jqxCheckBox('disable');
                    if ($("#firstCheckBoxTotVal").attr("aria-checked") == 'true') {
                        formulaToApplyTot = 'yieldPaddy';
                    } else {
                        formulaToApplyTot = 'milled';
                    }

                } else if ($("#fifthCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxTotVal").jqxCheckBox('disable');
                    if ($("#firstCheckBoxTotVal").attr("aria-checked") == 'true') {
                        formulaToApplyTot = 'productionPaddy';
                    } else {
                        formulaToApplyTot = 'productionMilled';
                    }
                }
                break;

            case 5:
                if ($("#thirdCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#fourthCheckBoxTotVal").jqxCheckBox('uncheck');
                    $("#fourthCheckBoxTotVal").jqxCheckBox('disable');

                    if ($("#firstCheckBoxTotVal").attr("aria-checked") == 'true') {
                        formulaToApplyTot = 'areaHarvestedPaddy';
                    } else {
                        formulaToApplyTot = 'areaHarvestedMilled';
                    }

                }
                else if ($("#fourthCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxTotVal").jqxCheckBox('disable');
                    if ($("#firstCheckBoxTotVal").attr("aria-checked") == 'true') {
                        formulaToApplyTot = 'productionPaddy';
                    } else {
                        formulaToApplyTot = 'productionMilled';
                    }

                }
                break;
            }
    }

    PaddyObserver.prototype.onUncheckBoxTotal = function (number) {
        switch (number) {
            case 1:
                if ($('#secondCheckBoxTotVal').attr("aria-disabled") == 'true') {
                    $("#secondCheckBoxTotVal").jqxCheckBox('enable');
                    $("#secondCheckBoxTotVal").jqxCheckBox('check');

                }
                if ($('#thirdCheckBoxTotVal').attr("aria-checked") == 'true'&& $('#fourthCheckBoxTotVal').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'milled'
                }
                else if ( $('#fourthCheckBoxTotVal').attr("aria-checked") == 'true' && $('#fifthCheckBoxTotVal').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'productionMilled'
                }
                else if ($('#thirdCheckBoxTotVal').attr("aria-checked") == 'true' && $('#fifthCheckBoxTotVal').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'areaHarvestedMilled'
                }

                break;

            case 2:
                // milled\
                if ($('#firstCheckBoxTotVal').attr("aria-disabled") == 'true') {
                    $("#firstCheckBoxTotVal").jqxCheckBox('enable');
                    $("#firstCheckBoxTotVal").jqxCheckBox('check');

                }
                if ($('#thirdCheckBoxTotVal').attr("aria-checked") == 'true'
                    && $('#fourthCheckBoxTotVal').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'yieldPaddy'
                }
                else if ($('#fourthCheckBoxTotVal').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxTotVal').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'productionPaddy'
                }
                else if ($('#thirdCheckBoxTotVal').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxTotVal').attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'areaHarvestedPaddy'
                }

                break;

            case 3:
                if ($("#fourthCheckBoxTotVal").attr("aria-disabled") == 'true') {
                    $("#fourthCheckBoxTotVal").jqxCheckBox('enable');
                }
                if ($("#fifthCheckBoxTotVal").attr("aria-disabled") == 'true') {
                    $("#fifthCheckBoxTotVal").jqxCheckBox('enable');
                }
                break;

            case 4:
                if ($("#thirdCheckBoxTotVal").attr("aria-disabled") == 'true') {
                    $("#thirdCheckBoxTotVal").jqxCheckBox('enable');
                }
                if ($("#fifthCheckBoxTotVal").attr("aria-disabled") == 'true') {
                    $("#fifthCheckBoxTotVal").jqxCheckBox('enable');
                }
                break;
            case 5:
                if ($("#thirdCheckBoxTotVal").attr("aria-disabled") == 'true') {
                    $("#thirdCheckBoxTotVal").jqxCheckBox('enable');
                }
                if ($("#fourthCheckBoxTotVal").attr("aria-disabled") == 'true') {
                    $("#fourthCheckBoxTotVal").jqxCheckBox('enable');
                }
                break;

        }
    }

    PaddyObserver.prototype.listenToEditCellTotGrid = function () {

        $("#gridTotalValues").on('cellendedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            console.log('cellEdit: listener Active')
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
                if (formulaToApplyTot == 'init') {
                    formulaToApplyTot = 'milled'
                }
                var specialEditing = 'normal'

                controllerPaddy.updateTotGridOnEditing(numberOfRow, value2, formulaToApplyTot, columnValue, specialEditing)
            } else if (columnValue != 3 && (oldvalue != value)) {
                var numberOfRow = event.args.rowindex;
                controllerPaddy.updateTotGridOnEditing(numberOfRow, value, formulaToApplyTot, columnValue, 'normal')
            }
        })
    }

    PaddyObserver.prototype.listenToRecalculateButtonSingleCrops = function () {
        $('#applyRulesFormulaSingle').on('click', function (evt) {

            console.log(formulaToApplySingle)

            // third is disabled on default
            evt.preventDefault();
            evt.stopImmediatePropagation();
            var counter = 0;

            counter += $("#thirdCheckBoxSingleCrops").val()  ? 1 : 0;
            counter += $("#fourthCheckBoxSingleCrops").val() ? 1 : 0;
            counter += $("#fifthCheckBoxSingleCrops").val()  ? 1 : 0;

            singleCropsValuesModified = true;

            if (counter == 2) { //OK
                if(formulaToApplySingle == 'init'){
                    formulaToApplySingle = 'milled'
                }
                controllerPaddy.updateSingleCropsGridOnFormulaChanges(formulaToApplySingle, "normal");
            } else {
                var alert = '<div class="alert alert-danger alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                    '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>Attention!</strong> You have to select <strong>2 elements</strong></div>';
                $('#alertSingle').append(alert)
            }
        })
    }

    PaddyObserver.prototype.listenToRecalculateButtonTotalValues = function () {
        $('#applyRulesFormulaTot').on('click', function (evt) {
            // third is disabled on default
            evt.preventDefault();
            evt.stopImmediatePropagation();
            var counter = 0;
            counter += $("#thirdCheckBoxTotVal").val() ? 1 : 0;
            counter += $("#fourthCheckBoxTotVal").val() ? 1 : 0;
            counter += $("#fifthCheckBoxTotVal").val() ? 1 : 0;


            singleCropsValuesModified = true;
            if (counter == 2) { //OK
                console.log('FormualToAppply')
                console.log(formulaToApplyTot)
                if(formulaToApplyTot == 'init'){
                    formulaToApplyTot = 'milled'
                }
                controllerPaddy.updateTotGridOnFormulaChanges(formulaToApplyTot, "normal");
            } else {
                var alert = '<div class="alert alert-danger alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                    '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>Attention!</strong> You have to select <strong>2 elements</strong></div>';
                $('#alertTotal').append(alert)
            }
        })
    }

    PaddyObserver.prototype.listenToTotalEditable = function () {
        $("#gridTotalValues").bind('cellbeginedit', function (event) {
            debugger;
            event.preventDefault();
            event.stopImmediatePropagation()
            var toBlock = false;
            var row = event.args.rowindex;
            var column = event.args.datafield

            switch (formulaToApplyTot) {

                case 'init':
                    if (row == 1 || row == 3 || row == 5) {
                        toBlock = true;
                    }
                    break;

                case 'milled':
                    if (row == 1 || row == 3 || row == 5) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvestedMilled':
                    if (row == 0 || row == 1 || row ==5) {
                        toBlock = true;
                    }
                    break;

                case 'productionMilled':
                    if (row == 1 || row == 4 || row == 5) {
                        toBlock = true;
                    }
                    break;

                case 'yieldPaddy':
                    if (row == 3 || row == 4  || row == 5) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvestedPaddy':
                    if (row == 0 ||row == 3|| row == 4) {
                        toBlock = true;
                    }
                    break;

                case 'productionPaddy':
                    if (row == 1 || row == 4 || row ==5) {
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

    PaddyObserver.prototype.listenToSingleCropsEditable = function () {
        $("#gridSingleCrops").bind('cellbeginedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            var toBlock = false;
            var row = event.args.rowindex;
            var column = event.args.datafield

            switch (formulaToApplySingle) {

                case 'init':
                    if (row == 1 || row == 3 || row == 6) {
                        toBlock = true;
                    }
                    break;

                case 'milled':
                    if (row == 1 || row == 3 || row == 6) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvestedMilled':
                    if (row == 0 || row == 1 || row ==6) {
                        toBlock = true;
                    }
                    break;

                case 'productionMilled':
                    if (row == 1 || row == 4 || row == 6) {
                        toBlock = true;
                    }
                    break;

                case 'yieldPaddy':
                    if (row == 3 || row == 4  || row == 6) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvestedPaddy':
                    if (row == 0 ||row == 3|| row == 4) {
                        toBlock = true;
                    }
                    break;

                case 'productionPaddy':
                    if (row == 1 || row == 4 || row ==6) {
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

    PaddyObserver.prototype.listenToEditCellSingleGrid = function () {

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
                if (formulaToApplyTot == 'init') {
                    formulaToApplyTot = 'milled'
                }

                var specialEditing = controllerPaddy.selectSpecialEditing(formulaToApplySingle, numberOfRow)

                controllerPaddy.updateSingleCropsGridOnEditing(numberOfRow, value2, formulaToApplySingle, columnValue, specialEditing)
            } else if (columnValue != 3 && (oldvalue != value)) { // if modified only flag/notes
                var numberOfRow = event.args.rowindex;
                controllerPaddy.updateSingleCropsGridOnEditing(numberOfRow, value, formulaToApplySingle, columnValue, specialEditing)
            }
        })

    }

    PaddyObserver.prototype.listenToSaveTotalValuesButton = function () {
        $('#saveTotalValues').on('click', function (event) {
            console.log('listenToSaveTotal values')
            event.preventDefault();
            event.stopImmediatePropagation();
            if (totalValuesModified) {
                controllerPaddy.saveTotalValues(formulaToApplyTot)
            }
        })
    }

    PaddyObserver.prototype.closeEventsBindedToTotGrid = function () {
        $("#gridTotalValues").off();
        $("#firstCheckBoxTotVal").off();
        $("#secondCheckBoxTotVal").off();
        $("#thirdCheckBoxTotVal").off();
        $("#fourthCheckBoxTotVal").off();
        $('#saveTotalValues').off()
    }

    PaddyObserver.prototype.listenToTabs = function () {
        $('#productionTabs').on('tabclick', function (event) {
            event.preventDefault()
            event.stopImmediatePropagation();
            console.log('listenToTabs')
            var clickedItem = event.args.item;
            if (clickedItem == 0 && singleCropsValuesModified) { // from single crops to total values
                controllerPaddy.onSwitchingCropsValues(formulaToApplySingle)

            }
        });
    }

    PaddyObserver.prototype.listenToCloseModal = function(){
        $('#specialForm').on('hidden.bs.modal', function () {
            controllerPaddy.destroyAll()
        })
    }

    PaddyObserver.prototype.listenToCloseButton = function(){
        $('closeModal').on('click', function(){
            controllerPaddy.destroyAll()
        })
    }


    PaddyObserver.prototype.getFormulaTotalValues = function () {
        var result = formulaToApplyTot;
        return result;
    }

    PaddyObserver.prototype.setTotalValuesOnModified = function () {
        totalValuesModified = true;
    }


    return PaddyObserver;
})