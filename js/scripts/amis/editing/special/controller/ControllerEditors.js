/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "editingSpecial/utils/DataHandler", "productionEditor/creator/ProductionEditor",
"paddyEditor/controller/PaddyController", "otherUsesEditor/controller/OtherController"], function($, DataHandler, ProductionEditor, PaddyController,
    OtherController){

    var specialFormulaController, dataHandler, productionEditor, dsdConfigurator, supportUtility,
        clickedCellInfo, generalController, paddyController, otherController;

    function ControllerEditors(){
        dataHandler = new DataHandler;
        productionEditor = new ProductionEditor;
        paddyController = new PaddyController;
        otherController = new OtherController
    }

    ControllerEditors.prototype.init = function(allData,modelDataTable,resultedClicked, formulaController, DsdConfigurator, Utility,GeneralController,
        filterProductCode){

        generalController = GeneralController;
        dsdConfigurator = DsdConfigurator;
        var everyData = allData;
        var tableData = modelDataTable;
        supportUtility = Utility;
        clickedCellInfo = resultedClicked

        var takenCell =resultedClicked.clickedCell
        specialFormulaController = formulaController;
        // first take all the involvedCodes
        var codes = specialFormulaController.getInvolvedItems(takenCell, filterProductCode);

        var dataInvolved = dataHandler.getInvolvedData(codes, everyData, tableData, takenCell);
        debugger;


        var condition =parseInt(takenCell[0])

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


    ControllerEditors.prototype.saveFormProduction = function( calculatedData, originalData){
        generalController.saveDataFromAllForms(calculatedData,originalData,clickedCellInfo, 'production')
    }

    ControllerEditors.prototype.saveFormRiceProduction = function(calculatedData, originalData){
        console.log('saveFormRice Production: Controller Editors')
        generalController.saveDataFromAllForms(calculatedData,originalData,clickedCellInfo, 'productionRice')
    }

    ControllerEditors.prototype.saveFormOtherUses = function( calculatedData, originalData){
        console.log('saveFormRice Production: Controller Editors')
        generalController.saveDataFromAllForms(calculatedData,originalData,clickedCellInfo, 'otherUses')
    }

    return ControllerEditors;

    })