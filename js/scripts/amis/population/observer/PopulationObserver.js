define(['jquery'], function ($) {

    'use strict'


    var controller, iDContainer;

    function PopulationObserver(Controller, Conf) {
        controller = Controller;
        if (Conf) {
            this.o = $.extend(true, {}, Conf)
            iDContainer = this.o.containerID
        }
    }


    PopulationObserver.prototype.applyListeners = function () {

        this.listenToEditableColumns();
        this.listenToEditPopulationGrid();
        this.listenToNewPopulationYear();
        this.listenToCloseButton();
        this.listenToClosePopulationForm();
        this.listenToSavePopulationData();
        this.listenToResetButton();

    }

    PopulationObserver.prototype.unbindEventsFromPopulationForm = function () {
        $('#' + iDContainer).off()
    }

    PopulationObserver.prototype.rebindGridEvents = function () {
        this.listenToEditableColumns();
        this.listenToEditPopulationGrid();
    }


    PopulationObserver.prototype.listenToEditableColumns = function () {

        var self = this;
        $('#' + iDContainer).bind('cellbeginedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            var row = event.args.rowindex;
            var column = event.args.datafield
            if (column == self.o.year || column == self.o.units) {
                $("#" + iDContainer).jqxGrid('endcelledit', row, column, true);
            }
        });
    }


    PopulationObserver.prototype.listenToEditPopulationGrid = function () {

        var self = this;
        $("#" + iDContainer).on('cellendedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            var value = event.args.value;
            var column = event.args.datafield;
            var row = event.args.rowindex;
            if (event.args.oldvalue != value && (column != self.o.units && column != self.o.year)) {
                controller.updatePopGridOnEditing(row, column, value)
            }
        });
    }

    PopulationObserver.prototype.listenToCloseButton = function () {
        $('#closeModalPopulation').on('click', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            controller.destroyAll()
        })
    }


    PopulationObserver.prototype.listenToNewPopulationYear = function () {

        $('#createNewPopulationYear').on('click', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            controller.createNewYear()
        })
    }

    PopulationObserver.prototype.listenToSavePopulationData = function () {

        $('#savePopulationValues').on('click', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            controller.saveValues()

        })
    }


    PopulationObserver.prototype.listenToClosePopulationForm = function () {

        $('#closePopulationForm').on('click', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            controller.destroyAll()
        })
    }


    PopulationObserver.prototype.listenToResetButton = function () {

        $('#resetPopulationValues').on('click', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            controller.reloadPreviousValues()
        })
    }

    return PopulationObserver;
})