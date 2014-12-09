/**
 * Created by fabrizio on 9/19/14.
 */

define(["jquery", "specialFormulaConf/formulaUtils/FormulaConfigurator", "specialFormulaConf/dataUtils/CommonUtils"],
    function ($, FormulaConfigurator, CommonUtils) {

    var formulaConfigurator, commonUtils;

    function FormulaHandler() {
        formulaConfigurator = new FormulaConfigurator;
        commonUtils = new CommonUtils;
    }

    // For Production, number of forms are:
    //  1) total Values
    //  2) single Crops
    FormulaHandler.prototype.getInitFormulaFromConf = function (numberOfForm, typeOfForm) {

       var result =  formulaConfigurator.getInitFormula(numberOfForm, typeOfForm)
       return result;
    }

    FormulaHandler.prototype.getUpdateFormula = function(numberOfForm, typeOfForm, dependentElement, typeOfEditing){

        var result = formulaConfigurator.getUpdateFormula(numberOfForm, typeOfForm, dependentElement, typeOfEditing);
        return result;
    }

    FormulaHandler.prototype.createFormula = function (modelData, formulaData) {
        var model = modelData;
        var formula =  formulaData;
        var addendums = [];
        var operations = [];
        var startIndex, indexRow;
        // set the start index and the range
        var codeValue = formula.variable.value[0]
        var notRealizeable = false;
        //  initialize a label
        var indexValue =  commonUtils.getIndexModelFromCode(codeValue,model);

        label1:
            for (var i = 0; i < formula.addendums.length; i++) {
                var addendum = formula.addendums[i]
                switch (addendum.dataType) {
                    case "code":
                        var code = addendum.value[0];
                        var index =  commonUtils.getIndexModelFromCode(code,model);
                        var hasCondition = addendum.hasCondition
                        var existCondition = addendum.condition == "exists"
                        if (hasCondition&& existCondition){
                            if (typeof model[index][3] == 'undefined' || model[index][3] == null || model[index][3] == "") {
                                code = addendum.otherValue[0];
                                index =  commonUtils.getIndexModelFromCode(code,model);
                                if (typeof model[index][3] != 'undefined' && model[index][3] != null ) {
                                    addendums.push(model[index][3])
                                }
                                else{
                                    notRealizeable = true;
                                    break label1;
                                }
                            }else{
                                if (typeof model[index][3] != 'undefined' && model[index][3] != null ) {
                                    addendums.push(model[index][3])
                                }
                            }
                        }else{
                            if (typeof model[index][3] != 'undefined' && model[index][3] != null ) {
                                addendums.push(model[index][3])
                            }
                            else
                            {
                                notRealizeable = true;
                                break label1;
                            }
                        }
                        break;
                    case "operation":
                        operations.push(addendum.value)
                        break;
                    case "constant":
                        addendums.push(addendum.value)
                        break;
                }
            }

        if (!notRealizeable) {
            var value = addendums[0];
            label2:
                for (var j = 0; j < operations.length; j++) {
                    switch (operations[j]) {
                        case "+":
                            if (typeof addendums[j + 1] !== 'undefined' && addendums[j + 1] != null && addendums[j + 1] != '') {
                                value += addendums[j + 1]
                            } else {
                                notRealizeable = true;
                                break label2;
                            }
                            break;

                        case "-":
                            if (typeof addendums[j + 1] !== 'undefined' && addendums[j + 1] != null && addendums[j + 1] != '') {
                                value -= addendums[j + 1];
                            } else {
                                notRealizeable = true;
                                break label2;
                            }
                            break;

                        case "*":
                            if (typeof addendums[j + 1] !== 'undefined' && addendums[j + 1] != null && addendums[j + 1] != '') {
                                value = value * addendums[j + 1]
                            } else {
                                notRealizeable = true;
                                break label2;
                            }
                            break;

                        case "/":
                            if (typeof addendums[j + 1] !== 'undefined' && addendums[j + 1] != 0 && addendums[j + 1] != null && addendums[j + 1] != '') {
                                value = value / addendums[j + 1]
                            } else {
                                notRealizeable = true;
                                break label2;
                            }
                            break;
                    }
                }
            if (!notRealizeable) {

                model[indexValue][3] = parseFloat(value).toFixed(3);
                // Insert the flag
                model[indexValue][4] = 'C';
            } else {
                model[indexValue][3] = model[indexValue][3];
            }
        }


        return model;

    }

    return FormulaHandler;
})