/**
 * Created by fabrizio on 5/23/14.
 */
/**
 * Created by fabrizio on 5/20/14.
 */
define(["jquery", "./PreloadingController"],
    function ($, PreloadingController) {

        // vars that represent the models
        var controller;

        // vars returned from the models
        var combo, comboComm, natDB, cbs, comboYear, newSeasonBtn;


        function PreloadingObserver() {
            controller = new PreloadingController;
            newSeasonBtn = $('#new_season_btn');
        };


        PreloadingObserver.prototype.init = function () {
            var that = this

            this.initializeParameters(that);

            setTimeout(function() {


                $("#loadData").bind('click', function () {
                    controller.passDataToLoading();
                });

                combo.bind('select', function (event) {
                    controller.onChangingCountry(event);

                });

                comboComm.bind('select', function (event) {
                    controller.onChangingCommodity(event);

                });

                natDB.bind('change', function (event) {
                    if (event.args.checked) {
                        controller.onSelectNatDB(event);
                    }

                });

                cbs.bind('change', function (event) {
                    if (event.args.checked) {
                        controller.onSelectCBS(event);
                    }
                });

                comboYear.bind('change', function (event) {
                    controller.onSelectingYear(event)
                });

                newSeasonBtn.on('click', function () {

                    controller.addNewSeason();

                })
            },300)

        };


        PreloadingObserver.prototype.initializeParameters = function (that) {

            controller.init();
            setTimeout(function() {
                combo = controller.getCountrySelector().getcombo();
                natDB = controller.getDbSelector().getNatDb();
                cbs = controller.getDbSelector().getCBS();
                comboComm = controller.getcommSelector().getcombo();
                comboYear = controller.getYearSelector().getcombo();
            },300);

        };


        return PreloadingObserver;
    });