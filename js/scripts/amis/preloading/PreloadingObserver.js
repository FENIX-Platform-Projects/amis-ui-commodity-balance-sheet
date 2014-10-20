/**
 * Created by fabrizio on 5/23/14.
 */
/**
 * Created by fabrizio on 5/20/14.
 */
define(["jquery","./PreloadingController"],
    function($, PreloadingController) {

        // vars that represent the models
        var  controller;

        // vars returned from the models
        var combo,comboComm,natDB,cbs, comboYear;


        function PreloadingObserver(){
            controller = new PreloadingController;
        };


        PreloadingObserver.prototype.init = function(){
            var that = this

            this.initializeParameters(that);


            $("#loadData").bind('click', function() {
               controller.passDataToLoading();
            });

            combo.bind('select', function (event) {
                console.log("countryChnged")
                controller.onChangingCountry(event);

            });

            comboComm.bind('select', function (event) {
                console.log("commodity")
                controller.onChangingCommodity(event);

            });

            natDB.bind('change', function(event) {
                if (event.args.checked) {
                    console.log("natdb")
                    controller.onSelectNatDB(event);
                }

            });

            cbs.bind('change', function(event) {
                if (event.args.checked) {
                    console.log("cbs")
                    controller.onSelectCBS(event);
                }
            });

            comboYear.bind('change',function(event){
                console.log("CHANGE Year")
                controller.onSelectingYear(event)
            })

        };


        PreloadingObserver.prototype.initializeParameters = function(that){

            controller.init();

            combo =     controller.getCountrySelector().getcombo();
            natDB =     controller.getDbSelector().getNatDb();
            cbs   =     controller.getDbSelector().getCBS();
            comboComm=  controller.getcommSelector().getcombo();
            comboYear = controller.getYearSelector().getcombo();

        };


        return PreloadingObserver;
    });