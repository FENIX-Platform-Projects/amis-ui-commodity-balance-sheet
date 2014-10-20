/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "jqwidgets"], function ($, Formatter) {

    Element.prototype.remove = function () {
        this.parentElement.removeChild(this);
    }

    NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    }

    var observer;

    function OtherCreator() {
    }

    OtherCreator.prototype.init = function (totalValuesModel, Observer) {


        observer = Observer;
        var totalModel = $.extend(true, [], totalValuesModel);

        var totModelForTree = this.prepareDataForTreeGrid(totalModel)

        var source =
        {
            dataType: "json",
            dataFields: [
                { name: '0', type: 'string' },
                { name: '1', type: 'string' },
                { name: '2', type: 'string' },
                { name: '3', type: 'string' },
                { name: '4', type: 'string' },
                { name: '5', type: 'string' },
                { name: '6', type: 'string' },
                {
                    name: 'children',
                    type: 'array'
                }
            ],
            hierarchy:
            {
                root: 'children'
            },
            id: 'adsa',
            localData: totModelForTree
        };


        var dataAdapter = new $.jqx.dataAdapter(source);

        var f = document.getElementById("specialForm");

        if (f !== null) {


            f.remove()
        }

        var modal = '<div class="modal fade" id="specialForm"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" id="closeModal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="myModalLabel">Production Form</h4>' +
            '</div>' +
            '<div class="modal-body" id ="toappendData">' +
            '<div id="productionTabs">' +


            '<div class="col-lg-3 col-lg-offset-4">' +
            '<button type="button" class="btn btn-primary" id="applyRulesFormulaTot">Recalculate Data</button>' +
            '</div>' +
            '</div><div class="row"><br><div class = "col-lg-10 col-lg-offset-1" id="alertTotal"></div></div><hr>' +
            '</div>' +
            '<br>' +
            '<div class="row"><div class="col-lg-10 col-lg-offset-1">' +
            '<div id="gridTotalValues"></div></div></div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" data-dismiss="modal" >Close</button>' +
            '<button type="button" class="btn btn-primary" data-dismiss="modal" id="saveTotalValues">Save changes</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';


        $("#pivotGrid").append(modal);

        $("#specialForm").modal({ backdrop: 'static',
            keyboard: false});
        $("#gridTotalValues").jqxTreeGrid( {
                width: 400,
                source: dataAdapter,
                editable: true,
                editSettings: {
                    saveOnPageChange: true,
                    saveOnBlur: true,
                    saveOnSelectionChange: true,
                    cancelOnEsc: true,
                    saveOnEnter: true,
                    editOnDoubleClick: true,
                    editOnF2: false
                },
                columns: [
                    { text: 'Element', datafield: 6 },
                    { text: 'Value', datafield: 3  },
                    { text: 'Flag', datafield: 4    },
                    { text: 'Notes', datafield: 5   }
                ]
            });

       observer.applyListeners()
    }

    OtherCreator.prototype.prepareDataForTreeGrid = function (model) {
        var toObject = function (arr) {
            var rv = {};
            for (var i = 0; i < arr.length; ++i)
                if (arr[i] !== undefined) rv[i] = arr[i];
            return rv;
        }

       var  result = [
            {      "0": model[0][0], "1": model[0][1], "2": model[0][2], "3": model[0][3], "4": model[0][4], "5": model[0[5]], "6": model[0][6], "expanded": true,
            'children': [
                {  "0": model[1][0], "1": model[1][1], "2": model[1][2], "3": model[1][3], "4": model[1][4], "5": model[1][5], "6": model[1][6] },
                {  "0": model[2][0], "1": model[2][1], "2": model[2][2], "3": model[2][3], "4": model[2][4], "5": model[2][5], "6": model[2][6] },
                {  "0": model[3][0], "1": model[3][1], "2": model[3][2], "3": model[3][3], "4": model[3][4], "5": model[3][5], "6": model[3][6], "expanded": true,
                    'children':[
                        {  "0": model[4][0], "1": model[4][1], "2": model[4][2], "3": model[4][3], "4": model[4][4], "5": model[4][5], "6": model[4][6] },
                        {  "0": model[5][0], "1": model[5][1], "2": model[5][2], "3": model[5][3], "4": model[5][4], "5": model[5][5], "6": model[5][6] },
                        {  "0": model[6][0], "1": model[6][1], "2": model[6][2], "3": model[6][3], "4": model[6][4], "5": model[6][5], "6": model[6][6] },
                        {  "0": model[7][0], "1": model[7][1], "2": model[7][2], "3": model[7][3], "4": model[7][4], "5": model[7][5], "6": model[7][6] },
                        {  "0": model[8][0], "1": model[8][1], "2": model[8][2], "3": model[8][3], "4": model[8][4], "5": model[8][5], "6": model[8][6] }
                    ]
                }
            ]
        }]
        return result;
    }


    OtherCreator.prototype.updateTotGrid = function (calculatedModel) {


        console.log('update Tot Grid!!')
        var source ={
            dataType: "json",
            dataFields: [
                { name: '0', type: 'string' },
                { name: '1', type: 'string' },
                { name: '2', type: 'string' },
                { name: '3', type: 'string' },
                { name: '4', type: 'string' },
                { name: '5', type: 'string' },
                { name: '6', type: 'string' },
                {name: 'children', type: 'array'}
            ],
            hierarchy:
            {
                root: 'children'
            },
            id: 'adsa',
            localData: calculatedModel
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        $("#gridTotalValues").jqxTreeGrid({
                width: "100%",
                source: dataAdapter,
                editable: true,
                columns: [
                    { text: 'Element', datafield: 6 },
                    { text: 'Value', datafield: 3  },
                    { text: 'Flag', datafield: 4    },
                    { text: 'Notes', datafield: 5   }
                ]
            });
    }

    OtherCreator.prototype.destroyAll = function(){
        $("#gridTotalValues").jqxTreeGrid('destroy')
    }


    return OtherCreator;
})