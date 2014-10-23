/**
 * Created by fabrizio on 6/26/14.
 */

define(["jquery", "formulasAmis/support/SupportModel" ], function ($, SupportModel) {

    var instanceData, Configurator, instanceFullTableData, counterEmptySpaces,
        fullRows, fullColumns, indexesDoubleColumnLeft, originalData, leftIndexes, upIndexes,
        visualizedData, newData, updatedData, supportModel;

    // -------------------- SET OPERATIONS --------------------------------------

    Array.prototype.getUnique = function () {
        var u = {}, a = [];
        for (var i = 0, l = this.length; i < l; ++i) {
            if (u.hasOwnProperty(this[i])) {
                continue;
            }
            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    }

    //----------------------------------------------------------------------


    function TableDataModel() {
        newData = [];
        updatedData = [];
    }


    TableDataModel.prototype.init = function (data, configurator) {
        instanceData = data;
        originalData = $.extend(true, [], data)
        Configurator = configurator;
        supportModel = new SupportModel;
        supportModel.init(Configurator)
    }


    TableDataModel.prototype.getTableData = function () {
        var result = visualizedData;
        return result;
    }

    TableDataModel.prototype.setTableDataModel = function(index, row){
        var model = this.getTableData();
        model[index] = row;
    }

    TableDataModel.prototype.setAllDataModel = function(index, row){
        var model = this.getAllData();
        model[index] = row;
    }


    TableDataModel.prototype.createSparseTableData = function (newData) {
        instanceData = newData;
    }


    TableDataModel.prototype.createFullTableData = function (modelForCreation) {
        fullColumns = [];
        fullRows = [];

        var dsdColumns = Configurator.getAllColumnModels();
        leftIndexes = dsdColumns["leftColumnsModel"]["leftKeyIndexes"]
        upIndexes = dsdColumns["upColumnsModel"]["upKeyIndexes"]
        var accessorIndexes = dsdColumns["accessorColumnsModel"]["accessorIndexes"];
        var valueIndexes = dsdColumns["valueColumnsModel"]
        var table = []
        counterEmptySpaces = {
            rows: [],
            columns: []
        }

        var numberOfRows = 0;
        for (var i = 0; i < modelForCreation["matrixAll"].length; i++) {
            counterEmptySpaces.rows[i] = 0;
            for (var j = 0; j < modelForCreation["matrixAll"][i].length; j++) {
                if (typeof counterEmptySpaces.columns[j] === 'undefined') {
                    counterEmptySpaces.columns[j] = 0
                }
                var cell = modelForCreation["matrixAll"][i][j];
                if (cell.length > 0) {
                    fullColumns.push(j);
                    fullRows.push(i);

                    counterEmptySpaces.columns[j] = 1;
                    counterEmptySpaces.rows[i] = 1;
                    var leftKeys = modelForCreation["matrixLeft"][i]
                    var upKeys = modelForCreation["matrixUp"][0][j]
                    var val = cell[0];
                    var accessors = []
                    for (var k = 1; k < cell.length; k++) {
                        accessors.push(cell[k]);
                    }
                    var array = []
                    for (var m = 0; m < leftIndexes.length; m++) {
                        array[leftIndexes[m]] = leftKeys[m];
                    }

                    for (var m = 0; m < upIndexes.length; m++) {
                        array[upIndexes[m]] = upKeys[m];
                    }

                    for (var m = 0; m < accessorIndexes.length; m++) {
                        array[accessorIndexes[m]] = accessors[m];
                    }
                    array[valueIndexes] = val;

                    table.push(array)
                    numberOfRows++;
                } else {
                    var leftKeys = modelForCreation["matrixLeft"][i]
                    var upKeys = modelForCreation["matrixUp"][0][j]
                    var val = cell[0];
                    var accessors = []
                    for (var k = 1; k < cell.length; k++) {
                        accessors.push(cell[k]);

                    }
                    var array = []
                    for (var m = 0; m < leftIndexes.length; m++) {
                        array[leftIndexes[m]] = leftKeys[m];
                    }

                    for (var m = 0; m < upIndexes.length; m++) {
                        array[upIndexes[m]] = upKeys[m];
                    }

                    for (var m = 0; m < accessorIndexes.length; m++) {
                        array[accessorIndexes[m]] = accessors[m];
                    }
                    array[valueIndexes] = val;

                    table.push(array)
                    numberOfRows++;
                }
            }
        }

        this.makeOperationsOnFullIndexes(),
            instanceFullTableData = table;
        return table;
    }


    TableDataModel.prototype.getFullIndexRows = function () {
        return fullRows;
    }

    TableDataModel.prototype.getFullIndexColumns = function () {
        return fullColumns;
    }


    TableDataModel.prototype.makeOperationsOnFullIndexes = function () {
        // Sort and "set" operations in variables that represent
        // the rows and columns that have to be represented

        fullRows.sort(function (a, b) {
            return a > b ? 1 : a < b ? -1 : 0;
        })
        fullRows = fullRows.getUnique()
        fullColumns.sort(function (a, b) {
            return a > b ? 1 : a < b ? -1 : 0;
        })
        fullColumns = fullColumns.getUnique();
    }

    // To get the original data and the new ones
    TableDataModel.prototype.getAllData = function () {
        var result = originalData;
        return result;
    }


    TableDataModel.prototype.createTableModelFromGrid = function (GridDataModel) {

        var result = [];
        indexesDoubleColumnLeft = {};
        if (fullRows.length > 0 && fullColumns.length > 0) {
            var firstIndex = (counterEmptySpaces.columns.length * fullRows[0]) + fullColumns[0];
            var firstField = instanceFullTableData[firstIndex][0];
        }

        for (var i = 0; i < fullRows.length; i++) {
            var indRow = fullRows[i]
            for (var j = 0; j < fullColumns.length; j++) {
                var indCol = fullColumns[j]

                // for each value contained into a cell
                var numberColumns = counterEmptySpaces.columns.length;
                if (GridDataModel["matrixLeft"][0].length == 2) {
                    if (indRow == 0) {
                        result.push(instanceFullTableData[indCol])
                    } else {
                        var element = instanceFullTableData[(numberColumns * indRow) + (indCol)]
                        if (typeof firstField !== 'undefined' && firstField !== element[0]) {
                            firstField = element[0];
                            var startingIndex = j + (i * fullColumns.length);
                            for (var k = 0; k < fullColumns.length; k++) {
                                indexesDoubleColumnLeft[startingIndex + k] = 1;
                            }
                        }
                        result.push(instanceFullTableData[(numberColumns * indRow) + (indCol)])
                        // new Left key element
                    }

                } else {
                    if (indRow == 0) {
                        result.push(instanceFullTableData[indCol])
                    } else {
                        result.push(instanceFullTableData[(numberColumns * indRow) + (indCol)])
                    }
                }
            }
        }

        return result;
    }


    // Represent Every rows but only the full columns
    TableDataModel.prototype.createColumnSparseTableData = function (modelForCreation) {

        var result = [];
        // for each Row
        for (var i = 0; i < modelForCreation["matrixAll"].length; i++) {
            for (var j = 0; j < fullColumns.length; j++) {
                var indexColumns = fullColumns[j];
                var numberColumns = counterEmptySpaces.columns.length;
                result.push(instanceFullTableData[(numberColumns * i) + indexColumns])
            }
        }

        visualizedData = result;
        return result;
    }


    TableDataModel.prototype.updateTableData = function (value, index) {
        visualizedData[index] = value;
        // new Data To Save!!
        var indexRow = this.findIfUpdateOrNewValue(value)
        if (typeof indexRow == 'undefined') {
            originalData.push(value);
            newData.push(visualizedData[index])
        } else {
            visualizedData[indexRow] = value;
            this.pushInUpdatedData(visualizedData[index])
        }
    }


    // find if it 's new or updated
    TableDataModel.prototype.findIfUpdateOrNewValue = function (value) {
        var indexRow;
        var allKeyIndexes = leftIndexes.concat(upIndexes);
        var found = false;
        for (var i = 0; i < visualizedData.length && !found; i++) {
            var row = visualizedData[i];
            if (value[allKeyIndexes[0]] == row[allKeyIndexes[0]]) {
                var semiFound = true;
                for (var j = 1; j < allKeyIndexes.length && semiFound; j++) {
                    if (value[allKeyIndexes[j]] != row[allKeyIndexes[j]]) {
                        semiFound = false;
                    } else {
                        if (semiFound && j == allKeyIndexes.length - 1) {
                            indexRow = i;
                            found = true;
                        }
                    }
                }
            }
        }
        return indexRow;
    }


    TableDataModel.prototype.getFullTableData = function () {
        return instanceFullTableData;
    }

    TableDataModel.prototype.getIndexesDoubleColumns = function () {
        return indexesDoubleColumnLeft;
    }

    // return data to save
    TableDataModel.prototype.getDataToSave = function(){
        var result = {
            "updatedData": updatedData,
            "newData" : newData
        }
        return result;
    }

    TableDataModel.prototype.addNewForecast= function(dataArray){
        var mapCodes =supportModel.getMapCodes()
        var data = this.getTableData();
        for(var i =0;i<dataArray.length; i++){
            visualizedData.push(dataArray[i])
            originalData.push(dataArray[i])
            newData.push(dataArray[i])
        }
        visualizedData.sort(function (a,b) {
            if (mapCodes[a["0"]] < mapCodes[b["0"]]) {
                if (a["2"] < b["2"])
                    return -2;
                return -1;
            }
            if (mapCodes[a["0"]]> mapCodes[b["0"]]){
                if (a["2"]> b["2"])
                    return 2;
                return 1;
            }else{
                if (a["2"] < b["2"])
                    return -1;
                if (a["2"]> b["2"])
                    return 1;
                return 0;
            }
        });
        originalData.sort(function (a,b) {
            if (mapCodes[a["0"]] < mapCodes[b["0"]]) {
                if (a["2"] < b["2"])
                    return -2;
                return -1;
            }
            if (mapCodes[a["0"]]> mapCodes[b["0"]]){
                if (a["2"]> b["2"])
                    return 2;
                return 1;
            }else{
                if (a["2"] < b["2"])
                    return -1;
                if (a["2"]> b["2"])
                    return 1;
                return 0;
            }
        });
        return this.getTableData()
    }

    TableDataModel.prototype.updateDataFromOtherUsesForm = function(productionData){
        var dateInvolved = productionData[0][2];
        var indexes = {"15": true, "21":true, "34":true, "28":true, "29":true,"30":true,"31":true,"32":true,"33":true} ;

        debugger;
        // if there's Area planted
        var tableData = this.getTableData();
        var allData = this.getAllData();

        // take the indexes from the table data and the all data
        var indexesTableData = this.getAllIndexesRequested(tableData, indexes, dateInvolved);
        var indexesAllData = this.getAllIndexesRequested(allData, indexes, dateInvolved);

        // put in updatedData
        for(var i =0; i<productionData.length; i++){
            this.pushInUpdatedData(productionData[i])
        }

        // save the data
        this.saveDataFromIndexes('table',indexesTableData,productionData);
        if(indexesAllData.length >0) {
            this.saveDataFromIndexes('original', indexesAllData, productionData);
        }
        return indexesTableData;

    }

    TableDataModel.prototype.updateDataFromRiceProductionForm = function(productionData){
        var dateInvolved = productionData[0][2];
        var indexes = (productionData.length>3)? {"4": true, "2":true, "5":true, "37":true, "998":true,"3":true} : {"4":true, "5":true, "2":true};

        // if there's Area planted
        var tableData = this.getTableData();
        var allData = this.getAllData();

        // take the indexes from the table data and the all data
        var indexesTableData = this.getAllIndexesRequested(tableData, indexes, dateInvolved);
        var indexesAllData = this.getAllIndexesRequested(allData, indexes, dateInvolved);

        // put in updatedData
        for(var i =0; i<productionData.length; i++){
            this.pushInUpdatedData(productionData[i])
        }

        // save the data
        this.saveDataFromIndexes('table',indexesTableData,productionData);
        if(indexesAllData.length >0) {
            this.saveDataFromIndexes('original', indexesAllData, productionData);
        }
        return indexesTableData;

    }

    TableDataModel.prototype.updateDataFromProductionForm = function(productionData, indTable){
        var dateInvolved = productionData[0][2];
        var indexes = (productionData.length>3)? {"4": true, "2":true, "5":true, "37":true} : {"4":true, "5":true, "2":true};

        // if there's Area planted
        var tableData = this.getTableData();
        var allData = this.getAllData();

        // put in updatedData
        for(var i =0; i<productionData.length; i++){
            this.pushInUpdatedData(productionData[i])
        }

        // take the indexes from the table data and the all data
        var indexesTableData = this.getAllIndexesRequested(tableData, indexes, dateInvolved);
        var indexesAllData = this.getAllIndexesRequested(allData, indexes, dateInvolved);

        // save the data
        this.saveDataFromIndexes('table',indexesTableData,productionData);
        if(indexesAllData.length >0) {
            this.saveDataFromIndexes('original', indexesAllData, productionData);
        }
        return indexesTableData;
    }

    TableDataModel.prototype.pushInUpdatedData = function(value){
        var exist = false;
        if(updatedData.length >0) {
            for (var i = 0; i < updatedData.length && !exist; i++) {
                //if keys are equals
                if (value[0] == updatedData[i][0] && value[2] == updatedData[i][2]) {
                    updatedData[i] = value
                    exist = true;
                } else if (i == updatedData.length - 1 && !exist) {
                    updatedData.push(value)
                }
            }
        }else{
            updatedData.push(value)
        }
    }

    // take all indexes
    TableDataModel.prototype.getAllIndexesRequested = function(data,indexes,key){
        var result= []
        var copyIndexes = $.extend(true,[], indexes)
        var foundAll = false;

        // start with TableData

        for(var i =0; i< data.length && !foundAll; i++){
            if(data[i][2] == key  && indexes[data[i][0]]){
                result.push({"key": data[i][0], "index":i})
                indexes[data[i][0]] = false;
            }
        }
        return result;
    }


    TableDataModel.prototype.saveDataFromIndexes = function(model, indexes, productionData){
        var modelData;
        modelData = (model == 'table')? this.getTableData() : this.getAllData();
        for (var i=0; i<indexes.length; i++) {
            for (var j = 0; j < productionData.length; j++) {
                if( modelData[indexes[i]['index']][0] == productionData[j][0]) {
                    (model == 'table')? this.setTableDataModel(indexes[i]['index'], productionData[j]) :
                        this.setAllDataModel(indexes[i]['index'], productionData[j])
                }
            }
        }
    }

    return TableDataModel;
})