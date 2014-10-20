/**
 * Created by fabrizio on 7/29/14.
 */
define(["jquery", "editor/cell/CellEditor", "formatter/DatatypesFormatter",
    "validator/EditorValidator"], function ($, CellEditor, DatatypeFormatter, Validator) {

    var FormEditor, valueIndex, accessorIndexes, columns, Formatter, EditorValidator
        , configurator;

    function FormController() {

        FormEditor = new CellEditor;
        Formatter = new DatatypeFormatter;
    }

    FormController.prototype.init = function (Configurator, cell, dsd) {
        configurator = Configurator;
        FormEditor.init(Configurator, cell, dsd)
        columns = configurator.getDSD().dsd.columns
        accessorIndexes = configurator.getDSDAccessorColumns()["accessorIndexes"]
        valueIndex = configurator.getValueIndex();
        EditorValidator = new Validator;

    }

    FormController.prototype.getValue = function (cell) {

        var result
        var input = FormEditor.getValuesFromCellEditor();
        console.log('INPUT : FormController.getValue')
        console.log(input)
        var result = []; // An new empty array

        // If something has changed
        if (this.checkValuesChanged(input, cell)) {
            for (var i = 0, len = cell.length; i < len; i++) {
                result[i] = cell[i];
            }
            result[valueIndex] = Formatter.fromVisualizationToDSDFormat(input[0], columns[valueIndex].dataTypes[0])
            for (var i = 0; i < accessorIndexes.length; i++) {
                var accessorColumnConf = configurator.lookForAccessorColumnByIdOnConfiguration(columns[accessorIndexes[i]].domain.id);
                var formatDate = accessorColumnConf.properties.cellProperties.dateFormat;
                //result[valueIndex] = Formatter.fromVisualizationToDSDFormat($input[i].value, columns[valueIndex].dataTypes[0])
                result[accessorIndexes[i]] = Formatter.fromVisualizationToDSDFormat(input[i + 1], columns[accessorIndexes[i]].dataTypes[0], formatDate);
            }
        }
        // validation (TODO)
        if (EditorValidator.init(result, configurator)) {
            $("#dialogForm").dialog('close');
        }
        return result;
    }


    FormController.prototype.checkValuesChanged = function (input, cell) {

        var changed = false
        for (var i = 0; i < input.length && !changed; i++) {
            // Value column case
            if (i == 0) {
                if (typeof cell[valueIndex] == 'undefined') {
                    changed = (input[i] != "");
                } else {
                    changed = (input[i] != cell[valueIndex])
                }
            }
            // accessor columns case
            else {
                // case where there is not an instance of the accessor value in the original cell
                if (typeof cell[accessorIndexes[i - 1]] == 'undefined') {
                    if (typeof input[i] == 'boolean') {
                        changed = typeof input[i] != 'undefined' && input[i] != null
                    } else {
                        changed = ((typeof input[i] != 'undefined' ) && (input[i] != "") && (input[i] != null));
                    }
                }
                else {
                    if (input[i] instanceof Date) {
                        var accessorColumnConf = configurator.lookForAccessorColumnByIdOnConfiguration(columns[accessorIndexes[i]].domain.id);
                        var formatDate = accessorColumnConf.properties.cellProperties.dateFormat;
                        var dateFormatted = Formatter.fromV(input[i], columns[accessorIndexes[i - 1]].dataTypes[0], formatDate);
                        changed = (dateFormatted != cell[accessorIndexes[i - 1]])
                    } else {
                        changed = (input[i] != cell[accessorIndexes[i - 1]])
                    }
                }
            }
        }
        return changed;
    }


    return FormController;
})