/**
 * Created by fabrizio on 10/4/14.
 */
define(['jquery'], function(){

    var filterActual, realPreviousDate, realDataToSave, previousYearForecast, actualYearForecasts;

    function SavingModel(){}

    SavingModel.prototype.init = function(){}

    SavingModel.prototype.prepareData = function(alldata, tableData, newData,actualFilter, realPreviousYearDate){
        realPreviousDate = realPreviousYearDate;
        filterActual = actualFilter;

        // dataOriginals

        debugger;

        var allDataCleaned = this.cleanNewData(actualYearForecasts);
        var allDataWithRealDate = this.setRealDate(allDataCleaned)
        var allDataRightDate = this.setRightDateFormat(allDataCleaned)

        // data Updated
        var trueAllData = this.setRealDate(newData.updatedData)
        var trueNewUpdatedData = this.setRightDateFormat(trueAllData)

        if(typeof newData.newData!= 'undefined' && newData.length > 0){

            var trueNewData = this.cleanNewData(newData.newData)
            // set the rightDateFormat
            var newDataRightDate = this.setRightDateFormat(trueNewData)
            trueNewUpdatedData = this.mergeNewDateWithUpdatedDate(trueNewUpdatedData, newDataRightDate)
        }
        // now I have the new Data clean, ready to merge with allData
        var dataToSplit = this.mergeNewDateWithUpdatedDate(allDataRightDate, trueNewUpdatedData);

        realDataToSave = this.splitDataWithDate(dataToSplit);
        debugger;
    }

    SavingModel.prototype.setRealDate = function(model){
        previousYearForecast = [];
        actualYearForecasts = [];
        var result = []
        for( var i=0; i< model.length; i++){
            if(model[i][2] == '20000103'){
                model[i][2] = realPreviousDate
                previousYearForecast.push(model[i])
            }
            actualYearForecasts.push(model[i])

            result.push(model[i])
        }
        return result;
    }

    SavingModel.prototype.cleanNewData = function(dataNew){
        var result = []
        for(var i =0; i<dataNew.length; i++){
            if(dataNew[i][0] != 1 && dataNew[i][0] != 999 && dataNew[i] != 22){
                result.push(dataNew[i])
            }
        }
        return result;
    }

    SavingModel.prototype.mergeNewDateWithUpdatedDate = function(dataUnique, dataToMerge){
        var result = []
        result = $.extend(true,[],dataUnique);
        for(var i =0; i<dataToMerge.length; i++){
            var exist = false
            for(var j =0; j<dataUnique.length && !exist; j++){
                // if exist
                if(dataUnique[j][0] == dataToMerge[i][0] && dataUnique[j][2] == dataToMerge[i][2]){
                    result[j] = dataToMerge[i]
                    exist = true;
                }else if(j == dataUnique.length-1 && !exist){
                    result.push(dataToMerge[i])
                }
            }
        }
        return result;
    }

    SavingModel.prototype.setRightDateFormat = function(model){
     var result = []
        for(var i =0; i< model.length; i++){
            var value = model[i][2]
            // if date is in DSD format
            if(value.length == 8) {
                var year = value.substr(0, 4);
                var month = value.substr(4, 2);
                var day = value.substr(6, 2);
                var date = new Date(year, month - 1, day);
                model[i][2] = moment(date).format('YYYY-MM-DD')
            }
            result.push(model[i])
        }
        return result;
    }

    SavingModel.prototype.preparePutPayload = function(){
        var result = {};
        result['filter'] = {
            "region": filterActual.region,
            "product": filterActual.product,
            "year": filterActual.year
        }
        result["data"] = realDataToSave
        return result;
    }

    SavingModel.prototype.splitDataWithDate = function(model){

        var result = []
        var date = {}
        date[model[0][2]] = true;
        var index = 0;
        result[index] =model[0]
        for(var i=0 ; i< model.length; i++){
            if( date[model[i][2]]){
                result[index].push(model[i])
            }else{
                index++;
                date[model[i][2]] = true;
                result[index]= model[i]
            }
        }
        return result;

    }

    return SavingModel;
})