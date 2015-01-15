
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
        3: "Extraction Rate"


    }

    function PaddyModel() {
        Services = new ServicesUrl;
        Services.init()
        cropsUrl = Services.getCropsNumberUrl()
    }

    PaddyModel.prototype.init = function () {
    }

    PaddyModel.prototype.createTotalValuesModel = function (itemsInvolved, utilitySupport) {
        console.log('paddyModel: createTotalValues Model')
        var copyMap = $.extend([], true, map);
        var result = []
        supportUtility = utilitySupport;
        var dataModel = $.extend(true, [], itemsInvolved);
        ;
        for (var i = 0; i < dataModel.length; i++) {
            if (dataModel[i].length == 3 || dataModel[i].length == 2) {
                dataModel[i] = this.initializePaddyProduction(dataModel[i])
            }
            var code = dataModel[i][0]
            if (i > 5) {
                result[i - 1] = $.extend(true, [], dataModel[i])
                result[i - 1].push(copyMap[code])
            } else if (code != 37) {
                result[i] = $.extend(true, [], dataModel[i])
                result[i].push(copyMap[code])
            }
        }
        console.log('originalTotalCrospModel')
        console.log(originalTotalCropsModel)
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
            console.log('converting!!')
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
                            result[index][x] = copyMap[dataModel[i][0]];
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
        for (var i = 0; i < 6; i++) {
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

    PaddyModel.prototype.setCalculatedTotalModel = function (calculatedModel) {
        calculatedTotalModel = calculatedModel
    }

    PaddyModel.prototype.getCalculatedTotalModel = function () {
        var result = calculatedTotalModel;
        return result;
    }

    PaddyModel.prototype.setCalculatedSingleModel = function (calculatedModel) {
        console.log('setCalucaletd model')
        calculatedSingleModel = calculatedModel;
    }


    PaddyModel.prototype.createSingleCalculatedModel = function (calculatedDataFromCrops, originalData) {
        calculatedSingleModel = $.extend(true, [], originalData);
        for (var i = 0; i < calculatedDataFromCrops.length; i++) {
            for (var k = 0; k < calculatedDataFromCrops[i].length; k++) {
                for (var j = 0; j < originalData.length; j++) {
                    if (calculatedDataFromCrops[i][k][7] == originalData[j][7] &&
                        calculatedDataFromCrops[i][k][0] == originalData[j][0]) {
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
        console.log('getAnd convert originalTot Values')
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
        console.log('unifySingleCropsDAta')
        var result = [];
        var listChecked = {}
        // check if total values need to be changed
        var calculatedModelSingle = this.getCalculatedSingleModel()
        if (this.checkIfCompletedSingleCrops(calculatedModelSingle)) {
            // case number of crops ==1
            var elementPosition = 0
            for (var i = 0; i < singleCropsData.length; i++) {
                var code = singleCropsData[i][0]
                if (code != 'undefined' && code != null && code != "" && typeof listChecked[singleCropsData[i][0]] == 'undefined') {
                    listChecked[singleCropsData[i][0]] = elementPosition;
                    var row = [ singleCropsData[i][0], singleCropsData[i][1], singleCropsData[i][2], singleCropsData[i][3], null, null , singleCropsData[i][6] ]
                    result.push(row)
                    elementPosition++;
                } else {
                    var indexList = listChecked[singleCropsData[i][0]]
                    result[indexList][3] += singleCropsData[i][3]
                }
            }
        }
        return result;
    }

    PaddyModel.prototype.checkIfCompletedSingleCrops = function (singleCropsData) {
        var result = false;
        for (var i = 0; i < singleCropsData.length && !result; i++) {
            var flag = singleCropsData[i][4]
            if (typeof flag != "undefined" && flag != null && flag != "")
                result = true;
        }
        return result;
    }

    return PaddyModel;
})