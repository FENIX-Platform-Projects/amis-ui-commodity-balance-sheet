/**
 * Created by fabrizio on 5/20/14.
 */
define(["jquery", "urlConfigurator", "jqwidgets"], function ($, servicesUrl) {

    var combo, regionCode, Services;


    function CountrySelector() {
        Services = new servicesUrl;
        Services.init();
    }


    CountrySelector.prototype.init = function () {

        var that = this;
        combo = $("#selectionCountryBox")
        var url = Services.getCountryListUrl();
        var sources = [];

        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function (data) {

                var localdata = that.sortData(data);

                // prepare the data
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: 'code' },
                        { name: 'label', map: "title>EN" }
                    ],
                    localdata: localdata
                };
                var dataAdapter = new $.jqx.dataAdapter(source);

                // comboBox
                combo.jqxComboBox({
                    source: dataAdapter,
                    displayMember: "label",
                    valueMember: "code",
                    selectedIndex: 0,
                    width: '200px',
                    height: '25px'
                })
            }
        });

        // Take the Preselected Value
        regionCode = combo.jqxComboBox('getItem', combo.jqxComboBox('selectedIndex')).value;
        return regionCode;
    };


    CountrySelector.prototype.getcombo = function () {
        return combo;
    };


    CountrySelector.prototype.change = function (event) {

        // To pass the value
        this.regionCode = event.args.item.originalItem.code;
        return this.regionCode;
    };


    CountrySelector.prototype.sortData = function (data) {

        var localdata = data.data.sort(function (a, b) {
            if (a.title.EN < b.title.EN)
                return -1;
            if (a.title.EN > b.title.EN)
                return 1;
            return 0;
        });

        return localdata;
    }


    return CountrySelector;

});

