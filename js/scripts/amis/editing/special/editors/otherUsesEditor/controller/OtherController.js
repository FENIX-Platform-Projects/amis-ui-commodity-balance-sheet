/**
 * Created by fabrizio on 10/1/14.
 */
define(['jquery', 'otherUsesEditor/model/OtherModel', 'otherUsesEditor/observer/OtherObserver', 'otherUsesEditor/creator/OtherCreator',
        "specialFormulaConf/formulaHandler/FormulaHandler"],
    function ($, OtherModel, OtherObserver, OtherEditor, FormulaHandler) {

        var editorsController, observer, modelOther, editorOther, supportUtility,
            originalTotCropsModel, formulaHandler;

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

        function OtherController() {
            observer = new OtherObserver;
            modelOther = new OtherModel;
            editorOther = new OtherEditor;
            formulaHandler = new FormulaHandler
        }

        OtherController.prototype.init = function (clickedItem, itemsInvolved, codesInvolved, configurator, Utility, ControllerEditors) {

            editorsController = ControllerEditors;
            var involvedItems = $.extend(true, [], itemsInvolved);
            supportUtility = Utility;
            // take data and calculate initial formulas

            modelOther.createTotalValuesModel(involvedItems, supportUtility);
            var originalTotCropsModel = modelOther.getTotalValuesModel();

            editorOther.init(originalTotCropsModel, observer)
            observer.init(this)
        }

        OtherController.prototype.simpleUpdateOnEditing = function (rowNumber, newValue, formulaToApply, columnValue) {
            modelOther.setOriginalTotalData(rowNumber, newValue, columnValue);
        }

        OtherController.prototype.updateTotGridOnEditing = function (rowNumber, newValue, formulaToApply, columnValue) {

            switch (rowNumber) {
                case 0:
                    // Direct Editing
                    modelOther.setOriginalTotalData(rowNumber, newValue, columnValue);
                    var dataUpdated = modelOther.getTotalValuesModel()
                    break;
                case 1:
                case 2:
                case 3:
                    // Other Uses
                    modelOther.deleteOtherUsesIfExists();
                    modelOther.setOriginalTotalData(rowNumber, newValue, columnValue)
                    var model = modelOther.getTotalValuesModel()

                    if (this.containsValuesFormula(rowNumber, 1, model)) {
                        this.applyFormula(1, model)
                    }
                    var dataUpdated = modelOther.getTotalValuesModel()
                    break;

                default :
                    // Industrial Uses
                    modelOther.deleteIndustrialUsesIfExists();
                    modelOther.setOriginalTotalData(rowNumber, newValue, columnValue)
                    var model = modelOther.getTotalValuesModel()

                    if (this.containsValuesFormula(rowNumber, 2, model)) {
                        this.applyFormula(2, model)
                        if (this.containsValuesFormula(rowNumber, 1, model))
                            this.applyFormula(1, model)
                    } else {
                        modelOther.setOriginalTotalData(rowNumber, newValue, columnValue)
                    }
                    var dataUpdated = modelOther.getTotalValuesModel()
                    break;

            }
            observer.closeEventsBindedToTotGrid()
            var grid = editorOther.updateTotGrid(dataUpdated);
            observer.applyListeners(grid)
        }

        OtherController.prototype.containsValuesFormula = function (rowNumber, numberFormula, model) {
            var result = true;
            if (numberFormula === 1) {
                for (var i = 1; i < 4 && result; i++) {
                    result = (!isNaN(model[i][3]) && model[i][3] != null && model[i][3] != "")
                }
            }
            else {
                for (var i = 4; i < model.length && result; i++) {
                    result = (!isNaN(model[i][3]) && model[i][3] != null && model[i][3] != "")
                }
            }
            return result
        }

        OtherController.prototype.applyFormula = function (number, model) {

            switch (number) {
                case 1:
                    // O Uses
                    var sum = 0, indexSum
                    for (var i = 0, length = model.length; i < length; i++) {
                        if (model[i][0] == 15) {
                            indexSum = i;
                        }
                        else if (model[i][0] == 21 || model[i][0] == 34 || model[i][0] == 28) {
                            sum += model[i][3]
                        }
                    }
                    modelOther.setOriginalModelValueFromIndex(indexSum, sum, true)
                    break;
                case 2:
                    // Industrial USes
                    var sum = 0, indexSum
                    for (var i = 0, length = model.length; i < length; i++) {
                        if (model[i][0] == 28) {
                            indexSum = i;
                        }
                        else if (model[i][0] == 29 || model[i][0] == 30 || model[i][0] == 31 || model[i][0] == 32 || model[i][0] == 33) {
                            sum += model[i][3]
                        }
                    }
                    modelOther.setOriginalModelValueFromIndex(indexSum, sum, false)
                    break;
                default :
                    break;
            }

        }

        OtherController.prototype.sendToObs =function(rowId){
            editorOther.changeRow(rowId);
        }

        OtherController.prototype.saveTotalValues = function (formulaToApply) {
            var dataOriginal = modelOther.getAndConvertOriginalTotValues();
            this.destroyModal()
            editorsController.saveFormOtherUses(dataOriginal, dataOriginal); // this is FALSE!! true is up
        }

        OtherController.prototype.destroyAll = function () {
            editorOther.destroyAll()
        }

        OtherController.prototype.destroyModal = function(){
            editorOther.destroyAll()

            editorOther.destroyIfExistOtherModalOtherUses();

            var root = document.getElementsByTagName( 'html' )[0]; // '0' to assign the first (and only `HTML` tag)

            root.setAttribute( "class", "settingOverflow" );
        }


        return OtherController;
    })