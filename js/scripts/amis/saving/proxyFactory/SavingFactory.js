define(['jquery', 'amplify', 'savingAnnual/controller/SavingAnnualController', 'savingMonthly/controller/SavingController'],
    function ($, AnnualController, MonthlyController) {

        var savingController

        function SavingFactory() {
            var store = amplify.store();
            var savingController = new MonthlyController
        }


        SavingFactory.prototype.init = function (balanceSheet, filterActual, realPreviousYear, dataFiltered, handlerSelection) {

            if (typeof savingController === 'undefined') {
                setTimeout(function () {
                    savingController.init(balanceSheet, filterActual, realPreviousYear, dataFiltered, handlerSelection)

                }, 1000);
            }
        }


        SavingFactory.prototype.startController = function (balanceSheet, filterActual, realPreviousYear, dataFiltered, handlerSelection) {
        }

        return SavingFactory
    })