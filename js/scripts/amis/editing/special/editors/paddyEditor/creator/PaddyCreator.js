/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "flagTranslator/controller/FlagController", "text!paddyEditor/view/_paddyForm.html",
    "text!productionEditor/view/_alertSelection.html","jqwidgets", "select2"], function ($, Formatter, FlagController, HTMLPaddy, AlertSelection) {

    var observer, formulaToRenderTotVal, formulaToRenderSingleCrops, flagController, modal,callbackStyleTotGrid, callbackStyleSingleGrid,
        that, callbackMultiFlagCreation, callbackMultiFlagInit, callbackMultiFlagGetValues, that, alertSelection;

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

    PaddyCreator.prototype.init = function (totalValuesModel, singleCropsModel, Observer) {

        formulaToRenderTotVal = 'init';
        formulaToRenderSingleCrops = 'init';

        var map = {
            2: "Area Harvested",
            5: "Production",
            4: "Yield",
            37: "Area Planted"
        }

        observer = Observer;
        var totalModel = $.extend(true, [], totalValuesModel);
        var singleModel = $.extend(true, [], singleCropsModel);

        var source = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string' },
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                {name: 5, type: 'string'}
            ],
            id: 'ppp',
            localdata: totalModel
        };

        var source2 = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string' },
                { name: 7, type: 'string' },
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                { name: 5, type: 'string'}
            ],
            id: 'ppp',
            localdata: singleModel
        };

        var dataAdapter = new $.jqx.dataAdapter(source);
        var dataAdapter2 = new $.jqx.dataAdapter(source2);

        var f = document.getElementById("specialForm");

        if (f !== null) {
            f.remove()
        }

        $("#pivotGrid").append(modal);

        $('#firstRadioBtnTotVal').jqxRadioButton({ width: 120, height: 25, groupName: "totValuePaddy"});
        $('#secondRadioBtnTotVal').jqxRadioButton({ width: 120, height: 25,groupName: "totValuePaddy", checked: true});
        $('#thirdCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true });
        $('#fourthCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true });
        $('#fifthCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, disabled: true });

        $('#firstRadioBtnSingleCrops').jqxRadioButton({ width: 120, groupName: "singleCropPaddy",height: 25});
        $('#secondRadioBtnSingleCrops').jqxRadioButton({ width: 120, groupName: "singleCropPaddy",height: 25, checked: true});
        $('#thirdCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true });
        $('#fourthCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true });
        $('#fifthCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, disabled: true });

        $('#gridTotalValues').jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6, cellclassname: callbackStyleTotGrid  },
                { text: 'Value', datafield: 3, cellclassname: callbackStyleTotGrid },
                { text: 'Flags', datafield: 4, cellclassname: callbackStyleTotGrid,
                    createeditor: callbackMultiFlagCreation, initeditor: callbackMultiFlagInit, geteditorvalue: callbackMultiFlagGetValues, heigth: 250 },
                { text: 'Notes', datafield: 5, cellclassname: callbackStyleTotGrid }
            ]
        });

        $('#gridSingleCrops').jqxGrid({
            source: dataAdapter2,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6, cellclassname: callbackStyleSingleGrid },
                { text: 'Crop', datafield: 7, cellclassname: callbackStyleSingleGrid },
                { text: 'Value', datafield: 3, cellclassname: callbackStyleSingleGrid  },
                { text: 'Flag', datafield: 4, cellclassname: callbackStyleSingleGrid  }
            ]
        });

        $("#specialForm").modal({ backdrop: 'static',
            keyboard: false});

        $('#specialForm').on('shown.bs.modal', function (e) {
            $('#productionTabs').jqxTabs();
        })

        observer.applyListeners()
    }

    PaddyCreator.prototype.updateTotGrid = function (calculatedModel, formulaToApply) {
        var that = this;

        formulaToRenderTotVal = formulaToApply

        console.log('update Tot Grid!!')

        var source = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string' },
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                {name: 5, type: 'string'}
            ],
            id: 'ppp',
            localdata: calculatedModel
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        $('#gridTotalValues').jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6, cellclassname: callbackStyleTotGrid  },
                { text: 'Value', datafield: 3, cellclassname: callbackStyleTotGrid },
                { text: 'Flags', datafield: 4, cellclassname: callbackStyleTotGrid,
                    createeditor: callbackMultiFlagCreation, initeditor: callbackMultiFlagInit, geteditorvalue: callbackMultiFlagGetValues, heigth: 250 },
                { text: 'Notes', datafield: 5, cellclassname: callbackStyleTotGrid }
            ]

        });
    }

    PaddyCreator.prototype.updateSingleGrid = function (calculatedModel, formulaToApply) {

        formulaToRenderSingleCrops = formulaToApply;

        console.log('updateSingelGRid')

        var source = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string'},
                { name: 7, type: 'string'},
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                { name: 5, type: 'string'}
            ],
            id: 'ppp',
            localdata: calculatedModel
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        $('#gridSingleCrops').jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6, cellclassname: callbackStyleSingleGrid },
                { text: 'Crop', datafield: 7, cellclassname: callbackStyleSingleGrid },
                { text: 'Value', datafield: 3, cellclassname: callbackStyleSingleGrid  },
                { text: 'Flag', datafield: 4, cellclassname: callbackStyleSingleGrid  }
            ]
        });

    }

    PaddyCreator.prototype.destroyAll = function () {
        $('#gridTotalValues').jqxGrid('destroy')
        $('#gridSingleCrops').jqxGrid('destroy');

        $('#firstRadioBtnTotVal').jqxRadioButton('destroy');
        $('#secondRadioBtnTotVal').jqxRadioButton('destroy');
        $('#thirdCheckBoxTotVal').jqxCheckBox('destroy');
        $('#fourthCheckBoxTotVal').jqxCheckBox('destroy');
        $('#fifthCheckBoxTotVal').jqxCheckBox('destroy');

        $('#firstRadioBtnSingleCrops').jqxRadioButton('destroy');
        $('#secondRadioBtnSingleCrops').jqxRadioButton('destroy');
        $('#thirdCheckBoxSingleCrops').jqxCheckBox('destroy');
        $('#fourthCheckBoxSingleCrops').jqxCheckBox('destroy');
        $('#fifthCheckBoxSingleCrops').jqxCheckBox('destroy');

        $('#productionTabs').jqxTabs('destroy');
    }

    PaddyCreator.prototype.createStyleClassGridTotal = function (row, column, value, data) {
        var result;
        switch (formulaToRenderTotVal) {
            case 'init':
            case 'milled':

                var conditionCalculated =
                   ((row == 1 + 7*0 || row == 3 +  7*0|| row == 5 + 7*0) ||
                    (row == 1 + 7*1 || row == 3  + 7*1|| row == 5 + 7*1) ||
                    (row == 1 + 7*2 || row == 3  + 7*2|| row == 5 + 7*2) ||
                    (row == 1 + 7*3 || row == 3  + 7*3|| row == 5 + 7*3))

                result = (conditionCalculated) ? 'calculatedRowGrid' : 'notCalculatedRows';
                break;
            case 'yieldPaddy':

                var conditionCalculated =
                   ((row == 4 + 7*0 || row == 3 +  7*0|| row == 5 + 7*0) ||
                    (row == 4 + 7*1 || row == 3  + 7*1|| row == 5 + 7*1) ||
                    (row == 4 + 7*2 || row == 3  + 7*2|| row == 5 + 7*2) ||
                    (row == 4 + 7*3 || row == 3  + 7*3|| row == 5 + 7*3))


                result = (conditionCalculated) ? 'calculatedRowGrid' : 'notCalculatedRows';
                break;
            case 'areaHarvestedPaddy':

                var conditionCalculated =
                   ((row == 4 + 7*0 || row == 3 + 7*0 || row == 0 + 7*0) ||
                    (row == 4 + 7*1 || row == 3  + 7*1|| row == 0 + 7*1) ||
                    (row == 4 + 7*2 || row == 3  + 7*2|| row == 0 + 7*2) ||
                    (row == 4 + 7*3 || row == 3  + 7*3|| row == 0 + 7*3))

                result = (conditionCalculated) ? 'calculatedRowGrid' : 'notCalculatedRows';
                break;

            case 'productionPaddy':
                var conditionCalculated =
                   ((row == 4 + 7*0 || row == 1  + 7*0|| row == 5 + 7*0) ||
                    (row == 4 + 7*1 || row == 1  + 7*1|| row == 5 + 7*1) ||
                    (row == 4 + 7*2 || row == 1  + 7*2|| row == 5 + 7*2) ||
                    (row == 4 + 7*3 || row == 1  + 7*3|| row == 5 + 7*3))


                result = (conditionCalculated) ? 'calculatedRowGrid' : 'notCalculatedRows';
                break;

            case 'productionMilled':

                var conditionCalculated =
                       ((row == 4 + 7*0 || row == 1  + 7*0|| row == 5 + 7*0) ||
                        (row == 4 + 7*1 || row == 1  + 7*1|| row == 5 + 7*1) ||
                        (row == 4 + 7*2 || row == 1  + 7*2|| row == 5 + 7*2) ||
                        (row == 4 + 7*3 || row == 1  + 7*3|| row == 5 + 7*3))

                result = (conditionCalculated) ? 'calculatedRowGrid' : 'notCalculatedRows';
                break;

            case 'areaHarvestedMilled':
                var conditionCalculated =
                       ((row == 0 + 7*0 || row == 1  + 7*0|| row == 5 + 7*0) ||
                        (row == 0 + 7*1 || row == 1  + 7*1|| row == 5 + 7*1) ||
                        (row == 0 + 7*2 || row == 1  + 7*2|| row == 5 + 7*2) ||
                        (row == 0 + 7*3 || row == 1  + 7*3|| row == 5 + 7*3))

                result = (conditionCalculated) ? 'calculatedRowGrid' : 'notCalculatedRows';
                break;
        }
        return result;
    }

    PaddyCreator.prototype.createStyleClassGridSingle = function (row, column, value, data) {

        var result;
        switch (formulaToRenderSingleCrops) {
            case 'init':
            case 'milled':

                var conditionCalculated =
                   ((row == 1 + 7*0 || row == 3  + 7*0|| row == 6 + 7*0) ||
                    (row == 1 + 7*1 || row == 3  + 7*1|| row == 6 + 7*1) ||
                    (row == 1 + 7*2 || row == 3  + 7*2|| row == 6 + 7*2) ||
                    (row == 1 + 7*3 || row == 3  + 7*3|| row == 6 + 7*3))


                result = (conditionCalculated) ? 'calculatedRowGrid' : 'notCalculatedRows';
                break;
            case 'yieldPaddy':

                var conditionCalculated =
                   ((row == 4 + 7*0 || row == 3  + 7*0|| row == 6 + 7*0) ||
                    (row == 4 + 7*1 || row == 3  + 7*1|| row == 6 + 7*1) ||
                    (row == 4 + 7*2 || row == 3  + 7*2|| row == 6 + 7*2) ||
                    (row == 4 + 7*3 || row == 3  + 7*3|| row == 6 + 7*3))

                result = (conditionCalculated) ? 'calculatedRowGrid' : 'notCalculatedRows';
                break;
            case 'areaHarvestedPaddy':

                var conditionCalculated =
                   ((row == 4 + 7*0 || row == 3  + 7*0|| row == 0 + 7*0) ||
                    (row == 4 + 7*1 || row == 3  + 7*1|| row == 0 + 7*1) ||
                    (row == 4 + 7*2 || row == 3  + 7*2|| row == 0 + 7*2) ||
                    (row == 4 + 7*3 || row == 3  + 7*3|| row == 0 + 7*3))


                result = (conditionCalculated) ? 'calculatedRowGrid' : 'notCalculatedRows';
                break;

            case 'productionPaddy':

                var conditionCalculated =
                   ((row == 4 + 7*0 || row == 1 +  7*0|| row == 6 + 7*0) ||
                    (row == 4 + 7*1 || row == 1  + 7*1|| row == 6 + 7*1) ||
                    (row == 4 + 7*2 || row == 1  + 7*2|| row == 6 + 7*2) ||
                    (row == 4 + 7*3 || row == 1  + 7*3|| row == 6 + 7*3))


                result = (conditionCalculated) ? 'calculatedRowGrid' : 'notCalculatedRows';
                break;

            case 'productionMilled':

                var conditionCalculated =
                   ((row == 4 + 7*0 || row == 1  + 7*0|| row == 6 + 7*0) ||
                    (row == 4 + 7*1 || row == 1  + 7*1|| row == 6 + 7*1) ||
                    (row == 4 + 7*2 || row == 1  + 7*2|| row == 6 + 7*2) ||
                    (row == 4 + 7*3 || row == 1  + 7*3|| row == 6 + 7*3))

                result = (conditionCalculated) ? 'calculatedRowGrid' : 'notCalculatedRows';
                break;

            case 'areaHarvestedMilled':
                var conditionCalculated =
                   ((row == 0 + 7*0 || row == 1 + 7*0 || row == 6 + 7*0) ||
                    (row == 0 + 7*1 || row == 1  + 7*1|| row == 6 + 7*1) ||
                    (row == 0 + 7*2 || row == 1  + 7*2|| row == 6 + 7*2) ||
                    (row == 0 + 7*3 || row == 1  + 7*3|| row == 6 + 7*3))

                result = (conditionCalculated) ? 'calculatedRowGrid' : 'notCalculatedRows';
                break;
        }
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

    PaddyCreator.prototype.showAlertTotal = function () {

        ;

        if (!document.getElementById('alertTotal').firstChild) {
            $("#alertTotal").append(alertSelection)
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

    return PaddyCreator;
})