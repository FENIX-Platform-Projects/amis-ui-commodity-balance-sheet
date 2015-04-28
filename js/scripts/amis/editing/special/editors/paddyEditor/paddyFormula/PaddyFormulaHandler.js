define(['jquery'],function($){

    var o = {
        "positions" : {
            "AH":0,
            "PROD_PADDY":1,
            "EX_RATE":2,
            "Y_MILL":3,
            "PROD":4,
            "AP":5,
            "Y_PADDY":6
        },
        "codes":{
            "PRODUCTION_PADDY_CODE" : 998,
            "PRODUCTION_CODE" : 5,
            "YIELD_PADDY_CODE" : 996,
            "YIELD_CODE" : 4,
            "AH_CODE" : 2,
            "APL_CODE" : 37
        },
        "indexes":{
            "flags":4,
            "value":3,
            "code":0

        }
    }

    function PaddyFormulaHandler(){ this.o = o; }


    PaddyFormulaHandler.prototype.checkIfDisabled = function(row, isAreaHSelected) {

        var conditionDisable =
            ((row === this.o.positions.AH && !isAreaHSelected) || ((row == this.o.positions.AP && isAreaHSelected)) ||
            ((row === this.o.positions.AH + (7 * 1) && !isAreaHSelected) || ((row == this.o.positions.AP + (7 * 1) && isAreaHSelected))) ||
            ((row === this.o.positions.AH + (7 * 2) && !isAreaHSelected) || ((row == this.o.positions.AP + (7 * 2) && isAreaHSelected))));
        return conditionDisable
    }


    PaddyFormulaHandler.prototype.checkIfBlocked = function(formulaToApply,isAreaHSelected, row, isTotalValueSection){

        var POSITIONS = this.o.positions;
        var toBlock = false

        var areaPosition = (isAreaHSelected)? POSITIONS.AH : POSITIONS.AP;
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
                        ((row ==  areaPosition  + 7 * 0 || row == POSITIONS.PROD_PADDY + 7 * 0  || row == POSITIONS.Y_PADDY + 7 * 0) ||
                            (row == areaPosition + 7 * 1 || row == POSITIONS.PROD_PADDY + 7 * 1 || row == POSITIONS.Y_PADDY + 7 * 1) ||
                            (row == areaPosition + 7 * 2 || row == POSITIONS.PROD_PADDY + 7 * 2 || row == POSITIONS.Y_PADDY + 7 * 2) ||
                            (row == areaPosition + 7 * 3 || row == POSITIONS.PROD_PADDY + 7 * 3 || row == POSITIONS.Y_PADDY + 7 * 3))

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
                        ((   row == POSITIONS.PROD + 7 * 0 || row == POSITIONS.Y_MILL + 7 * 0 || row == areaPosition + 7 * 0) ||
                            (row == POSITIONS.PROD + 7 * 1 || row == POSITIONS.Y_MILL + 7 * 1 || row == areaPosition + 7 * 1) ||
                            (row == POSITIONS.PROD + 7 * 2 || row == POSITIONS.Y_MILL + 7 * 2 || row == areaPosition + 7 * 2) ||
                            (row == POSITIONS.PROD + 7 * 3 || row == POSITIONS.Y_MILL + 7 * 3 || row == areaPosition + 7 * 3))

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

        }
        else{

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
                        ((row ==    areaPosition + 7 * 0 || row == POSITIONS.PROD_PADDY + 7 * 0 || row == POSITIONS.Y_PADDY + 7 * 0) ||
                            (row == areaPosition + 7 * 1 || row == POSITIONS.PROD_PADDY + 7 * 1 || row == POSITIONS.Y_PADDY + 7 * 1) ||
                            (row == areaPosition + 7 * 2 || row == POSITIONS.PROD_PADDY + 7 * 2 || row == POSITIONS.Y_PADDY + 7 * 2) ||
                            (row == areaPosition + 7 * 3 || row == POSITIONS.PROD_PADDY + 7 * 3 || row == POSITIONS.Y_PADDY + 7 * 3))

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
                        ((   row == POSITIONS.PROD + 7 * 0 || row == POSITIONS.Y_MILL + 7 * 0 || row == areaPosition + 7 * 0) ||
                            (row == POSITIONS.PROD + 7 * 1 || row == POSITIONS.Y_MILL + 7 * 1 || row == areaPosition + 7 * 1) ||
                            (row == POSITIONS.PROD + 7 * 2 || row == POSITIONS.Y_MILL + 7 * 2 || row == areaPosition + 7 * 2) ||
                            (row == POSITIONS.PROD + 7 * 3 || row == POSITIONS.Y_MILL + 7 * 3 || row == areaPosition + 7 * 3))


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

/*
        toBlock = (row == areaPosition);
*/

        return toBlock;
    }


    PaddyFormulaHandler.prototype.getFormulaFromData = function(data){

        var result, isAreaHarvSelected;

        var indexFlags = this.o.indexes.flags;
        var indexCode  = this.o.indexes.code;
        var indexValue = this.o.indexes.value;

        var positionDataPaddy = {}

        for(var i=0; i<data.length; i++)
            positionDataPaddy[data[i][indexCode]] = i;

        var foundAreaSelected = function(row){
            return (typeof row[indexValue] !== 'undefined' && row[indexValue] !=null && row[indexValue] !='')
        }

        var foundCalcFlagOnRow = function(row){
            return (typeof row[indexFlags] !== 'undefined' &&row[indexFlags] !=null && row[indexFlags].split(',')[0] == 'C')
        }

        var productionPaddy = data[positionDataPaddy[this.o.codes.PRODUCTION_PADDY_CODE]];
        var productionMilled = data[positionDataPaddy[this.o.codes.PRODUCTION_CODE]];
        var areaPlanted = data[positionDataPaddy[this.o.codes.APL_CODE]]

        isAreaHarvSelected = !foundAreaSelected(areaPlanted)

        if(foundCalcFlagOnRow(productionPaddy)){
            var yPaddy = data[positionDataPaddy[this.o.codes.YIELD_PADDY_CODE]]
            if(foundCalcFlagOnRow(yPaddy)){
                switch (true){

                    case foundCalcFlagOnRow(data[positionDataPaddy[this.o.codes.AH_CODE]]):
                        result = 'areaHarvestedMilled'
                        break;

                    case foundCalcFlagOnRow(data[positionDataPaddy[this.o.codes.APL_CODE]]):
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
            else if(foundCalcFlagOnRow(productionMilled) && foundCalcFlagOnRow(data[positionDataPaddy[this.o.codes.YIELD_CODE]])){
                result = 'productionPaddy'
            }
            else{
                result = 'init';
            }
        }


        else if(foundCalcFlagOnRow(productionMilled)){
            var yMilled = data[positionDataPaddy[this.o.codes.YIELD_CODE]]

            if(foundCalcFlagOnRow(yMilled)){

                switch (true){

                    case foundCalcFlagOnRow(data[positionDataPaddy[this.o.codes.AH_CODE]]):
                        result = 'areaHarvestedPaddy'
                        break;

                    case foundCalcFlagOnRow(data[positionDataPaddy[this.o.codes.APL_CODE]]):
                        result = 'areaHarvestedPaddy'
                        break;


                    case foundCalcFlagOnRow(data[positionDataPaddy[this.o.codes.YIELD_PADDY_CODE]]):
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
            else if(foundCalcFlagOnRow(productionPaddy) && foundCalcFlagOnRow(data[positionDataPaddy[this.o.codes.YIELD_PADDY_CODE]])){
                result = 'productionMilled'
            }
            else{
                result = 'init';
            }
        }


        else {
            result = 'init'
        }


        return{
            'formulaInit':result,
            'isAreaHarvSelected':isAreaHarvSelected
        }
    }


    PaddyFormulaHandler.prototype.getElementPositionOnGrid = function (isAreaHarvestedSelected) {

        var result = (isAreaHarvestedSelected)? this.o.positions.AP: this.o.positions.AH;
        return result;
    }





    return PaddyFormulaHandler;
})
