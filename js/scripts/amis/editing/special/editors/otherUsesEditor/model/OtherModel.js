/**
 * Created by fabrizio on 9/30/14.
 */
define(['jquery'], function($){

    var supportUtility, originalModel, newItems;

    // URL

    var map = {
        15: "Other Uses",
        21: "Seeds",
        34 : "Post Harvest Losses",
        28: "Industrial Use",
        29: "Malt",
        30: "Biofuel",
        31: "Sweeteners",
        32 : "Starch",
        33 : "Others"

    }

    function OtherModel(){}


    OtherModel.prototype.initializeModel = function(key, label, date){
        var result = []
        result[0] = key;
        result[1] = "Thousand tonnes";
        result[2] = date;
        result[3] = null;
        result[4] = null;
        result[5] = null;
        result[6] = label;
        return result;

    }

    OtherModel.prototype.createTotalValuesModel = function(itemsInvolved, utilitySupport){
        newItems = []
        var copyMap = $.extend([], true, map);
        var result = []
        supportUtility = utilitySupport;
        var dataModel = $.extend(true, [], itemsInvolved);

        for(var key in copyMap){
            var found = false
            label1:
            for(var i =0; i<dataModel.length && !found; i++){
                if(dataModel[i][0] == key){
                    result.push(dataModel[i])
                    result[result.length-1].push(copyMap[key])
                    found = true;
                    break label1;
                }else if(i == dataModel.length -1 && !found){
                    result.push(this.initializeModel(key, copyMap[key], dataModel[i][2]))
                }
            }
        }
        result.splice(result.length-1,1)

        originalModel = $.extend(true,[], result);
    }

    OtherModel.prototype.getTotalValuesModel = function(){
        var result = originalModel;
        return result;
    }

    OtherModel.prototype.setOriginalTotalData = function(rowNumber, value, columnNumber){
        debugger;
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

    return OtherModel;
})