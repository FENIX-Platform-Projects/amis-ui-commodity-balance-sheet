define(['jquery'],function($){

    function PaddyFormulaHandler(){}


    var PRODUCTION_PADDY_CODE = 998;
    var PRODUCTION_CODE = 5;
    var YIELD_PADDY_CODE = 996;
    var YIELD_CODE = 4;
    var AH_CODE = 2;
    var APL_CODE = 37;

    var POSITIONS = {
        "AH":0,
        "PROD_PADDY":1,
        "EX_RATE":2,
        "Y_MILL":3,
        "PROD":4,
        "AP":5,
        "Y_PADDY":6
    }

    PaddyFormulaHandler.prototype.checkIfBlocked = function(formulaToApply, row, isTotalValueSection){

        var toBlock = false;
        if(isTotalValueSection) {

            switch (formulaToApply) {

                case 'milled':
                case 'init':
                    var conditionCalculated =
                        ((row == POSITIONS.PROD_PADDY + 7 * 0    || row == POSITIONS.Y_MILL + 7 * 0 || row == POSITIONS.Y_PADDY + 7 * 0) ||
                            (row == POSITIONS.PROD_PADDY + 7 * 1 || row == POSITIONS.Y_MILL + 7 * 1 || row == POSITIONS.Y_PADDY + 7 * 1) ||
                            (row == POSITIONS.PROD_PADDY + 7 * 2 || row == POSITIONS.Y_MILL + 7 * 2 || row == POSITIONS.Y_PADDY + 7 * 2) ||
                            (row == POSITIONS.PROD_PADDY + 7 * 3 || row == POSITIONS.Y_MILL + 7 * 3 || row == POSITIONS.Y_PADDY + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvestedMilled':

                    var conditionCalculated =
                        ((row ==  POSITIONS.AH  + 7 * 0 || row == POSITIONS.PROD_PADDY + 7 * 0  || row == POSITIONS.Y_PADDY + 7 * 0) ||
                            (row == POSITIONS.AH + 7 * 1 || row == POSITIONS.PROD_PADDY + 7 * 1 || row == POSITIONS.Y_PADDY + 7 * 1) ||
                            (row == POSITIONS.AH + 7 * 2 || row == POSITIONS.PROD_PADDY + 7 * 2 || row == POSITIONS.Y_PADDY + 7 * 2) ||
                            (row == POSITIONS.AH + 7 * 3 || row == POSITIONS.PROD_PADDY + 7 * 3 || row == POSITIONS.Y_PADDY + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'productionMilled':

                    var conditionCalculated =
                        ((   row == POSITIONS.PROD + 7 * 0 || row == POSITIONS.PROD_PADDY + 7 * 0 || row == POSITIONS.Y_PADDY + 7 * 0) ||
                            (row == POSITIONS.PROD + 7 * 1 || row == POSITIONS.PROD_PADDY + 7 * 1 || row == POSITIONS.Y_PADDY + 7 * 1) ||
                            (row == POSITIONS.PROD + 7 * 2 || row == POSITIONS.PROD_PADDY + 7 * 2 || row == POSITIONS.Y_PADDY + 7 * 2) ||
                            (row == POSITIONS.PROD + 7 * 3 || row == POSITIONS.PROD_PADDY + 7 * 3 || row == POSITIONS.Y_PADDY + 7 * 3))


                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'yieldPaddy':

                    var conditionCalculated =
                        ((   row == POSITIONS.PROD + 7 * 0 || row == POSITIONS.Y_MILL + 7 * 0 || row == POSITIONS.Y_PADDY + 7 * 0) ||
                            (row == POSITIONS.PROD + 7 * 1 || row == POSITIONS.Y_MILL + 7 * 1 || row == POSITIONS.Y_PADDY + 7 * 1) ||
                            (row == POSITIONS.PROD + 7 * 2 || row == POSITIONS.Y_MILL + 7 * 2 || row == POSITIONS.Y_PADDY + 7 * 2) ||
                            (row == POSITIONS.PROD + 7 * 3 || row == POSITIONS.Y_MILL + 7 * 3 || row == POSITIONS.Y_PADDY + 7 * 3))


                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvestedPaddy':
                    var conditionCalculated =
                        ((   row == POSITIONS.PROD + 7 * 0 || row == POSITIONS.Y_MILL + 7 * 0 || row == POSITIONS.AH + 7 * 0) ||
                            (row == POSITIONS.PROD + 7 * 1 || row == POSITIONS.Y_MILL + 7 * 1 || row == POSITIONS.AH + 7 * 1) ||
                            (row == POSITIONS.PROD + 7 * 2 || row == POSITIONS.Y_MILL + 7 * 2 || row == POSITIONS.AH + 7 * 2) ||
                            (row == POSITIONS.PROD + 7 * 3 || row == POSITIONS.Y_MILL + 7 * 3 || row == POSITIONS.AH + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'productionPaddy':

                    var conditionCalculated =
                        ((   row == POSITIONS.PROD + 7 * 0 || row == POSITIONS.PROD_PADDY + 7 * 0 || row == POSITIONS.Y_MILL + 7 * 0) ||
                            (row == POSITIONS.PROD + 7 * 1 || row == POSITIONS.PROD_PADDY + 7 * 1 || row == POSITIONS.Y_MILL + 7 * 1) ||
                            (row == POSITIONS.PROD + 7 * 2 || row == POSITIONS.PROD_PADDY + 7 * 2 || row == POSITIONS.Y_MILL + 7 * 2) ||
                            (row == POSITIONS.PROD + 7 * 3 || row == POSITIONS.PROD_PADDY + 7 * 3 || row == POSITIONS.Y_MILL + 7 * 3))

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
                        ((row == POSITIONS.PROD_PADDY + 7 * 0    || row == POSITIONS.Y_MILL + 7 * 0 || row == POSITIONS.Y_PADDY + 7 * 0) ||
                            (row == POSITIONS.PROD_PADDY + 7 * 1 || row == POSITIONS.Y_MILL + 7 * 1 || row == POSITIONS.Y_PADDY + 7 * 1) ||
                            (row == POSITIONS.PROD_PADDY + 7 * 2 || row == POSITIONS.Y_MILL + 7 * 2 || row == POSITIONS.Y_PADDY + 7 * 2) ||
                            (row == POSITIONS.PROD_PADDY + 7 * 3 || row == POSITIONS.Y_MILL + 7 * 3 || row == POSITIONS.Y_PADDY + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvestedMilled':

                    var conditionCalculated =
                        ((row ==    POSITIONS.AH + 7 * 0 || row == POSITIONS.PROD_PADDY + 7 * 0 || row == POSITIONS.Y_PADDY + 7 * 0) ||
                            (row == POSITIONS.AH + 7 * 1 || row == POSITIONS.PROD_PADDY + 7 * 1 || row == POSITIONS.Y_PADDY + 7 * 1) ||
                            (row == POSITIONS.AH + 7 * 2 || row == POSITIONS.PROD_PADDY + 7 * 2 || row == POSITIONS.Y_PADDY + 7 * 2) ||
                            (row == POSITIONS.AH + 7 * 3 || row == POSITIONS.PROD_PADDY + 7 * 3 || row == POSITIONS.Y_PADDY + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'productionMilled':

                    var conditionCalculated =
                        ((row ==    POSITIONS.PROD + 7 * 0 || row == POSITIONS.PROD_PADDY + 7 * 0 || row == POSITIONS.Y_PADDY + 7 * 0) ||
                            (row == POSITIONS.PROD + 7 * 1 || row == POSITIONS.PROD_PADDY + 7 * 1 || row == POSITIONS.Y_PADDY + 7 * 1) ||
                            (row == POSITIONS.PROD + 7 * 2 || row == POSITIONS.PROD_PADDY + 7 * 2 || row == POSITIONS.Y_PADDY + 7 * 2) ||
                            (row == POSITIONS.PROD + 7 * 3 || row == POSITIONS.PROD_PADDY + 7 * 3 || row == POSITIONS.Y_PADDY + 7 * 3))


                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'yieldPaddy':

                    var conditionCalculated =
                        ((   row == POSITIONS.PROD + 7 * 0 || row == POSITIONS.Y_MILL + 7 * 0 || row == POSITIONS.Y_PADDY + 7 * 0) ||
                            (row == POSITIONS.PROD + 7 * 1 || row == POSITIONS.Y_MILL + 7 * 1 || row == POSITIONS.Y_PADDY + 7 * 1) ||
                            (row == POSITIONS.PROD + 7 * 2 || row == POSITIONS.Y_MILL + 7 * 2 || row == POSITIONS.Y_PADDY + 7 * 2) ||
                            (row == POSITIONS.PROD + 7 * 3 || row == POSITIONS.Y_MILL + 7 * 3 || row == POSITIONS.Y_PADDY + 7 * 3))

                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'areaHarvestedPaddy':

                    var conditionCalculated =
                        ((   row == POSITIONS.PROD + 7 * 0 || row == POSITIONS.Y_MILL + 7 * 0 || row == POSITIONS.AH + 7 * 0) ||
                            (row == POSITIONS.PROD + 7 * 1 || row == POSITIONS.Y_MILL + 7 * 1 || row == POSITIONS.AH + 7 * 1) ||
                            (row == POSITIONS.PROD + 7 * 2 || row == POSITIONS.Y_MILL + 7 * 2 || row == POSITIONS.AH + 7 * 2) ||
                            (row == POSITIONS.PROD + 7 * 3 || row == POSITIONS.Y_MILL + 7 * 3 || row == POSITIONS.AH + 7 * 3))


                    if (conditionCalculated) {
                        toBlock = true;
                    }
                    break;

                case 'productionPaddy':

                    var conditionCalculated =
                        ((row ==    POSITIONS.PROD + 7 * 0 || row == POSITIONS.PROD_PADDY + 7 * 0 ||    row == POSITIONS.Y_MILL + 7 * 0) ||
                            (row == POSITIONS.PROD + 7 * 1 || row == POSITIONS.PROD_PADDY + 7 * 1 || row == POSITIONS.Y_MILL + 7 * 1) ||
                            (row == POSITIONS.PROD + 7 * 2 || row == POSITIONS.PROD_PADDY + 7 * 2 || row == POSITIONS.Y_MILL + 7 * 2) ||
                            (row == POSITIONS.PROD + 7 * 3 || row == POSITIONS.PROD_PADDY + 7 * 3 || row == POSITIONS.Y_MILL + 7 * 3))

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


        var productionPaddy = data[positionDataPaddy[PRODUCTION_PADDY_CODE]];
        var productionMilled = data[positionDataPaddy[PRODUCTION_CODE]];


        if(foundCalcFlagOnRow(productionPaddy)){

            var yPaddy = data[positionDataPaddy[YIELD_PADDY_CODE]]


            if(foundCalcFlagOnRow(yPaddy)){

                switch (true){

                    case foundCalcFlagOnRow(data[positionDataPaddy[AH_CODE]]):
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
            else if(foundCalcFlagOnRow(productionMilled) && foundCalcFlagOnRow(data[positionDataPaddy[YIELD_CODE]])){
                result = 'productionPaddy'
            }
            else{
                result = 'init';
            }
        }


        else if(foundCalcFlagOnRow(productionMilled)){


            var yMilled = data[positionDataPaddy[YIELD_CODE]]

            if(foundCalcFlagOnRow(yMilled)){

                switch (true){

                    case foundCalcFlagOnRow(data[positionDataPaddy[AH_CODE]]):
                        result = 'areaHarvestedPaddy'
                        break;


                    case foundCalcFlagOnRow(data[positionDataPaddy[YIELD_PADDY_CODE]]):
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
            else if(foundCalcFlagOnRow(productionPaddy) && foundCalcFlagOnRow(data[positionDataPaddy[YIELD_PADDY_CODE]])){
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
