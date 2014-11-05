define(["jquery", "formatter/DatatypesFormatter"], function ($, Formatter) {


    var formatter, configurator;

    var tableToExcel = (function() {
        var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
            , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
        return function(table, name) {
            if (!table.nodeType) table = document.getElementById(table)
            window.location.href = uri + base64(format(template, ctx))
        }
    })()


    function TableExport() {
        formatter = new Formatter
    }

    TableExport.prototype.init = function (realTable, Configurator) {
        configurator = Configurator
        var dsd = Configurator.getDSD();
        var language = Configurator.getComponentLanguage();

        var table2 = $.extend(true,[],realTable);
        var table = this.filterValues(table2)

        console.log(JSON.stringify(table))

        var string = "<table id='tablePivot'><tr>"
        for (var i = 0; i < dsd.dsd.columns.length; i++) {
            var title = dsd.dsd.columns[i].domain.title[language];
            string += "<th>" + title + "</th>";
        }
        string += "</tr><tr>";
        for (var i = 0; i < table.length; i++) {
            for (var j = 0; j < table[i].length; j++) {
                var value = (typeof  table[i][j] === 'undefined') ? "" : table[i][j];
                string += "<td>" + value + "</td>"
            }
            if (i < table.length - 1) {
                string += "</tr><tr>";
            } else {
                string += "</tr>";
            }
        }
        string += "</<table>";

        $('#exportToAppend').append(string)

        var tableName = 'tablePivot'
        var name = 'provaTabellla'

        var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
            , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
        if (!tableName.nodeType) tableName = document.getElementById(tableName)
        var ctx = {worksheet: name || 'Worksheet', table: tableName.innerHTML}
        window.location.href = uri + base64(format(template, ctx))

        var f = document.getElementById('tablePivot');
        if(f){
            f.remove()
        }
    }


    TableExport.prototype.filterValues = function(table){
        var result = []
        var keyColumns = configurator.getKeyColumnConfiguration()
        var column0 = keyColumns.leftKeyColumnConfiguration[0]
        console.log('Column0')
        console.log(column0)
        var column2 = keyColumns.upKeyColumnConfiguration[0]
        console.log('Column2')
        console.log(column2)

        for(var i= 0, length=table.length; i<length; i++) {
            var row = []
            for (var j = 0; j < table[i].length; j++) {
                var valueConverted
                switch (j) {
                    case 0:
                        valueConverted = formatter.fromDSDToVisualizationFormat(table[i][j], column0, ['code'], configurator);
                        break;
                    case 2:
                        valueConverted = formatter.fromDSDToVisualizationFormat(table[i][j], column2, ['date'], configurator);
                        break;
                    default :
                        valueConverted = table[i][j];
                        break;
                }
                row.push(valueConverted)
            }
            result.push(row);
         }
        return result;

        }



    TableExport.convertCode = function(){
        var map = {}
    }

    return TableExport;

})