define(['jquery', 'urlConfigurator'], function ($, ServicesUrl) {


    'use strict'


    var servicesURL, modelData;


    var o={}


    function PopulationModel(CONF) {

        if(CONF) this.o = CONF;
        servicesURL = new ServicesUrl
    }


    PopulationModel.prototype.init = function () {

        var url = './js/scripts/amis/population/example/dataExample.js'

        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function (result) {
                modelData = result;
            }
        })
    }


    PopulationModel.prototype.getModelData = function(){
        return $.extend(true,[],modelData);
    }


    PopulationModel.prototype.setModelData = function(row, column, value){
        modelData[row][column] = value;
    }

    PopulationModel.prototype.addNewYearToModel = function(){

        var elementName, units, mostRecentYear, elementNamePos, unitsPos, yearPos;

        elementNamePos = this.o['elementName'];
        unitsPos = this.o['UM'];

        for(var i= 0,length = modelData.length; i<length; i++){
            if(typeof  elementName == 'undefined'){}
        }
    }


    return PopulationModel;
})