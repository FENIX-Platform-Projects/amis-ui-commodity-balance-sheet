
define(["jquery", "urlConfigurator", "jqwidgets"], function ($, ServicesUrl) {

    var combo, productCode, Services;

    function CommoditySelector() {
        Services = new ServicesUrl;
        Services.init()
    }


    CommoditySelector.prototype.init = function () {

        var that = this;
        combo = $("#selectionCommodity")
        var url = Services.getCommodityUrl();
        var sources = [];

        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function (data) {

                var localdata = that.sortAndFilter(data);

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
                combo.jqxDropDownList({
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
        productCode = combo.jqxDropDownList('getItem', combo.jqxDropDownList('selectedIndex')).value;

        return productCode;
    };


    CommoditySelector.prototype.getcombo = function () {
        return combo;
    };


    CommoditySelector.prototype.change = function (event) {

        // To pass the value

        this.productCode = event.args.item.originalItem.code;
        return this.productCode;
    };


    CommoditySelector.prototype.sortAndFilter = function (data) {

        // Sort
        var localdata = data.data.sort(function (a, b) {
            if (a.title.EN < b.title.EN)
                return -1;
            if (a.title.EN > b.title.EN)
                return 1;
            return 0;
        });

        // Filter
        localdata.splice(0, 1);
        localdata.splice(3, 1);

        // Return
        return localdata;
    }


    return CommoditySelector;

});

