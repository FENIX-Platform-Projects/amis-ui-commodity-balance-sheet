/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery", "view/GridDataView", "editorController/FormController",
        "exporter/controller/ExportController", "adapterGrid", "formulasAmis/controller/FormulaController",
        "editingSpecial/controller/ControllerEditors", "generalObserver/GeneralObserver" , "editHandler", "jquery.sidebar"],
    function ($, GridDataView, EditorController, ExportController, Adapter, FormulaController, SpecialEditorController, GeneralObserver, EditHandler) {

        var ViewGrid, ModelController, FormController, dsd, Configurator, adapterGrid, formulaController, supportUtility,
            specialControlEditor, editingOnCell, generalObserver, filterData, xCoordinate, yCoordinate, grid, editHandler,
            eventClick, eventStop, thousandSeparator, elementShown;


        function GeneralController() {
            editHandler = new EditHandler;
            ViewGrid = new GridDataView;
            FormController = new EditorController;
            adapterGrid = new Adapter;
            formulaController = new FormulaController;
            specialControlEditor = new SpecialEditorController;
            generalObserver = new GeneralObserver;
            editingOnCell = true
        };

        GeneralController.prototype.init = function (gridModel, tableModel, configurator, modelController, utility, NProgress) {
            ModelController = modelController;
            dsd = configurator.getDSD();
            Configurator = configurator;
            supportUtility = utility;
            // create a copy
            var tableModelWithFormula = $.extend(true, [], tableModel);
            filterData = supportUtility.getFilterData()

            // formula
            formulaController.init(tableModelWithFormula, Configurator, filterData)

            thousandSeparator = 1
            elementShown = 1
            // visualization model
            grid = ViewGrid.init(tableModelWithFormula, configurator, supportUtility, this)
            generalObserver.init(this, thousandSeparator, elementShown)

            NProgress.done()

            this.onChangeModalityEditing();
        }

        GeneralController.prototype.createListeners = function (grid) {
            var self = this;


            var resultedClicked
            eventClick = grid.attachEvent("onItemClick", function (id, e, node) {

                this.blockEvent();
                //    console.log('GC: after itemclick.blockEvent')
                var coordinates = grid.getScrollState()
                xCoordinate = coordinates.x;
                yCoordinate = coordinates.y;

                // no clikc on the first column
                if (id.column != 'data0' && resultedClicked != -1) {
                    var cellTableModel2 = ModelController.getTableDataModel();
                    var cellTableModel = $.extend(true, {}, cellTableModel2);
                    // To identify when the first new nested row starts
                    var indexesObject = ModelController.getIndexesNewFirstColumnLeft();
                    resultedClicked = adapterGrid.getClickedCell(cellTableModel, Configurator, id, this, indexesObject);

                    var clickedCell = resultedClicked["clickedCell"]
                    var isEditable = formulaController.checkIfEditableCell(clickedCell)
                    editHandler.startEditCell(resultedClicked, isEditable, editingOnCell, grid, self)

                } else {
                    this.unblockEvent()
                }
            });

            eventStop = grid.attachEvent("onBeforeEditStop", function (state, editor) {

                if (state.value == resultedClicked.clickedCell[3]) {
                    this.blockEvent()
                    state.value = state.old;
                    this.unblockEvent();
                } else {
                    if (state.value != null && state.value != '' && !(isNaN(state.value))) {
                        var newValue = parseFloat(state.value)
                        resultedClicked.clickedCell[3] = newValue
                        var indTable = resultedClicked["indTable"];
                        var rowGridIndex = resultedClicked["rowGridIndex"];
                        var columnGridIndex = resultedClicked["columnGridIndex"];

                        self.updateGrid(resultedClicked.clickedCell, indTable, rowGridIndex, columnGridIndex, this)
                        resultedClicked = -1
                        return false;

                    } else {
                        this.blockEvent()
                        state.value = state.old;
                        this.unblockEvent();
                        return true;
                    }
                }
            });


            $("#export").click(function () {
                var ExportControl = new ExportController;
                var table = ModelController.getTableDataModel();
                debugger;
                ExportControl.init(table, Configurator)
            })


            $('#newForecast').on("click", function (evt) {
                evt.preventDefault();
                evt.stopImmediatePropagation();
                self.updateWithNewForecast()
            })
        }

        GeneralController.prototype.startSpecialEditing = function (resultedClicked) {
            console.log('GC: startSpecialEditing')
            var allData = ModelController.getData();
            var tableData = $.extend(true, {}, ModelController.getTableDataModel());
            specialControlEditor.init(allData, tableData, resultedClicked, formulaController, Configurator, supportUtility, this, filterData.productCode);
        }

        GeneralController.prototype.startFullEditing = function (resultedClicked) {

            //  console.log('GC: startFullEditing')
            var clickedCell = resultedClicked["clickedCell"]
            var indTable = resultedClicked["indTable"];
            var rowGridIndex = resultedClicked["rowGridIndex"];
            var columnGridIndex = resultedClicked["columnGridIndex"];
            FormController.init(Configurator, clickedCell, dsd)
            this.onSaveButton(indTable, clickedCell, rowGridIndex, columnGridIndex);
        }

        GeneralController.prototype.onSaveButton = function (indTable, cell, rowIndex, columnIndex) {

            var that = this;
            $("#saveButton").on('click', function (e) {
                e.preventDefault()
                e.stopImmediatePropagation();
                var newCell = FormController.getValue(cell)
                if (newCell.length > 0) {
                    that.updateGrid(newCell, indTable, rowIndex, columnIndex)
                }
            });
        }

        GeneralController.prototype.updateGrid = function (newCell, indTable, rowIndex, columnIndex, eventGrid) {
            console.log('GC: updateGrid ')

            var bindedKeys = formulaController.getBindedKeys();
            ModelController.updateModels(newCell, indTable, rowIndex, columnIndex)
            // check if need to apply a formula
            var codeNewCell = newCell[0]
            if (formulaController.checkIfBindedCode(bindedKeys, codeNewCell)) {

                var tableModel = ModelController.getTableDataModel();
                var modelWithFormulas = $.extend(true, [], tableModel);
                formulaController.init(modelWithFormulas, Configurator, filterData)

                var formulas = formulaController.getFormulasBindedFromKey(codeNewCell)
                // Initially, order by date
                formulaController.sortByDateAtStart(modelWithFormulas);

                var rowsChanged = formulaController.applyUpdateFormulas(modelWithFormulas, formulas, columnIndex, rowIndex);

                rowsChanged.push({'index': indTable, 'row': newCell})

                // at the end, order like initially
                formulaController.sortInitialValue(modelWithFormulas);
                ViewGrid.updateBatchGridView(modelWithFormulas, rowsChanged, xCoordinate, yCoordinate);
            } else {
                ViewGrid.updateGridView(newCell, indTable, xCoordinate, yCoordinate);
            }
        }


        GeneralController.prototype.saveDataFromAllForms = function (newCalculatedData, newOriginalData, cellClickedInfo, typeOfForm) {
            console.log('GC: saveDataFrom All Forms')
            var indexes = ModelController.saveDataFromSpecialForm(newOriginalData, cellClickedInfo.indTable, cellClickedInfo.rowGridIndex, cellClickedInfo.columnGridIndex, typeOfForm)
            var tableModel = ModelController.getTableDataModel();

            var modelWithFormulas = $.extend(true, [], tableModel);

            formulaController.init(modelWithFormulas, Configurator, filterData)

            // otherUses
            if (typeOfForm == 'otherUses') {
                var formulas = formulaController.getFormulasBindedFromKey(15)

                formulaController.sortByDateAtStart(modelWithFormulas);
                var rowsChanged = formulaController.applyUpdateFormulas(modelWithFormulas, formulas, cellClickedInfo.columnGridIndex,
                    cellClickedInfo.rowGridIndex);

                for (var i = 0; i < indexes.length; i++) {
                    if (indexes[i].key == 15) {
                        var indTable = indexes[i].index;
                        break
                    }
                }
                var newCell = ModelController.getTableDataModel()[indTable]
                rowsChanged.push({'index': indTable, 'row': newCell})
            }

            // production or production Rice
            else if (typeOfForm == 'production' || typeOfForm == 'productionRice') {
                var formulas = formulaController.getFormulasBindedFromKey(5)

                var rowsChanged = []
                formulaController.sortByDateAtStart(modelWithFormulas);

                for (var i = 0; i < newCalculatedData.length; i++) {
                    for (var j = 0; j < indexes.length; j++) {
                        if (newCalculatedData[i][0] == indexes[j]['key']) {
                            if (newCalculatedData[i][0] == 5) {
                                var rowsFormula = formulaController.applyUpdateFormulas(modelWithFormulas, formulas, cellClickedInfo.columnGridIndex, cellClickedInfo.rowGridIndex);
                                for (var k = 0, length = rowsFormula.length; k < length; k++) {
                                    rowsChanged.push(rowsFormula[k])
                                }
                                rowsChanged.push({'index': indexes[j]['index'], 'row': newCalculatedData[i]})
                            } else {
                                rowsChanged.push({'index': indexes[j]['index'], 'row': newCalculatedData[i]})
                            }
                        }
                    }
                }
            }

            formulaController.sortInitialValue(modelWithFormulas);
            ViewGrid.updateBatchGridView(modelWithFormulas, rowsChanged, xCoordinate, yCoordinate);
        }

        GeneralController.prototype.updateWithNewForecast = function () {
            console.log('GC: updateWithNewForecast')
            var tableModel = ModelController.createNewForecast();
            if (tableModel) {
                var tableModelWithFormula = $.extend(true, [], tableModel);
                formulaController.init(tableModelWithFormula, Configurator, filterData)
                grid = ViewGrid.init(tableModelWithFormula, Configurator, supportUtility, this)
                generalObserver.listenToVisualizationOptions(thousandSeparator)
                generalObserver.listenToElementsOptions(elementShown)
                this.onChangeModalityEditing()
            }
        }

        GeneralController.prototype.onChangeModalityEditing = function () {
            $("#editingChoice").bind('change', function (event) {
                event.preventDefault()
                editingOnCell = !event.args.checked;
                editHandler.updateEditingOnCell(editingOnCell)
            })
        }

        GeneralController.prototype.onChangeVisualizationOption = function (visualizationMode, typeOfVisualization) {
            if (typeOfVisualization != thousandSeparator || typeOfVisualization != elementShown) {

                if (visualizationMode == 'separator' && typeOfVisualization != thousandSeparator) {
                    Configurator.setThousandSeparator(typeOfVisualization)
                    thousandSeparator = typeOfVisualization;
                }

                else if (visualizationMode == 'elements' && typeOfVisualization != elementShown) {
                    Configurator.setValueLabel(typeOfVisualization)
                    elementShown = typeOfVisualization;
                }

                // create a copy
                var tableModel = ModelController.getTableDataModel();

                var tableModelWithFormula = $.extend(true, [], tableModel);
                filterData = supportUtility.getFilterData()

                // formula
                formulaController.init(tableModelWithFormula, Configurator, filterData)

                // visualization model
                grid = ViewGrid.init(tableModelWithFormula, Configurator, supportUtility, this)

                generalObserver.listenToVisualizationOptions(thousandSeparator)
                generalObserver.listenToElementsOptions(elementShown)

                this.onChangeModalityEditing(typeOfVisualization)

            }
        }

        return GeneralController;
    });