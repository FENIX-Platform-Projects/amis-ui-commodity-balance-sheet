/**
 * Created by fabrizio on 10/1/14.
 */
define(['jquery','otherUsesEditor/model/OtherModel', 'otherUsesEditor/observer/OtherObserver', 'otherUsesEditor/creator/OtherCreator'],  function($,
       OtherModel, OtherObserver,OtherEditor){

    var editorsController, observer, modelOther, editorOther, supportUtility,
        originalTotCropsModel;

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

    function OtherController(){
        observer = new OtherObserver;
        modelOther = new OtherModel;
        editorOther = new OtherEditor;
    }

    OtherController.prototype.init = function(clickedItem, itemsInvolved, codesInvolved, configurator, Utility, ControllerEditors){
        observer.init(this)
        editorsController = ControllerEditors;
        var involvedItems = $.extend(true, [], itemsInvolved);
        supportUtility = Utility;
        // take data and calculate initial formulas
        debugger;

        modelOther.createTotalValuesModel(involvedItems, supportUtility);
        var originalTotCropsModel = modelOther.getTotalValuesModel();

        editorOther.init(originalTotCropsModel, observer)
    }

    OtherController.prototype.updateTotGridOnEditing = function(rowNumber, newValue, formulaToApply, columnValue){
        /* TODO
         var formulaToUpdate
         if (formulaToApply == 'init') {
         formulaToUpdate = formulaHandler.getInitFormulaFromConf(1, 'totalValues')
         } else {
         formulaToUpdate = formulaHandler.getUpdateFormula(1, 'totalValues', formulaToApply)
         }*/
        modelOther.setOriginalTotalData(rowNumber, newValue, columnValue);
        var dataUpdated = modelOther.getTotalValuesModel()
        var modelTotalCrops = $.extend(true, [], dataUpdated)
        /* TODO
         var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate)
         var modelCalculated =  $.extend(true, [], calculatedModel);
         modelProduction.setCalculatedTotalModel(modelCalculated)
         */
        observer.closeEventsBindedToTotGrid()
        editorOther.updateTotGrid(modelTotalCrops);
        observer.applyListeners()


    }

    OtherController.prototype.updateSingleCropsGridOnEditing  = function(rowNumber, newValue, formulaToApply, columnValue){
        // TODO
    }

    OtherController.prototype.updateTotGridOnFormulaChanges = function(formulaToApply){
        // TODO

    }

    OtherController.prototype.updateSingleCropsGridOnFormulaChanges = function(formulaToApply){
        // TODO
    }

    OtherController.prototype.saveTotalValues = function(formulaToApply){
        // TODO

        console.log('OtherController: saveTotalValues')
        var dataOriginal = modelOther.getAndConvertOriginalTotValues();
        // var dataCalculated = modelOther.getCalculatedTotalModel();
        // TRUE!  editorProduction.saveDataTotGrid(dataCalculated,dataOriginal);
        console.log('dataToSave:')
        console.log(dataOriginal)
        editorsController.saveFormRiceProduction(dataOriginal,dataOriginal); // this is FALSE!! true is up
    }

    OtherController.prototype.destroyAll = function(){
        editorOther.destroyAll()
    }

    OtherController.prototype.onSwitchingCropsValues = function(formulaSingleToApply){
        // TODO
    }

    return OtherController;
})