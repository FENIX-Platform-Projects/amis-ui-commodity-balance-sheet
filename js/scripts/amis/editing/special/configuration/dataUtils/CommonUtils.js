/**
 * Created by fabrizio on 9/19/14.
 */
define(['jquery'], function ($) {

    function CommonUtils() {
    }

    CommonUtils.prototype.getIndexModelFromCode = function (code, model) {
        var result;
        var found = false;
        for (var i = 0; i < model.length && !found; i++) {
            if (model[i][0] == code) {
                result = i;
                found = true;
            }
        }
        return result;
    }

    return CommonUtils;
})