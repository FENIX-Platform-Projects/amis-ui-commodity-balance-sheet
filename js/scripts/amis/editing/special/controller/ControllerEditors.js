/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "editingSpecial/utils/DataHandler", "productionEditor/creator/ProductionEditor",
    "paddyEditor/controller/PaddyController", "otherUsesEditor/controller/OtherController"], function ($, DataHandler, ProductionEditor, PaddyController, OtherController) {

    var specialFormulaController, dataHandler, productionEditor, dsdConfigurator, supportUtility,
        clickedCellInfo, generalController, paddyController, otherController;

    function ControllerEditors() {
        dataHandler = new DataHandler;
        productionEditor = new ProductionEditor;
        paddyController = new PaddyController;
        otherController = new OtherController
    }

    ControllerEditors.prototype.init = function (allData, modelDataTable, resultedClicked, formulaController, DsdConfigurator, Utility, GeneralController, filterProductCode) {

        generalController = GeneralController;
        dsdConfigurator = DsdConfigurator;
        var everyData = allData;
        var tableData = modelDataTable;
        supportUtility = Utility;
        clickedCellInfo = resultedClicked

        var takenCell = resultedClicked.clickedCell
        specialFormulaController = formulaController;
        // first take all the involvedCodes
        var codes = specialFormulaController.getInvolvedItems(takenCell, filterProductCode);

        var dataInvolved = dataHandler.getInvolvedData(codes, everyData, tableData, takenCell);

        var condition = parseInt(takenCell[0])

        switch (condition) {
            case 5 :
                if (filterProductCode != 4) {
                    productionEditor.init(takenCell, dataInvolved, codes, dsdConfigurator, supportUtility, this)
                }
                else {
                    paddyController.init(takenCell, dataInvolved, codes, dsdConfigurator, supportUtility, this)
                }
                break;

            case 15:
                otherController.init(takenCell, dataInvolved, codes, dsdConfigurator, supportUtility, this)

                break;
        }

    }


    ControllerEditors.prototype.saveFormProduction = function (calculatedData, originalData) {
        generalController.saveDataFromAllForms(calculatedData, originalData, clickedCellInfo, 'production')
    }

    ControllerEditors.prototype.saveFormRiceProduction = function (calculatedData, originalData) {

        for(var i=0; i<calculatedData.length; i++) {
            calculatedData[i].length = 6;
            if (calculatedData[i][3] != null) {
                (calculatedData[i][0] != 4 && calculatedData[i][0] != 996) ?
                    calculatedData[i][3] = parseInt(calculatedData[i][3]) :
                    calculatedData[i][3] = parseFloat(calculatedData[i][3])
            }
        }
        generalController.saveDataFromAllForms(calculatedData, originalData, clickedCellInfo, 'productionRice')
    }

    ControllerEditors.prototype.saveFormOtherUses = function (calculatedData, originalData) {
        generalController.saveDataFromAllForms(calculatedData, originalData, clickedCellInfo, 'otherUses')
    }

    return ControllerEditors;

})