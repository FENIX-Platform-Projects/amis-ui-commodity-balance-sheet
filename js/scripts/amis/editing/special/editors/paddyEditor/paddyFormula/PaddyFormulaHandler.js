define(['jquery'],function($){

    function PaddyFormulaHandler(){}


    PaddyFormulaHandler.prototype.checkIfBlocked = function(formulaToApply, row, isTotalValueSection){


        var toBlock = false;
        if(isTotalValueSection) {

            switch (formulaToApply) {

                case 'milled':
                case 'init':
                    var conditionCalculated =
                        ((row == 1 + 7 * 0 || row == 3 + 7 * 0 || row == 5 + 7 * 0) ||
                            (row == 1 + 7 * 1 || row == 3 + 7 * 1 || row == 5 + 7 * 1) ||
                            (row == 1 + 7 * 2 || row == 3 + 7 * 2 || row == 5 + 7 * 2) ||
                            (row == 1 + 7 * 3 || row == 3 + 7 * 3 || row == 5 + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvestedMilled':

                    var conditionCalculated =
                        ((row == 0 + 7 * 0 || row == 1 + 7 * 0 || row == 5 + 7 * 0) ||
                            (row == 0 + 7 * 1 || row == 1 + 7 * 1 || row == 5 + 7 * 1) ||
                            (row == 0 + 7 * 2 || row == 1 + 7 * 2 || row == 5 + 7 * 2) ||
                            (row == 0 + 7 * 3 || row == 1 + 7 * 3 || row == 5 + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'productionMilled':

                    var conditionCalculated =
                        ((row == 4 + 7 * 0 || row == 1 + 7 * 0 || row == 5 + 7 * 0) ||
                            (row == 4 + 7 * 1 || row == 1 + 7 * 1 || row == 5 + 7 * 1) ||
                            (row == 4 + 7 * 2 || row == 1 + 7 * 2 || row == 5 + 7 * 2) ||
                            (row == 4 + 7 * 3 || row == 1 + 7 * 3 || row == 5 + 7 * 3))


                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'yieldPaddy':

                    var conditionCalculated =
                        ((row == 4 + 7 * 0 || row == 3 + 7 * 0 || row == 5 + 7 * 0) ||
                            (row == 4 + 7 * 1 || row == 3 + 7 * 1 || row == 5 + 7 * 1) ||
                            (row == 4 + 7 * 2 || row == 3 + 7 * 2 || row == 5 + 7 * 2) ||
                            (row == 4 + 7 * 3 || row == 3 + 7 * 3 || row == 5 + 7 * 3))


                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvestedPaddy':
                    var conditionCalculated =
                        ((row == 4 + 7 * 0 || row == 3 + 7 * 0 || row == 0 + 7 * 0) ||
                            (row == 4 + 7 * 1 || row == 3 + 7 * 1 || row == 0 + 7 * 1) ||
                            (row == 4 + 7 * 2 || row == 3 + 7 * 2 || row == 0 + 7 * 2) ||
                            (row == 4 + 7 * 3 || row == 3 + 7 * 3 || row == 0 + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'productionPaddy':

                    var conditionCalculated =
                        ((row == 4 + 7 * 0 || row == 1 + 7 * 0 || row == 3 + 7 * 0) ||
                            (row == 4 + 7 * 1 || row == 1 + 7 * 1 || row == 3 + 7 * 1) ||
                            (row == 4 + 7 * 2 || row == 1 + 7 * 2 || row == 3 + 7 * 2) ||
                            (row == 4 + 7 * 3 || row == 1 + 7 * 3 || row == 3 + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;
            }

        }else{

            switch (formulaToApply) {

                case 'milled':
                case 'init':

                    var conditionCalculated =
                        ((row == 1 + 7 * 0 || row == 3 + 7 * 0 || row == 6 + 7 * 0) ||
                            (row == 1 + 7 * 1 || row == 3 + 7 * 1 || row == 6 + 7 * 1) ||
                            (row == 1 + 7 * 2 || row == 3 + 7 * 2 || row == 6 + 7 * 2) ||
                            (row == 1 + 7 * 3 || row == 3 + 7 * 3 || row == 6 + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvestedMilled':

                    var conditionCalculated =
                        ((row == 0 + 7 * 0 || row == 1 + 7 * 0 || row == 6 + 7 * 0) ||
                            (row == 0 + 7 * 1 || row == 1 + 7 * 1 || row == 6 + 7 * 1) ||
                            (row == 0 + 7 * 2 || row == 1 + 7 * 2 || row == 6 + 7 * 2) ||
                            (row == 0 + 7 * 3 || row == 1 + 7 * 3 || row == 6 + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'productionMilled':

                    var conditionCalculated =
                        ((row == 4 + 7 * 0 || row == 1 + 7 * 0 || row == 6 + 7 * 0) ||
                            (row == 4 + 7 * 1 || row == 1 + 7 * 1 || row == 6 + 7 * 1) ||
                            (row == 4 + 7 * 2 || row == 1 + 7 * 2 || row == 6 + 7 * 2) ||
                            (row == 4 + 7 * 3 || row == 1 + 7 * 3 || row == 6 + 7 * 3))


                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'yieldPaddy':

                    var conditionCalculated =
                        ((row == 4 + 7 * 0 || row == 3 + 7 * 0 || row == 6 + 7 * 0) ||
                            (row == 4 + 7 * 1 || row == 3 + 7 * 1 || row == 6 + 7 * 1) ||
                            (row == 4 + 7 * 2 || row == 3 + 7 * 2 || row == 6 + 7 * 2) ||
                            (row == 4 + 7 * 3 || row == 3 + 7 * 3 || row == 6 + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvestedPaddy':

                    var conditionCalculated =
                        ((row == 4 + 7 * 0 || row == 3 + 7 * 0 || row == 0 + 7 * 0) ||
                            (row == 4 + 7 * 1 || row == 3 + 7 * 1 || row == 0 + 7 * 1) ||
                            (row == 4 + 7 * 2 || row == 3 + 7 * 2 || row == 0 + 7 * 2) ||
                            (row == 4 + 7 * 3 || row == 3 + 7 * 3 || row == 0 + 7 * 3))


                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'productionPaddy':

                    var conditionCalculated =
                        ((row == 4 + 7 * 0 || row == 1 + 7 * 0 || row == 3 + 7 * 0) ||
                            (row == 4 + 7 * 1 || row == 1 + 7 * 1 || row == 3 + 7 * 1) ||
                            (row == 4 + 7 * 2 || row == 1 + 7 * 2 || row == 3 + 7 * 2) ||
                            (row == 4 + 7 * 3 || row == 1 + 7 * 3 || row == 3 + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;
            }

        }

        return toBlock;

    }


    return PaddyFormulaHandler;
})
