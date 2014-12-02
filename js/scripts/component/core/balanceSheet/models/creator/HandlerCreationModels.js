/**
 * Created by fabrizio on 8/6/14.
 */

define(["jquery"], function ($) {

    var leftKeyColumns,             // DSD columns that represent the left key columns
        leftKeyIndexes,             // Index of the left key columns on the DSD
        upKeyColumns,               // DSD columns that represent the up key columns
        upKeyIndexes,               // DSD columns that represent the up key columns
        accessorIndexes,            // Indexes that indicate the position of the accessor column on the data
        accessorColumns,
        leftKeyColumnConfiguration,   // Left key columns on the configuration ordered with DSD
        upKeyColumnConfiguration,    // Up key columns on the configuration ordered with DSD
        indexValueColumns,
        configuratorDsd,
        language,
        mapCodesIndex;


    function HandlerCreationModels() {
    }

    HandlerCreationModels.prototype.init = function (Configurator) {
        configuratorDsd = Configurator;
        mapCodesIndex = [];
        var model = this.createKeyMatrixes()
        return model;

    }

    HandlerCreationModels.prototype.createKeyMatrixes = function () {
        leftKeyColumns = configuratorDsd.getDSDtoConfigurationKeyColumns().leftColumns
        leftKeyIndexes = configuratorDsd.getLeftKeyColumn()["leftKeyIndexes"]
        upKeyColumns = configuratorDsd.getDSDtoConfigurationKeyColumns().upColumns
        upKeyIndexes = configuratorDsd.getUpKeyColumn()["upKeyIndexes"]
        accessorIndexes = configuratorDsd.getDSDAccessorColumns()["accessorColumns"]
        accessorColumns = configuratorDsd.getDSDAccessorColumns()["accessorIndexes"]
        leftKeyColumnConfiguration = configuratorDsd.getKeyColumnConfiguration()["leftKeyColumnConfiguration"]
        upKeyColumnConfiguration = configuratorDsd.getKeyColumnConfiguration()["upKeyColumnConfiguration"]
        indexValueColumns = configuratorDsd.getValueIndex();
        language = configuratorDsd.getComponentLanguage();

        var matrixLeft = this.chooseAndCreateByDataRepresentationType("left")
        var matrixUp = this.chooseAndCreateByDataRepresentationType("up")
        var matrixAll = this.createBigMatrix(matrixLeft, matrixUp)
        var model = {
            "matrixLeft": matrixLeft,
            "matrixUp": matrixUp,
            "matrixAll": matrixAll
        }

        return model;
    }

    HandlerCreationModels.prototype.chooseAndCreateByDataRepresentationType = function (versus) {

        var matrix, dataRepresentation, keyColumns;

        // Check versus
        if (versus == "left") {
            dataRepresentation = leftKeyColumnConfiguration;
            keyColumns = leftKeyColumns;
        }
        else if (versus == "up") {
            dataRepresentation = upKeyColumnConfiguration;
            keyColumns = upKeyColumns;
        }
        else {
            alert("Error on HandlerCreationModels.chooseAndCreateByDataRepresentationType: " +
                "versus value is bad specified or not specified ");
            throw Error;
        }

        if (typeof dataRepresentation[1] !== 'undefined') {
            // choose the right way of creating the matrix in order with the data representation type
            switch (dataRepresentation[0].values.dataRepresentation) {
                case "distinct":
                    if (dataRepresentation[1].values.dataRepresentation == "distinct") {
                        matrix = this.createMatrixDistinctToDistinct(versus, keyColumns[0], keyColumns[1]);
                    }
                    else if (dataRepresentation[1].values.dataRepresentation == "domain") {
                        matrix = this.createMatrixDistinctToDomain(versus, keyColumns[0], keyColumns[1]);
                    }
                    else if (dataRepresentation[1].values.dataRepresentation == "hybrid") {
                        matrix = this.createMatrixDistinctToHybrid(versus, keyColumns[0], keyColumns[1]);
                    }
                    else {
                        alert("Error on HandlerCreationModels.chooseAndCreateByDataRepresentationType: error " +
                            "on component configuration with the field dataRepresentation");
                        throw Error;
                    }
                    break;

                case "domain":
                    if (dataRepresentation[1].values.dataRepresentation == "distinct" && typeof dataRepresentation[1] !== 'undefined') {
                        matrix = this.createMatrixDomainToDistinct(versus, keyColumns[1], keyColumns[0]);
                    }
                    else if (dataRepresentation[1].values.dataRepresentation == "domain") {
                        matrix = this.createMatrixDomainToDomain(versus, keyColumns[0], keyColumns[1]);
                    }
                    else if (dataRepresentation[1].values.dataRepresentation == "hybrid") {
                        matrix = this.createMatrixDomainToHybrid(versus, keyColumns[0], keyColumns[1]);
                    }
                    else {
                        alert("Error on HandlerCreationModels.chooseAndCreateByDataRepresentationType: error" +
                            " on component configuration with the field dataRepresentation");
                        throw Error;
                    }
                    break;

                case "hybrid":
                    if (dataRepresentation[1].values.dataRepresentation == "distinct") {
                        matrix = this.createMatrixHybridToDistinct(versus, keyColumns[1], keyColumns[0]);
                    }
                    else if (dataRepresentation[1].values.dataRepresentation == "domain") {
                        matrix = this.createMatrixHybridToDomain(versus, keyColumns[0], keyColumns[1]);
                    }
                    else if (dataRepresentation[1].values.dataRepresentation == "hybrid") {
                        matrix = this.createMatrixHybridToHybrid(versus, leftKeyColumns[0], leftKeyColumns[1]);
                    }
                    else {
                        alert("Error on HandlerCreationModels.chooseAndCreateByDataRepresentationType: error " +
                            "on component configuration with the field dataRepresentation");
                        throw Error;
                    }
                    break;
            }
        }
        else {
            switch (dataRepresentation[0].values.dataRepresentation) {
                case "distinct":
                    matrix = this.createMatrixDistinctToDistinct(versus, keyColumns[0]);
                    break;
                case "domain":
                    matrix = this.createMatrixDomainToDomain(versus, keyColumns[0]);
                    break;
                case "hybrid":
                    matrix = this.createMatrixHybridToDomain(versus, keyColumns[0]);
                    break
            }
        }
        return matrix
    }

    /*The data representation of the master column is "domain"  */
    HandlerCreationModels.prototype.createMatrixDomainToDomain = function (versus, masterColumn, slaveColumn) {

        var matrix = [
            [ ]
        ];

        var slaveArray;
        var masterArray = this.createArrayByDomain(masterColumn);
        (typeof slaveColumn !== 'undefined') ? slaveArray = this.createArrayByDomain(slaveColumn) : slaveArray = undefined;

        switch (versus) {
            case "left":
                for (var i = 0; i < masterArray.length; i++) {
                    if (typeof slaveArray !== 'undefined') {
                        for (var j = 0; j < slaveArray.length; j++) {
                            matrix[i * slaveArray.length + j] = [masterArray[i], slaveArray[j]];
                        }
                    } else {
                        matrix[i] = [masterArray[i]]
                    }
                }
                break;

            case "up":
                for (var i = 0; i < masterArray.length; i++) {
                    if (typeof slaveArray !== 'undefined') {
                        for (var j = 0; j < slaveArray.length; j++) {
                            matrix[0].push([masterArray[i], slaveArray[j]])
                        }
                    } else {
                        matrix[0].push([masterArray[i]])
                    }
                }
                break;
        }

        return matrix

    }

    HandlerCreationModels.prototype.createMatrixDomainToDistinct = function (versus, masterColumn, slaveColumn) {

        if (typeof slaveColumn !== 'undefined') {
            return this.createMatrixDomainToDomain(versus, masterColumn, slaveColumn)
        }
        else {
            var firstArray = this.createArrayByDomain(masterColumn);

            switch (versus) {
                case "left":
                    for (var i = 0; i < firstArray.length; i++) {
                        for (var j = 0; j < slaveColumn.values.length; j++) {
                            matrix[i * slaveColumn.values.length + j] = [firstArray[i], slaveColumn.values[j]]
                        }
                    }
                    break;

                case  "up":
                    for (var i = 0; i < firstArray.length; i++) {
                        for (var j = 0; j < slaveColumn.values.length; j++) {
                            matrix[0].push([firstArray[i], slaveColumn.values[j]])
                        }
                    }
                    break;
            }
        }
    }

    HandlerCreationModels.prototype.createMatrixDomainToHybrid = function (versus, masterColumn, slaveColumn) {

        if (typeof slaveColumn !== 'undefined') {
            return this.createMatrixDomainToDomain(versus, masterColumn, slaveColumn)
        }
        else if (slaveColumn.values.length == 0 || typeof slaveColumn.values === 'undefined') {
            return this.create(versus, masterColumn, slaveColumn)
        } else {
            return this.createMatrixDistinctToDistinct(versus, masterColumn, slaveColumn)
        }
    }

    /*The data representation of the master column is "distinct"  */
    HandlerCreationModels.prototype.createMatrixDistinctToDomain = function (versus, masterColumn, slaveColumn) {
        if (typeof slaveColumn !== 'undefined') {
            return this.createMatrixDomainToDomain(versus, masterColumn, slaveColumn)
        }
        else {
            var secondArray = this.createArrayByDomain(slaveColumn);

            switch (versus) {
                case "left":
                    for (var i = 0; i < masterColumn.values.length; i++) {
                        for (var j = 0; j < secondArray.length; j++) {
                            matrix[i * secondArray.length + j] = [masterColumn.values[i], secondArray[j]]
                        }
                    }
                    break;

                case  "up":
                    for (var i = 0; i < masterColumn.values.length; i++) {
                        for (var j = 0; j < secondArray.length; j++) {
                            matrix[0].push([masterColumn.values[i], secondArray[j]])
                        }
                    }
                    break;
            }
        }
    }

    HandlerCreationModels.prototype.createMatrixDistinctToDistinct = function (versus, masterColumn, slaveColumn) {

        var matrix = [
            [ ]
        ];

        switch (versus) {
            case "left":
                if (typeof slaveColumn !== 'undefined') {
                    for (var i = 0; i < masterColumn.values.length; i++) {

                        for (var j = 0; j < slaveColumn.values.length; j++) {
                            matrix[i * slaveColumn.values.length + j] = [masterColumn.values[i], slaveColumn.values[j]]
                        }
                    }
                } else {
                    for (var i = 0; i < masterColumn.values.length; i++) {
                        matrix[i] = [masterColumn.values[i]]

                    }
                }
                break;

            case  "up":
                if (typeof slaveColumn !== 'undefined') {
                    for (var i = 0; i < masterColumn.values.length; i++) {
                        for (var j = 0; j < slaveColumn.values.length; j++) {
                            matrix[0].push([masterColumn.values[i], slaveColumn.values[j]])
                        }
                    }
                } else {
                    for (var i = 0; i < masterColumn.values.length; i++) {
                        matrix[0].push([masterColumn.values[i]])
                    }
                }
        }
        return matrix
    };

    HandlerCreationModels.prototype.createMatrixDistinctToHybrid = function (versus, masterColumn, slaveColumn) {

        if (slaveColumn.values.length == 0 || typeof slaveColumn.values === 'undefined') {
            return this.createMatrixDistinctToDomain(versus, masterColumn, slaveColumn)
        } else {
            return this.createMatrixDistinctToDistinct(versus, masterColumn, slaveColumn)
        }
    };

    /*The data representation of the master column is "hybrid"  */
    HandlerCreationModels.prototype.createMatrixHybridToDomain = function (versus, masterColumn, slaveColumn) {
        if (masterColumn.values.length == 0 || typeof masterColumn.values === 'undefined') {
            return this.createMatrixDomainToDomain(versus, masterColumn, slaveColumn)
        } else {
            return this.createMatrixDistinctToDomain(versus, masterColumn, slaveColumn)
        }

    }

    HandlerCreationModels.prototype.createMatrixHybridToDistinct = function (versus, masterColumn, slaveColumn) {

        if (masterColumn.values.length == 0 || typeof masterColumn.values === 'undefined') {
            return this.createMatrixDomainToDistinct(versus, masterColumn, slaveColumn)
        } else {
            return this.createMatrixDistinctToDistinct(versus, masterColumn, slaveColumn)
        }

    }

    HandlerCreationModels.prototype.createMatrixHybridToHybrid = function (versus, masterColumn, slaveColumn) {


        if (masterColumn.values.length == 0 || typeof masterColumn.values === 'undefined') {
            if (slaveColumn.values.length == 0 || typeof slaveColumn.values === 'undefined') {
                return this.createMatrixDomainToDomain(versus, masterColumn, slaveColumn)
            }
            else {
                return this.createMatrixDomainToDistinct(versus, masterColumn, slaveColumn)
            }
        } else {
            if (slaveColumn.values.length == 0 || typeof slaveColumn.values === 'undefined') {
                return this.createMatrixDistinctToDomain(versus, masterColumn, slaveColumn)
            }
            else {
                return this.createMatrixDistinctToDistinct(versus, masterColumn, slaveColumn)
            }
        }
    }

    /*
     This method choose the correct domain and creates the array
     */
    HandlerCreationModels.prototype.createArrayByDomain = function (column) {

        Date.prototype.dateFormat = function () {
            var yyyy = this.getFullYear();
            var mm = this.getMonth() + 1; // getMonth() is zero-based
            var dd = this.getDate();
            return String(10000 * yyyy + 100 * mm + dd); // Leading zeros for mm and dd
        }

        Date.prototype.monthFormat = function () {
            var yyyy = this.getFullYear();
            var provMonth = this.getMonth() + 1; // getMonth() is zero-based
            var month;
            month = (provMonth < 10) ? ("0" + provMonth) : provMonth;

            return String(yyyy + month); // Leading zeros for mm and dd
        }

        var array = []
        switch (column.dataTypes[0]) {

            case "code" || "customCode" :
                var codes = column.domain.codes
                for (var i = 0; i < codes.length; i++) {
                    array.push(codes[i].code.code)
                    mapCodesIndex[codes[i].code.code] = i;
                }
                break;

            case "codeList":
                var codes = column.domain.codes
                for (var i = 0; i < codes.length; i++) {
                    array.push(codes[i].codeList)
                }
                break;

            case "boolean":
                array.push(true);
                array.push(false)
                break;

            case "date":
                var from = column.domain.period.from
                var yearFrom = from.substr(0, 4);
                var mmFrom = from.substr(4, 2);
                var ddFrom = from.substr(6, 2);

                var dateFrom = new Date(yearFrom, mmFrom - 1, ddFrom)

                var to = column.domain.period.to
                var yearTo = to.substr(0, 4);
                var mmTo = to.substr(4, 2);
                var ddTo = to.substr(6, 2);
                var dateTo = new Date(yearTo, mmTo - 1, ddTo)

                if (dateTo.getTime() - dateFrom.getTime() > 0) {
                    var intervalDays = (dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)
                    for (var i = 0; i < intervalDays; i++) {
                        var date = new Date(dateFrom.setDate(dateFrom.getDate() + 1))
                        array.push(date.dateFormat())
                    }
                } else {
                    alert("error on DSD configuration startDate and endDate")
                    throw Error
                }
                break;

            case "month":
                var from = column.domain.period.from
                var yearFrom = from.substr(0, 4);
                var mmFrom = from.substr(4, 2);
                var dateFrom = new Date(yearFrom, mmFrom - 1)

                var to = column.domain.period.to
                var yearTo = to.substr(0, 4);
                var mmTo = to.substr(4, 2);
                var dateTo = new Date(yearTo, mmTo - 1)
                if (dateTo.getTime() - dateFrom.getTime() > 0) {
                    var intervalMonths = (dateTo.getMonth() + 12 * dateTo.getFullYear()) - (dateFrom.getMonth() + 12 * dateFrom.getFullYear())
                    array.push(dateFrom.monthFormat())
                    for (var i = 0; i <= intervalMonths; i++) {
                        var date = new Date(dateFrom.setMonth(dateFrom.getMonth() + 1))
                        array.push(date.monthFormat())
                    }
                } else {
                    alert("error on DSD configuration startDate and endDate")
                    throw Error
                }
                break;

            case "time":
                // Updates once every hour
                var from = new Date(column.domain.period.from)
                var to = new Date(column.domain.period.to)
                var diff = parseInt((to - from) / (1000 * 60 * 60))
                for (var i = 1; i < diff; i++) {
                    array.push(new Date(from.getTime() + (i * ( 1000 * 60 * 60))).toJSON());
                }
                break;

            case "year":
                var from = column.domain.period.from
                var yearFrom = from.substr(0, 4);
                var dateFrom = new Date(yearFrom)

                var to = column.domain.period.to
                var yearTo = to.substr(0, 4);
                var dateTo = new Date(yearTo)
                var yearsDiff = yearTo - yearFrom;
                if (yearsDiff > 0) {
                    for (var i = 0; i <= yearsDiff; i++) {
                        array.push(new Date((parseInt(yearFrom) + i).toString()).getFullYear().toString());
                    }
                } else {
                    alert("error!")
                    throw Error
                }
                break;

            case "Number":
                var from = column.domain.period.from
                var to = column.domain.period.to

                var counter = from;
                if (counter < to) {
                    for (var i = 0; i < to; i++) {
                        array.push(counter++)
                    }
                } else if (counter == to) {
                    array.push(counter)
                } else {
                    alert("error!")
                    throw Error
                }
                break;

            case "season":
                var from = column.domain.period.from
                var to = column.domain.period.to;
                var counter = from;
                var yearFrom = parseInt(from.substr(0, 4));
                var yearTo = parseInt(to.substr(0, 4));
                for (var i = yearFrom; i < yearTo; i++) {
                    var nextYear = i+1;
                    var nextSeas = (''+nextYear);
                    var toAppend = nextSeas.substr(2,4);
                    var season = ''+i+'/'+toAppend;
                    array.push(season);
                }

                break;
            }

        return array;
    }

    HandlerCreationModels.prototype.createBigMatrix = function (matrixLeft, matrixUp) {

        var matrix = [
            []
        ];

        for (var i = 0; i < matrixLeft.length; i++) {
            for (var j = 0; j < matrixUp[0].length; j++) {
                if (typeof matrix[i] === 'undefined') {
                    matrix[i] = []
                }
                matrix[i].push([]);
            }
        }

        return matrix
    }

    HandlerCreationModels.prototype.getCodesMap = function () {
        return mapCodesIndex;
    }

    return HandlerCreationModels;
})
