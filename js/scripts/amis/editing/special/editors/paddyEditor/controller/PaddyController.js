define(['jquery', 'paddyEditor/model/PaddyModel', 'paddyEditor/observer/PaddyObserver', 'paddyEditor/creator/PaddyCreator',
    'paddyEditor/paddyFormula/PaddyFormulaHandler',
    "specialFormulaConf/formulaHandler/FormulaHandler"], function ($, PaddyModel, PaddyObserver, PaddyEditor, PaddyEditableHandler,FormulaHandler) {

    var editorsController, observer, modelPaddy, editorPaddy, supportUtility, originalTotCropsModel, formulaHandler, paddyEditableHandler;

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

    function PaddyController() {
        observer = new PaddyObserver;
        modelPaddy = new PaddyModel;
        editorPaddy = new PaddyEditor;
        formulaHandler = new FormulaHandler;
        paddyEditableHandler = new PaddyEditableHandler;
    }

    PaddyController.prototype.init = function (clickedItem, itemsInvolved, codesInvolved, configurator, Utility, ControllerEditors) {
        editorsController = ControllerEditors;
        var involvedItems = $.extend(true, [], itemsInvolved);
        supportUtility = Utility;
        // take data and calculate initial formulas

        modelPaddy.createTotalValuesModel(involvedItems, supportUtility);
        var originalTotCropsModel = modelPaddy.getTotalValuesModel();
        var copyOriginalModelTot = $.extend(true, [], originalTotCropsModel);

        var formulaInit = paddyEditableHandler.getFormulaFromData(copyOriginalModelTot)
        console.log('***********************************************************')
        console.log('prova FORMULA')
        console.log(formulaInit)
        console.log('***********************************************************')


        if(formulaInit == 'init') {
            var formulaTotCrops = formulaHandler.getInitFormulaFromConf(2, 'totalValues')
            if (Object.prototype.toString.call(formulaTotCrops) === '[object Array]') {
                for (var i = 0; i < formulaTotCrops.length; i++) {
                    var totalCropsCalc = formulaHandler.createFormula(copyOriginalModelTot, formulaTotCrops[i])
                    if (i != formulaTotCrops.length - 1) {
                        copyOriginalModelTot = totalCropsCalc
                    }
                }
            } else {
                var totalCropsCalc = formulaHandler.createFormula(copyOriginalModelTot, formulaTotCrops)

            }
        }else{
            var totalCropsCalc = this.changeFormulaOnTotalGrid(formulaInit,'normal');
        }

        modelPaddy.createSingleCropsModel(involvedItems, supportUtility)
        var singleCropsModel = modelPaddy.getSingleCropsModel()
        editorPaddy.init(totalCropsCalc, singleCropsModel, observer, paddyEditableHandler, formulaInit)
        observer.init(this, paddyEditableHandler, formulaInit)

    }


    PaddyController.prototype.updateTotGridOnEditing = function (rowNumber, newValue, formulaToApply, columnValue, typeOfEditing) {

        console.log('updateTOT grid on EDITIING: controller')
        var formulaToUpdate
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(2, 'totalValues')
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(2, 'totalValues', formulaToApply, typeOfEditing)
        }
        modelPaddy.setOriginalTotalData(rowNumber, newValue, columnValue);
        var dataUpdated = modelPaddy.getTotalValuesModel()
        var modelTotalCrops = $.extend(true, [], dataUpdated)

        if (Object.prototype.toString.call(formulaToUpdate) === '[object Array]') {
            for (var i = 0; i < formulaToUpdate.length; i++) {
                var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate[i])
                if (i != formulaToUpdate.length - 1) {
                    modelTotalCrops = calculatedModel
                }
            }
        } else {
            var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate)
        }

        var modelCalculated = $.extend(true, [], calculatedModel);
        modelPaddy.setCalculatedTotalModel(modelCalculated);
        editorPaddy.updateTotGrid(modelCalculated, formulaToApply);
    }

    PaddyController.prototype.reattachListeners = function () {
        observer.applyListeners()
    }

    PaddyController.prototype.updateSingleCropsGridOnEditing = function (rowNumber, newValue, formulaToApply, columnValue, typeOfEditing) {

        var formulaToUpdate;
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(2, 'singleCrops')
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(2, 'singleCrops', formulaToApply, typeOfEditing)
        }

        // set new value
        modelPaddy.setOriginalCropsData(newValue, rowNumber, columnValue)
        // get all the model
        var allData = modelPaddy.getSingleCropsModel();

        var modelSingleCrops = $.extend(true, [], allData)

        // filter data through crops number
        var dataForCrops = modelPaddy.filterModelSingleFromCrops(allData);

        // filterData through crops number
        var calculatedDataDividedCrops = []
        var numberOfCrops = modelPaddy.getCropsNumber();
        var startIndex = 0;

        for (var i = 0; i < numberOfCrops; i++) {
            var endIndex = dataForCrops.length / numberOfCrops + startIndex;
            var itemsNumber = 7;
            var copyDataForCrops = $.extend(true, [], dataForCrops)
            var modelPiece = copyDataForCrops.splice(startIndex, itemsNumber)
            var calculatedPieceOfModel = null;

            if (Object.prototype.toString.call(formulaToUpdate) === '[object Array]') {
                for (var j = 0; j < formulaToUpdate.length; j++) {
                    if (calculatedPieceOfModel == null) {
                        calculatedPieceOfModel = modelPiece;
                    }
                    calculatedPieceOfModel = formulaHandler.createFormula(calculatedPieceOfModel, formulaToUpdate[j])
                }
            } else {
                var calculatedPieceOfModel = formulaHandler.createFormula(modelPiece, formulaToUpdate)
            }
            calculatedDataDividedCrops.push(calculatedPieceOfModel);
            startIndex = parseInt(endIndex)
        }

        // insert batch into model
        var newCalculatedData = modelPaddy.createSingleCalculatedModel(calculatedDataDividedCrops, allData)

        var modelCalculated = $.extend(true, [], newCalculatedData);
        modelPaddy.setCalculatedSingleModel(modelCalculated)
        editorPaddy.updateSingleGrid(modelCalculated, formulaToApply);
    }

    PaddyController.prototype.updateTotGridOnFormulaChanges = function (formulaToApply, typeOfEditing) {
        editorPaddy.updateTotGrid(this.changeFormulaOnTotalGrid(formulaToApply,typeOfEditing), formulaToApply);
    }

    PaddyController.prototype.updateSingleCropsGridOnFormulaChanges = function (formulaToApply, typeOfEditing) {
        console.log('formulaToApply -------SINGLE------------')
        console.log(formulaToApply)
        var formulaToUpdate = formulaHandler.getUpdateFormula(2, 'singleCrops', formulaToApply, typeOfEditing)
        var dataUpdated = modelPaddy.getSingleCropsModel();
        var modelSingleCrops = $.extend(true, [], dataUpdated);
        if (Object.prototype.toString.call(formulaToUpdate) === '[object Array]') {
            for (var i = 0; i < formulaToUpdate.length; i++) {
                var calculatedModel = formulaHandler.createFormula(modelSingleCrops, formulaToUpdate[i])
                if (i != formulaToUpdate.length - 1) {
                    modelSingleCrops = calculatedModel
                }
            }
        } else {
            var calculatedModel = formulaHandler.createFormula(modelSingleCrops, formulaToUpdate)
        }
        var modelCalculated = $.extend(true, [], calculatedModel);
        modelPaddy.setCalculatedSingleModel(modelCalculated)
        editorPaddy.updateSingleGrid(calculatedModel, formulaToApply);

    }


    PaddyController.prototype.changeFormulaOnTotalGrid = function(formulaToApply, typeOfEditing){
        var formulaToUpdate = formulaHandler.getUpdateFormula(2, 'totalValues', formulaToApply, typeOfEditing)

        var dataUpdated = modelPaddy.getTotalValuesModel()
        var modelTotalCrops = $.extend(true, [], dataUpdated)

        if (Object.prototype.toString.call(formulaToUpdate) === '[object Array]') {
            for (var i = 0; i < formulaToUpdate.length; i++) {
                var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate[i])
                if (i != formulaToUpdate.length - 1) {
                    modelTotalCrops = calculatedModel
                }
            }
        } else {
            var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate)
        }

        var modelCalculated = $.extend(true, [], calculatedModel);
        modelPaddy.setCalculatedTotalModel(modelCalculated, formulaToApply)
        return modelCalculated;
    }

    PaddyController.prototype.saveTotalValues = function () {

        var dataOriginal = modelPaddy.getAndConvertOriginalTotValues();
        var dataCalculated = modelPaddy.getCalculatedTotalModel();
        editorsController.saveFormRiceProduction(dataCalculated, dataOriginal); // this is FALSE!! true is up
    }

    PaddyController.prototype.onSwitchingCropsValues = function (formulaTotToApply) {
        var originalSingleCropsModel = modelPaddy.getSingleCropsModel()
        var dataSingleCrops = $.extend(true, [], originalSingleCropsModel)

        var dataUnified = modelPaddy.unifySingleCropsData(dataSingleCrops);

        var totalValueModel = $.extend(true, [], modelPaddy.getTotalValuesModel());
        for (var i = 0; i < dataUnified.length; i++) {
            for (var j = 0; j < totalValueModel.length; j++) {
                if (totalValueModel[j][0] == dataUnified[i][0]) {
                    modelPaddy.setOriginalTotalData(j, dataUnified[i][3], 3)
                }
            }
        }

        if (formulaTotToApply == 'init') {
            formulaTotToApply = 'milled'
        }
        console.log('formulaSingleToApply')

        observer.setTotalValuesOnModified()

        this.updateTotGridOnFormulaChanges(formulaTotToApply, "normal")
    }

    PaddyController.prototype.onSwitchingSimpleTotal = function (formulaToApplyTot) {
        this.updateTotGridOnFormulaChanges(formulaToApplyTot, "normal")

    }

    PaddyController.prototype.onSwitchingSimpleSingle = function (formulaToApplySingle) {
        this.updateSingleCropsGridOnFormulaChanges(formulaToApplySingle, "normal")

    }

    PaddyController.prototype.destroyAll = function () {
        editorPaddy.destroyAll();
    }

    PaddyController.prototype.showAlerts = function (isTotal) {
        console.log('controller.showalerts!!!!!!!!!!')
            debugger;
       (isTotal)? editorPaddy.showAlert('alertTotal') : editorPaddy.showAlert('alertSingle');
    }

    PaddyController.prototype.deleteAlerts = function (isTotal) {
        editorPaddy.cancelAlerts(isTotal);
    }

    PaddyController.prototype.onChangeFormulaWithRadio = function (oldFormula) {

        var result;
        switch (true) {
            case (oldFormula == 'productionPaddy'):
                result = 'productionMilled';
                break;
            case (oldFormula == 'areaHarvestedPaddy'):
                result = 'areaHarvestedMilled';
                break;
            case (oldFormula == 'yieldPaddy'):
                result = 'milled';
                break;
            case (oldFormula == 'productionMilled'):
                result = 'productionPaddy';
                break;
            case (oldFormula == 'areaHarvestedMilled'):
                result = 'areaHarvestedPaddy';
                break;
            case (oldFormula == 'milled' || oldFormula == 'init' ):
                result = 'yieldPaddy';
                break;
        }
        return result;

    }

    PaddyController.prototype.onChangeKindOfRice = function (formulaToApply, isMilledSelected, isTotalSection) {

        (isTotalSection) ? this.updateTotGridOnFormulaChanges(formulaToApply, "normal") : this.updateSingleCropsGridOnFormulaChanges(formulaToApply, "normal");
        editorPaddy.changeLabelToElements(isMilledSelected, isTotalSection)

    }

    return PaddyController;
})