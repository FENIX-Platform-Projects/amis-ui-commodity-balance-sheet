/**
 * Created by fabrizio on 6/27/14.
 */

define(["jquery"], function ($) {

    var matrixLeft, matrixUp, matrixAll, instanceGridModel;

    function GridDataModel() {
    }


    GridDataModel.prototype.init = function (model, tableData, indexes) {

        var xPositions = []
        var yPositions = []
        var valueIndex = indexes["valueColumnsModel"];
        var accessorIndexes = indexes["accessorColumnsModel"]["accessorIndexes"];
        matrixLeft = model["matrixLeft"];
        matrixUp = model["matrixUp"];
        matrixAll = model["matrixAll"]

        for (var i = 0; i < tableData.length; i++) {
            var fieldsRowTable = tableData[i]
            debugger;
            xPositions.push(this.findPositionLeftCell(tableData[i], indexes["leftColumnsModel"]["leftKeyIndexes"], model["matrixLeft"]))
            yPositions.push(this.findPositionUpCell(tableData[i], indexes["upColumnsModel"]["upKeyIndexes"], model["matrixUp"]))


            // Insert DATA
            if (typeof  xPositions[i] !== 'undefined' && typeof  yPositions[i] !== 'undefined') {
                var cell = model["matrixAll"][xPositions[i]][yPositions[i]]
                cell.push(fieldsRowTable[valueIndex])
                for (var k = 0; k < accessorIndexes.length; k++) {
                    cell.push(fieldsRowTable[accessorIndexes[k]])
                }
            }
        }

        instanceGridModel = model["matrixAll"];
        var result = model;
        return result;
    }


    GridDataModel.prototype.findPositionLeftCell = function (rowTable, leftIndexes, leftKeyMatrix) {
        var xPosition;
        var found = false;

        for (var i = 0; i < leftKeyMatrix.length && !found; i++) {
            var firstElement = leftKeyMatrix[i][0];
            if (leftKeyMatrix[0].length > 1) {
                var secondElement = leftKeyMatrix[i][1];
                if (firstElement == rowTable[leftIndexes[0]] &&
                    secondElement == rowTable[leftIndexes[1]]) {
                    xPosition = i;
                    found = true;
                }
            }
            else {
                if (firstElement == rowTable[leftIndexes[0]]) {
                    xPosition = i;
                    found = true;
                }
            }
        }

        return xPosition;
    }


    GridDataModel.prototype.findPositionUpCell = function (rowTable, upIndexes, upKeyMatrix) {

        var yPosition;
        var found = false;

        debugger;

        for (var j = 0; j < upKeyMatrix[0].length && !found; j++) {
            var firstElement = upKeyMatrix[0][j][0]
            if (upKeyMatrix[0][j].length > 1) {
                var secondElement = upKeyMatrix[0][j][1]
                if (firstElement == rowTable[upIndexes[0]] &&
                    secondElement == rowTable[upIndexes[1]]) {
                    found = true;
                    yPosition = j;
                }
            }
            else {

                if (firstElement == rowTable[upIndexes[0]]) {
                    found = true;
                    yPosition = j;
                }

            }
        }
        return yPosition

    }

    GridDataModel.prototype.getGridDataModel = function () {
        return instanceGridModel;
    }


    GridDataModel.prototype.updateModel = function (cell, indexRow, indexColumn) {
        instanceGridModel[indexRow][indexColumn] = cell;
    }


    GridDataModel.prototype.addRow = function (row, position) {
        //TODO
    }


    GridDataModel.prototype.deleteRow = function (idRow) {
        //TODO
    }


    GridDataModel.prototype.addColumn = function (column, position) {
        //TODO
    }


    GridDataModel.prototype.removeColumn = function (idColumn) {
        //TODO
    }

    GridDataModel.prototype.getMatrixLeft = function () {
        return matrixLeft;
    }

    GridDataModel.prototype.getMatrixUp = function () {
        return matrixUp;
    }

    GridDataModel.prototype.getMatrixAll = function () {
        return matrixAll;
    }


    return GridDataModel;

})