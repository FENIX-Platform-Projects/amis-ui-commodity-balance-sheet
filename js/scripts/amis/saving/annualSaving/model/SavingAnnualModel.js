define(['jquery'], function ($) {

    var supportUtility, filterActual, seasonDateMap;


    function SavingAnnualModel() {
    }


    SavingAnnualModel.prototype.init = function (SupportUtility) {
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


    SavingAnnualModel.prototype.prepareData = function (allData, tableData, newdata, actualFilter, handlerAnnual) {

        filterActual = actualFilter;

        var dataOriginal = allData;

        var dataMerged = this.mergeUpdatedData(dataOriginal, newdata.updatedData)

        var dataCleaned = this.cleanData(dataMerged);

        var dataReadyForPayload = this.createDataForPayload(dataCleaned, handlerAnnual)

        var dataWithPayload = this.preparePutPayload(dataReadyForPayload, handlerAnnual)

        return dataWithPayload;

    }


    SavingAnnualModel.prototype.mergeUpdatedData = function (myData, updatedData) {
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

        return result;
    }


    SavingAnnualModel.prototype.addInRightPositionForDate = function(toAdd, previousValues){


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


    SavingAnnualModel.prototype.cleanData = function (dataNew) {
        var result = []
        for (var i = 0; i < dataNew.length; i++) {
            // clean data
            if (dataNew[i][0] != 1 && dataNew[i][0] != 999 && dataNew[i] != 22) {

                dataNew[i][0] = parseInt(dataNew[i][0])
                // put real date previous year

                for(var k=0; k<dataNew[i].length; k++) {
                    if (dataNew[i][k] === '') dataNew[i][k] = null
                }

                if(dataNew[i][3]!= null && dataNew[i][2]!=null && typeof dataNew[i][2]!= 'undefined') {
                    result.push(dataNew[i])
                }
            }
        }
        return result;
    }


    SavingAnnualModel.prototype.createDataForPayload = function (allData, Handler) {



        var result = {}

        seasonDateMap = Handler.getSeasonMapDate()

        for (var i = 0, length = allData.length; i < length; i++) {

            if(typeof allData[i][2] != 'undefined'){

                var seasonToChange = allData[i][2];

                var rowCopy = $.extend(true,[], allData[i]);

                rowCopy[2] = seasonDateMap[seasonToChange];

                if (typeof result[seasonToChange] === 'undefined') {
                    result[seasonToChange] = []
                }
                result[seasonToChange].push(rowCopy);

            }
        }

        return result

    }


    SavingAnnualModel.prototype.preparePutPayload = function (dataWithSeason, Handler) {
        var filterData = supportUtility.getFilterData()
        var seasonYearMap = Handler.getSeasonYearMap()

        var payLoads = [];


        for (var season in dataWithSeason) {
            var checkIfUnique = function(arrayA, matrixB){

                var result = true;
                for(var i=0; i< matrixB.length && result;  i++){

                    if(matrixB[i][0] == arrayA[0] &&matrixB[i][2] == arrayA[2]){
                        result= false;
                    }
                }

                return result;
            }



            var dataChosen = dataWithSeason[season];
            var newDataWithoutDuplicates = []
            for(var i=0; i<dataChosen.length; i++){

                if(newDataWithoutDuplicates.length == 0){
                    newDataWithoutDuplicates.push(dataChosen[i])
                }else{
                    if(checkIfUnique(dataChosen[i], newDataWithoutDuplicates)){
                        newDataWithoutDuplicates.push(dataChosen[i]);
                    }
                }
            }

            var singlePayload = {};
            singlePayload['filter'] = {
                "region": filterData.countryCode,
                "product": filterData.productCode,
                "year": seasonYearMap[season],
                "season": season,
                "date": seasonDateMap[season],
                "datasource": filterData.dataSource
            }
            singlePayload["data"] = newDataWithoutDuplicates
            payLoads.push(singlePayload)
        }

        return payLoads;
    }


    return SavingAnnualModel;

})