define(["jquery", "formatter/DatatypesFormatter", "jqwidgets"], function ($, Formatter) {

    var controllerPaddy, formulaToApplyTot, formulaToApplySingle, totalValuesModified, singleCropsValuesModified, isMilledTotSelected,
        isMilledSingleSelected,paddyEditableHandler, isAreaHSelectedTot, isAreaHSelectedSingle;

    // ------------ Support method ------------------//
    var checkAll = function (obj) {
        return typeof obj !== 'undefined' && obj != null;
    }
    // ---------------------------------------------//

    function PaddyObserver() {

    }

    PaddyObserver.prototype.init = function (Controller, PaddyEditableHandler,
                                             formulaTotInit, isAreaHSelected) {
        isMilledTotSelected = true
        isMilledSingleSelected = true;

        console.log('observer.oinit()')
        console.log(isAreaHSelected)
        isAreaHSelectedTot = isAreaHSelected;
        isAreaHSelectedSingle = isAreaHSelected;


        paddyEditableHandler = PaddyEditableHandler;
        controllerPaddy = Controller;
        formulaToApplyTot = formulaTotInit;
        formulaToApplySingle = 'init';
        totalValuesModified = false;
        singleCropsValuesModified = false;
        if(formulaTotInit != 'init' && (formulaTotInit.substr(formulaTotInit.length -6)) != 'Milled'){
            isMilledTotSelected = false;
        }

    }

    PaddyObserver.prototype.applyListeners = function () {

        this.listenToCheckboxesTotal();
        this.listenToCheckboxesSingleCrops();
        this.listenToRecalculateButtonTotalValues()
        this.listenToRecalculateButtonSingleCrops();
        this.listenToTabs()

        this.listenToEditCellTotGrid();
        this.listenToEditCellSingleGrid();
        this.listenToSaveTotalValuesButton();

        this.listenToTotalEditable()
        this.listenToSingleCropsEditable();

        // this.listenToCloseModal()
        this.listenToCloseButton()
        this.listenToChangeRadioButtonValue();

    }

    PaddyObserver.prototype.listenToCheckboxesSingleCrops = function () {

        var that = this;

        $("#thirdCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            controllerPaddy.showAlerts(false);
            (event.args.checked) ? that.onCheckBoxSingleCrops(3) : that.onUncheckBoxSingleCrops(3);
        })
        $("#fourthCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            controllerPaddy.showAlerts(false);

            (event.args.checked) ? that.onCheckBoxSingleCrops(4) : that.onUncheckBoxSingleCrops(4);
        })
        $("#fifthCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            controllerPaddy.showAlerts(false);

            (event.args.checked) ? that.onCheckBoxSingleCrops(5) : that.onUncheckBoxSingleCrops(5);
        })

    }

    PaddyObserver.prototype.listenToChangeRadioButtonValue = function () {

        var self = this;
        $('#radioBtnPaddyTot').on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            if (event.args.checked == isMilledTotSelected) {
                self.setTotalValuesOnModified();
                isMilledTotSelected = !event.args.checked;
                formulaToApplyTot = controllerPaddy.onChangeFormulaWithRadio(formulaToApplyTot)
                controllerPaddy.onChangeKindOfRice(formulaToApplyTot, isMilledTotSelected, true)

            }
        })


        $('#radioBtnAreaPlantedTot').on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            console.log('befr')
            console.log(isAreaHSelectedTot)

            if (event.args.checked == isAreaHSelectedTot) {
                console.log('after')

                debugger;

                self.setTotalValuesOnModified();
                isAreaHSelectedTot = !event.args.checked;
                controllerPaddy.onChangeKindOfArea(true, isAreaHSelectedTot)
                controllerPaddy.onChangeKindOfRice(formulaToApplyTot, isMilledTotSelected, true)

            }
        })

        $('#radioBtnPaddySingle').on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            if (event.args.checked == isMilledSingleSelected) {
                isMilledSingleSelected = !event.args.checked;
                formulaToApplySingle = controllerPaddy.onChangeFormulaWithRadio(formulaToApplySingle)
                controllerPaddy.onChangeKindOfRice(formulaToApplySingle, isMilledSingleSelected, false)

            }
        })

    }

    PaddyObserver.prototype.onCheckBoxSingleCrops = function (number) {
        switch (number) {

            case 3:
                if ($("#fourthCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#fifthCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = (isMilledSingleSelected) ? 'milled' : 'yieldPaddy'

                }
                else if ($("#fifthCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = (isMilledSingleSelected) ? 'areaHarvestedMilled' : 'areaHarvestedPaddy'

                }
                break;

            case 4:
                if ($("#thirdCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#fifthCheckBoxSingleCrops").jqxCheckBox('uncheck');
                    $("#fifthCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = (isMilledSingleSelected) ? 'milled' : 'yieldPaddy'


                } else if ($("#fifthCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = (isMilledSingleSelected) ? 'productionMilled' : 'productionPaddy'

                }
                break;

            case 5:
                if ($("#thirdCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('uncheck');
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = (isMilledSingleSelected) ? 'areaHarvestedMilled' : 'areaHarvestedPaddy'
                }

                else if ($("#fourthCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = (isMilledSingleSelected) ? 'productionMilled' : 'productionPaddy'
                }
                break;
        }
    }

    PaddyObserver.prototype.onUncheckBoxSingleCrops = function (number) {
        switch (number) {
            case 1:

                if ($('#thirdCheckBoxSingleCrops').attr("aria-checked") == 'true' && $('#fourthCheckBoxSingleCrops').attr("aria-checked") == 'true') {
                    formulaToApplySingle = 'milled'
                }
                else if ($('#fourthCheckBoxSingleCrops').attr("aria-checked") == 'true' && $('#fifthCheckBoxSingleCrops').attr("aria-checked") == 'true') {
                    formulaToApplySingle = 'productionMilled'
                }
                else if ($('#thirdCheckBoxSingleCrops').attr("aria-checked") == 'true' && $('#fifthCheckBoxSingleCrops').attr("aria-checked") == 'true') {
                    formulaToApplySingle = 'areaHarvestedMilled'
                }

                break;

            case 2:
                // milled\
                if ($('#radioBtnMilledSingle').attr("aria-checked") == 'false') {
                    $("#radioBtnMilledSingle").jqxRadioButton('enable');
                    $("#radioBtnMilledSingle").jqxRadioButton('check');

                }
                if ($('#thirdCheckBoxSingleCrops').attr("aria-checked") == 'true'
                    && $('#fourthCheckBoxSingleCrops').attr("aria-checked") == 'true') {
                    formulaToApplySingle = 'yieldPaddy'
                }
                else if ($('#fourthCheckBoxSingleCrops').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxSingleCrops').attr("aria-checked") == 'true') {
                    formulaToApplySingle = 'productionPaddy'
                }
                else if ($('#thirdCheckBoxSingleCrops').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxSingleCrops').attr("aria-checked") == 'true') {
                    formulaToApplySingle = 'areaHarvestedPaddy'
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


        $("#thirdCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            controllerPaddy.showAlerts(true);
            (event.args.checked)? that.onCheckBoxTotal(3) : that.onUncheckBoxTotal(3);
        })
        $("#fourthCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            controllerPaddy.showAlerts(true);
            (event.args.checked)? that.onCheckBoxTotal(4) : that.onUncheckBoxTotal(4);
        })
        $("#fifthCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            controllerPaddy.showAlerts(true);
            (event.args.checked)? that.onCheckBoxTotal(5) : that.onUncheckBoxTotal(5);
        })
    }

    PaddyObserver.prototype.onCheckBoxTotal = function (number) {
        switch (number) {

            case 3:
                if ($("#fourthCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#fifthCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = (isMilledTotSelected) ? 'milled' : 'yieldPaddy'

                }
                else if ($("#fifthCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#fourthCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = (isMilledTotSelected) ? 'areaHarvestedMilled' : 'areaHarvestedPaddy'
                }
                break;

            case 4:
                if ($("#thirdCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#fifthCheckBoxTotVal").jqxCheckBox('uncheck');
                    $("#fifthCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = (isMilledTotSelected) ? 'milled' : 'yieldPaddy'

                } else if ($("#fifthCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = (isMilledTotSelected) ? 'productionMilled' : 'productionPaddy'
                }
                break;

            case 5:
                if ($("#thirdCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#fourthCheckBoxTotVal").jqxCheckBox('uncheck');
                    $("#fourthCheckBoxTotVal").jqxCheckBox('disable');

                    formulaToApplyTot = (isMilledTotSelected) ? 'areaHarvestedMilled' : 'areaHarvestedPaddy'

                }
                else if ($("#fourthCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxTotVal").jqxCheckBox('disable');

                    formulaToApplyTot = (isMilledTotSelected) ? 'productionMilled' : 'productionPaddy'
                }
                break;
        }
    }

    PaddyObserver.prototype.onUncheckBoxTotal = function (number) {
        switch (number) {

            case 1:

                if ($('#thirdCheckBoxTotVal').attr("aria-checked") == 'true' && $('#fourthCheckBoxTotVal').attr("aria-checked") == 'true') {
                    formulaToApplyTot = 'milled'
                }
                else if ($('#fourthCheckBoxTotVal').attr("aria-checked") == 'true' && $('#fifthCheckBoxTotVal').attr("aria-checked") == 'true') {
                    formulaToApplyTot = 'productionMilled'
                }
                else if ($('#thirdCheckBoxTotVal').attr("aria-checked") == 'true' && $('#fifthCheckBoxTotVal').attr("aria-checked") == 'true') {
                    formulaToApplyTot = 'areaHarvestedMilled'
                }

                break;

            case 2:
                // milled\

                if ($('#thirdCheckBoxTotVal').attr("aria-checked") == 'true'
                    && $('#fourthCheckBoxTotVal').attr("aria-checked") == 'true') {
                    formulaToApplyTot = 'yieldPaddy'
                }
                else if ($('#fourthCheckBoxTotVal').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxTotVal').attr("aria-checked") == 'true') {
                    formulaToApplyTot = 'productionPaddy'
                }
                else if ($('#thirdCheckBoxTotVal').attr("aria-checked") == 'true'
                    && $('#fifthCheckBoxTotVal').attr("aria-checked") == 'true') {
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
            event.stopPropagation();
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

            // third is disabled on default
            evt.preventDefault();
            evt.stopImmediatePropagation();
            var counter = 0;

            counter += $("#thirdCheckBoxSingleCrops").val() ? 1 : 0;
            counter += $("#fourthCheckBoxSingleCrops").val() ? 1 : 0;
            counter += $("#fifthCheckBoxSingleCrops").val() ? 1 : 0;

            singleCropsValuesModified = true;

            if (counter == 2) { //OK
                if (formulaToApplySingle == 'init') {
                    formulaToApplySingle = 'milled'
                }
                controllerPaddy.deleteAlerts(false)
                controllerPaddy.updateSingleCropsGridOnFormulaChanges(formulaToApplySingle, "normal");
            } else{
                if(!document.getElementById('selectAtLeastTwoElSing')) {
                    var alert = '<div class="alert alert-danger alert-dismissible" role="alert" id="selectAtLeastTwoElSing">' +
                        '<button type="button" class="close" data-dismiss="alert">' +
                        '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                        '<strong>Attention!</strong> You have to select <strong>2 elements</strong></div>';
                    $('#alertSingle').append(alert)
                }
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
                if (formulaToApplyTot == 'init') {
                    formulaToApplyTot = 'milled'
                }
                controllerPaddy.deleteAlerts(true)
                controllerPaddy.updateTotGridOnFormulaChanges(formulaToApplyTot, "normal", false);
            } else {
                if (!document.getElementById('selectAtLeastTwoElTot')) {
                    var alert = '<div class="alert alert-danger alert-dismissible" role="alert" id="selectAtLeastTwoElTot">' +
                        '<button type="button" class="close" data-dismiss="alert">' +
                        '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                        '<strong>Attention!</strong> You have to select <strong>2 elements</strong></div>';
                    $('#alertTotal').append(alert)
                }
            }
        })
    }

    PaddyObserver.prototype.listenToTotalEditable = function () {
        var that = this;
        $("#gridTotalValues").bind('cellbeginedit', function (event) {

            event.preventDefault();
            event.stopImmediatePropagation();
            var toBlock = false;
            var row = event.args.rowindex;
            var column = event.args.datafield
            var toBlock =  paddyEditableHandler.checkIfBlocked(formulaToApplyTot, row,true);


            if (column == 6) {
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
            var row = event.args.rowindex;
            var column = event.args.datafield
            var toBlock =  paddyEditableHandler.checkIfBlocked(formulaToApplySingle, row,false);

            if (column == 6 || column == 7) {
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

            if (checkAll(value)) {
                if (columnValue == 3 && value != oldvalue) {
                    var numberOfRow = event.args.rowindex;
                    var value2 = parseFloat(value)
                    if (formulaToApplyTot == 'init') {
                        formulaToApplyTot = 'milled'
                    }
                    var specialEditing = 'normal'
                    controllerPaddy.updateSingleCropsGridOnEditing(numberOfRow, value2, formulaToApplySingle, columnValue, specialEditing)
                } else if ((oldvalue != value)) { // if modified only flag/notes
                    var numberOfRow = event.args.rowindex;
                    controllerPaddy.updateSingleCropsGridOnEditing(numberOfRow, value, formulaToApplySingle, columnValue, 'normal')
                }
            }
        })

    }

    PaddyObserver.prototype.listenToSaveTotalValuesButton = function () {
        $('#saveTotalValues').on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            controllerPaddy.saveTotalValues(formulaToApplyTot)

        })
    }


    PaddyObserver.prototype.listenToTabs = function () {

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var newly = e.target // newly activated tab
            var oldly = e.relatedTarget // previous active tab

            if (newly.hash == '#totalValues' && singleCropsValuesModified) {
                var isChanged;
                if(isMilledTotSelected!= isMilledSingleSelected){
                    isMilledTotSelected = isMilledSingleSelected
                    isChanged = true;
                }else{
                    isChanged = false
                }
                controllerPaddy.onSwitchingCropsValues(formulaToApplySingle,isChanged, isMilledTotSelected)
            } else if (newly.hash == '#totalValues' && !singleCropsValuesModified) {
                controllerPaddy.onSwitchingSimpleTotal(formulaToApplyTot)
            } else if (newly.hash == '#singleCrops') {
                controllerPaddy.onSwitchingSimpleSingle(formulaToApplySingle)
            }
        })

    }

    PaddyObserver.prototype.listenToCloseModal = function () {
        $('#specialForm').on('hidden.bs.modal', function () {
            controllerPaddy.destroyAll()
        })
    }

    PaddyObserver.prototype.listenToCloseButton = function () {
        $('#closeModalTotal').on('click', function () {
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

    PaddyObserver.prototype.setSingleCropsOnModified = function () {
        singleCropsValuesModified = true;
    }

    PaddyObserver.prototype.unbindEventsFromTotalValues = function () {

        $('#saveTotalValues').off()
        $('#gridTotalValues').off()
    }

    PaddyObserver.prototype.reBindEventsFromTotalValues = function () {
        this.listenToEditCellTotGrid(); //edit
        this.listenToCheckboxesTotal(); //checkboxes
        this.listenToRecalculateButtonTotalValues(); //formulas
        this.listenToSaveTotalValuesButton(); // saving
        this.listenToTotalEditable()
    }


    return PaddyObserver;
})