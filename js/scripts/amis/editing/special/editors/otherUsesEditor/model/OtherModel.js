/**
 * Created by fabrizio on 9/30/14.
 */
define(['jquery'], function($){

    var supportUtility, originalModel, newItems;

    var map = {
        '15': "Other Uses",
        '21': "Seeds",
        '34' : "Post Harvest Losses",
        '28': "Industrial Use",
        '29': "Malt",
        '30': "Biofuel",
        '31': "Sweeteners",
        '32' : "Starch",
        '33' : "Others"

    }

    function OtherModel(){}

    OtherModel.prototype.initializeModel = function(key, label, date){
        var result = []
        result[0] = key;
        result[1] = "Thousand tonnes";
        result[2] = date;
        result[3] = "";
        result[4] = "";
        result[5] = "";
        result[6] = label;
        return result;

    }

    OtherModel.prototype.createTotalValuesModel = function(itemsInvolved, utilitySupport){
        newItems = []
        var copyMap = $.extend([], true, map);
        var result = []
        supportUtility = utilitySupport;
        var dataModel = $.extend(true, [], itemsInvolved);

        var keys = [15,21,34,28,29,30,31,32,33]

        for(var n= 0, length = keys.length; n<length; n++){
            var found = false
            label1:
            for(var i =0; i<dataModel.length && !found; i++){
                if(dataModel[i][0] == keys[n]){
                    result.push(dataModel[i])
                    result[result.length-1].push(copyMap[keys[n]])
                    found = true;
                    break label1;
                }else if(i == dataModel.length -1 && !found){
                    result.push(this.initializeModel(keys[n], copyMap[keys[n]], dataModel[i][2]))
                }
            }
        }
        originalModel = $.extend(true,[], result);
    }

    OtherModel.prototype.getTotalValuesModel = function(){
        var result = originalModel;
        return result;
    }

    OtherModel.prototype.setOriginalTotalData = function(rowNumber, value, columnNumber){
        if(columnNumber == 3){
            originalModel[rowNumber][columnNumber] = parseFloat(value);
        }else {
            originalModel[rowNumber][columnNumber] = value;
        }

    }

    OtherModel.prototype.getAndConvertOriginalTotValues = function(){
        console.log('getAnd convert originalTot Values')
        var model = $.extend(true,[],this.getTotalValuesModel())
        for(var i=0;i<model.length; i++){
            model[i].splice(6,1)
        }
        return model;
    }

    OtherModel.prototype.setOriginalModelValueFromIndex = function(index, value,isWithFlag){
        if(isWithFlag) {
            originalModel[index][3] = value
            originalModel[index][4] = 'C'
        }else{
            originalModel[index][3] = value
        }
    }

    return OtherModel;
})