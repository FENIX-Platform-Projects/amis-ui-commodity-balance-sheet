/**
 * Created by fabrizio on 9/10/14.
 */
define(["jquery", "jqwidgets"], function($) {

    var filterData;

    function SupportUtility() {
    }

    SupportUtility.prototype.init = function (data) {
        filterData = data;
    }

    SupportUtility.prototype.getFilterData = function () {
        var season = filterData.years.currentYearLabel;
        var datasourceFilt = filterData.post.databaseText;
        var productCode = filterData.post.productCode;
        var countryCode = filterData.post.regionCode;
        var product = $("#selectionCommodity").jqxComboBox('getItemByValue', productCode).label;
        var country = $("#selectionCountryBox").jqxComboBox('getItemByValue', countryCode).label;

        return {"season" : season, "dataSource": datasourceFilt, "product" : product, "country": country,
        "productCode" : productCode, "countryCode" : countryCode, "productCode": productCode}
    }

    SupportUtility.prototype.getPreviousSeasonLabel = function(){
        return filterData.years.previousYearLabel;
    }

    return SupportUtility;
})