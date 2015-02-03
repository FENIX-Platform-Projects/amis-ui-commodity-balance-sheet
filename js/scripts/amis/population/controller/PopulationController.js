define(['jquery',
        'amis_population/model/PopulationModel',
        'amis_population/creator/PopulationCreator',
        'amis_population/observer/PopulationObserver'],
    function ($, Model, Creator, Observer) {

        'use strict'


        var CONF = {
            "value": 7,
            "flags": 8,
            "notes": 9,
            "units": 6,
            "elementName": 5,
            "containerID": "gridPopulation"
        }

        var observer, model, creator


        function PopulationController() {
            model = new Model(CONF);
            observer = new Observer;
            creator = new Creator(CONF)
        }


        PopulationController.prototype.init = function () {
            model.init()
            creator.init(model.getModelData())
        }


        PopulationController.prototype.updatePopGridOnEditing = function (row, column, value) {

            model.setModelData(row, column, value);
            creator.updateRenderingGrid(model.getModelData());
        }


        PopulationController.prototype.destroyAll = function () {
            creator.destroyIfExistOtherModal()
        }
        
        PopulationController.prototype.createNewYear = function(){
            model.addNewYearToModel();
        }


        return PopulationController;

    })