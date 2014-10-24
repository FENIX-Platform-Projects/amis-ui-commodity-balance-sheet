/**
 * Created by fabrizio on 9/15/14.
 */
define(["jquery",  "urlConfigurator"], function($, ServicesURL){

// models
   var originalData, totalCropsData, originalTotalCropsModel, originalSingleCropsModel, calculatedTotalModel, calculatedSingleModel;

// variables
    var numberOfCrops;

// Modules
    var supportUtility, Services;

// URL
    var cropsUrl;

    var map=  {
        2 : "Area Harvested",
        5 : "Production",
        4 : "Yield",
        37: "Area Planted"
    }

    function ProductionModel(){
        Services = new ServicesURL;
        Services.init();
        cropsUrl = Services.getCropsNumberUrl()
    }

    ProductionModel.prototype.getTotalCropsModel = function(involvedItems, Utility){
        originalData = involvedItems;
        debugger;

        var result;
        supportUtility = Utility;
        var modelData = $.extend([], true, involvedItems)
        result = this.convertOriginalToModelDataTotal('total', modelData);

        return result;
    }

    ProductionModel.prototype.adjustData = function(model){

    }

    ProductionModel.prototype.getOriginalTotalCropsModelOriginalConverted  =function(){
        console.log('getOrinalTotalCro')
        var model = $.extend(true,[],this.getOriginalTotalCropsModel())
        for(var i=0;i<model.length; i++){
            model[i].splice(6,1)
        }
        return model;
    }

    ProductionModel.prototype.setOriginalData = function(rowNumber, value, columnNumber){
        if(columnNumber == 3){
            originalTotalCropsModel[rowNumber][columnNumber] = parseFloat(value);
        }else {
            originalTotalCropsModel[rowNumber][columnNumber] = value;
        }
    }

    ProductionModel.prototype.getSingleCropsModel = function(involvedItemsSingleCrops, Utility){
        var result;
        var cropsNumber = this.getCropsNumber();
        var modelDataSingCrops = $.extend([], true, involvedItemsSingleCrops)
        result =this.convertOriginalToSingleCrops(modelDataSingCrops, cropsNumber);
        return result;
    }

    ProductionModel.prototype.getOriginalTotalCropsModel = function(){
        return originalTotalCropsModel;
    }

    ProductionModel.prototype.getOriginalSingleCropsModel = function(){
        return originalSingleCropsModel;

    }

    ProductionModel.prototype.getOriginalData = function(){
        return originalData;
    }

    ProductionModel.prototype.getModelData = function(){
        return modelData;
    }

    ProductionModel.prototype.convertOriginalToModelDataTotal = function(modality, modelData){
        var result = [];
        var dataModel = $.extend([],true,modelData);
        var copyMap = $.extend([], true, map);
        if(modality == 'total') {
            // delete Area Planted from object
            delete copyMap[37]
            for(var i =0; i< dataModel.length; i++){
                if(dataModel[i][0] == 37){
                    dataModel.splice(i,1)
                }
            }
        }
        for(var i =0; i< dataModel.length; i++){
            result[i] = $.extend([],true,dataModel[i])
            var code = dataModel[i][0]
            result[i].push(copyMap[code])
        }
        originalTotalCropsModel = $.extend(true,[], result);
        return result;
    }

    ProductionModel.prototype.convertOriginalToSingleCrops = function(modelData, cropsNumber){

        var result = [];
        var dataModel = $.extend([],true,modelData);
        var copyMap = $.extend([], true, map);
        for(var j =0; j< cropsNumber ; j++) {
            console.log('converting!!')
            for (var i = 0; i < dataModel.length; i++) {
                var index =  (j*dataModel.length )+i;
                console.log('index!!')
                console.log(index);
                console.log(j +", " +i+ "+, +"+index+ " length DM: "+dataModel.length)
                result[index] = []
                for(var x =0; x< dataModel[i].length +2; x++) {
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
        originalSingleCropsModel = $.extend(true,[], result);
        return result;
    }

    ProductionModel.prototype.convertModelDataToOriginal = function(){

    }

    ProductionModel.prototype.createSingleCropModel = function(numberOfCrops,modelData){
        // To create like the modelData, but with something different( the Area Planted)

    }

    ProductionModel.prototype.getCropsNumber = function(){

            var filterData = supportUtility.getFilterData()
            // if it is a new instance
            if(typeof filterCrops == 'undefined' || (filterCrops.regionCode !=filterData.countryCode || filterCrops.productCode != filterData.productCode )){
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

        return numberOfCrops;

    }

    ProductionModel.prototype.filterModelSingleFromCrops = function( allData){
        var result = [];
        for(var n=0; n< numberOfCrops; n++) {
            for (var i = 0; i < allData.length; i++) {
                if (allData[i][7] == n+1) {
                    result.push(allData[i]);
                }
            }
        }
        return result;
    }

    ProductionModel.prototype.setOriginalCropsData = function(newValue, rowNumber, columnValue){
        originalSingleCropsModel[rowNumber][columnValue] = newValue;
    }

    ProductionModel.prototype.createSingleCalculatedModel = function(calculatedDataFromCrops){
       var result = [];
        for( var i =0; i< calculatedDataFromCrops.length; i++){
            if(i==0){
                result = calculatedDataFromCrops[i]
            }else{
                result  = result.concat(calculatedDataFromCrops[i])
            }
        }
        return result
    }

    ProductionModel.prototype.setCalculatedTotalModel = function(calculatedModel){
        calculatedTotalModel = calculatedModel
    }

    ProductionModel.prototype.getCalculatedTotalModel = function(){
        var result = $.extend(true, [], calculatedTotalModel);
        // remove description of element
        for( var i=0; i<result.length; i++){
            result[i].splice(6,1)
        }
        return result;
    }

    ProductionModel.prototype.setCalculatedSingleModel = function(calculatedModel){
        calculatedSingleModel = calculatedModel;
    }

    ProductionModel.prototype.getCalculatedSingleModel = function(){
        var result = calculatedSingleModel;
        return result;
    }


    ProductionModel.prototype.unifySingleCropsData = function(singleCropsData){
        var result = [];
        var listChecked = {}
        // check if total values need to be changed
        var calculatedModelSingle = this.getCalculatedSingleModel()
        if(this.checkIfCompletedSingleCrops(calculatedModelSingle)) {
            // case number of crops ==1
             var elementPosition = 0
             for (var i = 0; i < singleCropsData.length; i++) {
                 var code = singleCropsData[i][0]
                 if(code != 'undefined' && code != null && code != "" && typeof listChecked[singleCropsData[i][0]] == 'undefined') {
                    listChecked[singleCropsData[i][0]] = elementPosition;
                    var row = [ singleCropsData[i][0],singleCropsData[i][1], singleCropsData[i][2], singleCropsData[i][3],null, null ,singleCropsData[i][6] ]
                    result.push(row)
                    elementPosition++;
                 }else{
                     var indexList = listChecked[singleCropsData[i][0]]
                     result[indexList][3] += singleCropsData[i][3]
                 }
             }
        }
        return result;
    }

    ProductionModel.prototype.checkIfCompletedSingleCrops = function(singleCropsData){
        var result = false;
        for( var i =0; i< singleCropsData.length && !result ; i++){
            var flag = singleCropsData[i][4]
            if(typeof flag != "undefined" && flag != null && flag != "" )
                result = true;
        }
        return result;
    }

    ProductionModel.prototype.getAreaPlanted = function(){
        var result;
        var originalSingleCrops = $.extend(true, [],this.getOriginalSingleCropsModel());
        for(var i = 0, length = originalSingleCrops.length; i<length; i++){
           if(originalSingleCrops[i][0] == 37) {
               if (result) {
                   result[3] += originalSingleCrops[i][3]
               }
               else{
                   result = originalSingleCrops[i]
               }
           }
        }
        return result;
    }

    return ProductionModel;

})