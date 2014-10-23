/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "webix"], function ($, Formatter) {

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

    var observer, grid;

    function OtherCreator() {
    }

    OtherCreator.prototype.init = function (totalValuesModel, Observer) {
        observer = Observer;
        var totalModel = $.extend(true, [], totalValuesModel);
        console.log(totalModel)
        var modelWithoutNull = this.eliminateNull(totalModel)
        console.log('modelWithoutNull')
        console.log(modelWithoutNull)

        var totModelForTree = this.prepareDataForTreeGrid(modelWithoutNull)
       console.log(totModelForTree)

        var f = document.getElementById("specialForm");

        if (f !== null) {
            f.remove()
        }

        var modal = '<div class="modal fade" id="specialForm"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" id="closeModal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="myModalLabel">Other Uses Form</h4>' +
            '</div>' +
            '<div class="modal-body" id ="toappendData">' +
            '<div id="productionTabs">' +
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

        grid = new webix.ui({
            id:"otherUsesTree",
            container:"gridTotalValues",
            view:"treetable",
            columns:[
                { id:"value",	header:"Element", template:"{common.treetable()} #value#", width: 250},
                { id:"3",	editor:"text",header:"Value"},
                { id:"4",	editor:"text",header:"Flag"},
                { id:"5",	editor:"text",header:"Notes", width:250}
            ],
            autoheight:true,
            autowidth:true,
            editable:true,

            data:totModelForTree
        });

       observer.applyListeners(grid)
    }

    OtherCreator.prototype.prepareDataForTreeGrid = function (model) {


        var  result = [
         {"0": model[0][0], "1": model[0][1], "2": model[0][2], "3": model[0][3], "4": model[0][4], "5": model[0][5], "value": model[0][6], "open": false,
            "data": [
                {  "0": model[1][0], "1": model[1][1], "2": model[1][2], "3": model[1][3], "4": model[1][4], "5": model[1][5], "value": model[1][6] },
                {  "0": model[2][0], "1": model[2][1], "2": model[2][2], "3": model[2][3], "4": model[2][4], "5": model[2][5], "value": model[2][6] },
                {  "0": model[3][0], "1": model[3][1], "2": model[3][2], "3": model[3][3], "4": model[3][4], "5": model[3][5], "value": model[3][6], "open": true,
                    "data":[
                        {  "0": model[4][0], "1": model[4][1], "2": model[4][2], "3": model[4][3], "4": model[4][4], "5": model[4][5], "value": model[4][6] },
                        {  "0": model[5][0], "1": model[5][1], "2": model[5][2], "3": model[5][3], "4": model[5][4], "5": model[5][5], "value": model[5][6] },
                        {  "0": model[6][0], "1": model[6][1], "2": model[6][2], "3": model[6][3], "4": model[6][4], "5": model[6][5], "value": model[6][6] },
                        {  "0": model[7][0], "1": model[7][1], "2": model[7][2], "3": model[7][3], "4": model[7][4], "5": model[7][5], "value": model[7][6] },
                        {  "0": model[8][0], "1": model[8][1], "2": model[8][2], "3": model[8][3], "4": model[8][4], "5": model[8][5], "value": model[8][6] }
                    ]
                }
            ]
        }]
        return result;
    }

    OtherCreator.prototype.updateDataForTreeGrid = function (model) {


        var  result = [
            {"0": model[0][0], "1": model[0][1], "2": model[0][2], "3": model[0][3], "4": model[0][4], "5": model[0[5]], "value": model[0][6], "open": true,
                "data": [
                    {  "0": model[1][0], "1": model[1][1], "2": model[1][2], "3": model[1][3], "4": model[1][4], "5": model[1][5], "value": model[1][6] },
                    {  "0": model[2][0], "1": model[2][1], "2": model[2][2], "3": model[2][3], "4": model[2][4], "5": model[2][5], "value": model[2][6] },
                    {  "0": model[3][0], "1": model[3][1], "2": model[3][2], "3": model[3][3], "4": model[3][4], "5": model[3][5], "value": model[3][6], "open": true,
                        "data":[
                            {  "0": model[4][0], "1": model[4][1], "2": model[4][2], "3": model[4][3], "4": model[4][4], "5": model[4][5], "value": model[4][6] },
                            {  "0": model[5][0], "1": model[5][1], "2": model[5][2], "3": model[5][3], "4": model[5][4], "5": model[5][5], "value": model[5][6] },
                            {  "0": model[6][0], "1": model[6][1], "2": model[6][2], "3": model[6][3], "4": model[6][4], "5": model[6][5], "value": model[6][6] },
                            {  "0": model[7][0], "1": model[7][1], "2": model[7][2], "3": model[7][3], "4": model[7][4], "5": model[7][5], "value": model[7][6] },
                            {  "0": model[8][0], "1": model[8][1], "2": model[8][2], "3": model[8][3], "4": model[8][4], "5": model[8][5], "value": model[8][6] }
                        ]
                    }
                ]
            }]
        return result;
    }

    OtherCreator.prototype.updateTotGrid = function (calculatedModel) {

        var modelWithoutNull = this.eliminateNull(calculatedModel)
        var totModelForTree = this.updateDataForTreeGrid(modelWithoutNull)

        this.destroyAll()

        grid = new webix.ui({
            id:"otherUsesTree",
            container:"gridTotalValues",
            view:"treetable",
            columns:[
                { id:"value",	header:"Element", template:"{common.treetable()} #value#", width: 250},
                { id:"3",	editor:"text",header:"Value"},
                { id:"4",	editor:"text",header:"Flag"},
                { id:"5",	editor:"text",header:"Notes", width:250}
            ],
            autoheight:true,
            autowidth:true,
            editable:true,

            data:totModelForTree
        });

        return grid
    }

    OtherCreator.prototype.destroyAll = function(){
        if(grid)
            grid.destructor();
    }

    OtherCreator.prototype.eliminateNull= function(model){
        var result = []

        for(var i = 0, length = model.length; i<length; i++){
            result[i] = []
            for(var j= 0, length2 = model[i].length; j<length2; j++)
              result[i].push((!model[i][j] || model[i][j] == null || model[i][j] == 'null')? "": model[i][j]);
        }
        return result

    }

    return OtherCreator;
})