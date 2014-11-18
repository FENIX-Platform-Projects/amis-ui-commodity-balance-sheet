/**
 * Created by fabrizio on 9/30/14.
 */
define(['jquery','paddyEditor/model/PaddyModel', 'paddyEditor/observer/PaddyObserver', 'paddyEditor/creator/PaddyCreator',
    "specialFormulaConf/formulaHandler/FormulaHandler"],  function($,
    PaddyModel, PaddyObserver,PaddyEditor, FormulaHandler){

    var editorsController, observer, modelPaddy, editorPaddy, supportUtility,originalTotCropsModel, formulaHandler;

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

    function PaddyController(){
        observer = new PaddyObserver;
        modelPaddy = new PaddyModel;
        editorPaddy = new PaddyEditor;
        formulaHandler = new FormulaHandler;
    }

    PaddyController.prototype.init = function(clickedItem, itemsInvolved, codesInvolved, configurator, Utility, ControllerEditors){
        observer.init(this)
        editorsController = ControllerEditors;
        var involvedItems = $.extend(true, [], itemsInvolved);
        supportUtility = Utility;
        // take data and calculate initial formulas

        modelPaddy.createTotalValuesModel(involvedItems, supportUtility);
        var originalTotCropsModel = modelPaddy.getTotalValuesModel();
        var copyOriginalModelTot = $.extend(true, [], originalTotCropsModel);

        var formulaTotCrops = formulaHandler.getInitFormulaFromConf(2, 'totalValues')
        if( Object.prototype.toString.call( formulaTotCrops ) === '[object Array]' ) {
            for (var i = 0; i < formulaTotCrops.length; i++) {
                var totalCropsCalc = formulaHandler.createFormula(copyOriginalModelTot, formulaTotCrops[i])
                if (i != formulaTotCrops.length - 1) {
                    copyOriginalModelTot = totalCropsCalc
                }
            }
        }else{
            var totalCropsCalc = formulaHandler.createFormula(copyOriginalModelTot, formulaTotCrops)
        }

        modelPaddy.createSingleCropsModel(involvedItems, supportUtility)
        var singleCropsModel = modelPaddy.getSingleCropsModel()
        editorPaddy.init(totalCropsCalc, singleCropsModel, observer)
    }

    PaddyController.prototype.selectSpecialEditing = function(formulaToApplyTot, numberOfRow){

        var result;
        if(formulaToApplyTot == 'milled'){
            switch (numberOfRow) {
                case 3 :
                    result = 'yieldChange'
                    break;
                default :
                    result = 'normal'
                    break;
            }
        }
        else if(formulaToApplyTot == 'areaHarvested'){
            switch (numberOfRow) {
                case 4:
                    result = 'productionChange'
                    break;

                default :
                    result = 'normal'
                    break;
            }

        }else if (formulaToApplyTot == 'yield'){
            switch (numberOfRow) {
                case 2:
                    result = 'extractionRateChange'
                    break;
                default :
                    result = 'normal'
                    break;
            }
        }
        else if (formulaToApplyTot == 'productionMilled'){
            switch (numberOfRow) {
                case 2:
                    result = 'extractionRateChange'
                    break;
                default :
                    result = 'normal'
                    break;
            }
        }
        return result;


    }

    PaddyController.prototype.updateTotGridOnEditing = function(rowNumber, newValue, formulaToApply, columnValue, typeOfEditing){
        var formulaToUpdate
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(2, 'totalValues')
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(2, 'totalValues', formulaToApply, typeOfEditing)
        }
        modelPaddy.setOriginalTotalData(rowNumber, newValue, columnValue);
        var dataUpdated = modelPaddy.getTotalValuesModel()
        var modelTotalCrops = $.extend(true, [], dataUpdated)

        if( Object.prototype.toString.call( formulaToUpdate ) === '[object Array]' ) {
            for (var i = 0; i < formulaToUpdate.length; i++) {
                debugger;
                var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate[i])
                if (i != formulaToUpdate.length - 1) {
                    modelTotalCrops = calculatedModel
                }
            }
        }else{
            var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate)
        }

        var modelCalculated =  $.extend(true, [], calculatedModel);
        modelPaddy.setCalculatedTotalModel(modelCalculated);
        editorPaddy.updateTotGrid(modelCalculated, formulaToApply);
    }

    PaddyController.prototype.reattachListeners = function(){
        observer.applyListeners()
    }

    PaddyController.prototype.updateSingleCropsGridOnEditing  = function(rowNumber, newValue, formulaToApply, columnValue, typeOfEditing){

        var formulaToUpdate;
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(2, 'singleCrops')
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(2, 'singleCrops', formulaToApply, typeOfEditing)
        }

        // set new value
        modelPaddy.setOriginalCropsData(newValue, rowNumber,columnValue )
        // get all the model
        var allData = modelPaddy.getSingleCropsModel();

        var modelSingleCrops = $.extend(true, [], allData)

        // filter data through crops number
        var dataForCrops = modelPaddy.filterModelSingleFromCrops( allData);

        // filterData through crops number
        var calculatedDataDividedCrops = []
        var numberOfCrops  =modelPaddy.getCropsNumber();
        var startIndex=  0;
        for( var i =0; i< numberOfCrops; i++){
            var endIndex = dataForCrops.length/numberOfCrops +startIndex ;
            var copyDataForCrops = $.extend(true,[],dataForCrops)
            var modelPiece = copyDataForCrops.splice(startIndex, endIndex)

            if( Object.prototype.toString.call( formulaToUpdate ) === '[object Array]' ) {
                for (var i = 0; i < formulaToUpdate.length; i++) {
                    var calculatedPieceOfModel = formulaHandler.createFormula(modelPiece, formulaToUpdate[i])
                    if (i != formulaToUpdate.length - 1) {
                        modelPiece = calculatedPieceOfModel
                    }
                }
            }else{
                var calculatedPieceOfModel = formulaHandler.createFormula(modelPiece, formulaToUpdate)
            }
            calculatedDataDividedCrops.push(calculatedPieceOfModel);
            startIndex = parseInt(endIndex)
        }

        // insert batch into model
        var newCalculatedData = modelPaddy.createSingleCalculatedModel(calculatedDataDividedCrops)

        var modelCalculated =  $.extend(true, [], newCalculatedData);
        modelPaddy.setCalculatedSingleModel(modelCalculated)
        editorPaddy.updateSingleGrid(modelCalculated, formulaToApply);
    }

    PaddyController.prototype.updateTotGridOnFormulaChanges = function(formulaToApply, typeOfEditing){
        var formulaToUpdate = formulaHandler.getUpdateFormula(2, 'totalValues', formulaToApply, typeOfEditing)

        var dataUpdated = modelPaddy.getTotalValuesModel()
        var modelTotalCrops = $.extend(true, [], dataUpdated)

        if( Object.prototype.toString.call( formulaToUpdate ) === '[object Array]' ) {
            for (var i = 0; i < formulaToUpdate.length; i++) {
                var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate[i])
                if (i != formulaToUpdate.length - 1) {
                    modelTotalCrops = calculatedModel
                }
            }
        }else{
            var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate)
        }

        var modelCalculated =  $.extend(true, [], calculatedModel);
        modelPaddy.setCalculatedTotalModel(modelCalculated)
        editorPaddy.updateTotGrid(calculatedModel, formulaToApply);

    }

    PaddyController.prototype.updateSingleCropsGridOnFormulaChanges = function(formulaToApply, typeOfEditing){
        console.log('formulaToApply -------SINGLE------------')
        console.log(formulaToApply)
        debugger;
        var formulaToUpdate = formulaHandler.getUpdateFormula(2, 'singleCrops', formulaToApply, typeOfEditing)
        var dataUpdated = modelPaddy.getSingleCropsModel();
        var modelSingleCrops = $.extend(true, [], dataUpdated);
        if( Object.prototype.toString.call( formulaToUpdate ) === '[object Array]' ) {
            for (var i = 0; i < formulaToUpdate.length; i++) {
                var calculatedModel = formulaHandler.createFormula(modelSingleCrops, formulaToUpdate[i])
                if (i != formulaToUpdate.length - 1) {
                    modelSingleCrops = calculatedModel
                }
            }
        }else{
            var calculatedModel = formulaHandler.createFormula(modelSingleCrops, formulaToUpdate)
        }
        var modelCalculated =  $.extend(true, [], calculatedModel);
        modelPaddy.setCalculatedSingleModel(modelCalculated)
        editorPaddy.updateSingleGrid(calculatedModel, formulaToApply);

    }

    PaddyController.prototype.saveTotalValues = function(formulaToApply){

       var dataOriginal = modelPaddy.getAndConvertOriginalTotValues();
       var dataCalculated = modelPaddy.getCalculatedTotalModel();
        debugger;

       editorsController.saveFormRiceProduction(dataCalculated,dataOriginal); // this is FALSE!! true is up
    }

    PaddyController.prototype.onSwitchingCropsValues = function(formulaTotToApply){
        var originalSingleCropsModel = modelPaddy.getSingleCropsModel()
        var dataSingleCrops = $.extend(true, [], originalSingleCropsModel)

        var dataUnified = modelPaddy.unifySingleCropsData(dataSingleCrops);

        var totalValueModel = $.extend(true, [],modelPaddy.getTotalValuesModel());
        var rowIndexes = [];
        for(var i =0; i<dataUnified.length; i++) {
            for(var j=0; j<totalValueModel.length; j++) {
                if (totalValueModel[j][0] == dataUnified[i][0]) {
                    modelPaddy.setOriginalTotalData(j, dataUnified[i][3], 3)
                }
            }
        }

        if(formulaTotToApply == 'init'){
            formulaTotToApply = 'milled'
        }
        console.log('formulaSingleToApply')

        observer.setTotalValuesOnModified()

        this.updateTotGridOnFormulaChanges(formulaTotToApply, "normal")
    }

    PaddyController.prototype.onSwitchingSimple = function(formulaToApplySingle){

    }

    PaddyController.prototype.destroyAll = function(){
        editorPaddy.destroyAll();
    }

    return PaddyController;
})