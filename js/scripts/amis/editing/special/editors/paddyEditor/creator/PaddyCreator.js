/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery","formatter/DatatypesFormatter","flagTranslator/controller/FlagController","text!paddyEditor/view/_paddyForm", "select2" ,"jqwidgets"], function($, Formatter, FlagController,
    HTMLPaddy){

    var observer, formulaToRenderTotVal, formulaToRenderSingleCrops, flagController, modal;

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

    var createGridEditor = function(row, cellValue, editor, cellText, width, height){
        var stringValue = cellValue;
        var oldInput = document.getElementById(editor[0].id)
        oldInput.parentNode.className =  oldInput.parentNode.className + " flagClass"
        var newInput = document.createElement('div')
        newInput.id = oldInput.id;
        newInput.className = oldInput.className;
        oldInput.parentNode.replaceChild(newInput,oldInput)
        var stringToAppend ='<select multiple tabindex="-1" id="multiFlag" style="width:100%" class="input-group-lg">';
        stringToAppend += flagController.getOptions(stringValue)
        debugger;
        stringToAppend +='</select>'
        $('#'+editor[0].id).append(stringToAppend)

        // $('#multiflag').select2({placeholder: "Click to select the flags"})


    }

    var initGridEditor = function (row, cellValue, editor, cellText, width, height) {
        debugger;
        $('#multiFlag').select2({placeholder: "Click to select the flags"}) ;


    }

    var gridEditorValue = function (row, cellValue, editor) {
        var codes = $('#multiFlag').select2("val");
        return  flagController.getStringFromCodes(codes);
    }

    function PaddyCreator(){

        flagController = new FlagController;
        modal = HTMLPaddy;
    }

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
                { text: 'Flags',    datafield: 4 ,  cellclassname:  cellclassnameTot,
                    createeditor: createGridEditor, initeditor: initGridEditor, geteditorvalue: gridEditorValue, heigth: 250 },
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


        $("#specialForm").modal({ backdrop: 'static',
            keyboard: false});

        $('#specialForm').on('shown.bs.modal', function (e) {
            $('#productionTabs').jqxTabs();
        })


        observer.applyListeners()
      //  $('#productionTabs').jqxTabs();
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
                { text: 'Flags',    datafield: 4 ,  cellclassname:  cellclassnameTot ,
                    createeditor: createGridEditor, initeditor: initGridEditor, geteditorvalue: gridEditorValue, heigth: 250 },
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