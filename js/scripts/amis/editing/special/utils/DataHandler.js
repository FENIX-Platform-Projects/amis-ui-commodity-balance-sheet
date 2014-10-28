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
        var stillNotFound = []
        for(var i = 0, length = copyCodes.length; i<length; i++){

           var notFound = true;
           for( var h = 0, lengthTable = tableData.length; h<lengthTable; h++){

               if(copyCodes[i] == tableData[h][0] && tableData[h][2] == date){
                   result.push(tableData[h])
                   notFound = false
               }

               else if(notFound && h == (lengthTable-1)){

                   for(var k= 0, lengthAlldata = data.length; k<lengthAlldata && notFound; k++){
                       if(copyCodes[i] == data[k][0] && data[k][2] == date){
                           result.push(data[k])
                           notFound = false
                       }
                       else if(notFound && k == (lengthAlldata-1)){
                           stillNotFound.push(copyCodes[i])
                           notFound = false
                       }
                   }
               }
           }
        }
        result = this.checkIfEveryElementExist(result)

        return result;
    }


    DataHandler.prototype.checkIfEveryElementExist = function(model){
        var result = [];

        for(var i = 0, length = model.length; i<length; i++){
            if(model[i].length != 6){
               var measurementUnit;
               switch(model[i][0]){
                   case 37:
                       measurementUnit=  'Thousand Tonnes';
                       break;
                   default :
                       measurementUnit=  'Thousand Tonnes';
                        break;
               }
                var row = []
               for(var n=0; n<6; n++){
                   if( n==0 || n==2){
                       row.push(model[i][n])
                   }else if(n ==1){
                       row.push(measurementUnit)
                   }else{
                       row.push(null)
                   }
               }
               result.push(row)
            }else{
                result.push(model[i])
            }
        }
        return result;
    }

    return DataHandler;
})