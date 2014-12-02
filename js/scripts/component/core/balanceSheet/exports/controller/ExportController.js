/**
 * Created by fabrizio on 8/5/14.
 */
define(["jquery", "exporter/excelExporter/ExcelExporter"], function($, Export ){

    function ExportController(){}

    var Exporter;

    ExportController.prototype.init = function(table, Configurator, grid, supportUtility){

        Exporter = new Export;
        Exporter.init(supportUtility);
    }

    return ExportController;
})