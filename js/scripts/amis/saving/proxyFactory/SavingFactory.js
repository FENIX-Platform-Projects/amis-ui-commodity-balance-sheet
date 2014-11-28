define(['jquery', 'databaseSaver/annualSaving/controller/SavingAnnualController',
        'databaseSaver/monthlySaving/controller/SavingController', 'amplify'],
    function ($, AnnualController, MonthlyController) {

        var monthlySaving, annualSaving

        function SavingFactory() {
            annualSaving = new AnnualController;
            monthlySaving = new MonthlyController;
        }


        SavingFactory.prototype.getSavingController = function () {
            var result;

           var store = amplify.store()
            if(store.isMonthlyModality){

                result = monthlySaving
            }else{
                result = annualSaving
            }
            return result;
        }

        return SavingFactory
    })