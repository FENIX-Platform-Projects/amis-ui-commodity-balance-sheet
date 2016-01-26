/**
 * Created by fabrizio on 5/20/14.
 */
define(["jquery", "preloading/filterDatafields/CountrySelector",
        "preloading/filterDatafields/DatabaseSelector",
        "preloading/filterDatafields/CommoditySelector",
        "preloading/filterDatafields/YearSelector",
        "loading/LoadingController"],
    function ($, CountrySelector, DataBaseSelector, CommSelector, YearSelector, LoadingController) {

        // vars that represent the models
        var countrySelector, dbSelector, commSelector, yearSelector, loadingController;

        // vars returned from the models
        var regionCode, databaseText, databaseValue, productCode , yearPost, yearPostNat, yearChosen;

        // to control the grid
        var pivotGrid;

        function PreloadingController() {
            countrySelector = new CountrySelector;
            dbSelector = new DataBaseSelector;
            commSelector = new CommSelector;
            yearSelector = new YearSelector;


            yearPost = {
                regionCode: regionCode,
                productCode: productCode,
                databaseText: databaseText,
                databaseValue: databaseValue
            };
            pivotGrid = document.getElementById('pivotGrid');
        };


        PreloadingController.prototype.init = function () {

            var that = this;

            // Country
            regionCode = countrySelector.init();
            that.updateRegionCode(regionCode);

            // Database
            databaseText = dbSelector.init(regionCode);
            that.updateDBSel(databaseText);

            // Commodity
            productCode = commSelector.init();
            that.updateproductCode(productCode);

            yearChosen = yearSelector.init(yearPost);
        };


        PreloadingController.prototype.onChangingCountry = function (event) {
            this.showAlertIfExists()

            regionCode = countrySelector.change(event);
            dbSelector.changeRadio(regionCode);
            this.updateRegionCode(regionCode);
            this.updateDBSel(databaseText);
            //this.printUpdate();
            yearSelector.init(yearPost);
        }


        PreloadingController.prototype.onChangingCommodity = function (event) {
            this.showAlertIfExists()

            this.updateproductCode(commSelector.change(event));
            this.updateDBSel(databaseText);
            //this.printUpdate();
            if (yearPost.databaseText != "CBS") {
                var yearPostNat = {};
                //copy all the fields of yearPost in yearPostNat
                for (var key in yearPost) {
                    yearPostNat[key] = yearPost[key];
                }
                yearPostNat.databaseText = "NATIONAL";
                yearSelector.init(yearPost);
            } else
                yearSelector.init(yearPost);

        };


        PreloadingController.prototype.onSelectingYear = function (event) {
            this.showAlertIfExists()
            yearChosen = yearSelector.change(event);
        };


        PreloadingController.prototype.onSelectNatDB = function (event) {
            databaseText = dbSelector.selectNational(event);
            this.updateDBSel(databaseText);
            //this.printUpdate();
            yearSelector.init(yearPost);

        };


        PreloadingController.prototype.onSelectCBS = function (event) {
            //  this.showAlertIfExists()
            databaseText = dbSelector.selectCBS(event);
            this.updateDBSel(databaseText);
            //this.printUpdate();
            yearSelector.init(yearPost);

        };


        PreloadingController.prototype.updateRegionCode = function (regionCode) {
            yearPost.regionCode = regionCode;
        }


        PreloadingController.prototype.updateDBSel = function (databaseText) {
            yearPost.databaseText = databaseText;
            if (yearPost.databaseText != "CBS") {
                yearPost.databaseValue = "NATIONAL";
            } else {
                yearPost.databaseValue = "CBS";
            }
        }


        PreloadingController.prototype.updateproductCode = function (commCode) {
            yearPost.productCode = commCode;
        }


        PreloadingController.prototype.printUpdate = function () {
            console.log("---------------- UPDATE  ------------------");
            console.log('REGIONCODE: ' + yearPost.regionCode);
            console.log('DATABASE: ' + yearPost.databaseText);
            console.log('COMMDOITY: ' + yearPost.productCode);
        }


        PreloadingController.prototype.getCountrySelector = function () {
            return countrySelector;
        };


        PreloadingController.prototype.getDbSelector = function () {
            return dbSelector;
        };


        PreloadingController.prototype.getcommSelector = function () {
            return commSelector;
        };


        PreloadingController.prototype.getYearSelector = function () {
            return yearSelector;
        };

        PreloadingController.prototype.passDataToLoading = function () {
            loadingController = new LoadingController;

            var preloadingData = {
                post: yearPost,
                years: yearChosen
            }

            // delete the alerts
            if (document.getElementById('alertChangeGrid').hasChildNodes() || document.getElementById('alertNewValues').hasChildNodes) {

                var myNode = document.getElementById('alertChangeGrid');
                var myNode2 = document.getElementById('alertNewValues');
                if(myNode && myNode.hasChildNodes()) {
                    while (myNode.firstChild) {
                        myNode.removeChild(myNode.firstChild);
                    }
                }

                if(myNode2 && myNode2.hasChildNodes()) {
                    while (myNode2.firstChild) {
                        myNode2.removeChild(myNode2.firstChild);
                    }
                }
            }

            loadingController.init(preloadingData, true);
        }


        PreloadingController.prototype.showAlertIfExists = function () {

            if (document.querySelectorAll('[view_id]').length > 0) {
                if (loadingController.checkIfNewValues() && document.getElementById('alertNewValues').childNodes.length == 0 &&
                    document.getElementById('alertChangeGrid').childNodes.length == 0) {

                    var alert2 = '<div class="alert alert-warning alert-dismissible" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert">' +
                        '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                        '<strong>Attention!</strong> You have edited some values : to save new values,  <strong>click on save data</strong></div>';
                    $('#alertNewValues').append(alert2);
                }
                else {
                    debugger;
                    if (document.getElementById('alertNewValues')!== null && document.getElementById('alertNewValues').childNodes >0 &&
                        document.getElementById('alertNewValues').childNodes.length == 0 && document.getElementById('alertChangeGrid').childNodes.length == 0) {
                        var alert1 = '<div class="alert alert-info alert-dismissible" role="alert">' +
                            '<button type="button" class="close" data-dismiss="alert">' +
                            '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                            '<strong>Attention!</strong> To apply the changes of your selection, <strong>click on load data</strong></div>';
                        $('#alertChangeGrid').append(alert1);
                    }
                }
            }
        };

        PreloadingController.prototype.addNewSeason = function() {

            yearSelector.addNewSeason();


        };


        return PreloadingController;
    });