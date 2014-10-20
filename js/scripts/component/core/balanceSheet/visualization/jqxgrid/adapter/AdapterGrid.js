/**
 * Created by fabrizio on 10/10/14.
 */
define(['jquery'], function($){

    var numberOfColumns, differentDates

    function AdapterGrid(){}

    AdapterGrid.prototype.getNumberOfColumns = function(model){
        var result
        differentDates = {};
        if(typeof numberOfColumns != 'undefined'){
            result = numberOfColumns
        }else{
            differentDates[ model[0][2]] = true
            numberOfColumns = 1
            for(var i =0; i< model.length; i++){
               if(typeof differentDates[model[i][2]] === 'undefined'){
                   differentDates[model[i][2]] = true
                   numberOfColumns++;
               }
            }
        }


        result =  numberOfColumns;
        return result;
    }

    AdapterGrid.prototype.getDifferentDates = function() {
        if (typeof differentDates != 'undefined') {
            return differentDates
        }else{
            return null;
        }
    }

    return AdapterGrid;

})
