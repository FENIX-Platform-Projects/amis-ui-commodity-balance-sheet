/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery","formatter/DatatypesFormatter", "jqwidgets"], function($, Formatter){

    var observer, formulaToRenderTotVal, formulaToRenderSingleCrops ;

    var cellclassnameTot = function (row, column, value, data) {
        var result;
        switch(formulaToRenderTotVal){
            case 'init':
            case 'milled':
                result = (row == 1 || row == 3 || row == 5)? 'calculatedRowGrid' : 'notCalculatedRows';
                break;
            case 'yieldPaddy':
                result = (row == 3 || row == 4 || row == 5)? 'calculatedRowGrid' : 'notCalculatedRows';
                break;
            case 'areaHarvestedPaddy':
                result = (row == 0 || row == 3 ||row == 4)? 'calculatedRowGrid' : 'notCalculatedRows';
                break;

            case 'productionPaddy':
                result = (row == 1 || row == 4 ||row == 5)? 'calculatedRowGrid' : 'notCalculatedRows';
                break;

            case 'productionMilled':
                result = (row == 1 || row == 4 ||row == 5)? 'calculatedRowGrid' : 'notCalculatedRows';
                break;

            case 'areaHarvestedMilled':
                result = (row == 0 || row == 1 ||row == 5)? 'calculatedRowGrid' : 'notCalculatedRows';
                break;
        }
        return result;
    };

    var cellclassnameSingle = function (row, column, value, data) {
        var result;
        switch(formulaToRenderSingleCrops){
            case 'init':
            case 'milled':
                result = (row == 1 || row == 3 || row == 6)? 'calculatedRowGrid' : 'notCalculatedRows';
                break;
            case 'yieldPaddy':
                result = (row == 3 || row == 4 || row == 6)? 'calculatedRowGrid' : 'notCalculatedRows';
                break;
            case 'areaHarvestedPaddy':
                result = (row == 0 || row == 3 ||row == 4)? 'calculatedRowGrid' : 'notCalculatedRows';
                break;

            case 'productionPaddy':
                result = (row == 1 || row == 4 ||row == 6)? 'calculatedRowGrid' : 'notCalculatedRows';
                break;

            case 'productionMilled':
                result = (row == 1 || row == 4 ||row == 6)? 'calculatedRowGrid' : 'notCalculatedRows';
                break;

            case 'areaHarvestedMilled':
                result = (row == 0 || row == 1 ||row == 6)? 'calculatedRowGrid' : 'notCalculatedRows';
                break;
        }
        return result;
    };

    function PaddyCreator(){}

    PaddyCreator.prototype.init = function(totalValuesModel, singleCropsModel, Observer){
        formulaToRenderTotVal = 'init';
        formulaToRenderSingleCrops = 'init';

        var map = {
            2: "Area Harvested",
            5: "Production",
            4: "Yield",
            37: "Area Planted"
        }

        observer = Observer;
        var totalModel = $.extend(true,[], totalValuesModel);
        var singleModel = $.extend(true, [], singleCropsModel);

        var source = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string' },
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                {name: 5, type: 'string'}
            ],
            id: 'ppp',
            localdata: totalModel
        };

        var source2 = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string' },
                { name: 7, type: 'string' },
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                { name: 5, type: 'string'}
            ],
            id: 'ppp',
            localdata: singleModel
        };

        var dataAdapter = new $.jqx.dataAdapter(source);
        var dataAdapter2 = new $.jqx.dataAdapter(source2);

        var f = document.getElementById("specialForm");

        if (f !== null) {
            // destroy both grids, all checkboxes, tabs

            f.remove()
        }

        var modal = '<div class="modal fade" id="specialForm"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" id="closeModal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="myModalLabel">Production Rice Form</h4>' +
            '</div>' +
            '<div class="modal-body" id ="toappendData">' +
            '<div id="productionTabs">' +
            '<ul>' +
            '<li>Total Values </li>' +
            '<li>Singe Crop Values </li>' +
            '</ul>' +

            '<div id="totalValues"><br>' +

            '<div class="col-lg-4 col-lg-offset-1">' +
            '<small class = "labelRice">Select the <strong>ITEM</strong> to enter</small><br><br>'+
            '<div class ="totalValuesBoxes" id="firstCheckBoxTotVal">Rice Paddy</div>' +
            '</div>' +
            '<br><br>' +
            '<div class="col-lg-6">' +
            '<div class ="totalValuesBoxes" id="secondCheckBoxTotVal">Rice Milled</div>' +
            '</div>' +
            '<br><br>' +
            '<br>' +
            '<div>'+
            '<div class="col-lg-4 col-lg-offset-1">' +
            '<small class = "labelRice">Select the <strong>ELEMENT</strong> to enter</small><br><br>'+
            '<div class ="totalValuesBoxes" id="thirdCheckBoxTotVal">Production</div>' +
            '<small  class="labelCheckBoxes">(Thousand tonnes)</small>'+
            '</div>' +

            '<div class="col-lg-4"><br><br>' +
            '<div class ="totalValuesBoxes" id="fourthCheckBoxTotVal">Area Harvested</div>' +
            '<small  class="labelCheckBoxes">(Thousand Ha)</small>'+
            '</div>' +
            '<div class="col-lg-3"><br><br>' +
            '<div class ="totalValuesBoxes" id="fifthCheckBoxTotVal">Yield</div>' +
            '<small  class="labelCheckBoxes">(Tonnes/Ha)</small>'+
            '</div>' +
            '<br><br><br><br>' +
            '<div class="row"><br><br>' +
            '<div class="col-lg-3 col-lg-offset-4">' +
            '<button type="button" class="btn btn-primary" id="applyRulesFormulaTot">Confirm Selection</button>' +
            '</div>' +
            '</div><div class="row"><br><div class = "col-lg-10 col-lg-offset-1" id="alertTotal"></div></div><hr>' +
            '</div>' +
            '<br>' +
            '<div class="row"><div class="col-lg-10 col-lg-offset-1">' +
            '<div id="gridTotalValues"></div></div></div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" data-dismiss="modal" id="closeModal" >Close</button>' +
            '<button type="button" class="btn btn-primary" data-dismiss="modal" id="saveTotalValues">Save changes</button>' +
            '</div>' +
            '</div>' +

            // Single Crops ------------------------------------
            '<div id="singleCrops"><br>' +

            '<div class="col-lg-4 col-lg-offset-1">' +
            '<small class = "labelRice">Select the <strong>ITEM</strong> to enter</small><br><br>'+
            '<div class ="singleCropsBoxes" id="firstCheckBoxSingleCrops">Rice Paddy</div>' +
            '</div>' +
            '<br><br>' +
            '<div class="col-lg-6">' +
            '<div class ="singleCropsBoxes" id="secondCheckBoxSingleCrops">Rice Milled</div>' +
            '</div>' +
            '<br><br>' +
            '<br>' +
            '<div>'+
            '<div class="col-lg-4 col-lg-offset-1">' +
            '<small class = "labelRice">Select the <strong>ELEMENT</strong> to enter</small><br><br>'+
            '<div class ="singleCropsBoxes" id="thirdCheckBoxSingleCrops">Production</div>' +
            '<small  class="labelCheckBoxes">(Thousand tonnes)</small>'+
            '</div>' +

            '<div class="col-lg-4"><br><br>' +
            '<div class ="singleCropsBoxes" id="fourthCheckBoxSingleCrops">Area Harvested</div>' +
            '<small  class="labelCheckBoxes">(Thousand Ha)</small>'+
            '</div>' +

            '<div class="col-lg-3"><br><br>' +
            '<div class ="singleCropsBoxes" id="fifthCheckBoxSingleCrops">Yield</div>' +
            '<small  class="labelCheckBoxes">(Tonnes/Ha)</small>'+
            '</div>' +
            '<br><br><br><br>' +
            '<div class="row"><br><br>' +
            '<div class="col-lg-3 col-lg-offset-4">' +
            '<button type="button" class="btn btn-primary" id="applyRulesFormulaSingle">Confirm Selection</button>' +
            '</div>' +
            '</div><div class="row"><br><div class = "col-lg-10 col-lg-offset-1" id="alertSingle"></div></div><hr>' +
            '</div>' +
            '<br>' +
            '<div class="row"><div class="col-lg-10 col-lg-offset-1">' +
            '<div id="gridSingleCrops"></div></div></div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" data-dismiss="modal" >Close</button>' +
            '<button type="button" class="btn btn-primary" data-dismiss="modal" id="saveTotalValues">Save changes</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';


        $("#pivotGrid").append(modal);
        $('#firstCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, disabled: true});
        $('#secondCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true});
        $('#thirdCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true });
        $('#fourthCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true });
        $('#fifthCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, disabled: true });

        $('#firstCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, disabled: true});
        $('#secondCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true});
        $('#thirdCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true });
        $('#fourthCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true });
        $('#fifthCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, disabled: true });

        $('#gridTotalValues').jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6,   cellclassname:  cellclassnameTot  },
                { text: 'Value',   datafield: 3 ,  cellclassname:  cellclassnameTot },
                { text: 'Flag',    datafield: 4 ,  cellclassname:  cellclassnameTot },
                { text: 'Notes',   datafield: 5 ,  cellclassname:  cellclassnameTot }
            ]
        });

        $('#gridSingleCrops').jqxGrid({
            source: dataAdapter2,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6 ,cellclassname: cellclassnameSingle },
                { text: 'Crop',    datafield: 7, cellclassname: cellclassnameSingle },
                { text: 'Value',   datafield: 3, cellclassname: cellclassnameSingle  },
                { text: 'Flag',    datafield: 4, cellclassname: cellclassnameSingle  }
            ]
        });

        $('#specialForm').on('shown.bs.modal', function (e) {
            $('#productionTabs').jqxTabs();
        })
        $("#specialForm").modal({ backdrop: 'static',
            keyboard: false});


        observer.applyListeners()
    }

    PaddyCreator.prototype.updateTotGrid = function (calculatedModel, formulaToApply) {
        var that  =this;

        formulaToRenderTotVal = formulaToApply
        console.log('update Tot Grid!!')
        var source = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string' },
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                {name: 5,  type: 'string'}
            ],
            id: 'ppp',
            localdata: calculatedModel
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        $('#gridTotalValues').jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6,   cellclassname:  cellclassnameTot  },
                { text: 'Value',   datafield: 3 ,  cellclassname:  cellclassnameTot  },
                { text: 'Flag',    datafield: 4 ,  cellclassname:  cellclassnameTot  },
                { text: 'Notes',   datafield: 5 ,  cellclassname:  cellclassnameTot  }
            ]

        });
    }

    PaddyCreator.prototype.updateSingleGrid = function (calculatedModel, formulaToApply) {

        formulaToRenderSingleCrops = formulaToApply;
        console.log('updateSingelGRid')

        var source = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string'},
                { name: 7, type: 'string'},
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                { name: 5, type: 'string'}
            ],
            id: 'ppp',
            localdata: calculatedModel
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        $('#gridSingleCrops').jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6 ,cellclassname: cellclassnameSingle },
                { text: 'Crop',    datafield: 7, cellclassname: cellclassnameSingle },
                { text: 'Value',   datafield: 3, cellclassname: cellclassnameSingle  },
                { text: 'Flag',    datafield: 4, cellclassname: cellclassnameSingle  }
            ]
        });

    }

    PaddyCreator.prototype.destroyAll = function(){
        $('#gridTotalValues').jqxGrid('destroy')
        $('#gridSingleCrops').jqxGrid('destroy');

        $('#firstCheckBoxTotVal').jqxCheckBox( 'destroy');
        $('#secondCheckBoxTotVal').jqxCheckBox('destroy');
        $('#thirdCheckBoxTotVal').jqxCheckBox( 'destroy');
        $('#fourthCheckBoxTotVal').jqxCheckBox('destroy');
        $('#fifthCheckBoxTotVal').jqxCheckBox( 'destroy');

        $('#firstCheckBoxSingleCrops').jqxCheckBox( 'destroy');
        $('#secondCheckBoxSingleCrops').jqxCheckBox('destroy');
        $('#thirdCheckBoxSingleCrops').jqxCheckBox( 'destroy');
        $('#fourthCheckBoxSingleCrops').jqxCheckBox('destroy');
        $('#fifthCheckBoxSingleCrops').jqxCheckBox( 'destroy');

        $('#productionTabs').jqxTabs('destroy');




    }

    return PaddyCreator;
})