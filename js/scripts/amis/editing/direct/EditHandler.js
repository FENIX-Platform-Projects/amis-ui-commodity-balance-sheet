/**
 * Created by fabrizio on 10/16/14.
 */
define(['jquery'], function($){

    var isEditable, editingOnCell, generalController

    function EditHandler(){}

    EditHandler.prototype.startEditCell = function(resultedClicked, isEditable, editingOnCell, grid, GeneralController){
        var clickedCell =   resultedClicked["clickedCell"]
        generalController = GeneralController

        switch(isEditable){
            case 0:
                //not editable
                grid.editCancel();
                grid.unblockEvent()
                break;

            case 1:
                // editable
                if(editingOnCell){

                    grid.getEditor().setValue(clickedCell[3]) // change the value
                    grid.unblockEvent()

                }else{
                    grid.editCancel();
                    generalController.startFullEditing(resultedClicked)
                    grid.unblockEvent()
                }


                break;

            case 2:
                // Special editing
                grid.editCancel();
                generalController.startSpecialEditing(resultedClicked)
                break;
        }
    }

    EditHandler.prototype.updateEditingOnCell = function(updated){
        editingOnCell = updated
    }

    return EditHandler;
})