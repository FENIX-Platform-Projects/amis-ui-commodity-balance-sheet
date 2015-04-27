
define(['jquery', "urlConfigurator"], function ($, ServicesUrl) {

    var supportUtility, originalTotalCropsModel, numberOfCrops, originalSingleCropsModel, calculatedSingleModel, calculatedTotalModel;

    var Services;
    // URL
    var cropsUrl;

    var map = {
        2: "Area Harvested",
        5: "Production",
        4: "Yield Milled",
        37: "Area Planted",
        998: "Production Paddy",
        996: "Yield Paddy",
        3: "Extraction Rate (%)"
    }

    var positionDB = {
        "code":0,
        "value":3,
        "flag":4,
        "notes":5
    }

    function PaddyModel() {
        Services = new ServicesUrl;
        Services.init()
        cropsUrl = Services.getCropsNumberUrl()
    }

    PaddyModel.prototype.init = function () {
    }

    PaddyModel.prototype.createTotalValuesModel = function (itemsInvolved, utilitySupport) {
        var copyMap = $.extend([], true, map);
        var result = []
        supportUtility = utilitySupport;
        var dataModel = $.extend(true, [], itemsInvolved);
        for (var i = 0; i < dataModel.length; i++) {
            if (dataModel[i].length == 3 || dataModel[i].length == 2) {
                dataModel[i] = this.initializePaddyProduction(dataModel[i])
            }
           result[i] = $.extend(true, [], dataModel[i])
           result[i].push(copyMap[dataModel[i][positionDB.code]])
        }
        originalTotalCropsModel = $.extend(true, [], result);
    }

    PaddyModel.prototype.getTotalValuesModel = function () {
        var result = originalTotalCropsModel;
        return result;
    }

    PaddyModel.prototype.setOriginalTotalData = function (rowNumber, value, columnNumber) {

        if (columnNumber == 3 && (value != "" && value != null && typeof value !== 'undefined')) {
            originalTotalCropsModel[rowNumber][columnNumber] = parseFloat(value);
        } else {
            originalTotalCropsModel[rowNumber][columnNumber] = value;
        }

    }

    PaddyModel.prototype.createSingleCropsModel = function (itemsInvolved, utilitySupport) {
        var result = [];
        var copyMap = $.extend([], true, map);
        supportUtility = utilitySupport;
        var dataModel = $.extend(true, [], itemsInvolved);
        var cropsNumber = this.getCropsNumber();
        for (var j = 0; j < cropsNumber; j++) {
            for (var i = 0; i < dataModel.length; i++) {
                var index = (j * dataModel.length ) + i;


                if (dataModel[i].length == 3 || dataModel[i] == 2) {
                    dataModel[i] = this.initializePaddyProduction(dataModel[i])
                }
                result[index] = []
                for (var x = 0; x < dataModel[i].length + 2; x++) {
                    switch (x) {
                        case 3:
                            result[index][x] = null;
                            break;
                        case dataModel[i].length:
                            result[index][x] = copyMap[dataModel[i][positionDB.code]];
                            break;
                        case dataModel[i].length + 1 :
                            result[index][x] = j + 1;
                            break;
                        default:
                            result[index][x] = dataModel[i][x];
                            break;
                    }
                }
            }
        }
        originalSingleCropsModel = $.extend(true, [], result);
        return result;
    }

    PaddyModel.prototype.initializePaddyProduction = function (row) {
        var result = []
        for (var i = 0; i < Object.keys(map).length; i++) {
            if (i == 0 || i == 2) {
                result[i] = row[i]
            } else {
                result[i] = null
            }
        }
        return result;
    }

    PaddyModel.prototype.getSingleCropsModel = function () {
        var result = originalSingleCropsModel;
        return result;
    }

    PaddyModel.prototype.setOriginalCropsData = function (value, rowNumber, columnNumber) {
        if (columnNumber == 3 && (value != "" && value != null)) {
            originalSingleCropsModel[rowNumber][columnNumber] = parseFloat(value);
        } else {
            originalSingleCropsModel[rowNumber][columnNumber] = value;
        }
    }

    PaddyModel.prototype.getCropsNumber = function () {
        var result;
        var filterData = supportUtility.getFilterData()
        // if it is a new instance
        if (typeof filterCrops == 'undefined' || (filterCrops.regionCode != filterData.countryCode || filterCrops.productCode != filterData.productCode )) {
            var filterCrops = { "regionCode": filterData.countryCode, "productCode": filterData.productCode}

            // first call
            $.ajax({
                async: false,
                url: cropsUrl,
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(filterCrops)

            }).done(function (result) {
                numberOfCrops = result;
            })
        }

        result = numberOfCrops;
        return result;
    }

    PaddyModel.prototype.setCalculatedTotalModel = function (calculatedModel, formulaToApply) {
        calculatedTotalModel = calculatedModel

        // erase other old flags if presents

    }

    PaddyModel.prototype.getCalculatedTotalModel = function () {
        var result = calculatedTotalModel;
        return result;
    }

    PaddyModel.prototype.setCalculatedSingleModel = function (calculatedModel) {
        calculatedSingleModel = calculatedModel;
    }


    PaddyModel.prototype.createSingleCalculatedModel = function (calculatedDataFromCrops, originalData) {
        calculatedSingleModel = $.extend(true, [], originalData);
        for (var i = 0; i < calculatedDataFromCrops.length; i++) {
            for (var k = 0; k < calculatedDataFromCrops[i].length; k++) {
                for (var j = 0; j < originalData.length; j++) {
                    if (calculatedDataFromCrops[i][k][7] == originalData[j][7] &&
                        calculatedDataFromCrops[i][k][positionDB.code] == originalData[j][positionDB.code]) {
                        calculatedSingleModel[j] = calculatedDataFromCrops[i][k]
                    }
                }
            }
        }
        return calculatedSingleModel
    }

    PaddyModel.prototype.filterModelSingleFromCrops = function (allData) {
        var result = [];
        for (var n = 0; n < numberOfCrops; n++) {
            for (var i = 0; i < allData.length; i++) {
                if (allData[i][7] == n + 1) {
                    result.push(allData[i]);
                }
            }
        }
        return result;
    }

    PaddyModel.prototype.getAndConvertOriginalTotValues = function () {
        var model = $.extend(true, [], this.getTotalValuesModel())
        for (var i = 0; i < model.length; i++) {
            model[i].splice(6, 1)
        }
        return model;
    }

    PaddyModel.prototype.getCalculatedSingleModel = function () {
        var result = calculatedSingleModel;
        return result;
    }


    PaddyModel.prototype.unifySingleCropsData = function (singleCropsData) {
        var result = [];
        var listChecked = {}
        // check if total values need to be changed
        var calculatedModelSingle = this.getCalculatedSingleModel()
        if (this.checkIfCompletedSingleCrops(calculatedModelSingle)) {
            // case number of crops ==1
            var elementPosition = 0
            for (var i = 0; i < singleCropsData.length; i++) {
                var code = singleCropsData[i][positionDB.code]
                if (code != 'undefined' && code != null && code != "" && typeof listChecked[singleCropsData[i][positionDB.code]] == 'undefined') {
                    listChecked[singleCropsData[i][positionDB.code]] = elementPosition;
                    var row = [ singleCropsData[i][positionDB.code], singleCropsData[i][1], singleCropsData[i][2], singleCropsData[i][positionDB.value], null, null , singleCropsData[i][6] ]
                    result.push(row)
                    elementPosition++;
                } else {
                    var indexList = listChecked[singleCropsData[i][positionDB.code]]
                    result[indexList][positionDB.value] += singleCropsData[i][positionDB.value]
                }
            }
        }
        return result;
    }

    PaddyModel.prototype.checkIfCompletedSingleCrops = function (singleCropsData) {
        var result = false;
        for (var i = 0; i < singleCropsData.length && !result; i++) {
            var flag = singleCropsData[i][positionDB.flag]
            if (typeof flag != "undefined" && flag != null && flag != "")
                result = true;
        }
        return result;
    }

    PaddyModel.prototype.eraseOldValues = function (rowNumber, isTotalValue) {
        if (isTotalValue) {

            this.resetOldValues(originalTotalCropsModel,rowNumber,positionDB.value, null )
            this.resetOldValues(originalTotalCropsModel,rowNumber,positionDB.flag, null )
            this.resetOldValues(originalTotalCropsModel,rowNumber,positionDB.notes, null )
        }
        else {

            for (var i = 1; i < 3; i++) {
                var rowNumber = rowNumber +(i*7)

                this.resetOldValues(originalSingleCropsModel,rowNumber,positionDB.value, null )
                this.resetOldValues(originalSingleCropsModel,rowNumber,positionDB.flag,null )
                this.resetOldValues(originalSingleCropsModel,rowNumber,positionDB.notes, null )
            }
        }

    }


    PaddyModel.prototype.resetOldValues = function(model, rowNumber, columnNumber, newValue) {
        if (typeof model[rowNumber] !== 'undefined') {

            if(columnNumber=== positionDB.value) {
                if (newValue !== 'undefined' && newValue != null && !isNaN(newValue)) {
                    newValue = parseFloat(newValue)
                } else if (isNaN(newValue) || newValue == '' || newValue == "") {
                    newValue = null;
                }
            }
            model[rowNumber][columnNumber] = newValue;
        }
    }

    return PaddyModel;
})