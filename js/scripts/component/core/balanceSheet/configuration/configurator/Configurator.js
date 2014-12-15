/**
 * Created by fabrizio on 7/10/14.
 */
define(['jquery', 'amplify'], function ($) {


    const INDEX_DATES = 2;

    var leftKeyColumns,              // DSD columns that represent the left key columns
        leftKeyIndexes,              // Index of the left key columns on the DSD
        upKeyColumns,                // DSD columns that represent the up key columns
        upKeyIndexes,                // DSD columns that represent the up key indexes
        accessorIndexes,             // Indexes that indicate the position of the accessor column on the data
        accessorColumns,             // Accessor Columns from DSD
        dsdConf,                     // DSD
        compConfiguration,
        lefKeyColumnConfiguration,   // Left key columns on the configuration ordered with DSD
        upKeyColumnConfiguration,    // Up key columns on the configuration ordered with DSD
        indexValueColumns,
        accessorMap,                 // It is a map with KEYS = titles of accessor fields and VALUES = indexes on the DSD structure
        mapCodesLabel,
        mapCodesIndexes,
        labelValue,
        decimalNumberValue;

    function Configurator() {
    }


    Configurator.prototype.init = function (dsd, component) {
        dsdConf = dsd;
        compConfiguration = component;
        var storage = amplify.store();
        if (storage.isMonthlyModality) {
            dsdConf.dsd.columns[INDEX_DATES].dataTypes[0] = "date"
            dsdConf.dsd.columns[INDEX_DATES].domain.period.from = '20000101'
            dsdConf.dsd.columns[INDEX_DATES].domain.period.to = '20180601';
        } else {
            dsdConf.dsd.columns[INDEX_DATES].dataTypes[0] = "season"
            dsdConf.dsd.columns[INDEX_DATES].domain.period.from = '2000/01'
            dsdConf.dsd.columns[INDEX_DATES].domain.period.to = '2017/18';
        }

        this.createKeyMatrixes();
    }


    Configurator.prototype.createKeyMatrixes = function () {
        lefKeyColumnConfiguration = [];
        leftKeyColumns = []
        leftKeyIndexes = []
        upKeyColumnConfiguration = [];
        upKeyColumns = []
        upKeyIndexes = [],
            accessorMap = {},
            accessorColumns = [];
        accessorIndexes = [];
        mapCodesLabel = [];
        mapCodesIndexes = {};


        var configuration = $.extend(true, {}, compConfiguration);

        for (var i = 0; i < dsdConf.dsd.columns.length; i++) {
            if (dsdConf.dsd.columns[i].domain.key) {
                var found = false;
                for (var k = 0; k < configuration.gridConfiguration.columnsKey.left.length && !found; k++) {
                    if (configuration.gridConfiguration.columnsKey.left[k].columnId ==
                        dsdConf.dsd.columns[i].domain.id) {
                        lefKeyColumnConfiguration.push(configuration.gridConfiguration.columnsKey.left.splice(k, 1)[0])
                        leftKeyColumns.push(dsdConf.dsd.columns[i])
                        leftKeyIndexes.push(i);
                        found = true;
                    }
                }

                for (var k = 0; k < configuration.gridConfiguration.columnsKey.up.length && !found; k++) {
                    if (configuration.gridConfiguration.columnsKey.up[k].columnId ==
                        dsdConf.dsd.columns[i].domain.id) {
                        upKeyColumnConfiguration.push(configuration.gridConfiguration.columnsKey.up.splice(k, 1)[0])
                        upKeyColumns.push(dsdConf.dsd.columns[i])
                        upKeyIndexes.push(i);
                        found = true;
                    }
                }
            }      // Column Value
            else if (dsdConf.dsd.columns[i].dimension.title.EN == "value") {
                indexValueColumns = i;
            }
            else { // Accessor Columns
                accessorMap[dsdConf.dsd.columns[i].dimension.title.EN] = i;
                accessorColumns.push(dsdConf.dsd.columns[i]);
                accessorIndexes.push(i);
            }
        }

    }


    Configurator.prototype.getLeftKeyColumn = function () {

        var leftKeyColumn;
        leftKeyColumn = {
            "leftColumns": leftKeyColumns,
            "leftKeyIndexes": leftKeyIndexes
        }

        return leftKeyColumn;
    }


    Configurator.prototype.getUpKeyColumn = function () {

        var upKeyColumn;
        upKeyColumn = {
            "upColumns": upKeyColumns,
            "upKeyIndexes": upKeyIndexes
        }
        return upKeyColumn;
    }


    Configurator.prototype.getDSDtoConfigurationKeyColumns = function () {

        var keyColumns;
        keyColumns = {
            "leftColumns": leftKeyColumns,
            "leftKeyIndexes": leftKeyIndexes,
            "upColumns": upKeyColumns,
            "upKeyIndexes": upKeyIndexes
        }
        return keyColumns;
    }


    Configurator.prototype.getDSDAccessorColumns = function () {

        var accessorsObject
        accessorsObject = {
            "accessorColumns": accessorColumns,
            "accessorIndexes": accessorIndexes
        }
        return accessorsObject;
    }


    Configurator.prototype.getValueIndex = function () {
        return indexValueColumns;
    }


    Configurator.prototype.getAllColumnModels = function () {

        var allColumnsModel = {
            "leftColumnsModel": this.getLeftKeyColumn(),
            "upColumnsModel": this.getUpKeyColumn(),
            "accessorColumnsModel": this.getDSDAccessorColumns(),
            "valueColumnsModel": this.getValueIndex()
        }
        return allColumnsModel;
    }


    Configurator.prototype.getKeyColumnConfiguration = function () {

        var keyColumnConf = {
            "leftKeyColumnConfiguration": lefKeyColumnConfiguration,
            "upKeyColumnConfiguration": upKeyColumnConfiguration
        }

        return keyColumnConf;
    }


    Configurator.prototype.getAccessorMap = function () {
        return accessorMap;
    }


    Configurator.prototype.getValueColumnConfiguration = function () {
        var result = compConfiguration.gridConfiguration.otherColumns.valueColumn;
        return result;
    }

    Configurator.prototype.getValueColumnOnDSD = function () {
        var valueIndex = this.getValueIndex();
        return dsdConf.dsd.columns[valueIndex];
    }


    Configurator.prototype.getIdOlapGrid = function () {
        var result = compConfiguration.gridConfiguration.HTMLproperties.idGrid;
        return result;
    }


    Configurator.prototype.getDSD = function () {
        var result = dsdConf;
        return result;
    }


    Configurator.prototype.getComponentConfigurator = function () {
        var result = compConfiguration;
        return result;
    }

    Configurator.prototype.getComponentLanguage = function () {
        var language = compConfiguration.gridConfiguration.generalOptions.language;
        return language;
    }

    // create an object with the id of the column and a property that represent a map
    // between codes and value (in the chosen language)
    Configurator.prototype.createMapCodes = function (columnDsd, compColumn) {
        var id = compColumn.columnId;
        var language = this.getComponentLanguage();
        var map = {'id': id, 'mapCodeLabel': {}}

        if (compColumn.values.dataRepresentation == 'domain') {
            for (var i = 0; i < columnDsd.domain.codes.length; i++) {
                map.mapCodeLabel[columnDsd.domain.codes[i].code.code] = columnDsd.domain.codes[i].code.title[language];
            }
        } else if (compColumn.values.dataRepresentation == 'distinct') {
            for (var i = 0; i < columnDsd.values.length; i++) {
                var value = columnDsd.values[i];
                for (var j = 0; j < columnDsd.domain.codes.length; j++) {
                    if (value == columnDsd.domain.codes[j].code.code) {
                        map.mapCodeLabel[value] = columnDsd.domain.codes[j].code.title[language];
                    }
                }
            }
        } else if (compColumn.values.dataRepresentation == 'hybrid') {
            if (columnDsd.values.length > 0) {
                for (var i = 0; i < columnDsd.values.length; i++) {
                    var value = columnDsd.values[i];
                    for (var j = 0; j < columnDsd.domain.codes.length; j++) {
                        if (value == columnDsd.domain.codes[j].code.code) {
                            map.mapCodeLabel[value] = columnDsd.domain.codes[j].code.title[language];
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < columnDsd.codes.length; i++) {
                    map.mapCodeLabel[columnDsd.domain.codes[i].code.code] = columnDsd.domain.codes[i].code.title[language];
                }
            }
        }
        mapCodesIndexes[map.id] = mapCodesLabel.length;
        mapCodesLabel.push(map)
    }

    Configurator.prototype.getMapDomainCodes = function () {
        return mapCodesLabel;
    }

    Configurator.prototype.getMapDomainCodesIndexes = function (index) {
        return mapCodesIndexes[index];
    }

    Configurator.prototype.lookForCode = function (id) {
        var result;
        for (var i = 0; i < mapCodesLabel.length; i++) {
            if (mapCodesLabel[i].id == id) {
                result = mapCodesLabel[i];
            }
        }
        return result;
    }

    Configurator.prototype.getLeftKeyColumnIndexes = function () {
        return leftKeyIndexes;
    }


    Configurator.prototype.getUpKeyColumnIndexes = function () {
        return upKeyIndexes;
    }


    // Get an accessor column from the grid configuration ; @parameter: column id
    Configurator.prototype.lookForAccessorColumnByIdOnConfiguration = function (id) {
        var result;
        var found = false
        var accessorsColumns = compConfiguration.gridConfiguration.otherColumns.accessorsColumns;
        for (var i = 0; i < accessorsColumns.length && !found; i++) {
            if (accessorsColumns[i].columnId == id) {
                result = accessorsColumns[i];
                found = true;
            }
        }
        return result;
    }


    // Get the value column on json component configuration
    Configurator.prototype.getValueColumnOnConfiguration = function () {
        return compConfiguration.gridConfiguration.otherColumns.valueColumn;
    }

    // Get the value the representation of row configured on compnent configuration
    Configurator.prototype.getFullRowsRepresentation = function () {
        return compConfiguration.gridConfiguration.generalOptions.fullRowsRepresentation;
    }

    // Get the factor of conversion between different Masurement Units
    Configurator.prototype.getNumberOfDecimals = function () {
        return compConfiguration.gridConfiguration.otherColumns.valueColumn.values.numberOfDecimals;
    }


    Configurator.prototype.setValueLabel = function (number) {
        if (labelValue && labelValue != null) {
            switch (number) {
                case 1:
                    // everyThing
                    labelValue = "#value|$value ~#flag| $flag  ~#note| $note ~|";

                    break;
                case 2:
                    // only Flag
                    labelValue = "#value|$value ~#flag| $flag ~|";
                    break;

                case 3:
                    // only notes
                    labelValue = "#value|$value ~#note| $note ~|";
                    break;

                case 4:
                    // only value
                    labelValue = "#value|$value ~|";
                    break;
            }
        }
    }

    Configurator.prototype.setThousandSeparator = function (number) {

        // 1: comma
        // 2: period
        // 3: space
        switch (number) {
            case 1:
                decimalNumberValue = "0,0"
                break;
            case 2:
                decimalNumberValue = "0.0"
                break;

            case 3:
                decimalNumberValue = "0 0"
                break;
        }

    }

    Configurator.prototype.getThousandSeparator = function () {

        if (!decimalNumberValue) {
            decimalNumberValue = compConfiguration.gridConfiguration.otherColumns.valueColumn.properties.cellProperties.numericFormat
        }

        return decimalNumberValue;

    }

    Configurator.prototype.getValueLabel = function () {
        // Get the value
        if (!labelValue) {
            labelValue = compConfiguration.gridConfiguration.otherColumns.valueColumn.label
        }

        return labelValue
    }


    return Configurator;

})