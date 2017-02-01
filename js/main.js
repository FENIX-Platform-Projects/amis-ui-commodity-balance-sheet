// Place third party dependencies in the lib folder
requirejs.config({
    "baseUrl":              "js/scripts/libs",
    "paths": {
        jquery            :  "jquery",
        underscore        :  "underscore-min",
        preloading        :  "../amis/preloading",
        loading           :  "../amis/loading",
        monthlyLoader     :  "../amis/loading/monthlySelection",
        annualLoader      :  "../amis/loading/annualSelection",
        subscriberLoader  :  "../amis/loading/observer/SubscriberLoader",
        exportLoader      :  "../amis/loading/exportSelection",
        utilities         :  "../component/core/balanceSheet/configuration/utilities",
        balanceSheet      :  "../component/core/balanceSheet",
        models            :  "../component/core/balanceSheet/models",
        views             :  "../component/core/balanceSheet/views",
        view              :  "../component/core/balanceSheet/views/gridDataView",
        configurator      :  "../component/core/balanceSheet/configuration/configurator",
        generalController :  "../component/core/balanceSheet/controller",
        modelController   :  "../component/core/balanceSheet/models/controllerDataModels",
        editor            :  "../component/plugins/Amis/InputTool/editing/editors",
        modalView         :  "../component/plugins/Amis/InputTool/editing/editors/modalView",
        editorController  :  "../component/core/balanceSheet/editors/controller",
        exporter          :  "../component/core/balanceSheet/exports",
        validator         :  "../component/core/balanceSheet/validator",
        formatter         :  "../component/core/balanceSheet/formatter",
        adapter           :  "../component/core/balanceSheet/visualization/ignite/adapter",
        adapterGrid       :  "../component/core/balanceSheet/visualization/webixDtable/adapter/AdapterDataTable",
        formulasAmis      :  "../amis/formulas",
        dataLoader        :  "../amis/loading/logic",
        editingSpecial    :  "../amis/editing/special",
        productionEditor  :  "../amis/editing/special/editors/productionEditor",
        paddyEditor       :  "../amis/editing/special/editors/paddyEditor",
        otherUsesEditor   :  "../amis/editing/special/editors/otherUsesEditor",
        multiFlagJQAdapter:  "../component/plugins/Amis/InputTool/utils/flagFormatter/adapters/jqwidgets/JQW_Select2Adapter",
        flagTranslator    :  "../component/plugins/Amis/InputTool/utils/flagFormatter",
        specialFormulaConf:  "../amis/editing/special/configuration",
        generalObserver   :  "../component/core/balanceSheet/observer",
        urlConfigurator   :  "../services/configurator/ServicesConfigurator",
        databaseSaver     :  "../amis/saving",
        editHandler       :  "../amis/editing/direct/EditHandler",
        FenixValidator         :  "FenixReports-Validator",
        othUsesPlugin     :  "../amis/otherUsesNotes/OtherUsesPluginNotes",
        amis_population   :  "../amis/population",
        calculatedCodes   :  "../amis/saving/configuration/calculated_data"
    },
    "shim": {
        "bootstrap": {
            deps: ["jquery"]
        },
        "jquery-ui" : {
            "deps" : ["jquery"]
        },
        "jquery.dirtyFields" : {
            deps: ["jquery"]
        },
        "timepicker":{
            deps: ["jquery-ui"]
        },
        "jquery.sidebar" :{
            deps : ["jquery", "jquery-ui"]
        },
        "chosen.jquery" : {
            deps : ["jquery"]
        },
        "bootstrap-dialog":{
            deps: ["bootstrap"]
        },
        "underscore": {
            exports: '_'
        },
        "FenixExports":{
            deps:["FenixValidator", "jquery"]
        },
        "jqwidgets":{
            deps : ["jquery"]
        },
        "select2":{
            deps:["jquery"]
        },
        "amplify":{
            deps:["jquery"]
        }

    }
});

requirejs(["jquery"], function($) {
    window.$ = $;
    if (typeof console == "undefined") {
        this.console = {log: function() {}};
    }
    /*//this will invoke the script for the page
    if (module){
        require([module], function(module){});
    }*/
});


require(["../../IndexContext", "jquery","domReady!", "bootstrap"], function(IndexContext) {
/*
    console.log("index.js() - require() on domReady!");
*/


    // TODO: AMIS INTEGRATION:
    // TO IMPROVA SECURITY: add AND CONDITION:
    // if( window.parent.location.href === 'http://statistics.amis-outlook.org/data/index.html#INPUT'
/*
    if(window.location !== window.parent.location ) {
*/
        var indexContext = new IndexContext;
        indexContext.init();
/*
    }
*/

});







