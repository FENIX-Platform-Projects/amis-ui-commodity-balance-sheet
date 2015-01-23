/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "productionEditor/observer/ProductionObserver",
        "productionEditor/model/ProductionModel", "specialFormulaConf/formulaHandler/FormulaHandler",
        "productionEditor/controller/ProductionController", "text!productionEditor/view/_productionForm.html", "flagTranslator/controller/FlagController",
        "text!productionEditor/view/_alertSelection.html", "productionEditor/formulaHandler/ProductionFormulaHandler","select2"],
    function ($, Formatter, Observer, ModelProduction, FormulaHandler, Controller, HTLMProduction, FlagController, AlertSelection, ProductionHandler) {


        // ---------------------- SUPPORT FUNCTIONS -------------------------------------------

        Element.prototype.remove = function () {
            this.parentElement.removeChild(this);
        }

        NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
            for (var i = 0, len = this.length; i < len; i++) {
                if (this[i] && this[i].parentElement) {
                    this[i].parentElement.removeChild(this[i]);
                }
            }
        }
        // ------------------------------------------------------------------------------------


        var observer, modelProduction, supportUtility, formulaHandler, originalTotCropsModel, productionController, controllerEditors,
            flagController, modal, formulaToRenderTotVal, formulaToRenderSingleCrops, areaHarvSelected, callbackStyleTotGrid, callbackStyleSingleGrid,
            that, callbackMultiFlagCreation, callbackMultiFlagInit, callbackMultiFlagGetValues, alertSelection, productionHandler


        function ProductionEditor() {
            that = this;
            alertSelection = AlertSelection
            observer = new Observer;
            modelProduction = new ModelProduction;
            formulaHandler = new FormulaHandler;
            productionController = new Controller;
            flagController = new FlagController;
            productionHandler = new ProductionHandler;
            modal = HTLMProduction
            areaHarvSelected = true;

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

        ProductionEditor.prototype.init = function (clickedItem, itemsInvolved, codesInvolved, configurator, Utility, ControllerEditors) {
            this.destroyIfExistOtherModal();

            controllerEditors = ControllerEditors;

            var involvedItems = $.extend(true, [], itemsInvolved);
            supportUtility = Utility;

            // take data and calculate initial formulas
            originalTotCropsModel = modelProduction.getTotalCropsModel(involvedItems, supportUtility);

            var formulaTotInit = productionHandler.getFormulaFromData(originalTotCropsModel);

            console.log('**********************************************************')
            console.log('TThe formula tot init is:')
            console.log('is AreaHarvested slected: '+formulaTotInit['isAreaHarvSelected'])
            console.log('formula tot init : '+formulaTotInit['formulaInit'])
            console.log('**********************************************************')

            formulaToRenderTotVal = formulaTotInit['formulaInit'];
            productionController.init(this, formulaHandler, modelProduction)

            var typeOfTotGridInit = (formulaTotInit['isAreaHarvSelected'])? 'totalValues': 'totalValuesAPlanted';

            var totalCropsCalc = productionController.createModelCalculatedTotalGrid( formulaToRenderTotVal,typeOfTotGridInit);


            /*
            var formulaTotCrops = formulaHandler.getInitFormulaFromConf(1, 'totalValues')
            var totalCropsCalc = formulaHandler.createFormula(copyOriginalModelTot, formulaTotCrops)
            */

            var singleCropsModel = modelProduction.getSingleCropsModel(involvedItems, supportUtility);
            var copyOriginalModelSingle = $.extend(true, [], singleCropsModel);

            formulaToRenderSingleCrops = 'init'


            $("#pivotGrid").append(modal);

            $("#specialForm").modal({
                backdrop: 'static',
                keyboard: false});

            this.initAllCheckBoxes(formulaToRenderTotVal,formulaTotInit['isAreaHarvSelected']);
            this.changeLabelToArea(formulaTotInit['isAreaHarvSelected'],true);

            this.createAndDrawGrid( this.setDataForGrid(totalCropsCalc,true),   "gridTotalValues") ;
            this.createAndDrawGrid( this.setDataForGrid(copyOriginalModelSingle,false), "gridSingleCrops");

            observer.applyListeners(this, productionController, formulaToRenderTotVal, formulaTotInit['isAreaHarvSelected'])

        }

        ProductionEditor.prototype.updateTotGrid = function (calculatedModel, formulaToApply, isAreaHarv) {
            areaHarvSelected = isAreaHarv

            formulaToRenderTotVal = formulaToApply

            observer.unbindEventsFromTotalValues()

            this.createAndDrawGrid( this.setDataForGrid(calculatedModel,true),   "gridTotalValues") ;

            observer.reBindEventsFromTotalValues()
        }

        ProductionEditor.prototype.updateSingleGrid = function (calculatedModel, formulaToApply, isAreaHarv) {
            areaHarvSelected = isAreaHarv

            formulaToRenderSingleCrops = formulaToApply

            this.createAndDrawGrid( this.setDataForGrid(calculatedModel,false), "gridSingleCrops");

        }

        ProductionEditor.prototype.saveDataTotGrid = function (dataCalculated, originalData) {
            console.log(dataCalculated)
            console.log(originalData)
            controllerEditors.saveFormProduction(dataCalculated, originalData);
        }

        ProductionEditor.prototype.setTotalValuesOnModified = function () {
            observer.setTotalValuesModified();
        }

        ProductionEditor.prototype.destroyAll = function () {
            $('#gridTotalValues').jqxGrid('destroy')
            $('#gridSingleCrops').jqxGrid('destroy');

            $('#firstCheckBoxTotVal').jqxCheckBox('destroy');
            $('#secondCheckBoxTotVal').jqxCheckBox('destroy');
            $('#thirdCheckBoxTotVal').jqxCheckBox('destroy');

            $('#firstCheckBoxSingleCrops').jqxCheckBox('destroy');
            $('#secondCheckBoxSingleCrops').jqxCheckBox('destroy');
            $('#thirdCheckBoxSingleCrops').jqxCheckBox('destroy');

            $('#radioBtnAreaHarv').jqxRadioButton('destroy');
            $('#radioBtnAreaPlanted').jqxRadioButton('destroy');

            $('#radioBtnAreaHarvSingleCrops').jqxRadioButton('destroy');
            $('#radioBtnAreaPltdSingleCrops').jqxRadioButton('destroy');



            var f = document.getElementById("specialForm");
            f.modal('hide')

            if (f && f !== null) {
                f.remove()
            }

        }

        ProductionEditor.prototype.changeLabelToArea = function (isAreaHarvested, isTotalValue) {

            var idLabel = (isTotalValue) ? "secondCheckBoxTotValLabel" : "secondCheckBoxSingCropsLabel";

            areaHarvSelected = isAreaHarvested

            var areaLabel = (isAreaHarvested) ? "Area Harvested" : "Area Planted";
            $("#" + idLabel).html(areaLabel)
        }

        ProductionEditor.prototype.createStyleClassGridTotal = function (row, column, value, data) {

            var result;
            var conditionDisable = ((row === 0 && !areaHarvSelected) || ((row == 3 && areaHarvSelected)) ||
                ((row === 0 + (4 * 1) && !areaHarvSelected) || ((row == 3 + (4 * 1) && areaHarvSelected))) ||
                ((row === 0 + (4 * 2) && !areaHarvSelected) || ((row == 3 + (4 * 2) && areaHarvSelected))));


            switch (formulaToRenderTotVal) {
                case 'init':
                case 'yield':
                    var conditionCalculated = ((row == 1) || row == 1 + (4 * 1) || row == 1 + (4 * 2))
                    if (conditionCalculated) {
                        result = 'calculatedRowGrid'
                    } // area harvested disabled
                    else if (conditionDisable) {
                        result = 'areaDisabled';
                    }
                    else {
                        result = 'notCalculatedRows'
                    }
                    break;
                case 'areaHarvested':
                    var conditionCalculated = ((row == 0 && areaHarvSelected) || (row == 3 && !areaHarvSelected) ||
                        (row == 0 + 4 * 1 && areaHarvSelected) || (row == 3 + 4 * 1 && !areaHarvSelected) ||
                        (row == 0 + 4 * 2 && areaHarvSelected) || (row == 3 + 4 * 2 && !areaHarvSelected))

                    if (conditionCalculated) {
                        result = 'calculatedRowGrid'
                    }
                    else if (conditionDisable) {
                        result = 'areaDisabled';
                    } else {
                        result = 'notCalculatedRows'
                    }
                    break;

                case 'production':
                    var conditionCalculated = (row == 2 || row == 2 + 4 * 1 || row == 2 + 4 * 1)

                    if (conditionCalculated) {
                        result = 'calculatedRowGrid';
                    }
                    else if (conditionDisable) {
                        result = 'areaDisabled';
                    }
                    else {
                        result = 'notCalculatedRows'
                    }

                    break;
            }
            return result;
        }

        ProductionEditor.prototype.createStyleClassGridSingle = function (row, column, value, data) {

            var result;
            var conditionDisable = ((row === 0 && !areaHarvSelected) || ((row == 3 && areaHarvSelected)) ||
                ((row === 0 + (4 * 1) && !areaHarvSelected) || ((row == 3 + (4 * 1) && areaHarvSelected))) ||
                ((row === 0 + (4 * 2) && !areaHarvSelected) || ((row == 3 + (4 * 2) && areaHarvSelected))));


            switch (formulaToRenderSingleCrops) {
                case 'init':
                case 'yield':
                    var conditionCalculated = ((row == 1) || row == 1 + (4 * 1) || row == 1 + (4 * 2) || row == 1 + (4 * 3) )
                    if (conditionCalculated) {
                        result = 'calculatedRowGrid'
                    } // area harvested disabled
                    else if (conditionDisable) {
                        result = 'areaDisabled';
                    }
                    else {
                        result = 'notCalculatedRows'
                    }
                    break;
                case 'areaHarvested':
                    var conditionCalculated = ((row == 0 && areaHarvSelected) || (row == 3 && !areaHarvSelected) ||
                        (row == 0 + 4 * 1 && areaHarvSelected) || (row == 3 + 4 * 1 && !areaHarvSelected) ||
                        (row == 0 + 4 * 2 && areaHarvSelected) || (row == 3 + 4 * 2 && !areaHarvSelected))

                    if (conditionCalculated) {
                        result = 'calculatedRowGrid'
                    }
                    else if (conditionDisable) {
                        result = 'areaDisabled';
                    } else {
                        result = 'notCalculatedRows'
                    }
                    break;

                case 'production':
                    var conditionCalculated = (row == 2 || row == 2 + 4 * 1 || row == 2 + 4 * 1)

                    if (conditionCalculated) {
                        result = 'calculatedRowGrid';
                    }
                    else if (conditionDisable) {
                        result = 'areaDisabled';
                    }
                    else {
                        result = 'notCalculatedRows'
                    }

                    break;
            }
            return result;

        }

        ProductionEditor.prototype.createMultiFlagEditor = function (row, cellValue, editor, cellText, width, height) {
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

        ProductionEditor.prototype.createMultiFlagInit = function (row, cellValue, editor, cellText, width, height) {
            $('#multiFlag').select2({placeholder: "Click to select the flags"});
        }

        ProductionEditor.prototype.getFromMultiFlag = function (row, cellValue, editor) {
            var codes = $('#multiFlag').select2("val");
            return  flagController.getStringFromCodes(codes);
        }

        ProductionEditor.prototype.showAlertTotal = function () {

            if (!document.getElementById('alertTotal').firstChild) {
                $("#alertTotal").append(alertSelection)
            }
        }

        ProductionEditor.prototype.showAlertSingle = function () {
            if (!document.getElementById('alertSingle').firstChild) {
                $("#alertSingle").append(alertSelection)
            }
        }

        ProductionEditor.prototype.cancelAlerts = function (isTotal) {
            var myNode = (isTotal) ? document.getElementById('alertTotal') : document.getElementById('alertSingle');
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }

        }

        ProductionEditor.prototype.initAllCheckBoxes = function(formulaToApply, isAreaHarvSelected){


            $('#radioBtnAreaHarv').jqxRadioButton({ width: 120, height: 25, groupName: "totValueBtn"});
            $('#radioBtnAreaPlanted').jqxRadioButton({ width: 120, groupName: "totValueBtn", height: 25 });

            $('#firstCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25});
            $('#secondCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25});
            $('#thirdCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25 });




            $('#radioBtnAreaHarvSingleCrops').jqxRadioButton({ width: 120, height: 25, groupName: "singleCropsBtn", checked: true });
            $('#radioBtnAreaPltdSingleCrops').jqxRadioButton({ width: 120, height: 25, groupName: "singleCropsBtn"});

            $('#firstCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#secondCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#thirdCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, disabled: true });

            var checkBoxToEnable = {}
            var checkBoxToDisable = {}


            switch (formulaToApply){

                case 'init':

                    checkBoxToEnable['firstCheckBoxTotVal'] = true
                    checkBoxToEnable['secondCheckBoxTotVal'] = true
                    checkBoxToDisable['thirdCheckBoxTotVal'] = true
                    break;

                case 'areaHarvested':

                    checkBoxToEnable['firstCheckBoxTotVal'] = true
                    checkBoxToEnable['thirdCheckBoxTotVal'] = true
                    checkBoxToDisable['secondCheckBoxTotVal'] = true

                    break;

                case 'production':

                    checkBoxToEnable['secondCheckBoxTotVal'] = true
                    checkBoxToEnable['thirdCheckBoxTotVal'] = true
                    checkBoxToDisable['firstCheckBoxTotVal'] = true

                    break;

                case 'yiled':

                    checkBoxToEnable['firstCheckBoxTotVal'] = true
                    checkBoxToEnable['secondCheckBoxTotVal'] = true
                    checkBoxToDisable['thirdCheckBoxTotVal'] = true
                    break;
            }

            (isAreaHarvSelected)?  $('#radioBtnAreaHarv').jqxRadioButton('check'):   $('#radioBtnAreaPlanted').jqxRadioButton('check');

            debugger;

            for(var key in checkBoxToEnable ){
                $('#'+key).jqxCheckBox('check');
            }

            for(var key in checkBoxToDisable ){
                $('#'+key).jqxCheckBox('disable');
            }

            /*

            $('#firstCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#secondCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#thirdCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, disabled: true });


            $('#firstCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#secondCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#thirdCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, disabled: true });

            $('#radioBtnAreaHarv').jqxRadioButton({ width: 120, height: 25, groupName: "totValueBtn", checked: true });
            $('#radioBtnAreaPlanted').jqxRadioButton({ width: 120, groupName: "totValueBtn", height: 25 });

            $('#radioBtnAreaHarvSingleCrops').jqxRadioButton({ width: 120, height: 25, groupName: "singleCropsBtn", checked: true });
            $('#radioBtnAreaPltdSingleCrops').jqxRadioButton({ width: 120, height: 25, groupName: "singleCropsBtn"});

            */


        }

        ProductionEditor.prototype.createAndDrawGrid = function(dataAdapter, idContainer  ){

            var columns =this.createColumnsForGrid(idContainer);

            $('#'+idContainer).jqxGrid({
                source: dataAdapter,
                width: "100%",
                editable: true,
                rowsheight: 40,
                selectionmode: 'singlecell',
                pageable: false,
                autoheight: true,
                columns: columns
            });

        }


        ProductionEditor.prototype.createColumnsForGrid = function(idContainer){

            var columns = (idContainer == "gridTotalValues")?
                [
                    { text: 'Element', datafield: 6, cellclassname: callbackStyleTotGrid, width: '25%' },
                    { text: 'Value', datafield: 3, cellclassname: callbackStyleTotGrid, width: '15%'},
                    { text: 'Flags', datafield: 4, cellclassname: callbackStyleTotGrid, width: '25%',
                        createeditor: callbackMultiFlagCreation, initeditor: callbackMultiFlagInit, geteditorvalue: callbackMultiFlagGetValues, heigth: 250
                    },
                    { text: 'Notes', datafield: 5, cellclassname: callbackStyleTotGrid, width: '35%'}
                ]:
                [
                    { text: 'Element', datafield: 6, cellclassname: callbackStyleSingleGrid, width: '40%' },
                    { text: 'Crop', datafield: 7, cellclassname: callbackStyleSingleGrid, width: '20%' },
                    { text: 'Value', datafield: 3, cellclassname: callbackStyleSingleGrid, width: '30%' },
                    { text: 'Flag', datafield: 4, cellclassname: callbackStyleSingleGrid, width: '10%' }
                ]

            return columns;
        }


        ProductionEditor.prototype.setDataForGrid = function(data, isTotalModel){


            var dataField = (isTotalModel)?
                [
                    { name: 6, type: 'string' },
                    { name: 3, type: 'float' },
                    { name: 4, type: 'string'},
                    {name: 5, type: 'string'}
                ]:
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
                id: 'grid'+isTotalModel,
                localdata: data
            };


            return new $.jqx.dataAdapter(source);
        }

        ProductionEditor.prototype.destroyIfExistOtherModal = function(){
            $('#specialForm').modal('hide');

            var g = document.getElementById("specialForm");

            if (g && g !== null) {
                g.remove()
            }

            debugger;

            $('#dialogForm').modal('hide');


            var f =  $('#closeModalFormTotal');
            if(f) {
                $('#closeModalFormTotal').click();
            }

            var f = document.getElementById("dialogForm");

            if (f && f !== null) {
                f.remove()
            }
        }



        return ProductionEditor;
    })