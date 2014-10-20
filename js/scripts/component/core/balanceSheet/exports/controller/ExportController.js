/**
 * Created by fabrizio on 8/5/14.
 */
define(["jquery", "exporter/tableModel/TableExport"], function($, Export ){

    function ExportController(){}

    var Exporter;

    ExportController.prototype.init = function(table, Configurator){

    Exporter = new Export;
    Exporter.init(table, Configurator);

    }

    return ExportController;
})