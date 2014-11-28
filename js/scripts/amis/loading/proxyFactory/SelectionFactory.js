define(['jquery',"monthlyLoader/controller/HandlerSelection",
    "annualLoader/controller/HandlerAnnualSelection","amplify"], function($, HandlerMonthly, HandlerAnnual){

        var annualHandler, monthlyHandler

        function SelectionFactory(){
            annualHandler = new HandlerAnnual;
            monthlyHandler = new HandlerMonthly;
        }

        SelectionFactory.prototype.init = function(isMonthlySelection){
            var result;
            if(isMonthlySelection){
                amplify.store('isMonthlyModality',true);
                result = monthlyHandler;
            }else{
                amplify.store('isMonthlyModality',false);
                result = annualHandler;
            }
            return result;
        }

        return SelectionFactory
})
