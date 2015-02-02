/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "flagTranslator/controller/FlagController", "text!modalView/modalForm.html", "select2", "jquery.dirtyFields",
    "jqwidgets"], function ($, Formatter, FlagController, ModalView) {

    var formatter, language, columns, valueIndex, accessorIndexes , mapPreviousValues, flagController, modalView;

    // ---------------------- SUPPORT FUNCTIONS -------------------------------------------

    Element.prototype.remove = function () {
        this.parentElement.removeChild(this);
    }

    NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    }
    // ------------------------------------------------------------------------------------


    function CellEditor() {
    }


    CellEditor.prototype.init = function (Configurator, cell, dsd) {

        var that = this;

        this.destroyIfExist();

        modalView = ModalView;
        $("body").append(modalView)


        flagController = new FlagController;
        formatter = new Formatter;
        var configuration = Configurator.getComponentConfigurator();
        columns = dsd.dsd.columns
        var leftColumns = Configurator.getLeftKeyColumn();
        var upColumns = Configurator.getUpKeyColumn();
        var leftKeyColumnsIndexes = leftColumns["leftKeyIndexes"];
        var upKeyColumnsIndexes = upColumns["upKeyIndexes"];
        var configurationKeys = Configurator.getKeyColumnConfiguration();
        var upKeyColumns = upColumns["upColumns"];
        var leftKeyColumns = leftColumns["leftColumns"]
        valueIndex = Configurator.getValueIndex();
        accessorIndexes = Configurator.getDSDAccessorColumns()["accessorIndexes"]
        language = Configurator.getComponentLanguage();
        mapPreviousValues = [];


        for (var i = 0; i < leftKeyColumnsIndexes.length; i++) {
            // show value in right format
            var valueLeft = formatter.fromDSDToVisualizationFormat(cell[leftKeyColumnsIndexes[i]], configurationKeys["leftKeyColumnConfiguration"][i],
                leftKeyColumns[i].dataTypes, Configurator)
            $('#form').append("<div class ='row'>" +
                "<div class='col-xs-6'><label class='titlesForm' for='leftKeyColumn" + i + "'>" + columns[leftKeyColumnsIndexes[i]].domain.title[language]
                + "</label></div>" +
                "<div class='col-xs-6'><p  class='read-group-xs' name='name' id='leftKeyColumn" + i + "'>" + valueLeft + "</p></div>" +
                "</div><br>")
        }
        // upKeyColumns
        for (var i = 0; i < upKeyColumnsIndexes.length; i++) {
            var valueUp = formatter.fromDSDToVisualizationFormat(cell[upKeyColumnsIndexes[i]], configurationKeys["upKeyColumnConfiguration"][i],
                upKeyColumns[i].dataTypes, Configurator)
            $('#form').append("<div class ='row'>" +
                "<div class='col-xs-6'><label class='titlesForm' for='upKeyColumn" + i + "'>" + columns[upKeyColumnsIndexes[i]].domain.title[language]
                + "</label></div>" +
                "<div class='col-xs-6'><p  class='read-group-xs' name='name' id='upKeyColumn" + i + "'>" + valueUp + "</p></div>" +
                "</div><br>")
        }


        var titleVal = columns[valueIndex].domain.title[language];
        var valueVal = cell[valueIndex];
        var columnDSDVal = columns[valueIndex];
        var columnCONFVal = Configurator.getValueColumnOnConfiguration()
        var containerVal = "valueInput";

        // value column
        this.appendRigthInputFormat('Value', valueVal, columnDSDVal, columnCONFVal, containerVal);

        // accessorColumn
        for (var i = 0; i < accessorIndexes.length; i++) {
            var title = columns[accessorIndexes[i]].domain.title[language];
            var value = cell[accessorIndexes[i]];
            var columnDSD = columns[accessorIndexes[i]];
            var columnCONF = Configurator.lookForAccessorColumnByIdOnConfiguration(columnDSD.domain.id)
            var container = "accessorInput" + i + "";

            this.appendRigthInputFormat(title, value, columnDSD, columnCONF, container);

        }


        $("#dialogForm").modal({ backdrop: 'static',
            keyboard: false});


        $("#dialogForm").draggable({
            handle: ".modal-header"
        });



        $('#resetButton').on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            that.restorePreviousValues();
        })

    }

    // To restore previous values when clicks on reset button
    CellEditor.prototype.restorePreviousValues = function () {

        for (key in mapPreviousValues) {
            if (key == 'getUnique') {
                break;
            }
            var value = mapPreviousValues[key];
            for (var container in value) {
                var prevValue = value[container][0]
                switch (value[container][1]) {
                    case  "date" :
                    case  "month":
                    case  "year" :
                    case  "time" :
                        if (typeof prevValue != 'undefined' && prevValue != 'undefined') {
                            switch (prevValue.length) {
                                case (8) :
                                    var year = prevValue.substring(0, 4);
                                    var month = prevValue.substring(4, 6);
                                    var day = prevValue.substring(6, 8);
                                    var date = new Date(year, month - 1, day);
                                    // date
                                    break;
                                case ( 6) :
                                    var year = prevValue.substring(0, 4);
                                    var month = prevValue.substring(4, 6);
                                    var date = new Date(year, month - 1);
                                    break;

                                case ( 4) :
                                    // year
                                    var year = prevValue.substring(0, 4);
                                    var date = new Date(year);
                                    break;
                                default:
                                    // time
                                    var json = Date.parse(prevValue);
                                    var date = new Date(json);
                                    break;
                            }
                            $('#' + container).jqxDateTimeInput('setDate', date)
                        } else {
                            $('#' + container).jqxDateTimeInput('setDate', null)
                        }

                        break;
                    case "boolean":
                        if (typeof prevValue == 'undefined') {
                            $('#' + container).jqxRadioButton('check');
                            $('#' + container).jqxRadioButton('uncheck');
                        } else if (prevValue) {
                            $('#' + container).jqxRadioButton('check');
                        } else {
                            $('#' + container).jqxRadioButton('uncheck');
                        }
                        break

                    case "code":
                        (typeof prevValue == 'undefined' || prevValue == 'undefined') ? $('#' + container).jqxComboBox('val', "") :
                            $('#' + container).jqxComboBox('val', prevValue);
                        break

                    default:
                        if (container == 'accessorInput1') {
                            container = 's2id_accessorInput1'
                            var rightValue = (typeof prevValue == 'undefined' || prevValue == 'undefined') ?
                                "" : prevValue;
                            $('#' + container).select2('val', rightValue)
                        } else {
                            var rightValue = (typeof prevValue == 'undefined' || prevValue == 'undefined') ?
                                "" : prevValue;
                            document.getElementById(container).value = rightValue;
                        }
                        break;
                }
            }
        }
    }


    CellEditor.prototype.appendRigthInputFormat = function (title, value, dsdColumn, ConfColumn, container) {
        var result;

        switch (dsdColumn.dataTypes[0]) {
            case "time":
                var defaultDate, fromDate, toDate;

                // if data representation is distinct or hybrid, take the default value from the first element of value
                if ((ConfColumn.values.dataRepresentation == 'distinct' || ConfColumn.values.dataRepresentation == 'hybrid')
                    && typeof dsdColumn.values !== 'undefined' && dsdColumn.values.length > 1) {
                    var maxLength = dsdColumn.values.length;
                    var dateStringFrom = JSON.parse(dsdColumn.values[0]);
                    var dateStringTo = JSON.parse(dsdColumn.values[maxLength - 1]);
                    fromDate = new Date(dateStringFrom);
                    toDate = new Date(dateStringTo);
                    // if a value exist, take it as default
                    if (typeof value !== 'undefined') {
                        var dateStringValue = JSON.parse(value);
                        defaultDate = new Date(dateStringValue);
                    }
                }
                else { // else, take defaultDate from the first element of the domain
                    var dateStringFrom = Date.parse(dsdColumn.domain.period.from);
                    var dateStringTo = Date.parse(dsdColumn.domain.period.to);

                    fromDate = new Date(dateStringFrom);
                    toDate = new Date(dateStringTo);
                    if (typeof value !== 'undefined') {
                        var dateStringValue = Date.parse(value);
                        defaultDate = new Date(dateStringValue);
                    }
                }
                if (typeof defaultDate === 'undefined') {
                    defaultDate = null;
                }

                $('#form').append("<div class ='row'>" +
                    "<div class='col-xs-6'><label class='titlesForm' for='" + container + "'>" + title + "</label></div>" +
                    "<div class='col-xs-6'><div class = 'input-group-xs' id='" + container + "' /></div></div></div><br>");

                $("#" + container + "").jqxDateTimeInput({
                    value: defaultDate,
                    min: new Date(fromDate),
                    max: new Date(toDate),
                    width: '200px',
                    height: '20px',
                    formatString: "dd/MM/yyyy hh:mm:ss"
                });

                // Disable the selection if it is not configured
                if (!ConfColumn.values.editable)
                    $('#' + container + '').jqxDateTimeInput({disabled: true});

                // For reset operation
                var previous = {};
                previous[container] = [value, "time"];
                mapPreviousValues.push(previous);
                break;

            case "month":
                var defaultDate, fromDate, toDate;
                // to transform it in a string
                value += ""

                // if data representation is distinct or hybrid, take the default value from the first element of value
                if ((ConfColumn.values.dataRepresentation == 'distinct' || ConfColumn.values.dataRepresentation == 'hybrid')
                    && typeof dsdColumn.values !== 'undefined' && dsdColumn.values.length > 1) {
                    var maxLength = dsdColumn.values.length;
                    var yearFrom = dsdColumn.values[0].substr(0, 4);
                    var yearTo = dsdColumn.values[maxLength - 1].substr(0, 4);

                    var monthFrom = dsdColumn.values[0].substr(4, 2);
                    var monthTo = dsdColumn.values[maxLength - 1].substr(4, 2);

                    fromDate = new Date(yearFrom, monthFrom - 1);
                    toDate = new Date(yearTo, monthTo - 1);
                    // if a value exist, take it as default
                    if (typeof value !== 'undefined') {
                        var year = value.substr(0, 4);
                        var month = value.substr(4, 2);
                        defaultDate = new Date(year, month - 1);
                    }
                }
                else { // else, take defaultDate from the first element of the domain
                    var yearFrom = dsdColumn.domain.period.from.substr(0, 4);
                    var monthFrom = dsdColumn.domain.period.from.substr(4, 2);

                    // setting the upper bound limit of the date
                    var yearTo = dsdColumn.domain.period.to.substr(0, 4);
                    var monthTo = dsdColumn.domain.period.to.substr(4, 2);

                    fromDate = new Date(yearFrom, monthFrom - 1);
                    toDate = new Date(yearTo, monthTo - 1);
                    if (typeof value !== 'undefined' && value != 'undefined' && value != "Invalid date" && value != 'null') {
                        var year = value.substr(0, 4);
                        var month = value.substr(4, 2);
                        defaultDate = new Date(year, month - 1);
                    } else {
                        defaultDate = null;
                    }
                }


                $('#form').append("<div class ='row'>" +
                    "<div class='col-xs-6'><label class='titlesForm' for='" + container + "'>" + title + "</label></div>" +
                    "<div class='col-xs-6'><div class = 'input-group-xs' id='" + container + "' /></div></div></div><br>");
                $("#" + container + "").jqxDateTimeInput({
                    value: defaultDate,
                    min: new Date(yearFrom, monthFrom - 1),
                    max: new Date(yearTo, monthTo - 1),
                    width: '200px',
                    height: '20px',
                    formatString: "MMMM yyyy"

                });

                // Disable the selection if it is not configured
                if (!ConfColumn.values.editable)
                    $('#' + container + '').jqxDateTimeInput({disabled: true});

                // To mantain in memory the original value
                var previous = {};
                previous[container] = [value, "month"];
                mapPreviousValues.push(previous);
                break;

            case "year":
                var defaultDate, fromDate, toDate;
                // to transform it in a string
                value += ""

                // if data representation is distinct or hybrid, take the default value from the first element of value
                if ((ConfColumn.values.dataRepresentation == 'distinct' || ConfColumn.values.dataRepresentation == 'hybrid')
                    && typeof dsdColumn.values !== 'undefined' && dsdColumn.values.length > 1) {
                    var maxLength = dsdColumn.values.length;
                    var yearFrom = dsdColumn.values[0].substr(0, 4);
                    var yearTo = dsdColumn.values[maxLength - 1].substr(0, 4);

                    fromDate = new Date(yearFrom);
                    toDate = new Date(yearTo);
                    // if a value exist, take it as default
                    if (typeof value !== 'undefined') {
                        var year = value.substr(0, 4);
                        defaultDate = new Date(year);
                    }
                }
                else { // else, take defaultDate from the first element of the domain
                    var yearFrom = dsdColumn.domain.period.from.substr(0, 4);

                    // setting the upper bound limit of the date
                    var yearTo = dsdColumn.domain.period.to.substr(0, 4);

                    fromDate = new Date(yearFrom);
                    toDate = new Date(yearTo);
                    if (typeof value !== 'undefined' && value != 'undefined' && value != "Invalid date" && value != 'null') {
                        var year = value.substr(0, 4);
                        defaultDate = new Date(year);
                    } else {
                        defaultDate = null;
                    }
                }

                $('#form').append("<div class ='row'>" +
                    "<div class='col-xs-6'><label class='titlesForm' for='" + container + "'>" + title + "</label></div>" +
                    "<div class='col-xs-6'><div class = 'input-group-xs' id='" + container + "' /></div></div></div><br>");
                $("#" + container + "").jqxDateTimeInput({
                    value: defaultDate,
                    min: new Date(yearFrom),
                    max: new Date(yearTo),
                    width: '200px',
                    height: '20px',
                    formatString: "yyyy"
                });

                // Disable the selection if it is not configured
                if (!ConfColumn.values.editable)
                    $('#' + container + '').jqxDateTimeInput({disabled: true});

                // To mantain in memory the original value
                var previous = {};
                previous[container] = [value, "year"];
                mapPreviousValues.push(previous);
                break;


            case "date":
                var defaultDate, fromDate, toDate;
                // to transform it in a string
                value += ""

                // if data representation is distinct or hybrid, take the default value from the first element of value
                if ((ConfColumn.values.dataRepresentation == 'distinct' || ConfColumn.values.dataRepresentation == 'hybrid')
                    && typeof dsdColumn.values !== 'undefined' && dsdColumn.values.length > 1) {
                    var maxLength = dsdColumn.values.length;
                    var yearFrom = dsdColumn.values[0].substr(0, 4);
                    var yearTo = dsdColumn.values[maxLength - 1].substr(0, 4);

                    var monthFrom = dsdColumn.values[0].substr(4, 2);
                    var monthTo = dsdColumn.values[maxLength - 1].substr(4, 2);

                    var dayFrom = dsdColumn.values[0].substr(6, 4);
                    var dayTo = dsdColumn.values[maxLength - 1].substr(6, 4);

                    fromDate = new Date(yearFrom, monthFrom - 1, dayFrom);
                    toDate = new Date(yearTo, monthTo - 1, dayTo);
                    // if a value exist, take it as default; otherwise, take the first value available
                    if (typeof value !== 'undefined') {
                        var year = value.substr(0, 4);
                        var month = value.substr(4, 2);
                        var day = value.substr(6, 4);
                        defaultDate = new Date(year, month - 1, day);
                    }
                }
                else { // else, take defaultDate from the first element of the domain
                    var yearFrom = dsdColumn.domain.period.from.substr(0, 4);
                    var monthFrom = dsdColumn.domain.period.from.substr(4, 2);
                    var dayFrom = dsdColumn.domain.period.from.substr(6, 4);
                    // setting the upper bound limit of the date
                    var yearTo = dsdColumn.domain.period.to.substr(0, 4);
                    var monthTo = dsdColumn.domain.period.to.substr(4, 2);
                    var dayTo = dsdColumn.domain.period.to.substr(6, 4);
                    fromDate = new Date(yearFrom, monthFrom - 1, dayFrom);
                    toDate = new Date(yearTo, monthTo - 1, dayTo);
                    if (typeof value !== 'undefined' && value != 'undefined' && value != "Invalid date" && value != 'null') {
                        var year = value.substr(0, 4);
                        var month = value.substr(4, 2);
                        var day = value.substr(6, 4);
                        defaultDate = new Date(year, month - 1, day);
                    } else {
                        defaultDate = null;
                    }
                }


                $('#form').append("<div class ='row'>" +
                    "<div class='col-xs-6'><label class='titlesForm' for='" + container + "'>" + title + "</label></div>" +
                    "<div class='col-xs-6'><div class = 'input-group-xs' id='" + container + "' /></div></div></div><br>");
                $("#" + container + "").jqxDateTimeInput({
                    value: defaultDate,
                    min: new Date(yearFrom, monthFrom - 1, dayFrom),
                    max: new Date(yearTo, monthTo - 1, dayTo),
                    width: '190px',
                    height: '20px'
                });

                // Disable the selection if it is not configured
                if (!ConfColumn.values.editable)
                    $('#' + container + '').jqxDateTimeInput({disabled: true});

                // To mantain in memory the original value
                var previous = {};
                previous[container] = [value, "date"];
                mapPreviousValues.push(previous);

                break;

            case "code" || "codeList" || "customCode":
                var codeValue;
                // Prepare the data for Jqwidgets and sort by label
                var data = dsdColumn.domain.codes;
                var sortedData = data.sort(function (a, b) {

                    if (a.code.title[language] < b.code.title[language])
                        return -1;
                    if (a.code.title[language] > b.code.title[language])
                        return 1;
                    return 0;
                });
                // prepare the data
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: 'code', map: "code>code" },
                        { name: 'label', map: "code>title>" + language + "" }
                    ],
                    localdata: sortedData
                };

                for (var i = 0; i < sortedData.length; i++) {
                    if (value == sortedData[i].code.code) {
                        codeValue = i;
                    }
                }
                var dataAdapter = new $.jqx.dataAdapter(source);

                $('#form').append("<div class ='row'>" +
                    "<div class='col-xs-6'><label class='titlesForm' for='" + container + "'>" + title + "</label></div>" +
                    "<div class='col-xs-6'><div class = 'input-group-xs' id='" + container + "' /></div></div><br>");

                // comboBox
                // Multiselect or not

                $('#' + container + '').jqxComboBox({
                    source: dataAdapter,
                    displayMember: "label",
                    valueMember: "code",
                    selectedIndex: codeValue,
                    width: '190px',
                    height: '20px'
                })
                // Disable the selection if it is not configured
                if (!ConfColumn.values.editable)
                    $('#' + container + '').jqxComboBox({ disabled: true });

                var previous = {};
                previous[container] = [value, "code"];
                mapPreviousValues.push(previous);

                break;
            case ("number" || "enum"):
                var maxLength, numberFrom, numberTo;
                if ((ConfColumn.values.dataRepresentation == 'distinct' || ConfColumn.values.dataRepresentation == 'hybrid')
                    && typeof dsdColumn.values !== 'undefined' && dsdColumn.values.length > 1) {
                    maxLength = dsdColumn.values.length;
                    numberFrom = dsdColumn.values[0];
                    numberTo = dsdColumn.values[maxLength - 1];

                } else {
                    numberFrom = dsdColumn.domain.period.from;
                    numberTo = dsdColumn.domain.period.to;
                }


                if (ConfColumn.values.editable) {
                    $('#form').append("<div class ='row'>" +
                        "<div class='col-xs-6'><label class='titlesForm' for='" + container + "'>" + title
                        + "</label></div>" +
                        "<div class='col-xs-6'><input class='input-group-xs' name='name' id='" + container + "' value='" + value +
                        "' min='" + numberFrom + "' max='" + numberTo + "'  step='any' style='width:100%'></div>" +
                        "</div><br>")
                } else {
                    $('#form').append("<div class ='row'>" +
                        "<div class='col-xs-6'><label class='titlesForm' for='" + container + "'>" + title
                        + "</label></div>" +
                        "<div class='col-xs-6'><input class='input-group-xs' name='name' id='" + container + "' value='" + value +
                        "' min='" + numberFrom + "' max='" + numberTo + "'  step='any' readonly></div>" +
                        "</div><br>")
                }
                var previous = {};
                previous[container] = [value, "number"];
                mapPreviousValues.push(previous);
                break;

            case "boolean":

                $('#form').append("<div class ='row'>" +
                    "<div class='col-xs-6'><label class='titlesForm' for='" + container + "'>" + title
                    + "</label></div>" +
                    "<div class='col-xs-3'><div class='input-group-xs' name='name' id='" + container + "1'>True" +
                    "</div></div>" +
                    "<div class='col-xs-3'><div class='input-group' name='name' id='" + container + "0'>False" +
                    "</div></div></div><br>");
                var trueId = container + "1"
                var falseId = container + "0"

                $("#" + trueId).jqxRadioButton({ width: 120, height: 25 });
                $("#" + falseId).jqxRadioButton({ width: 120, height: 25 });

                if (typeof value != 'undefined' && value.toString() != "" && value.toString() != "undefined") {
                    var selected = (value) ? "" + trueId : "" + falseId
                    $("#" + selected).jqxRadioButton('check')
                }
                if (!ConfColumn.values.editable) {
                    $("#" + trueId).jqxRadioButton('disable');
                    $("#" + falseId).jqxRadioButton('disable');
                }
                var previous = {};
                // Push only the node with true on the map
                previous[trueId] = [value, "boolean"];
                mapPreviousValues.push(previous);
                break;

            default:
                if (ConfColumn.values.editable) {
                    if (title == "Note") {

                        $('#form').append("<div class ='row'>" +
                            "<div class='col-xs-6'><label class='titlesForm' for='" + container + "'>" + title
                            + "</label></div>" +
                            "<div class='col-xs-6'><textarea placeholder ='Type some notes' type='text' class='input-group-xs form-control' name='name'  rows='3' id='" + container + "'></textarea></div>" +
                            "</div> ")

                        if(value && value!=null && value != '' && value != 'null'){
                            document.getElementById(container).innerHTML = value;
                        }
                    }
                    // Case Multiple flag
                    else if (title == "Flags") {
                        $('#form').append(this.getMultipleFlagToAppend(value, container, title))
                        $('#' + container).select2({placeholder: "Click to select the flags"})
                    }

                    else {
                        $('#form').append("<div class ='row'>" +
                            "<div class='col-xs-6'><label class='titlesForm' for='" + container + "'>" + title
                            + "</label></div>" +
                            "<div class='col-xs-6'><input type='text' class='input-group-xs form-control' name='name' id='" + container + "' value='" + value + "'/></div>" +
                            "</div><br>")
                    }
                }
                else {
                    $('#form').append("<div class ='row'  style='display: none'>" +
                        "<div class='col-xs-6'><label class='titlesForm' for='" + container + "'>" + title
                        + "</label></div>" +
                        "<div class='col-xs-6'><input type='text' class='input-group-xs form-control' name='name'  id='" + container + "' value='" + value + "' readonly/></div>" +
                        "</div><br>")

                }
                var previous = {};
                previous[container] = [value, "input"];
                mapPreviousValues.push(previous);
                break;
        }
    }


    /*
     The following methods are necessary to extract the values from the editor, depending on the
     datatype on which the element is related to */
    CellEditor.prototype.getValuesFromCellEditor = function () {
        var array = [];
        var $inputs = document.getElementsByClassName('input-group-xs');
        var $input = [];

        for (var i = 0; i < $inputs.length; i++) {
            if (i != 2) {
                $input.push($inputs[i])
            }
        }

        for (var i = 0; i < $input.length; i++) {
            // VALUE column
            if (i == 0) {
                array.push(this.chooseAndGetElementByDatatype(columns[valueIndex].dataTypes, $input[i]))
            } else {
                array.push(this.chooseAndGetElementByDatatype(columns[accessorIndexes[i - 1]].dataTypes, $input[i]))
            }
        }

        return array;
    }


    CellEditor.prototype.chooseAndGetElementByDatatype = function (datatype, htmlvalue) {
        var result;
        switch (datatype[0]) {
            case "code" || "customCode" || "codeList":
                result = $("#" + htmlvalue.id).val();
                break;
            // TO FINISH
            case "date" :
                result = $("#" + htmlvalue.id).jqxDateTimeInput('getDate');
                break;
            case  "month" :
                var stringMonth = $("#" + htmlvalue.id).jqxDateTimeInput('getDate');
                result = formatter.fromVisualizationToDSDFormat(stringMonth, "month");
                break;
            case  "year" :
                var stringYear = $("#" + htmlvalue.id).jqxDateTimeInput('getDate');
                result = formatter.fromVisualizationToDSDFormat(stringYear, "year");
                break;
            case "boolean":
                if (!$("#" + htmlvalue.id).val()) {
                    var other = htmlvalue.id.replace("1", "0")
                    result = ($("#" + other).val()) ? false : undefined;
                } else {
                    result = true;
                }
                break;
            case "number":

                result = $("#" + htmlvalue.id).val();
                if (typeof result == 'undefined' || result == '' || isNaN(result)) {
                    result = null
                }
                break;

            default :
                if (htmlvalue.id == 'accessorInput1') {
                    var codes = $("#" + htmlvalue.id).select2("val");
                    result = flagController.getStringFromCodes(codes);

                } else {
                    debugger;
                    result = $("#" + htmlvalue.id).val();
                    if (typeof result == 'undefined' || result == '' ) {
                        result = null
                    }
                }
        }
        return result;
    }


    CellEditor.prototype.getMultipleFlagToAppend = function (value, container, title) {
        var stringValue = value;
        var stringToAppend = '<div>' +
            '<div class="row"><div class="col-xs-6">' +
            '<label class="titlesForm" for="' + container + '">' + title + '</label></div>' +
            '<div class="col-xs-6">' +
            '<select multiple tabindex="-1" id="' + container + '" style="width:100%" class="input-group-xs">';
        stringToAppend += flagController.getOptions(stringValue)
        stringToAppend += '</select></div></div>' +
            '<br>';

        return stringToAppend
    }


    CellEditor.prototype.destroyIfExist = function () {

        $('#specialForm').modal('hide');

        var g = document.getElementById("specialForm");

        if (g && g !== null) {
            g.remove()
        }

        var k =  $('#closeModal');


        if(k) {
            $('#closeModal').click();
        }

        $('#dialogForm').modal('hide');


        var f =  $('#closeModalFormTotal');
        if(f) {
            $('#closeModalFormTotal').click();
        }

         var f = document.getElementById("dialogForm");

         if (f && f !== null) {
             f.remove()
         }

        var root = document.getElementsByTagName( 'html' )[0]; // '0' to assign the first (and only `HTML` tag)

        root.setAttribute( "class", "settingOverflow" );


    }


    return CellEditor;

})