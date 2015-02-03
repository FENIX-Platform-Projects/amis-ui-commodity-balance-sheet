define(['jquery',
    "multiFlagJQAdapter",
    "text!amis_population/view/populationForm.html",
    'select2', 'jqwidgets'], function ($, MultiFlagAdapter, PopulationTemplate) {

    var multiflagAdapter, modal, idContainer;


    var o={}

    function PopulationCreator(configuration) {

        if(configuration){
            this.o=configuration
        }

        idContainer = o['containerID']
        var self = this
        multiflagAdapter = new MultiFlagAdapter;
        modal= PopulationTemplate;

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


    PopulationCreator.prototype.init = function(modelData){

        $("#pivotGrid").append(modal);

        $("#"+idContainer).modal({
            backdrop: 'static',
            keyboard: false});

        this.updateRenderingGrid(modelData)

    }


    PopulationCreator.prototype.updateRenderingGrid = function(modelData){
        this.createAndDrawGrid( this.setDataForGrid(modelData)) ;
    }


    PopulationCreator.prototype.setDataForGrid = function (data) {


        var dataField =
            [
                { name: conf['elementName'], type: 'string' },
                { name: conf['value'], type: 'float' },
                { name: conf['units'], type: 'string' },
                { name: conf['flags'], type: 'string'},
                { name: conf['notes'], type: 'string'}
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
                { text: 'Element Name', datafield: conf['elementName'], cellclassname: callbackStylePopGrid, width: '25%' },
                { text: 'UM', datafield: conf['units'], cellclassname: callbackStylePopGrid, width: '15%'},
                { text: 'Flags', datafield: conf['flags'], cellclassname: callbackStylePopGrid, width: '25%',
                    createeditor: callbackMultiFlagCreation, initeditor: callbackMultiFlagInit, geteditorvalue: callbackMultiFlagGetValues, heigth: 250
                },
                { text: 'Notes', datafield: conf['notes'], cellclassname: callbackStylePopGrid, width: '35%'}
            ]

        return columns;
    }


    PopulationCreator.prototype.createStyleClassPopulation = function (row, column, value, data) {

        var result;

        switch (true) {
            case column == conf['elementName']:
            case column == conf['units']:
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
            rowsheight: 40,
            selectionmode: 'singlecell',
            pageable: false,
            autoheight: true,
            columns: columns
        });
    }


    PopulationCreator.prototype.destroyIfExistOtherModal = function(){

        $('#populationForm').modal('hide');

        $('#'+idContainer).jqxgrid('destroy')

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


    return PopulationCreator;
})
