/**
 * Created by fabrizio on 7/28/14.
 */
define(["jquery" ], function($ ){

    function AdapterPivot(){};

    // get the clicked cell from the model data and the index of Table model
    AdapterPivot.prototype.getClickedCell = function(TableModel, Configurator, ui, indexesObject) {
        var result = {};
        var rowGridIndex, columnGridIndex;

        var objectColumns = ui.owner.tmpDataSource._dataView[0];
        var columnsNumber = Object.keys(objectColumns).length -1

        var numberLeftKeyColumns = Configurator.getLeftKeyColumn().leftColumns.length
        if (ui.rowIndex == 0) {
            rowGridIndex = 0;
            columnGridIndex = ui.colIndex - 2;
            var indTable = (numberLeftKeyColumns > 1) ? ((ui.rowIndex) ) + (ui.colIndex - 2) :
                ((ui.rowIndex) + 1) + (ui.colIndex - 2);
             clickedCell = TableModel[indTable]
        } else {
            rowGridIndex = ui.rowIndex;
            columnGridIndex = ui.colIndex - 1;
            var indTable = ((ui.rowIndex) * columnsNumber) + (ui.colIndex - 1);
            if (numberLeftKeyColumns > 1) {
                if (typeof indexesObject[indTable - 1] !== 'undefined' && 
                    parseInt((indTable - 1) / columnsNumber) == ui.rowIndex) {
                    indTable--;
                }
            }
            clickedCell = TableModel[indTable]
           
        }
        result["clickedCell"]   = clickedCell;
        result["indTable"]      = indTable;
        result["rowGridIndex"]    = rowGridIndex;
        result["columnGridIndex"]    = columnGridIndex;
        return result;
    }


    AdapterPivot.prototype.getIndexTableFromGridIndex = function(rowIndex, columnIndex, columnsNumber, rowsNumber, indexesObject){
       
        var indexTable, rowGridIndex, columnGridIndex;
        
        // if it is the first
        if (rowIndex == 0) {
            rowGridIndex = 0;
            columnGridIndex = columnIndex - 2;
            indexTable = (rowsNumber > 1) ? ((rowIndex) ) + (columnIndex - 2) :
                ((rowIndex) + 1) + (columnIndex - 2);
        
        } else {
            rowGridIndex = rowIndex;
            columnGridIndex = columnIndex- 1;
            indTable = ((rowIndex) * columnsNumber) + (columnIndex - 1);
            if (rowsNumber > 1) {
                // Indexes object is a map where are stored the indexes of the first rows in a nested
                // left header
                if (typeof indexesObject[indexTable - 1] !== 'undefined' && 
                    parseInt((indexTable - 1) / columnsNumber) == rowIndex) {
                    indexTable--;
                }
            }
        }
        return indexTable
    }





    return AdapterPivot;
})
