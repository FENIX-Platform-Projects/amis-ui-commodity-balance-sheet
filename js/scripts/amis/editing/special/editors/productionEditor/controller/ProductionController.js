/**
 * Created by fabrizio on 9/24/14.
 */
define(['jquery'], function ($) {

    var formulaHandler, editorProduction, modelProduction, isAreaHarvestedSelectedTot, isAreaHarvestedSelectedSingle

    function ProductionController() {
    };

    ProductionController.prototype.init = function (EditorProduction, HandlerFormulas, ModelProduction) {
        formulaHandler = HandlerFormulas;
        editorProduction = EditorProduction;
        modelProduction = ModelProduction;
        isAreaHarvestedSelectedTot = true;
        isAreaHarvestedSelectedSingle = true;

    }

    ProductionController.prototype.updateTotGridOnEditing = function (rowNumber, newValue, formulaToApply, columnValue, isAreaHarvested) {

        var typeofTotalValue = (isAreaHarvested) ? 'totalValues' : 'totalValuesAPlanted';
        isAreaHarvestedSelectedTot = isAreaHarvested;

        var formulaToUpdate
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(1, typeofTotalValue)
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(1, typeofTotalValue, formulaToApply)
        }

        modelProduction.setOriginalData(rowNumber, newValue, columnValue);
        var dataUpdated = modelProduction.getOriginalTotalCropsModel()
        var modelTotalCrops = $.extend(true, [], dataUpdated)

        var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate)
        var modelCalculated = $.extend(true, [], calculatedModel);
        modelProduction.setCalculatedTotalModel(modelCalculated)
        editorProduction.updateTotGrid(calculatedModel, formulaToApply, isAreaHarvestedSelectedTot);

    }

    ProductionController.prototype.updateSingleCropsGridOnEditing = function (rowNumber, newValue, formulaToApply, columnValue, isAreaHarvested) {

        var typeofSingleValue = (isAreaHarvested) ? 'singleCrops' : 'singleCropsAPlanted';
        isAreaHarvestedSelectedSingle = isAreaHarvested;

        var formulaToUpdate;
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(1, typeofSingleValue)
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(1, typeofSingleValue, formulaToApply)
        }
        // set new value
        modelProduction.setOriginalCropsData(newValue, rowNumber, columnValue)
        // get all the model
        var allData = modelProduction.getOriginalSingleCropsModel();

        var modelSingleCrops = $.extend(true, [], allData)

        // create an array of array of data, divided by the crops number
        var dataForCrops = modelProduction.filterModelSingleFromCrops(modelSingleCrops);
        // filterData through crops number
        var calculatedDataDividedCrops = []
        var numberOfCrops = modelProduction.getCropsNumber();
        var startIndex = 0;
        for (var i = 0; i < numberOfCrops; i++) {
            var endIndex = dataForCrops.length / numberOfCrops + startIndex;
            var copyDataForCrops = $.extend(true, [], dataForCrops)
            calculatedDataDividedCrops.push(formulaHandler.createFormula(copyDataForCrops.splice(startIndex, endIndex), formulaToUpdate));
            startIndex = parseInt(endIndex)
        }

        // insert batch into model
        var newCalculatedData = modelProduction.createSingleCalculatedModel(calculatedDataDividedCrops)
        var modelCalculated = $.extend(true, [], newCalculatedData);
        modelProduction.setCalculatedSingleModel(modelCalculated)
        editorProduction.updateSingleGrid(modelCalculated, formulaToApply, isAreaHarvestedSelectedSingle);
    }

    ProductionController.prototype.updateTotGridOnFormulaChanges = function (formulaToApply, typeOfTotGrid) {
        if (!typeOfTotGrid) {
            typeOfTotGrid = 'totalValues';
        }
        var formulaToUpdate
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(1, typeOfTotGrid)
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(1, typeOfTotGrid, formulaToApply)
        }


        var dataUpdated = modelProduction.getOriginalTotalCropsModel()

        var modelTotalCrops = $.extend(true, [], dataUpdated)
        var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate)

        var modelCalculated = $.extend(true, [], calculatedModel);
        modelProduction.setCalculatedTotalModel(modelCalculated)
        editorProduction.updateTotGrid(calculatedModel, formulaToApply, isAreaHarvestedSelectedTot);

    }

    ProductionController.prototype.updateSingleCropsGridOnFormulaChanges = function (formulaToApply, typeOfSingleGrid) {
        if (!typeOfSingleGrid) {
            typeOfSingleGrid = 'singleCrops';
        }
        var formulaToUpdate
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(1, typeOfSingleGrid)
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(1, typeOfSingleGrid, formulaToApply)
        }
        var dataUpdated = modelProduction.getOriginalSingleCropsModel();

        var modelSingleCrops = $.extend(true, [], dataUpdated);
        var calculatedModel = formulaHandler.createFormula(modelSingleCrops, formulaToUpdate)

        var modelCalculated = $.extend(true, [], calculatedModel);
        modelProduction.setCalculatedSingleModel(modelCalculated)
        editorProduction.updateSingleGrid(calculatedModel, formulaToApply, isAreaHarvestedSelectedSingle);

    }

    ProductionController.prototype.saveTotalValues = function () {

        var dataOriginal = modelProduction.getOriginalTotalCropsModelOriginalConverted();
        var areaPlanted = modelProduction.getAreaPlanted();

        if (areaPlanted) {
            areaPlanted.length = 6;
            dataOriginal.push(areaPlanted)
        }
        var dataCalculated = modelProduction.getCalculatedTotalModel();
        editorProduction.saveDataTotGrid(dataCalculated, dataOriginal);
    }

    ProductionController.prototype.onSwitchingSimpleTotal = function (formulaToApplyTot, typeOfForm) {
        this.updateTotGridOnFormulaChanges(formulaToApplyTot, typeOfForm)

    }

    ProductionController.prototype.onSwitchingSimpleSingle = function (formulaToApplySingle, typeOfForm) {
        debugger;
        this.updateSingleCropsGridOnFormulaChanges(formulaToApplySingle, typeOfForm)

    }

    ProductionController.prototype.onSwitchingCropsValues = function (formulaSingleToApply, typeOfForm) {

        var originalSingleCropsModel = modelProduction.getOriginalSingleCropsModel()
        var dataSingleCrops = $.extend(true, [], originalSingleCropsModel)
        var dataUnified = modelProduction.unifySingleCropsData(dataSingleCrops);
        var totalValueModel = $.extend(true, [], modelProduction.getOriginalTotalCropsModel());
        var rowIndexes = [];
        for (var i = 0; i < dataUnified.length; i++) {
            for (var j = 0; j < totalValueModel.length; j++) {
                if (totalValueModel[j][0] == dataUnified[i][0]) {
                    modelProduction.setOriginalData(j, dataUnified[i][3], 3)
                }
            }
        }
        console.log('formulaSingleToApply')
        if (formulaSingleToApply == 'init') {
            formulaSingleToApply = 'yield'
        }
        editorProduction.setTotalValuesOnModified()
        this.updateTotGridOnFormulaChanges(formulaSingleToApply, typeOfForm)
    }

    ProductionController.prototype.destroyAll = function () {
        editorProduction.destroyAll()
    }

    ProductionController.prototype.onChangeAreaSelected = function (formulaToApply, isAreaHarvested, isTotal) {
        if (isTotal) {
            isAreaHarvestedSelectedTot = isAreaHarvested;
            var rowNumber, typeOfTotGrid
            if (isAreaHarvested) {
                rowNumber = 3
                // erase value , flag and notes

                modelProduction.eraseOldValues(rowNumber, true)
                typeOfTotGrid = 'totalValues'

            } else {
                rowNumber = 0
                modelProduction.eraseOldValues(rowNumber, true)
                typeOfTotGrid = 'totalValuesAPlanted'
            }

            this.updateTotGridOnFormulaChanges(formulaToApply, typeOfTotGrid);
            editorProduction.changeLabelToArea(isAreaHarvested, true);
        } else {
            isAreaHarvestedSelectedSingle = isAreaHarvested;
            var rowNumber, typeOfSingleCrops
            if (isAreaHarvestedSelectedSingle) {
                rowNumber = 3

                modelProduction.eraseOldValues(rowNumber, false)
                typeOfSingleCrops = 'singleCrops'

            } else {
                rowNumber = 0
                modelProduction.eraseOldValues(rowNumber, false)
                typeOfSingleCrops = 'singleCropsAPlanted'
            }

            this.updateSingleCropsGridOnFormulaChanges(formulaToApply, typeOfSingleCrops);
            editorProduction.changeLabelToArea(isAreaHarvested, false);
        }
    }

    ProductionController.prototype.showAlertTotal = function () {
        editorProduction.showAlertTotal()

    }

    ProductionController.prototype.showAlertSingle = function () {
        editorProduction.showAlertSingle();

    }

    ProductionController.prototype.cancelAllAlerts = function (isTotal) {
        editorProduction.cancelAlerts(isTotal)
    }

    return ProductionController;
})