define(["jquery", "formatter/DatatypesFormatter"], function ($, Formatter) {

    var configurator, fullModel, configurationKeys, valueColumn, indexValues, idOlapGrid, accessorMap, dsd, accessorModel,
        formatter, supportUtility, particularFormatterCodes;


    var _IMG_URL = window.location.href+ "/css/images/notes/paperclip-icon.png"

    function ViewModel() {
        particularFormatterCodes = {"Yield (Tonnes/Ha)":true, "Per capita food use (Kg/Yr)":true}
    }

    ViewModel.prototype.init = function (tableData, Configurator, SupportUtility) {
        supportUtility = SupportUtility;
        formatter = new Formatter;
        configurator = Configurator;
        dsd = configurator.getDSD()
        fullModel = configurator.getAllColumnModels();
        configurationKeys = configurator.getKeyColumnConfiguration();
        valueColumn = configurator.getValueColumnConfiguration();
        accessorMap = configurator.getAccessorMap();
        indexValues = configurator.getValueIndex();
        idOlapGrid = configurator.getIdOlapGrid();
        accessorModel = configurator.getDSDAccessorColumns()
        return this.createViewModel(tableData);

    }

    ViewModel.prototype.createViewModel = function (tableModel) {
        var result = tableModel.slice();
        for (var i = 0; i < tableModel.length; i++) {
            var item = tableModel[i];
            result[i] = this.updateItem(item);
        }
        return result;
    }


    ViewModel.prototype.updateItem = function (item) {
        var result = item.slice()
        fullModel["upColumnsModel"]["upKeyIndexes"]
        var upColumns = fullModel["upColumnsModel"];
        var leftColumns = fullModel["leftColumnsModel"];
        var upKeyIndexes = fullModel["upColumnsModel"]["upKeyIndexes"];
        var leftKeyIndexes = fullModel["leftColumnsModel"]["leftKeyIndexes"];
        var leftConf = configurationKeys["leftKeyColumnConfiguration"];
        var upConf = configurationKeys["upKeyColumnConfiguration"];

        // UpPIVOT
        for (var i = 0; i < upKeyIndexes.length; i++) {
            var datatype = fullModel["upColumnsModel"]["upColumns"][i].dataTypes;
            if (datatype == "date" || datatype == "time" || datatype == "month" || datatype == "year") {
                result[upKeyIndexes[i]] = this.renderFormatDate(item[upKeyIndexes[i]], upConf[i], datatype)
            }
            else if (datatype == "code" || datatype == "codeList" || datatype == "customCode") {
                var columnCodes = configurator.lookForCode(upColumns.upColumns[i].domain.id);
                if (typeof columnCodes === 'undefined') {
                    configurator.createMapCodes(upColumns.upColumns[i], upConf[i])
                    columnCodes = configurator.lookForCode(upColumns.upColumns[i].domain.id)
                }
                result[upKeyIndexes[i]] = columnCodes.mapCodeLabel[item[upKeyIndexes[i]]]
            }
            else {
                result[upKeyIndexes[i]] = item[upKeyIndexes[i]]
            }
        }
        // left KEY
        for (var i = 0; i < upKeyIndexes.length; i++) {
            // for now simple
            var datatype = fullModel["leftColumnsModel"]["leftColumns"][i].dataTypes;
            if (datatype == "date" || datatype == "time" || datatype == "month" || datatype == "year") {
                result[leftKeyIndexes[i]] = this.renderFormatDate(item[leftKeyIndexes[i]], leftConf[i], datatype)
            }
            else if (datatype == "code" || datatype == "codeList" || datatype == "customCode") {
                var columnCodes = configurator.lookForCode(leftColumns.leftColumns[i].domain.id);
                if (typeof columnCodes === 'undefined') {
                    configurator.createMapCodes(leftColumns.leftColumns[i], leftConf[i])
                    columnCodes = configurator.lookForCode(leftColumns.leftColumns[i].domain.id)
                }
                result[leftKeyIndexes[i]] = columnCodes.mapCodeLabel[item[leftKeyIndexes[i]]];
            }
            else {
                result[leftKeyIndexes[i]] = item[leftKeyIndexes[i]]
            }
        }

        var notesInserted = false
        var accessorIndexes = accessorModel["accessorIndexes"];
        var accessorColumns = accessorModel["accessorColumns"];
        // accessor columns
        for (var i = 0; i < accessorIndexes.length; i++) {

            var configurationColumn = configurator.lookForAccessorColumnByIdOnConfiguration(accessorColumns[i].domain.id)
            var datatype = accessorColumns[i].dataTypes
            // case of date format
            if (datatype == "date" || datatype == "time" || datatype == "month" || datatype == "year") {
                if (typeof item[accessorIndexes[i]] != 'undefined' && item[accessorIndexes[i]] != null) {
                    result[accessorIndexes[i]] = this.fromDSDToVisualizationFormat(item[accessorIndexes[i]], configurationColumn, datatype)
                } else {
                    result[accessorIndexes[i]] = item[accessorIndexes[i]]
                }
            }
            // case of code format
            else if (datatype == "code" || datatype == "codeList" || datatype == "customCode") {
                var columnAccessorCodes = configurator.lookForCode(accessorColumns[i].domain.id);
                if (typeof columnAccessorCodes === 'undefined') {
                    var configurationColumn = configurator.lookForAccessorColumnByIdOnConfiguration(accessorColumns[i].domain.id)
                    configurator.createMapCodes(accessorColumns[i], configurationColumn)
                    columnAccessorCodes = configurator.lookForCode(accessorColumns[i].domain.id)
                }
                result[accessorIndexes[i]] = columnAccessorCodes.mapCodeLabel[item[accessorIndexes[i]]]
            }
            else {
                result[accessorIndexes[i]] = item[accessorIndexes[i]]
                if( i ==2 && typeof item[accessorIndexes[i]] !='undefined' &&  item[accessorIndexes[i]] != null &&  item[accessorIndexes[i]] != 'null'){
                    notesInserted = true;
                }
            }
        }
      //  result[indexValues]  =formatter.fromDSDToVisualizationFormat(result[indexValues],valueColumn,configurator.getValueColumnOnDSD().dataTypes, configurator)

         result[indexValues]  = (result[0] && particularFormatterCodes[result[0]])? formatter.convertParticularValues(result[indexValues],valueColumn,configurator.getValueColumnOnDSD().dataTypes, configurator):
             formatter.fromDSDToVisualizationFormat(result[indexValues],valueColumn,configurator.getValueColumnOnDSD().dataTypes, configurator);


        var label = configurator.getValueLabel()
        result[indexValues] = this.expressionLanguage(label, indexValues, result);

        return result;
    }

    ViewModel.prototype.expressionLanguage = function (expressionValue, indexValue, item) {

        var conditionRegExpression = /(#(\w+)(\|))/;
        var valuesRegExpression = /(((\W)|(\s))*(\$\w+)((\W)|(\s))*(\~))/;
        var onlyValue = /(\$\w+)/;
        var result = "";

        var expression = expressionValue;
        while (expression != "" && expression != "|") {
            var firstCondition = expression.match(conditionRegExpression)[0]
            expression = expression.replace(conditionRegExpression, "")
            firstCondition = firstCondition.slice(0, -1);
            if (firstCondition.substring(1) == "value") {
                if (typeof item[indexValue] !== 'undefined'  && item[indexValue] != null) {
                    var secondCondition = expression.match(valuesRegExpression)[0];
                    expression = expression.replace(valuesRegExpression, "")
                    secondCondition = secondCondition.slice(0, -1);
                    var stringAppend = secondCondition.replace(onlyValue, function (match) {
                        var returnedValue;
                        returnedValue = (match.substring(1) == "value") ? item[indexValue] : item[accessorMap[match.substring(1)]];
                        return returnedValue;
                    })
                    result += stringAppend;
                }
                else {
                    break;
                }
            }
            else {
                if (typeof item[accessorMap[firstCondition.substring(1)]] !== 'undefined' && item[accessorMap[firstCondition.substring(1)]] !==null && item[accessorMap[firstCondition.substring(1)]] !== 'null') {
                    var secondCondition = expression.match(valuesRegExpression)[0];
                    expression = expression.replace(valuesRegExpression, "")
                    secondCondition = secondCondition.slice(0, -1);
                    var stringAppend = secondCondition.replace(onlyValue, function (match) {

                        var returnedValue;

                        if(match.substring(1) == "note"){
                            returnedValue = "&nbsp<img src='"+_IMG_URL+"' width='16' height='16'>";
                        }else{
                            returnedValue = " &nbsp  "+item[accessorMap[match.substring(1)]];
                        }

                        return returnedValue;
                    })
                    result +=stringAppend;
                }
                else {
                    expression = expression.replace(valuesRegExpression, "")
                }
            }
        }
        return result;
    }


    ViewModel.prototype.renderFormatDate = function (value, configurationKeyColumn, datatype) {

        var result;
        switch (datatype[0]) {
            case "time":
                var date = new Date(value);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "month":
                var date = (value !== 'undefined') ? moment(value).format("YYYYMM") : undefined;
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "year":
                var date = (value !== 'undefined') ? moment(value).format("YYYY") : undefined;
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "date":
                if(value != "20000103") {
                    var yearFrom = value.substr(0, 4);
                    var mmFrom = value.substr(4, 2);
                    var ddFrom = value.substr(6, 2);
                    var dateFrom = new Date(yearFrom, mmFrom - 1, ddFrom)
                    // var date = (value !== 'undefined') ? moment(value).format("YYYYMMDD") : undefined;
                    result = moment(dateFrom).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                }else{
                    result = supportUtility.getPreviousSeasonLabel()
                }
                break;

        }
        return result;
    }

    return ViewModel;
})