/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery" , "views/modelView/ViewModel", "adapterGrid", "nprogress", "webix"],
    function ($, ViewModel, AdapterGrid, Nprogress) {

    var model, table, Configurator, titlesUp, titlesLeft, accessorMap, fullModel, configurationKeys, indexValues, modelView,
        leftDimensions, upDimensions, valueColumn, language, viewModel, adapterGrid, supportUtility,
        dataSource, columns , arrDiffDates, grid, generalController, NProgress

    function GridDataView() {
        NProgress = Nprogress
        NProgress.done()
    }


    GridDataView.prototype.init = function (tableModel, configurator, utility, GeneralController) {

        generalController = GeneralController;
        supportUtility = utility
        adapterGrid = new AdapterGrid;
        viewModel = new ViewModel;
        table = tableModel;
        Configurator = configurator;
        language = Configurator.getComponentLanguage();
        var grid = this.createFullGrid();
        return grid;
    }

    GridDataView.prototype.createFullGrid = function () {

        fullModel = Configurator.getAllColumnModels();
        configurationKeys = Configurator.getKeyColumnConfiguration();
        accessorMap = Configurator.getAccessorMap();
        valueColumn = Configurator.getValueColumnConfiguration();
        indexValues = Configurator.getValueIndex();
        modelView = viewModel.init(table, Configurator, supportUtility)
        var grid = this.renderGrid(modelView)
        return grid;
    }

    GridDataView.prototype.renderGrid = function (model) {
        adapterGrid.createPropertiesFromModel(model)
        var columnsNumber = adapterGrid.getNumberOfColumns(model)
        var differentDates = adapterGrid.getDifferentDates();
        var titlesMap = adapterGrid.getTitlesMap()

        dataSource = this.createDataSource(columnsNumber, differentDates, titlesMap, model)

        columns = this.createColumns(dataSource, differentDates)

        this.createOtherOptions()

        if (grid)
            grid.destructor()

        var self = this;
        grid =
            webix.ui({
                container: "pivotGrid",
                view: "datatable",
                clipboard: "selection",
                id: "grid",
                editable: true,
                navigation: true,
                leftSplit: 1,
                scheme: {
                    $change: function (item) {
                        self.createColourConfiguration(item);
                    }
                },
                columns: columns,
                datatype: "jsarray",
                data: dataSource
            });

        generalController.createListeners(grid);
        return grid;
    }

    GridDataView.prototype.updateViewOnChangeVisualization = function(){
        modelView = viewModel.init(table, Configurator, supportUtility)
        var grid = this.renderGrid(modelView)
    }

    GridDataView.prototype.createOtherOptions = function () {
        var filterData = supportUtility.getFilterData()

        document.getElementById('box').style.visibility = "visible";
        var options = document.getElementById('options')
        options.style.visibility = "visible";
        var toappend = document.getElementById('toAppend');
        if (toappend != null) {
            toappend.remove()
        }

        var f = document.getElementById('optionsPivotGrid');
        if (typeof f != 'undefined' && f != null) {
            f.remove();
        }

        var f = document.getElementById('newForecast');
        if (typeof f != 'undefined' && f != null) {
            f.remove();
        }

        var fa = document.querySelectorAll('[view_id="grid"]');
        if (typeof fa != 'undefined' && fa != null) {
            fa.remove();
        }

        var titleGrid = document.getElementById('titlepivotGrid')
        titleGrid.innerHTML = "Forecast for season: " + filterData.season + " , " + filterData.country +
            " , " + filterData.product + " , " + filterData.dataSource

        $('#options').append('<div class="btn-group">' +
            '<button class="btn btn-primary" id="newForecast">Create a new forecast for season ' + filterData.season + '</button>' +
             '<button class="btn btn-primary" id="annualSelection">Change To annual Selection</button>' +
             '</div>' +
            '<div class="btn-group-vertical" id="optionsPivotGrid">' +
            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
            '<span class="caret"></span><span>Options</span></button>' +
            '<ul class="dropdown-menu" role="menu"><li>' +
            '<h5  class ="optionTitles">Editing options</h5>' +
            '<div id="editingChoice"  class="optionText"> Edit flag and notes</div>' +
            '<hr></li>' +
            '<li>' +
            '<div class="selectorThousand">' +
            '<h5 class ="optionTitles">Thousand separator</h5>' +
            '<div id="commaButton"  class="optionText">'+
            '  Comma (e.g. 1,000)</div>'+
            '<div id="periodButton" class="optionText">'+
            '  Period  &nbsp  (e.g. 1.000)</div>'+
            '<div id="spaceButton" class="optionText">'+
            '  Space   &nbsp (e.g. 1 000)</div>'+
            '</div><hr></li>' +
            '<li>' +
            '<div class="selectorView">' +
            '<h5  class ="optionTitles">Cell value</h5>' +
            '<div id="everyElButtons"  class="optionText">'+
            ' Show All ( Flags & Notes )</div>'+
            '<div id="flagButton" class="optionText">'+
            ' Show Flag and values  </div>'+
            '<div id="noteButton" class="optionText">'+
            ' Show Notes and values</div>'+
            '<div id="valueButton" class="optionText">'+
            ' Show only values  </div>'+
            '</div></li>'+
            '</ul></div>');


        $('#editingChoice').jqxCheckBox({width: 30, height: 25 });
        $('#commaButton').jqxRadioButton({groupName :"thousandSeparator",width: 30, height: 25});
        $('#periodButton').jqxRadioButton({groupName :"thousandSeparator",width: 30, height: 25});
        $('#spaceButton').jqxRadioButton({groupName :"thousandSeparator",width: 30, height: 25});

        $('#everyElButtons').jqxRadioButton({groupName :"elementSelectors",width: 30, height: 25});
        $('#flagButton').jqxRadioButton({groupName :"elementSelectors",width: 30, height: 25});
        $('#noteButton').jqxRadioButton({groupName :"elementSelectors",width: 30, height: 25});
        $('#valueButton').jqxRadioButton({groupName :"elementSelectors",width: 30, height: 25});


    }

    GridDataView.prototype.createColourConfiguration = function (item) {
        switch (item.data0) {
            case 'Population (1000s)':
            case 'Total Supply (Thousand tonnes)':
            case 'Domestic Supply (Thousand tonnes)':
            case 'Total Utilization (Thousand tonnes)':
            case 'Domestic Utilization (Thousand tonnes)':
            case 'Per capita food use (Kg/Yr)':
            case 'Extraction Rate (%)':
                item.$css = "blueLine"
                break;

            case 'Unbalanced':
                item.$css = "redLine"
                break;

            case 'Production (Thousand tonnes)':
            case 'Other Uses (Thousand tonnes)':
            case 'Area Harvested (Thousand Ha)':
            case 'Production Paddy (Thousand tonnes)':
            case 'Area Planted (Thousand Ha)':
            case 'Yield (Tonnes/Ha)':
            case 'Yield Paddy (Tonnes/Ha)':
            case 'Yield Milled (Tonnes/Ha)':
                item.$css = "greenLine"
                break;

            default :
                item.$css = "defaultLine"
                break;

        }
    }

    GridDataView.prototype.createColumns = function (dataSource, differentDates) {
        var filterData = supportUtility.getFilterData()

        var columns = [];
        arrDiffDates = Object.keys(differentDates)

        columns.push({id: "data0", width: 300, header: 'Elements', css: "firstColumn", sort: "string" })

        for (var i = 0; i < arrDiffDates.length; i++) {
            if (i == 0) {
                columns.push({id: "data" + 1, header: [
                    {text: 'Input dates', colspan: arrDiffDates.length},
                    {text: arrDiffDates[i]}
                ], editor: 'text', css: "datesColumns", sort: "string"})
            } else if (i != 0 && i != arrDiffDates.length) {

                columns.push({id: "data" + (i + 1), header: [
                    //{text: ''},
                    {text: null},
                    {text: arrDiffDates[i]}
                ], editor: 'text', css: "datesColumns", sort: "int"})
            }
        }
        return columns;
    }

    GridDataView.prototype.createDataSource = function (columnsNumber, differentDates, titlesMap, model) {

        var viewRowModel = []
        var index = 0;
        for (var key in titlesMap) {
            viewRowModel[index] = [key];
            for (var i = 0; i < titlesMap[key].length; i++) {
                var indexValue = titlesMap[key][i]
                viewRowModel[index].push(model[indexValue][3])
            }
            index++;
        }

        return viewRowModel;
    }

    GridDataView.prototype.updateGridView = function (newCell, indexCell, xCoordinate, yCoordinate) {

        var cellTransformed = viewModel.updateItem(newCell)
        modelView[indexCell] = cellTransformed;

        var result = this.updateDataSourceSingleCell(cellTransformed)

        grid.destructor()

        var self = this;
        grid =
            webix.ui({
                container: "pivotGrid",
                view: "datatable",
                navigation: true,
                id: "grid",
                editable: true,
                sortable: true,
                export:true,
                clipboard: "selection",
                leftSplit: 1,
                scheme: {
                    $change: function (item) {
                        self.createColourConfiguration(item);
                    }
                },
                columns: columns,
                datatype: "jsarray",
                data: dataSource
            });
        grid.scrollTo(xCoordinate, yCoordinate)
        generalController.createListeners(grid)

    }

    GridDataView.prototype.getGrid = function () {
        return grid
    }

    GridDataView.prototype.updateBatchGridView = function (tableModel, cells, xCoordinate, yCoordinate, events) {

        var newCalculatedCells = []
        for (var i = 0; i < cells.length; i++) {
            modelView[cells[i]["index"]] = viewModel.updateItem(cells[i]["row"])
            newCalculatedCells.push(modelView[cells[i]["index"]])
        }

        for (var i = 0; i < newCalculatedCells.length; i++) {
            this.updateDataSourceSingleCell(newCalculatedCells[i])
        }


        var self = this

        if (grid) {
            //  grid.detachEvent(events.click);
            //  grid.detachEvent(events.stop);
            grid.destructor()
        }
        if (document.getElementById('specialForm')) {
            $('#specialForm').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        }

        grid = webix.ui({
            container: "pivotGrid",
            view: "datatable",
            navigation: true,
            id: "grid",
            editable: true,
            leftSplit: 1,
            scheme: {
                $change: function (item) {
                    self.createColourConfiguration(item);
                }
            },
            columns: columns,
            datatype: "jsarray",
            data: dataSource
        });

        grid.scrollTo(xCoordinate, yCoordinate)
        generalController.createListeners(grid);
    }

    GridDataView.prototype.getDataSource = function () {
        return dataSource
    }

    GridDataView.prototype.updateDataSourceSingleCell = function (newCell) {
        var result = {}
        var found = false;
        for (var i = 0; i < dataSource.length && !found; i++) {
            if (dataSource[i][0] == newCell[0]) {
                for (var j = 0; j < arrDiffDates.length && !found; j++) {
                    if (newCell[2] == arrDiffDates[j]) {
                        found = true;
                        dataSource[i][j + 1] = newCell[3]
                        result['row'] = dataSource[i]
                        result['idRow'] = i;
                    }
                }
            }
        }
        return result;
    }

    return GridDataView;

})