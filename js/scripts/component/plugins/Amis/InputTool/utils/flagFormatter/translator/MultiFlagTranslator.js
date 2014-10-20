/**
 * Created by fabrizio on 9/18/14.
 */
define(['jquery'], function($){

    function MultiFlagTranslator(){}

    // Returns an array of codes:
    // if stringValues is undefined or doesn't contain a value codes is null
    MultiFlagTranslator.prototype.fromStringToCodes = function( stringValues){
        var codes;
        var conditionRegExpression = /((\w))/g;
        if(typeof stringValues !=='undefined' && stringValues != null && stringValues != "") {
            codes = stringValues.match(conditionRegExpression);
        }else{
            codes = null;
        }
        return codes;
    }

    // Return a string from codes: if codes is null OR undefined OR codes ==0
    // return null
    MultiFlagTranslator.prototype.fromCodesToString = function(codes) {
        var result = ""
        if (typeof codes != 'undefined' && codes != null && codes.length != 0) {
            for (var i = 0; i < codes.length; i++) {
                if (result != "" && result != null) {
                    result += ","+codes[i];
                }else{
                    result += codes[i];
                }
            }
        } else{
            result  = undefined;
        }
        return result;
    }


    // Get a map of codes
    MultiFlagTranslator.prototype.createMapCodesAssociated = function(codes){
        var map = {}
        if(codes != null && typeof codes != 'undefined') {
            for (var i = 0; i < codes.length; i++) {
                map[codes[i]] = true;
            }
        }else{
            map = undefined;
        }
        return map;
    }





    return MultiFlagTranslator;
})