define(['jquery', 'flagTranslator/controller/FlagController','jqwidgets','select2'], function($, FlagController){

    'use strict'


    var flagController;

    function JQW_Select2Adapter(){
        flagController = new FlagController;
    }


    JQW_Select2Adapter.prototype.createMultiFlagEditor = function (row, cellValue, editor, cellText, width, height) {
        var stringValue = cellValue;
        var oldInput = document.getElementById(editor[0].id)
        oldInput.parentNode.className = oldInput.parentNode.className + " flagClass"
        var newInput = document.createElement('div')
        newInput.id = oldInput.id;
        newInput.className = oldInput.className;
        oldInput.parentNode.replaceChild(newInput, oldInput)
        var stringToAppend = '<select multiple tabindex="-1" id="multiFlag" style="width:100%" class="input-group-lg">';
        stringToAppend += flagController.getOptions(stringValue)
        stringToAppend += '</select>'
        $('#' + editor[0].id).append(stringToAppend)
    }


    JQW_Select2Adapter.prototype.createMultiFlagInit = function (row, cellValue, editor, cellText, width, height) {
        $('#multiFlag').select2({placeholder: "Click to select the flags"});
    }

    JQW_Select2Adapter.prototype.getFromMultiFlag = function (row, cellValue, editor) {
        var codes = $('#multiFlag').select2("val");
        return  flagController.getStringFromCodes(codes);
    }


    return JQW_Select2Adapter;



})