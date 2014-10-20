/**
 * Created by fabrizio on 7/24/14.
 */
define(["jquery", "models/tableDataModel/TableDataModel",
    "models/gridDataModel/GridDataModel", "models/creator/HandlerCreationModels", "moment"], function ($, TableDataModel, GridDataModel, ModelCreator) {

    var TableModel, GridModel, indexes, instanceGridDataModel, instanceTableDataModel, fullTableModel, newValues, dataTable, CreatorModels,
        modelForCreation, Configurator;

    function ModelsController() {
        TableModel = new TableDataModel;
        GridModel = new GridDataModel;
        CreatorModels = new ModelCreator;
    }

    ModelsController.prototype.init = function (tableData, configurator) {

        Configurator = configurator;
        dataTable = tableData
        newValues = []; // New values will be put into this variable
        indexes = configurator.getAllColumnModels();
        instanceTableDataModel = tableData;
        TableModel.init(tableData, configurator);
        modelForCreation = CreatorModels.init(configurator)
        instanceGridDataModel = GridModel.init(modelForCreation, tableData, indexes)
        TableModel.createFullTableData(modelForCreation)
        // if a full rows representation need to be visualized
        var newTable =(configurator.getFullRowsRepresentation())?  TableModel.createColumnSparseTableData(modelForCreation) :
            TableModel.createTableModelFromGrid(instanceGridDataModel);

        TableModel.createSparseTableData(newTable);

    }

    ModelsController.prototype.getTableDataModel = function () {
        return TableModel.getTableData();
    }

    ModelsController.prototype.getGridDataModel = function () {
        return GridModel.getGridDataModel();
    }

    ModelsController.prototype.getData = function () {
        return TableModel.getAllData();
    }

    ModelsController.prototype.createFullTableModel = function () {
        fullTableModel = TableModel.createFullTableData(instanceGridDataModel)
        return fullTableModel;
    }

    ModelsController.prototype.getFullTableModel = function () {
        return fullTableModel;
    }

    ModelsController.prototype.updateModels = function (cell, indTable, rowIndex, columnIndex) {
        var newCell = cell;
        console.log("updateMODELS: INDEX table")
        console.log(indTable)
        newValues.push(newCell);
        //fullTableModel[indTable] = newCell;
        TableModel.updateTableData(cell, indTable)
        instanceTableDataModel = TableModel.getTableData();
        // Create a GRid Model
        GridModel.updateModel(cell, rowIndex, columnIndex)
        instanceGridDataModel = GridModel.getGridDataModel();
    }


    ModelsController.prototype.getFullRowsIndexes = function () {
        return TableModel.getFullIndexRows();
    }


    ModelsController.prototype.getFullColumnsIndexes = function () {
        return TableModel.getFullIndexColumns();
    }


    ModelsController.prototype.getIndexesNewFirstColumnLeft = function () {
        return TableModel.getIndexesDoubleColumns();
    }


    ModelsController.prototype.getMapDomainCodes = function (indexColumn) {
        TableModel.getMapDomainCodes(indexColumn)

    }

    ModelsController.prototype.getDataToSave = function(){
        return TableModel.getDataToSave()
    }

    ModelsController.prototype.createNewForecast = function(){
        var muArray = ["Thousand tonnes", "Thousand tonnes","Thousand tonnes","Thousand tonnes","Thousand tonnes",
            "Thousand tonnes","Thousand tonnes","Thousand tonnes","Thousand tonnes","Thousand tonnes",
            "Thousand tonnes","Thousand tonnes","Thousand tonnes","Thousand tonnes","Thousand tonnes","Thousand tonnes",
            "Thousand Ha","Thousand Ha","Tonnes/Ha","1000s","%","Kg/Yr"]
        var codes = Configurator.getLeftKeyColumn().leftColumns[0].domain.codes;
        var result = []
        var dateOfForecast = new Date();
        var dateDsdFormat = moment(dateOfForecast).format("YYYYMMDD");
        for( var i=0; i< codes.length; i++){
            result[i] = [];
            result[i][0] = codes[i].code.code;
            result[i][1] = muArray[i]
            result[i][2] = dateDsdFormat;
            result[i][3] = null;
            result[i][4] = null;
            result[i][5] = null;
        }
        var d = TableModel.addNewForecast(result);
        return d;
    }

    ModelsController.prototype.saveDataFromProduction = function(newData, indTable, rowGridIndex, columnGridIndex){
       var indexesTableData = TableModel.updateDataFromProductionForm(newData, indTable)
        // TODO: save also grid data
       return indexesTableData;
    }

    ModelsController.prototype.saveDataFromRiceProduction = function(newData, indTable, rowGridIndex, columnGridIndex){
        var indexesTableData = TableModel.updateDataFromRiceProductionForm(newData, indTable)
        // TODO: save also grid data
        return indexesTableData;
    }

    return ModelsController;
})