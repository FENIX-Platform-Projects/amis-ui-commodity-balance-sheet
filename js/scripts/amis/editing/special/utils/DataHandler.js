/**
 * Created by fabrizio on 9/11/14.
 */
define(['jquery'], function($){

    var originalData;

    function DataHandler(){};

    DataHandler.prototype.init = function(){

    }

    DataHandler.prototype.orderAndGetByDate = function(data, requestedDate){
        var result = [];
        originalData = data;
        var dataOrderedByDate = $.extend(true, [], cellTableModel2);
        dataOrderedByDate.sort(function (a,b) {
            if (a["2"] < b["2"])
                return -1;
            if (a["2"]> b["2"])
                return 1;
            return 0;
        });

        var startRightDate = 0;
        // return all the data of the column( the date)
        for(var i = 0; i<dataOrderedByDate.length && startRightDate !=2; i++){
            if(dataOrderedByDate[i] == requestedDate ){
                startRightDate =1
                result.push(dataOrderedByDate[i])
            }else if(dataOrderedByDate[i] != requestedDate &&  startRightDate ==1){
                startRightDate =2
            }
        }
        return result;
    }

    DataHandler.prototype.getOriginalData = function(){
        return originalData;
    }

    DataHandler.prototype.getDataFromCodes = function(data, codes){

        var result = [] ;
        for( var j=0; j< codes.length; j++ ) {
            var found = false;
            for (var i = 0; i < data.length && !found; i++) {
                if(data[i][0] == codes[j]) {
                    result.push(data[i])
                    found = true;
                }
            }
        }
        return result;
    }

    DataHandler.prototype.getInvolvedData = function(codes, data2, tableData2,cell){

        var data = $.extend([],true,data2);
        var tableData = $.extend([],true,tableData2);
        var result = [];
        var copyCodes = $.extend([], true, codes);
        var date = cell[2];
        var eliminatedValues = []
        for(var j = 0; j< copyCodes.length && eliminatedValues.length<copyCodes.length; j++) {
            for (var i = 0; i < tableData.length && eliminatedValues.length < copyCodes.length; i++) {
                if (tableData[i][0] == copyCodes[j] && tableData[i][2] == date) {
                    eliminatedValues.push(tableData[i][0])
                    result.push(tableData[i])
                }
            }
        }
        // the remaining list
        if(eliminatedValues.length < copyCodes.length){
            for(var j = 0; j< copyCodes.length && eliminatedValues.length<copyCodes.length; j++){
                for(var i =0; i< data.length && eliminatedValues.length<copyCodes.length; i++){
                    if(data[i][0] == copyCodes[j] && data[i][2] == date && eliminatedValues.indexOf(data[i][0])){
                        eliminatedValues.push(data[i][0])
                        result.push(data[i])
                    }
                }
            }
        }

        return result;
    }

    return DataHandler;
})