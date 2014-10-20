define(["jquery", "moment", "numeral"], function ($) {


    function DatatypesFormatter() {}


    // From editing or visualization to DSD format
    DatatypesFormatter.prototype.fromVisualizationToDSDFormat = function (value, datatype, formatDate) {

        var result
        switch (datatype) {
            case "month":
                result = (typeof value != 'undefined' && value !== 'undefined' && value != null) ? moment(value).format("YYYYMM") : undefined;
                break;

            case "year" :
                result = (typeof value != 'undefined' && value !== 'undefined' && value != null) ? moment(value).format("YYYY") : undefined;
                break;

            case "time" :
                result = (typeof value != 'undefined' && value !== 'undefined' && value != null) ? moment(value, formatDate).toJSON() : undefined;
                break;

            case "date":
                if (typeof value != 'undefined' && value !== 'undefined' && value != null) {
                    if (value != "2000/2001" || value != "2001/2002" ||  value != "2002/2003" || value != "2003/2004"
                        || value != "2004/2005" || value!= "2005/2006" || value != "2006/2007" || value != "2007/2008"
                        || value != "2008/2009" || value!= "2009/2010" || value != "2010/2011" || value != "2011/2012"
                        || value != "2012/2013" || value != "2013/2014" || value != "2014/2015" || value != "2015/2016" ||
                        value != "2016/2017" || value != "2017/2018" || value != "2018/2019" || value != "2019/2020") {
                        result = moment(value).format("YYYYMMDD")
                    } else {
                        result = "20000103"
                    }
                } else {
                    result = undefined
                }
                break;

            case "code" || "codeList" || "customCode":
                result = (value !== 'undefined') ? value : undefined;
                break;

            case "boolean":
                if (typeof  value == 'undefined' || value == 'undefined') {
                    result = undefined;
                }
                else {
                    result = value;
                }
                break;

            case "number":
                result = (typeof value != 'undefined' && value !== 'undefined' && value != null) ? parseInt(value) : undefined;
                break;

            default :
                result = (value !== 'undefined' && value != '') ? value : null;

        }
        return result;
    }

    // From DSD format to the right visualization format
    DatatypesFormatter.prototype.fromDSDToVisualizationFormat = function (value, configurationKeyColumn, datatype, configurator) {

        var result;
        switch (datatype[0]) {
            case "time":

                var date = new Date(value);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "month":
                var year = value.substr(0, 4);
                var month = value.substr(4, 2);
                var date = new Date(year, month - 1);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "year":
                var year = value.substr(0, 4);
                var date = new Date(year);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "date":
                if (typeof value != 'undefined' && value !== 'undefined' && value != null) {
                    if (value != "20000103") {
                        var year = value.substr(0, 4);
                        var month = value.substr(4, 2);
                        var day = value.substr(6, 2);
                        var date = new Date(year, month - 1, day);
                        result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                    } else {
                        result = "Previous Year"
                    }
                } else result = undefined
                break;

            case "code" || "codeList" || "customCode":

                var columnsCodes = configurator.lookForCode(configurationKeyColumn.columnId);
                console.log('columnsCodes')
                console.log(columnsCodes)
                result = columnsCodes.mapCodeLabel[value];
                break;

            case "number":
                result = (typeof value != 'undefined' && value !== 'undefined' && value != null) ?
                    numeral(value).format(configurationKeyColumn.properties.cellProperties.numericFormat) :
                    value;
                break;
        }
        return result;
    }

    // Convert into a fixed number of decimals
    DatatypesFormatter.prototype.convertNumberOfDecimals = function (data, numberOfDecimals) {
        var result;
        if (typeof data != 'undefined' && data != null && data != 'null') {
            result = parseInt(data).toFixed(numberOfDecimals);
        } else {
            result = data;
        }
        return result;
    }


    return DatatypesFormatter;
})