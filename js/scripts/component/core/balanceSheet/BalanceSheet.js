/**
 * Created by fabrizio on 6/26/14.
 */

define(["jquery", "configurator/Configurator", "modelController/ModelsController",
    "generalController/GeneralController", "utilities/SupportUtility"], function ($, Configurator, ModelController, GeneralController,
    Utility) {

    var urlComponent = './js/scripts/component/core/balanceSheet/configuration/component/componentConfiguration.json'

    var tableDataModel, gridDataModel, data, dsd, componentConfiguration,
        configurator, indexes, generalController, modelController, supportUtility, NProgress;

    var dataInput;

    function BalanceSheet() {

        configurator = new Configurator;
        generalController = new GeneralController;
        modelController = new ModelController;
        supportUtility = new Utility;

    }

    BalanceSheet.prototype.init = function (dataInput, urlDSD, filterData, Nprogress) {
        NProgress = Nprogress;
        // dsd
        $.ajax({
            async: false,
            type: 'GET',
            url: urlDSD,
            success: function (data) {
                dsd = data;
            }
        })

        // component Configuration
        $.ajax({
            async: false,
            type: 'GET',
            url: urlComponent,
            success: function (data) {
                componentConfiguration = data;
            }
        })

        supportUtility.init(filterData )

        configurator.init(dsd, componentConfiguration)
        modelController.init(dataInput, configurator)

        var gridModel = modelController.getGridDataModel()
        var tableModel = modelController.getTableDataModel()
        generalController.init(gridModel, tableModel, configurator, modelController, supportUtility, NProgress)

    }


    BalanceSheet.prototype.getData = function () {
        return modelController.getData();
    }

    BalanceSheet.prototype.setTableData = function (TableData) {
        var tableModel = tableDataModel.init(TableData, dsd, componentConfiguration, configurator);
        return tableModel;
    }

    BalanceSheet.prototype.setGridData = function (model) {
        indexes = configurator.getAllColumnModels();
        return (gridDataModel.init(dsd, model, data, indexes));
    }

    BalanceSheet.prototype.getTableData = function () {
        return modelController.getTableDataModel();
    }

    BalanceSheet.prototype.getGridData = function () {
        return modelController.getGridData();
    }

    BalanceSheet.prototype.getDataToSave = function(){
        return modelController.getDataToSave();
    }

    return BalanceSheet;

})