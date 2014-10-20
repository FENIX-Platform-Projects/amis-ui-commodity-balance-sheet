define(["jquery", "excellentExport"], function ($, ExcellentExport) {


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
    }

    TableExport.prototype.init = function (table, Configurator) {
        var dsd = Configurator.getDSD();
        var language = Configurator.getComponentLanguage();

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

        $("#optionPivotGrid").append(string);

        tableToExcel('tablePivot', 'Example')


       /* //var uri = 'data:application/vnd.ms-excel,' + $('#tablePivot').html();
        var downloadLink = document.createElement("a");
        downloadLink.href = "#";
        downloadLink.download = "data.xls";

        document.body.appendChild(downloadLink);
        downloadLink.click(function(){
            excellentExport.excel(this, $('#tablePivot').html(), 'MySheet');
        })
        document.body.removeChild(downloadLink);*/
    }

    return TableExport;

})