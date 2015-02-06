define(['jquery',
    "multiFlagJQAdapter",
    "text!amis_population/view/_populationForm.html",
    'jqwidgets'], function ($, MultiFlagAdapter, PopulationTemplate) {

    var multiflagAdapter, modal, idContainer;


    var o = {}

    function PopulationCreator(configuration) {

        if (configuration) {
            this.o = configuration
        }

        idContainer = this.o['containerID']
        var self = this
        multiflagAdapter = new MultiFlagAdapter;
        modal = PopulationTemplate;

        callbackMultiFlagCreation = function (row, cellValue, editor, cellText, width, height) {
            multiflagAdapter.createMultiFlagEditor(row, cellValue, editor, cellText, width, height)
        }

        callbackMultiFlagInit = function (row, cellValue, editor, cellText, width, height) {
            multiflagAdapter.createMultiFlagInit(row, cellValue, editor, cellText, width, height)
        }

        callbackMultiFlagGetValues = function (row, cellValue, editor) {
            return multiflagAdapter.getFromMultiFlag(row, cellValue, editor);
        }

        callbackStylePopGrid = function (row, column, value, data) {
            return self.createStyleClassPopulation(row, column, value, data)
        }
    }


    PopulationCreator.prototype.init = function (modelData) {
        this.destroyIfExistOtherModal()

        $("#pivotGrid").append(modal);

        $("#populationForm").modal({
            backdrop: 'static',
            keyboard: false});

        this.updateRenderingGrid(modelData)

        console.log($("#labelNatDB"))

        document.getElementById('labelTitlePopulation').innerHTML = modelData[0][ this.o['regionName']] + ', ' + $("#labelNatDB").html()
    }


    PopulationCreator.prototype.updateRenderingGrid = function (modelData) {
        this.createAndDrawGrid(this.setDataForGrid(modelData));
    }


    PopulationCreator.prototype.setDataForGrid = function (data) {


        var dataField =
            [
                { name: this.o['year'], type: 'string' },
                { name: this.o['units'], type: 'string' },
                { name: this.o['value'], type: 'float' },
                { name: this.o['flags'], type: 'string'},
                { name: this.o['notes'], type: 'string'}
            ]


        var source = {
            datatype: "array",
            datafields: dataField,
            id: 'gridPopulation',
            localdata: data
        };
        return new $.jqx.dataAdapter(source);
    }

    PopulationCreator.prototype.createColumnsForGrid = function () {

        var columns =
            [
                { text: 'Year', datafield: this.o['year'], cellclassname: callbackStylePopGrid, width: '12%' },
                { text: 'Units', datafield: this.o['units'], cellclassname: callbackStylePopGrid, width: '15%'},
                { text: 'Value', datafield: this.o['value'], cellclassname: callbackStylePopGrid, width: '15%'},
                { text: 'Flags', datafield: this.o['flags'], cellclassname: callbackStylePopGrid, width: '25%',
                    createeditor: callbackMultiFlagCreation, initeditor: callbackMultiFlagInit, geteditorvalue: callbackMultiFlagGetValues, heigth: 250
                },
                { text: 'Notes', datafield: this.o['notes'], cellclassname: callbackStylePopGrid, width: '33%'}
            ]

        return columns;
    }


    PopulationCreator.prototype.createStyleClassPopulation = function (row, column, value, data) {

        var result;

        switch (true) {
            case column == this.o['year']:
            case column == this.o['units']:
                result = 'notEditableColumn'
                break;
            default :
                result = 'editableColumn';
                break;
        }
        return result;
    }


    PopulationCreator.prototype.createAndDrawGrid = function (dataAdapter) {

        var columns = this.createColumnsForGrid(idContainer);

        $('#' + idContainer).jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            rowsheight: 30,
            selectionmode: 'singlecell',
            pageable: false,
            columns: columns,
            height: '400px'
        });
    }


    PopulationCreator.prototype.destroyIfExistOtherModal = function () {

        debugger;

        $('#populationForm').modal('hide');


        if (typeof $('#' + idContainer)!== 'undefined' &&$('#' + idContainer)!= null && $('#' + idContainer).length > 0) {

            $('#' + idContainer).jqxGrid('destroy')
        }

        var g = document.getElementById("populationForm");

        if (g && g !== null) {
            g.remove()
        }


        $('#specialForm').modal('hide');

        var g = document.getElementById("specialForm");

        if (g && g !== null) {
            g.remove()
        }


        $('#dialogForm').modal('hide');


        var f = document.getElementById("dialogForm");

        if (f && f !== null) {
            f.remove()
        }
    }

    PopulationCreator.prototype.destroyAllForm = function () {

        $('#' + idContainer).jqxGrid('destroy')
        $('#populationForm').modal('hide');


        var f = document.getElementById("dialogForm");

        if (f && f !== null) {
            f.remove()
        }


        var f = document.getElementById("specialForm");

        if (f && f !== null) {
            f.remove()
        }

        var f = document.getElementById("populationForm");

        if (f && f !== null) {
            f.remove()
        }

    }


    return PopulationCreator;
})
