define(['jquery', 'urlConfigurator'], function ($, ServicesUrl) {

    'use strict'

    var servicesURL, modelData, originalData;

    var o={}


    function PopulationModel(CONF) {

        if(CONF) this.o = CONF;
        servicesURL = new ServicesUrl
        servicesURL.init()
    }


    PopulationModel.prototype.init = function () {

        /*

        var url = './js/scripts/amis/population/example/dataExample.js'

        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function (result) {
                modelData = JSON.parse(result);
            }

        })*/


        var ulrPopulationDataLoading = servicesURL.getPopulationDataURL()
        var filter = {}
        filter['regionCode'] = $("#selectionCountryBox").jqxComboBox('getSelectedItem').value

        $.ajax({
            async: false,
            url: ulrPopulationDataLoading,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filter)
        }).done(function (result) {
            modelData = result;
        })


        debugger;
        originalData = $.extend(true,[],modelData)

    }


    PopulationModel.prototype.getModelData = function(){
        return $.extend(true,[],modelData);
    }


    PopulationModel.prototype.setModelData = function(row, column, value){
        modelData[row][column] = value;
    }


    PopulationModel.prototype.addNewYearToModel = function(){

        var elementName, units, mostRecentYear, elementNamePos, unitsPos, yearPos, elemCodePos, elemCode, regionCodePos, regionCode;

        regionCodePos= this.o['regionCode']
        elemCodePos= this.o['elementCode']
        elementNamePos = this.o['elementName'];
        unitsPos = this.o['units'];
        yearPos = this.o['year']


        for(var i= 0,length = modelData.length; i<length; i++){

            if(typeof  regionCode === 'undefined' && modelData[i][regionCodePos] && modelData[i][regionCodePos]!=null ){
                regionCode = modelData[i][regionCodePos]
            }

            if(typeof  elemCode === 'undefined' && modelData[i][elemCodePos] && modelData[i][elemCodePos]!=null ){
                elemCode = modelData[i][elemCodePos]
            }

            if(typeof  elementName === 'undefined' && modelData[i][elementNamePos] && modelData[i][elementNamePos]!=null ){
                elementName = modelData[i][elementNamePos]
            }

            if(typeof  units === 'undefined' && modelData[i][unitsPos] && modelData[i][unitsPos]!=null ){
                units = modelData[i][unitsPos]
            }


            if(typeof  mostRecentYear ==='undefined' ||
                (typeof  modelData[i][yearPos]!== 'undefined' && modelData[i][yearPos]!= null
                         && parseInt(modelData[i][yearPos])> mostRecentYear )){
                mostRecentYear = parseInt(modelData[i][yearPos])
            }
        }

        var newArrayToInsert = []
        newArrayToInsert.length = Object.keys(this.o).length

        newArrayToInsert[regionCodePos] = regionCode;
        newArrayToInsert[elemCodePos] = elemCode;
        newArrayToInsert[elementNamePos]  =elementName;
        newArrayToInsert[unitsPos] = units;
        newArrayToInsert[yearPos] = mostRecentYear+1;

        for(var i =0; i< newArrayToInsert.length; i++){
            if(typeof newArrayToInsert[i] === 'undefined'){
                newArrayToInsert[i] = null;
            }
        }

        modelData.push(newArrayToInsert);
    }


    PopulationModel.prototype.savePopulationData = function(){

    }


    return PopulationModel;
})