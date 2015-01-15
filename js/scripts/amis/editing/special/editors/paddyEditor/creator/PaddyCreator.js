define(["jquery", "formatter/DatatypesFormatter", "flagTranslator/controller/FlagController", "text!paddyEditor/view/_paddyForm.html",
    "text!productionEditor/view/_alertSelection.html", "jqwidgets", "select2"], function ($, Formatter, FlagController, HTMLPaddy, AlertSelection) {

    var observer, formulaToRenderTotVal, formulaToRenderSingleCrops, flagController, modal, callbackStyleTotGrid, callbackStyleSingleGrid,
        that, callbackMultiFlagCreation, callbackMultiFlagInit, callbackMultiFlagGetValues, that, alertSelection, paddyEditableHandler;

    function PaddyCreator() {

        alertSelection = AlertSelection;
        that = this;
        flagController = new FlagController;
        modal = HTMLPaddy;

        callbackStyleTotGrid = function (row, column, value, data) {
            return that.createStyleClassGridTotal(row, column, value, data)
        }

        callbackStyleSingleGrid = function (row, column, value, data) {
            return that.createStyleClassGridSingle(row, column, value, data)
        }

        callbackMultiFlagCreation = function (row, cellValue, editor, cellText, width, height) {
            that.createMultiFlagEditor(row, cellValue, editor, cellText, width, height)
        }

        callbackMultiFlagInit = function (row, cellValue, editor, cellText, width, height) {
            that.createMultiFlagInit(row, cellValue, editor, cellText, width, height)
        }

        callbackMultiFlagGetValues = function (row, cellValue, editor) {
            return that.getFromMultiFlag(row, cellValue, editor);
        }
    }

    PaddyCreator.prototype.init = function (totalValuesModel, singleCropsModel, Observer, PaddyEditableHandler) {
        paddyEditableHandler = PaddyEditableHandler;

        this.destroyIfExistOtherModal();

        $("#pivotGrid").append(modal);

        formulaToRenderTotVal = 'init';
        formulaToRenderSingleCrops = 'init';

        observer = Observer;
        var totalModel = $.extend(true, [], totalValuesModel);
        var singleModel = $.extend(true, [], singleCropsModel);


        $("#specialForm").modal({ backdrop: 'static',
            keyboard: false});

        $('#singleCrops').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        })

        this.initAllCheckBoxes()


        $('#totalValues').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        })


        this.createAndDrawGrid(this.setDataForGrid(totalModel, true), "gridTotalValues");

        this.createAndDrawGrid(this.setDataForGrid(singleModel, false), "gridSingleCrops");

        this.changeLabelToElements(true, true);
        this.changeLabelToElements(true, false);

        observer.applyListeners()

    }

    PaddyCreator.prototype.updateTotGrid = function (calculatedModel, formulaToApply) {

        formulaToRenderTotVal = formulaToApply

        observer.unbindEventsFromTotalValues()

        this.createAndDrawGrid(this.setDataForGrid(calculatedModel, true), "gridTotalValues");

        observer.reBindEventsFromTotalValues()

    }

    PaddyCreator.prototype.updateSingleGrid = function (calculatedModel, formulaToApply) {

        formulaToRenderSingleCrops = formulaToApply;

        this.createAndDrawGrid(this.setDataForGrid(calculatedModel, false), "gridSingleCrops");


    }

    PaddyCreator.prototype.destroyAll = function () {
        $('#gridTotalValues').jqxGrid('destroy')
        $('#gridSingleCrops').jqxGrid('destroy');

        $('#radioBtnMilledTot').jqxRadioButton('destroy');
        $('#radioBtnPaddyTot').jqxRadioButton('destroy');
        $('#thirdCheckBoxTotVal').jqxCheckBox('destroy');
        $('#fourthCheckBoxTotVal').jqxCheckBox('destroy');
        $('#fifthCheckBoxTotVal').jqxCheckBox('destroy');

        $('#radioBtnMilledSingle').jqxRadioButton('destroy');
        $('#radioBtnPaddySingle').jqxRadioButton('destroy');
        $('#thirdCheckBoxSingleCrops').jqxCheckBox('destroy');
        $('#fourthCheckBoxSingleCrops').jqxCheckBox('destroy');
        $('#fifthCheckBoxSingleCrops').jqxCheckBox('destroy');


    }

    PaddyCreator.prototype.createStyleClassGridTotal = function (row, column, value, data) {
        var result;
        result = ( paddyEditableHandler.checkIfBlocked(formulaToRenderTotVal, row,true)) ? 'calculatedRowGrid' : 'notCalculatedRows';
        return result;
    }

    PaddyCreator.prototype.createStyleClassGridSingle = function (row, column, value, data) {
        var result;
        result = ( paddyEditableHandler.checkIfBlocked(formulaToRenderSingleCrops, row,false)) ? 'calculatedRowGrid' : 'notCalculatedRows';
        return result;

    }

    PaddyCreator.prototype.createMultiFlagEditor = function (row, cellValue, editor, cellText, width, height) {
        var stringValue = cellValue;
        var oldInput = document.getElementById(editor[0].id)
        oldInput.parentNode.className = oldInput.parentNode.className + " flagClass"
        var newInput = document.createElement('div')
        newInput.id = oldInput.id;
        newInput.className = oldInput.className;
        oldInput.parentNode.replaceChild(newInput, oldInput)
        var stringToAppend = '<select multiple tabindex="-1" id="multiFlag" style="width:100%" class="input-group-lg">';
        stringToAppend += flagController.getOptions(stringValue)
        stringToAppend += '</select>'
        $('#' + editor[0].id).append(stringToAppend)
    }

    PaddyCreator.prototype.createMultiFlagInit = function (row, cellValue, editor, cellText, width, height) {
        $('#multiFlag').select2({placeholder: "Click to select the flags"});
    }

    PaddyCreator.prototype.getFromMultiFlag = function (row, cellValue, editor) {
        var codes = $('#multiFlag').select2("val");
        return  flagController.getStringFromCodes(codes);
    }

    PaddyCreator.prototype.showAlert = function (container) {
        console.log('alert trovato:')
        console.log(document.getElementById(''+container).firstChild)
        if (!document.getElementById(''+container).firstChild) {
            $("#"+container).append(alertSelection);
        }
    }

    PaddyCreator.prototype.showAlertSingle = function () {
        if (!document.getElementById('alertSingle').firstChild) {
            $("#alertSingle").append(alertSelection)
        }
    }

    PaddyCreator.prototype.cancelAlerts = function (isTotal) {
        var myNode = (isTotal) ? document.getElementById('alertTotal') : document.getElementById('alertSingle');
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    }


    PaddyCreator.prototype.createAndDrawGrid = function (dataAdapter, idContainer) {

        var columns = this.createColumnsForGrid(idContainer);

        $('#' + idContainer).jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: columns
        });

    }


    PaddyCreator.prototype.createColumnsForGrid = function (idContainer) {

        var columns = (idContainer == "gridTotalValues") ?
            [
                { text: 'Element', datafield: 6, cellclassname: callbackStyleTotGrid  },
                { text: 'Value', datafield: 3, cellclassname: callbackStyleTotGrid },
                { text: 'Flags', datafield: 4, cellclassname: callbackStyleTotGrid,
                    createeditor: callbackMultiFlagCreation, initeditor: callbackMultiFlagInit, geteditorvalue: callbackMultiFlagGetValues, heigth: 250 },
                { text: 'Notes', datafield: 5, cellclassname: callbackStyleTotGrid }
            ] :
            [
                { text: 'Element', datafield: 6, cellclassname: callbackStyleSingleGrid },
                { text: 'Crop', datafield: 7, cellclassname: callbackStyleSingleGrid },
                { text: 'Value', datafield: 3, cellclassname: callbackStyleSingleGrid  },
                { text: 'Flag', datafield: 4, cellclassname: callbackStyleSingleGrid  }
            ]

        return columns;
    }


    PaddyCreator.prototype.setDataForGrid = function (data, isTotalModel) {


        var dataField = (isTotalModel) ?
            [
                { name: 6, type: 'string' },
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                {name: 5, type: 'string'}
            ] :
            [
                { name: 6, type: 'string'},
                { name: 7, type: 'string'},
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                { name: 5, type: 'string'}
            ]


        var source = {
            datatype: "array",
            datafields: dataField,
            id: 'grid' + isTotalModel,
            localdata: data
        };


        return new $.jqx.dataAdapter(source);
    }


    PaddyCreator.prototype.initAllCheckBoxes = function () {

        $('#radioBtnMilledTot').jqxRadioButton({ width: 120, height: 25, groupName: "totValuePaddy", checked: true});
        $('#radioBtnPaddyTot').jqxRadioButton({ width: 120, height: 25, groupName: "totValuePaddy"});
        $('#thirdCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true });
        $('#fourthCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true });
        $('#fifthCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, disabled: true });

        $('#radioBtnMilledSingle').jqxRadioButton({ width: 120, groupName: "singleCropPaddy", height: 25, checked: true});
        $('#radioBtnPaddySingle').jqxRadioButton({ width: 120, groupName: "singleCropPaddy", height: 25});
        $('#thirdCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true });
        $('#fourthCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true });
        $('#fifthCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, disabled: true });
    }


    PaddyCreator.prototype.destroyIfExistOtherModal = function () {
        $('#specialForm').modal('hide');

        var g = document.getElementById("specialForm");

        if (g && g !== null) {
            g.remove()
        }

        debugger;

        $('#dialogForm').modal('hide');


        var f = $('#closeModalFormTotal');
        if (f) {
            $('#closeModalFormTotal').click();
        }

        var f = document.getElementById("dialogForm");

        if (f && f !== null) {
            f.remove()
        }
    }

    PaddyCreator.prototype.changeLabelToElements = function (isMilledSelected, isTotal) {
        var labelYield, labelProduction

        if (isMilledSelected) {

            labelYield = 'Yield Milled'
            labelProduction = 'Production'

        } else {
            labelYield = 'Yield Paddy'
            labelProduction = 'Production Paddy'
        }

        if (isTotal) {
            document.getElementById('thirdCheckBoxTotValLabel').innerHTML = labelProduction
            document.getElementById('fifthCheckBoxTotValLabel').innerHTML = labelYield
        } else {
            document.getElementById('thirdCheckBoxSingleCropsLabel').innerHTML = labelProduction
            document.getElementById('fifthCheckBoxSingleCropsLabel').innerHTML = labelYield
        }
    }

    return PaddyCreator;
})