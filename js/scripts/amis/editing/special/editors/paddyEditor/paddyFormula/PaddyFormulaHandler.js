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


    PaddyFormulaHandler.prototype.getFormulaFromData = function(data){

        var result;

        var indexFlags = 4;
        var indexCode = 0;

        var positionDataPaddy = {}

        for(var i=0; i<data.length; i++)
            positionDataPaddy[data[i][indexCode]] = i;


        var foundCalcFlagOnRow = function(row){
            return (typeof row[indexFlags] !== 'undefined' &&row[indexFlags] !=null && row[indexFlags].split(',')[0] == 'C')
        }


        var productionPaddy = data[positionDataPaddy[998]];
        var productionMilled = data[positionDataPaddy[5]];


        if(foundCalcFlagOnRow(productionPaddy)){

            var yPaddy = data[positionDataPaddy[996]]


            if(foundCalcFlagOnRow(yPaddy)){

                switch (true){

                    case foundCalcFlagOnRow(data[positionDataPaddy[2]]):
                        result = 'areaHarvestedMilled'
                        break;


                    case foundCalcFlagOnRow(productionMilled):
                        result = 'productionMilled'
                        break;

                    default :
                        result = 'init';
                        break;

                }
            }
            else if(foundCalcFlagOnRow(productionMilled) && foundCalcFlagOnRow(data[positionDataPaddy[4]])){
                result = 'productionPaddy'
            }
            else{
                result = 'init';
            }
        }


        else if(foundCalcFlagOnRow(productionMilled)){


            var yMilled = data[positionDataPaddy[4]]

            if(foundCalcFlagOnRow(yMilled)){

                switch (true){

                    case foundCalcFlagOnRow(data[positionDataPaddy[2]]):
                        result = 'areaHarvestedPaddy'
                        break;


                    case foundCalcFlagOnRow(data[positionDataPaddy[996]]):
                        result = 'yieldPaddy'
                        break;

                    case foundCalcFlagOnRow(productionPaddy):
                        result = 'productionPaddy';
                        break;

                    default :
                        result='init';
                        break;

                }
            }
            else if(foundCalcFlagOnRow(productionPaddy) && foundCalcFlagOnRow(data[positionDataPaddy[996]])){
                result = 'productionMilled'
            }
            else{
                result = 'init';
            }
        }

        else{
            result = 'init'
        }

        return result;

    }


    return PaddyFormulaHandler;
})
