/**
 * Created by fabrizio on 7/24/14.
 */
define(["jquery", "models/tableDataModel/TableDataModel",
    "models/gridDataModel/GridDataModel",
    "models/creator/HandlerCreationModels",
    "models/configUM/config_um",
    "moment",
    "amplify"], function ($, TableDataModel, GridDataModel, ModelCreator, C) {

    var TableModel, GridModel, indexes, instanceGridDataModel, instanceTableDataModel, fullTableModel, newValues, dataTable, CreatorModels,
        modelForCreation, Configurator, config;

    function ModelsController() {
        TableModel = new TableDataModel;
        GridModel = new GridDataModel;
        CreatorModels = new ModelCreator;
        config = C;
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
        var newTable = (configurator.getFullRowsRepresentation()) ? TableModel.createColumnSparseTableData(modelForCreation) :
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

    ModelsController.prototype.getDataToSave = function () {
        return TableModel.getDataToSave()
    }

    ModelsController.prototype.createNewForecast = function () {

        var muArray;
        switch (amplify.store().dsd) {
            case 6:
                muArray = config.soybeans
                break;
            case 4:
                muArray = config.rice
                break;
            default:
                muArray = config.default
                break;

        }

        var codes = Configurator.getLeftKeyColumn().leftColumns[0].domain.codes;
        var result = []
        var dateOfForecast = new Date();
        var dateDsdFormat = moment(dateOfForecast).format("YYYYMMDD");
        var tableModel = TableModel.getTableData();

        // if not exist
        if (this.checkBeforeCreateNewForecast(tableModel, dateDsdFormat)) {
            for (var i = 0; i < codes.length; i++) {
                result[i] = [];
                result[i][0] = codes[i].code.code;
                result[i][1] = muArray[i]
                result[i][2] = dateDsdFormat;
                if (codes[i].code.code == 1) {
                    var notFound = true;
                    for (var k = 0; k < tableModel.length && notFound; k++) {
                        if (tableModel[k][2] != "20000103" && tableModel[k][0] == 1) {
                            result[i][3] = (tableModel[k][3]) ? tableModel[k][3] : null;
                            result[i][4] = (tableModel[k][4]) ? tableModel[k][4] : null;
                            result[i][5] = (tableModel[k][5]) ? tableModel[k][5] : null;
                            notFound = false;
                        }
                    }
                    if (notFound) {
                        var forecast_population = amplify.store().population_new_forecast
                        result[i][3] = forecast_population && forecast_population[2] != null ? forecast_population[2] : null;
                        amplify.store("population_new_forecast", null);
                    }
                } else {
                    result[i][3] = null;
                    result[i][4] = null;
                    result[i][5] = null;

                }

            }
            var d = TableModel.addNewForecast(result);
        }
        return d;
    }

    ModelsController.prototype.checkBeforeCreateNewForecast = function (model, date) {
        var notFound = true;
        for (var i = 0, length = model.length; i < length && notFound; i++) {
            if (date == model[i][2]) {
                notFound = false
            }
        }
        return notFound
    }


    ModelsController.prototype.saveDataFromSpecialForm = function (newData, indTable, rowGridIndex, columnGridIndex, typeOfForm) {
        var indexesTableData = TableModel.updateDataFromSpecialForm(newData, typeOfForm)
        // TODO: save also grid data
        return indexesTableData;
    }

    return ModelsController;
})