/**
 * Created by fabrizio on 5/21/14555
 */
define(["jquery", "urlConfigurator" , "jqwidgets"], function ($, ServicesConf) {

    var radioNationDB, radioCBS, selectedDB, source, Services, urlDB;

    function DatabaseSelector() {

        radioNationDB = $("#jqxradiobuttonNationalDB");
        radioCBS = $("#jqxradiobuttonCBS");
        Services = new ServicesConf;
        Services.init();
        urlDB = Services.getDataSourceUrl()
        // $("#labelCBS").html("CBS");

    }


    DatabaseSelector.prototype.changeRadio = function (regionCode) {

        var filterRegionCode = {"regionCode": regionCode}
        var that = this;
        var data;

        $.ajax({
            async: false,
            url: urlDB,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterRegionCode)
        }).done(function (result) {
            data = result;
        });

        // prepare the data
        source =
        {
            datatype: "json",
            datafields: [
                { name: 'datasource'}
            ],
            localdata: data
        };

        //callback
        $("#labelNatDB").html(data['datasource']);


        radioNationDB.jqxRadioButton({ width: 120, height: 25, checked: true});
    }


    DatabaseSelector.prototype.init = function (regionCode) {
        var filterRegionCode = {"regionCode": regionCode}

        var that = this;
        $.ajax({
            async: false,
            type: 'post',
            url: urlDB,
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterRegionCode),
            success: function (data) {
                source = that.prepareBoxData(data)
                //callback
                $("#labelNatDB").html(data['datasource']);
            }
        });

        //radioCBS.jqxRadioButton({ width: 120, height: 25 });
        radioNationDB.jqxRadioButton({
            width: 120,
            height: 25,
            checked: true
        });
        selectedDB = $("#labelNatDB").text();
        return selectedDB;
    }


    DatabaseSelector.prototype.selectCBS = function (event) {
        return $("#labelCBS").text();
    }


    DatabaseSelector.prototype.selectNational = function (event) {
        return source.localdata.datasource;
    }


    DatabaseSelector.prototype.getCBS = function () {
        return radioCBS;
    }


    DatabaseSelector.prototype.getNatDb = function () {
        return radioNationDB;

    }


    DatabaseSelector.prototype.prepareBoxData = function (data) {

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

    return DatabaseSelector;

});