/**
 * Created by fabrizio on 10/4/14.
 */
define(['jquery'], function ($) {

    var filterActual, realPreviousDataToSave, realActualDataToSave, previousYearForecast, actualYearForecasts,
        actualYearForecasts, previousYearForecast, supportUtility, realPreviousDate;

    function SavingModel() {
    }

    SavingModel.prototype.init = function (SupportUtility) {
        supportUtility = SupportUtility;
        /*
         3 type of data: Actual Year, PRev Year, updated Data, New Data

         STEP 0) Divide actualYear from Previous Year

         -------------------------------------
         Actual Year :
         -------------------------------------
         1) Clean calculated Data (V)
         2) Set right Date format (V)
         3) Merge with READY updated Data
         4) Add(if exist) READY newData
         4) divide on forecast date


         -------------------------------------
         Previous Year:
         -------------------------------------
         1) Clean calculated Data(V)
         2) Put the right Date(V)
         2) Set right Date format(V)
         3) Merge with READY updated Data


         -------------------------------------
         Updated Data
         -------------------------------------
         1) Clean calculated Data
         2) Set right Date format

         */
    }

    SavingModel.prototype.prepareData = function (alldata, tableData, newData, actualFilter, realPreviousYearDate) {
        realPreviousDate = realPreviousYearDate;
        filterActual = actualFilter;

        //   STEP 0) Divide actualYear from Previous Year

        this.detachPreviousYearFromActual(alldata);

        // for updatedData and new Data
        var newDataCurrentYear = []
        var newDataPreviousYear = []
        for (var i = 0, length = newData.updatedData.length; i < length; i++) {
            if (newData.updatedData[i][2] == '20000103') {
                newDataPreviousYear.push(newData.updatedData[i])
            } else {
                newDataCurrentYear.push(newData.updatedData[i])
            }

        }
        var cleanedNewDataCurrentYear = this.cleanAndSetDate(newDataCurrentYear)
        var cleanedNewDataPreviousYear = this.cleanAndSetDate(newDataPreviousYear)

        // Actual Year
        var cleanedActualYear = this.cleanAndSetDate(actualYearForecasts);
        var cleanedPreviousYear = this.cleanAndSetDate(previousYearForecast);

        var actualYearUpdated = this.mergeUpdatedData(cleanedActualYear, cleanedNewDataCurrentYear)

        // Previous Year
        var previousYearUpdated = this.mergeUpdatedData(cleanedPreviousYear, cleanedNewDataPreviousYear)


        // dataOriginals
        realActualDataToSave = actualYearUpdated
        realPreviousDataToSave = previousYearUpdated

    }


    SavingModel.prototype.cleanAndSetDate = function (dataNew) {

        console.log('clean And Set data: saving Model')
        console.log(dataNew)
        debugger;
        var result = []
        for (var i = 0; i < dataNew.length; i++) {
            // clean data
            if (dataNew[i][0] != 1 && dataNew[i][0] != 999 && dataNew[i] != 22) {

                dataNew[i][0] = parseInt(dataNew[i][0])
                // put real date previous year
                if (dataNew[i][2] == '20000103') {
                    dataNew[i][2] = realPreviousDate
                }
                // set right format
                var value = dataNew[i][2]

                if (value.length == 8) {  // if date is in DSD format
                    var year = value.substr(0, 4);
                    var month = value.substr(4, 2);
                    var day = value.substr(6, 2);
                    var date = new Date(year, month - 1, day);
                    dataNew[i][2] = moment(date).format('YYYY-MM-DD')
                }

                for(var k=0; k<dataNew[i].length; k++) {
                    if (dataNew[i][k] == '') dataNew[i][k] = null
                }

                result.push(dataNew[i])
            }
        }
        return result;
    }

    SavingModel.prototype.mergeUpdatedData = function (myData, updatedData) {
        var result = $.extend(true, [], myData);

        var toAdd = [];
        for (var i = 0, length = updatedData.length; i < length; i++) {
            var found = false;
            for (var j = 0, lengthUpdated = result.length; j < lengthUpdated; j++) {
                if (result[j][0] == updatedData[i][0] && result[j][2] == updatedData[i][2]) {
                    result[j] = updatedData[i]
                }else if(j == lengthUpdated-1 &&(result[j][0] != updatedData[i][0] || result[j][2] != updatedData[i][2])){

                    toAdd.push(updatedData[i])
                }
            }
        }

        if(toAdd.length>0) this.addInRightPositionForDate(toAdd,result)

        console.log(result);

        return result;
    }


    SavingModel.prototype.addInRightPositionForDate = function(toAdd, previousValues){


      for(var i =0; i<toAdd.length; i++){
          var notFound = true;
          for(var j=0; j<previousValues.length && notFound; j++){
              if(previousValues[j][2] == toAdd[i][2]){
                  previousValues.splice(j,0,toAdd[i])
                  notFound = false;
              }
          }
      }

    }


    SavingModel.prototype.preparePutPayload = function (isActualYear) {
        var filterData = supportUtility.getFilterData()
        var prevSeason = supportUtility.getPreviousSeasonLabel()

        var result = {};

        if (isActualYear) {
            result['filter'] = {
                "region": filterActual.region,
                "product": filterActual.product,
                "year": filterActual.year,
                "season": filterData.season,
                "datasource": filterData.dataSource
            }
            result["data"] = realActualDataToSave
        }

        else {
            result['filter'] = {
                "region": filterActual.region,
                "product": filterActual.product,
                "year": filterActual.year - 1,
                "season": prevSeason,
                "date": realPreviousDate,
                "datasource": filterData.dataSource
            }
            result["data"] = realPreviousDataToSave
        }
        return result;
    }

    SavingModel.prototype.splitDataWithDate = function (model) {

        var result = []
        var date = {}
        date[model[0][2]] = true;
        var index = 0;
        result[index] = model[0]
        for (var i = 0; i < model.length; i++) {
            if (date[model[i][2]]) {
                result[index].push(model[i])
            } else {
                index++;
                date[model[i][2]] = true;
                result[index] = model[i]
            }
        }
        return result;

    }


    SavingModel.prototype.detachPreviousYearFromActual = function (model) {
        actualYearForecasts = []
        previousYearForecast = []
        for (var i = 0, length = model.length; i < length; i++) {
            if (model[i][2] == '20000103') {
                previousYearForecast.push((model[i]))
            } else {
                actualYearForecasts.push(model[i])
            }
        }
    }

    return SavingModel;
})