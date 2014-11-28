define(['jquery'], function($){

    var supportUtility, filterActual, seasonDateMap;


    function SavingAnnualModel(){}


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
        debugger;
        filterActual = actualFilter;


        var dataOriginal = allData;

        var dataMerged  =this.mergeUpdatedData(dataOriginal, newdata.updatedData)

        var dataCleaned = this.cleanData(dataMerged);

        var dataReadyForPayload = this.createDataForPayload(dataCleaned, handlerAnnual)

        debugger;
        var dataWithPayload = this.preparePutPayload(dataReadyForPayload,handlerAnnual)
        debugger;

        return dataWithPayload;



    }


    SavingAnnualModel.prototype.mergeUpdatedData = function (myData, updatedData) {
        var result = $.extend(true, [], myData);

        for (var i = 0, length = updatedData.length; i < length; i++) {
            var found = false;
            for (var j = 0, lengthUpdated = result.length; j < lengthUpdated; j++) {
                if (result[j][0] == updatedData[i][0] && result[j][2] == updatedData[i][2]) {
                    result[j] = updatedData[i]
                }
            }
        }
        return result;
    }


    SavingAnnualModel.prototype.cleanData = function (dataNew) {
        var result = []
        for (var i = 0; i < dataNew.length; i++) {
            // clean data
            if (dataNew[i][0] != 1 && dataNew[i][0] != 999 && dataNew[i] != 22) {

                dataNew[i][0] = parseInt(dataNew[i][0])
                // put real date previous year

                if (dataNew[i][3] == '') {
                    dataNew[i][3] = null;
                }

                result.push(dataNew[i])
            }
        }
        return result;
    }


    SavingAnnualModel.prototype.createDataForPayload = function (allData, Handler) {
        debugger;

        var result = {}

        seasonDateMap = Handler.getSeasonMapDate()



        for(var i = 0, length = allData.length;i<length; i++){

            var tempSeason = allData[i][2]
            var tempData = allData[i];

            var season  =tempData[2]

            tempData[2]  =seasonDateMap[season]

            if(typeof result[tempSeason] === 'undefined'){
                result[tempSeason] = []
            }
                result[tempSeason].push(tempData);

        }

        return result

    }



    SavingAnnualModel.prototype.preparePutPayload = function (dataWithSeason, Handler) {
        var filterData = supportUtility.getFilterData()
        var seasonYearMap  = Handler.getSeasonYearMap()

        var payLoads = [];


        for(var season in dataWithSeason){
            var singlePayload = {};
            singlePayload['filter'] = {
                "region": filterData.countryCode,
                "product": filterData.productCode,
                "year": seasonYearMap[season],
                "season": season,
                "date" : seasonDateMap[season],
                "datasource": filterData.dataSource
            }
            singlePayload["data"] = dataWithSeason[season]
            payLoads.push(singlePayload)
        }

        debugger;



        return payLoads;
    }



    return SavingAnnualModel;

})