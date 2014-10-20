/**
 * Created by fabrizio on 9/18/14.
 */
define(["jquery", "flagTranslator/translator/MultiFlagTranslator"], function($, Translator){

    var mapFlagUrl = "./js/scripts/component/plugins/Amis/InputTool/utils/flagFormatter/configFlags/FlagMap.json"
    var flagDoc;
    var flagTranslator;

    function FlagController(){
        flagTranslator = new Translator;
        $.ajax({
            type: 'GET',
            async: false,
            url: mapFlagUrl,
            success: function (data) {
                flagDoc = data;
            }
        })
    }


    FlagController.prototype.getStringFromCodes = function(codes){
        var codes2string = codes;
        var result =flagTranslator.fromCodesToString(codes2string);
        return result;
    }


    FlagController.prototype.getOptions = function(value){
        var flagMap = flagDoc.maps;
        var result = "";
        var stringValue = value;
        var codesAssociated = flagTranslator.fromStringToCodes(stringValue)
        // create Map of Codes Associated
        if(typeof codesAssociated !== 'undefined' && codesAssociated != null) {
            var mapCodes = flagTranslator.createMapCodesAssociated(codesAssociated);
            result += '<option value=""></option>';
            for(var i=0; i<flagMap.length; i++){
                var key = Object.keys(flagMap[i]);
                var value = flagMap[i][key]
                if(mapCodes[key]) {
                    result += '<option value ="' + key + '" selected>' + key + ' - ' + value + '</option>';
                }else{
                    result += '<option value ="' + key + '" >' + key + ' - ' + value + '</option>';
                }
            }
        }else{
            result += '<option value=""></option>';
            for(var i=0; i<flagMap.length; i++){
                var key = Object.keys(flagMap[i]);
                var value = flagMap[i][key]
                result +=  '<option value ="'+key+'">'+key+' - '+value+'</option>';
            }
        }
        return result;
    }


    return FlagController;
})