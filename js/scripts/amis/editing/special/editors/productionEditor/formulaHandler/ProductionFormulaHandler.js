define(['jquery'], function($){

    function ProductionFormulaHandler(){}



    ProductionFormulaHandler.prototype.getFormulaFromData = function(data){


        var  formulaInit, isAreaHarvSelected;

        var indexFlags = 4;
        var indexValue = 3;
        var indexCode = 0;

        var positionProduction = {}

        for(var i=0; i<data.length; i++)
            positionProduction[data[i][indexCode]] = i;


        var foundAreaSelected = function(row){
            return (typeof row[indexValue] !== 'undefined' && row[indexValue] !=null && row[indexValue] !='')
        }


        var foundCalcFlagOnRow = function(row){
            return (typeof row[indexFlags] !== 'undefined' &&row[indexFlags] !=null && row[indexFlags].split(',')[0] == 'C')
        }

        var areaHarvested = data[positionProduction[2]];
        var areaPlanted = data[positionProduction[37]]

        if(foundAreaSelected(areaHarvested)){
            isAreaHarvSelected = true;
            if(foundCalcFlagOnRow(areaHarvested)) {
                formulaInit = 'areaHarvested';
            }
            else if(foundCalcFlagOnRow(data[positionProduction[5]])){
                formulaInit = 'production';
            }else{
                formulaInit = 'init'
            }
        }

        else if(foundAreaSelected(areaPlanted)){
            isAreaHarvSelected = false;
            if(foundCalcFlagOnRow(areaPlanted)) {
                formulaInit = 'areaHarvested';
            }
            else if(foundCalcFlagOnRow(data[positionProduction[5]])){
                formulaInit = 'production';
            }else{
                formulaInit = 'init'
            }

        }

        else{
           formulaInit = 'init';
           isAreaHarvSelected  =true;
        }

        return {
            'formulaInit':formulaInit,
            'isAreaHarvSelected':isAreaHarvSelected
        }

    }


    return ProductionFormulaHandler;
})