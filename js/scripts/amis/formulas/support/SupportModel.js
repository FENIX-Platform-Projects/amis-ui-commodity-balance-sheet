/**
 * Created by fabrizio on 9/8/14.
 */
define(["jquery" ], function ($) {

    var configuratorDSD, mapCodes, tableMapCodes

    function SupportModel() {
    }

    SupportModel.prototype.init = function (dsdConfigurator) {
        configuratorDSD = dsdConfigurator;
        tableMapCodes = {};
    }


    SupportModel.prototype.getMapCodes = function () {
        var result;
        var result = {}
        var allDSDCodes = configuratorDSD.getLeftKeyColumn().leftColumns[0].domain.codes;
        for (var i = 0; i < allDSDCodes.length; i++)
            result[allDSDCodes[i].code.code] = i;
        mapCodes = result;


        return result;
    }

    // singleton
    SupportModel.prototype.getMapCodesInstance = function () {
        return mapCodes;
    }

    // get or find into the table model
    SupportModel.prototype.lookForCode = function (codeData, modelData, startIndexData, numberOfRowsData) {
        var result;
        var found = false;
        var code = codeData;
        var model = modelData;
        var startIndex = startIndexData;
        var numberOfRows = numberOfRowsData;
        for (var i = startIndex; !found && i < startIndex + numberOfRows; i++) {
            if (typeof model[i] !== 'undefined' && model[i][0] == code) {
                found = true
                result = i;
            }
        }
        return result;
    }


    SupportModel.prototype.createIndexOriginalModel = function (numberOfColumns, indexColumn, mapCodes, code) {
        var xCoordinate = mapCodes[code];
        return (numberOfColumns * xCoordinate) + indexColumn
    }

    return SupportModel;
})