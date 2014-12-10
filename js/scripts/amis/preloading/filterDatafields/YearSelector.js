/**
 * Created by fabrizio on 5/20/14.
 */
define(["jquery", "urlConfigurator", "jqwidgets"], function ($, ServicesUrl) {

    var combo, year, yearsSelected, size, previousYear, Services, urlYear;

    function YearSelector() {
        Services = new ServicesUrl;
        urlYear = Services.getYearUrl()


        yearsSelected = {
            currentYear: -1,
            currentYearLabel: -1,
            previousYear: -1,
            previousYearLabel: -1
        }
    }


    YearSelector.prototype.init = function (oldBody) {

        var body = {
            "regionCode": oldBody.regionCode,
            "productCode": oldBody.productCode
        }

        var that = this;
        combo = $("#selectionYear")
        var sources = [];

        $.ajax({
            async: false,
            url: urlYear,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(body),
            success: function (data) {

                size = data.length;

                var source = that.prepareComboData(data)
                var dataAdapter = new $.jqx.dataAdapter(source);

                // comboBox
                combo.jqxComboBox({
                    source: dataAdapter,
                    displayMember: "yearLabel",
                    valueMember: "year",
                    selectedIndex: 0,
                    width: '200px',
                    height: '25px'
                })
            }
        });

        // Take the Preselected Value
        yearsSelected.currentYear = combo.jqxComboBox('getItem', combo.jqxComboBox('selectedIndex')).value;
        yearsSelected.currentYearLabel = combo.jqxComboBox('getItem', combo.jqxComboBox('selectedIndex')).label;

        var index = combo.jqxComboBox('listBox').selectedIndex

        yearsSelected.previousYear = combo.jqxComboBox('getItem', index + 1).value;
        yearsSelected.previousYearLabel = combo.jqxComboBox('getItem', index + 1).label;

        return yearsSelected;
    };


    YearSelector.prototype.getcombo = function () {
        return combo;
    };


    YearSelector.prototype.change = function (event) {

        // To pass the value
        var args = event.args;
        var item = combo.jqxComboBox('getItem', args.index);

        yearsSelected.currentYear = item.value;
        yearsSelected.currentYearLabel = item.label;


        if (this.hasPreviousYear(args.index)) {
            yearsSelected.previousYear = combo.jqxComboBox('getItem', args.index + 1).value;
            yearsSelected.previousYearLabel = combo.jqxComboBox('getItem', args.index + 1).label;

        } else {
            yearsSelected.previousYear = -1;
            yearsSelected.previousYearLabel = -1;

        }

        return yearsSelected;
    };


    YearSelector.prototype.prepareComboData = function (data) {

        // prepare the data
        var source =
        {
            datatype: "json",
            datafields: [
                { name: 'yearLabel'},
                { name: 'year' }
            ],
            localdata: data
        };
        return source;
    }


    YearSelector.prototype.hasPreviousYear = function (index) {

        if (size - 1 >= index + 1) {
            return true
        }
        else {
            return false;
        }
    }


    return YearSelector;

});


