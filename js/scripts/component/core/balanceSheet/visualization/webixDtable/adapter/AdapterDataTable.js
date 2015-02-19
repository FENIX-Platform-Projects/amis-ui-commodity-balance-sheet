/**
 * Created by fabrizio on 10/14/14.
 */
define(['jquery'], function($){

    var numberOfColumns, differentDates,mapTitles


    function AdapterDataTable(){
        differentDates = [];
        mapTitles = {}
    }

    // get the clicked cell from the model data and the index of Table model
    AdapterDataTable.prototype.getClickedCell = function(TableModel, Configurator, idDatatable, grid, indexesObject) {
        var result = {};
        var rowGridIndex, columnGridIndex;

        // starts from -1, because it includes the first column
        var columnsNumber = -1;
        grid.eachColumn( function (col){ columnsNumber++ })

        var numberLeftKeyColumns = Configurator.getLeftKeyColumn().leftColumns.length

        // columnIndex
        var columnIndex  = grid.getColumnIndex(idDatatable.column)-1;
        var rowIndex = grid.getIndexById(idDatatable);

        rowGridIndex = rowIndex;
        columnGridIndex = columnIndex

        if(rowIndex == 0){
            var indTable = columnIndex
            clickedCell = TableModel[indTable]
        }
        else{
            indTable = (rowIndex* columnsNumber)+columnIndex
            clickedCell = TableModel[indTable]
        }
        result["clickedCell"]   = clickedCell;
        result["indTable"]      = indTable;
        result["rowGridIndex"]    = rowGridIndex;
        result["columnGridIndex"]    = columnGridIndex;
        return result;
    }

    AdapterDataTable.prototype.createPropertiesFromModel = function(model){
            differentDates = {};
            differentDates[ model[0][2]] = true
            numberOfColumns = 1
            for(var i =0; i< model.length; i++){
                // not exist in map
               if(typeof mapTitles[model[i][0]] == 'undefined') {
                   mapTitles[model[i][0]] = [i]
               }
               else{
                   mapTitles[model[i][0]].push(i)
               }
                if(typeof differentDates[model[i][2]] === 'undefined'){
                    differentDates[model[i][2]] = true
                    numberOfColumns++;
                }
            }
    }

    AdapterDataTable.prototype.getNumberOfColumns = function(){

        return numberOfColumns;
    }

    AdapterDataTable.prototype.getDifferentDates = function() {

        return differentDates;
    }

    AdapterDataTable.prototype.getTitlesMap = function(){
        return mapTitles;

    }

    return AdapterDataTable
})