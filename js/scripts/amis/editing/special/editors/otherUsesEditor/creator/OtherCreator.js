define(["jquery", "formatter/DatatypesFormatter", "text!otherUsesEditor/view/_otherUsesForm.html",
        "flagTranslator/controller/FlagController",
        "select2","webix"],
    function ($, Formatter, HTMLOtherUSes, MultiFlagController) {

        var multiFlagController, rowNumber, gridUi, rowId, idMultiFlag


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


        var observer, grid, modal;


        function OtherCreator() {
            modal = HTMLOtherUSes
            multiFlagController = new MultiFlagController;
            webix.editors.multiflagEditor = this.createMultiFlagEditor();

        }


        OtherCreator.prototype.createAndDrawGrid = function (dataset) {

             gridUi = new webix.ui({
                id: "otherUsesTree",
                container: "gridTotalValues",
                view: "treetable",
                columns: [
                    { id: "value", header: "Element", template: "{common.treetable()} #value#", fillspace: true },
                    { id: "3", editor: "text", header: "Value"},
                    { id: "4", editor: "multiflagEditor", header: "Flag"},
                    { id: "5", editor: "text", header: "Notes"}
                ],

                autoheight: true,
                editable: true,
                data: dataset
            });


            return gridUi;

        }


        OtherCreator.prototype.changeRow = function(rowID) {
            rowNumber = rowID;
        }



        OtherCreator.prototype.init = function (totalValuesModel, Observer) {

            this.destroyIfExistOtherModalOtherUses()
            observer = Observer;
            var totalModel = $.extend(true, [], totalValuesModel);
            var modelWithoutNull = this.eliminateNull(totalModel)

            var totModelForTree = this.prepareDataForTreeGrid(modelWithoutNull, false)

            var self = this;

            $("#pivotGrid").append(modal);

            $("#specialForm").modal({ backdrop: 'static',
                keyboard: false});

            $('#specialForm').on('shown.bs.modal', function (e) {
                grid = self.createAndDrawGrid(totModelForTree)
                observer.applyListeners(grid)
            });

        }


        OtherCreator.prototype.prepareDataForTreeGrid = function (model, isUpdated) {

            var result =
                (isUpdated) ?
                    [
                        {"0": model[0][0], "1": model[0][1], "2": model[0][2], "3": model[0][3], "4": model[0][4], "5": model[0[5]], "value": model[0][6], "open": true,
                            "data": [
                                {  "0": model[1][0], "1": model[1][1], "2": model[1][2], "3": model[1][3], "4": model[1][4], "5": model[1][5], "value": model[1][6] },
                                {  "0": model[2][0], "1": model[2][1], "2": model[2][2], "3": model[2][3], "4": model[2][4], "5": model[2][5], "value": model[2][6] },
                                {  "0": model[3][0], "1": model[3][1], "2": model[3][2], "3": model[3][3], "4": model[3][4], "5": model[3][5], "value": model[3][6], "open": true,
                                    "data": [
                                        {  "0": model[4][0], "1": model[4][1], "2": model[4][2], "3": model[4][3], "4": model[4][4], "5": model[4][5], "value": model[4][6] },
                                        {  "0": model[5][0], "1": model[5][1], "2": model[5][2], "3": model[5][3], "4": model[5][4], "5": model[5][5], "value": model[5][6] },
                                        {  "0": model[6][0], "1": model[6][1], "2": model[6][2], "3": model[6][3], "4": model[6][4], "5": model[6][5], "value": model[6][6] },
                                        {  "0": model[7][0], "1": model[7][1], "2": model[7][2], "3": model[7][3], "4": model[7][4], "5": model[7][5], "value": model[7][6] },
                                        {  "0": model[8][0], "1": model[8][1], "2": model[8][2], "3": model[8][3], "4": model[8][4], "5": model[8][5], "value": model[8][6] }
                                    ]
                                }
                            ]
                        }
                    ]
                    :
                    [
                        {"0": model[0][0], "1": model[0][1], "2": model[0][2], "3": model[0][3], "4": model[0][4], "5": model[0][5], "value": model[0][6], "open": false,
                            "data": [
                                {  "0": model[1][0], "1": model[1][1], "2": model[1][2], "3": model[1][3], "4": model[1][4], "5": model[1][5], "value": model[1][6] },
                                {  "0": model[2][0], "1": model[2][1], "2": model[2][2], "3": model[2][3], "4": model[2][4], "5": model[2][5], "value": model[2][6] },
                                {  "0": model[3][0], "1": model[3][1], "2": model[3][2], "3": model[3][3], "4": model[3][4], "5": model[3][5], "value": model[3][6], "open": true,
                                    "data": [
                                        {  "0": model[4][0], "1": model[4][1], "2": model[4][2], "3": model[4][3], "4": model[4][4], "5": model[4][5], "value": model[4][6] },
                                        {  "0": model[5][0], "1": model[5][1], "2": model[5][2], "3": model[5][3], "4": model[5][4], "5": model[5][5], "value": model[5][6] },
                                        {  "0": model[6][0], "1": model[6][1], "2": model[6][2], "3": model[6][3], "4": model[6][4], "5": model[6][5], "value": model[6][6] },
                                        {  "0": model[7][0], "1": model[7][1], "2": model[7][2], "3": model[7][3], "4": model[7][4], "5": model[7][5], "value": model[7][6] },
                                        {  "0": model[8][0], "1": model[8][1], "2": model[8][2], "3": model[8][3], "4": model[8][4], "5": model[8][5], "value": model[8][6] }
                                    ]
                                }
                            ]
                        }
                    ]
            return result;
        }


        OtherCreator.prototype.updateTotGrid = function (calculatedModel) {
            this.destroyAll()

            var modelWithoutNull = this.eliminateNull(calculatedModel)
            var totModelForTree = this.prepareDataForTreeGrid(modelWithoutNull, true)


            grid = this.createAndDrawGrid(totModelForTree)

            return grid
        }


        OtherCreator.prototype.destroyAll = function () {
            if (grid)
                grid.destructor();

           // this.destroyIfExistOtherModalOtherUses();
        }


        OtherCreator.prototype.eliminateNull = function (model) {
            var result = []

            for (var i = 0, length = model.length; i < length; i++) {
                result[i] = []
                for (var j = 0, length2 = model[i].length; j < length2; j++)
                    result[i].push((!model[i][j] || model[i][j] == null || model[i][j] == 'null') ? "" : model[i][j]);
            }
            return result

        }


        OtherCreator.prototype.destroyIfExistOtherModalOtherUses = function(){
            $('#specialForm').modal('hide');

            var g = document.getElementById("specialForm");

            if (g && g !== null) {
                g.remove()
            }

            $('#dialogForm').modal('hide');


            var f =  $('#closeModalFormTotal');
            if(f) {
                $('#closeModalFormTotal').click();
            }

            var k =  $('#closeModal');
            if(k) {
                $('#closeModal').click();
            }

            var f = document.getElementById("dialogForm");

            if (f && f !== null) {
                f.remove()
            }
        }


        OtherCreator.prototype.createMultiFlagEditor = function(){

            return {
                focus:function(){
                    $('#multiflagOtherUses').append(multiFlagController.getOptions(this.node.value))
                    $('#multiflagOtherUses').select2({placeholder: "Click to select the flags"});
                },
                getValue:function(){
                    var codes = $('select').select2("val");
                    $('select').select2("destroy");

                    var f = document.getElementById('containerMultiflagOtherUses')
                    if(f)
                        f.remove();

                    return  multiFlagController.getStringFromCodes(codes);
                },
                setValue:function(value){
                    this.node.value = value;
                },
                getInputNode:function(){
                    return this.config.node.firstChild;
                },
                render:function(){
                    var stringToAppend = '<select multiple tabindex="-1" id="multiflagOtherUses" style="width:100%" class="input-group-lg">';
                    stringToAppend += '</select>';
                    var result =webix.html.create("div", {
                        "class":"multiflagTreeTable",
                        "id": "containerMultiflagOtherUses"
                    }, stringToAppend);
                    return result;
                }
            }
        }


        return OtherCreator;
    })