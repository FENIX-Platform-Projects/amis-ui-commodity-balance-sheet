define(['amplify'], function(){

    var ELEMENTS_MAP = [15,21,21,34,28,29,30,31,32,33]

    function OtherUsesPluginNotes(){}

    OtherUsesPluginNotes.prototype.checkIfNotesAreNotPresent = function(allData, date, tableData){

        var notFound = true;
        var keyDate;


        alert()

        debugger;

        var storeModality = amplify.store()
        if (storeModality.isMonthlyModality) {
             keyDate =(date.substr(4,1)=='/')?
                 "20000103":
                 moment(date).format("YYYYMMDD");

        }else{
            keyDate = date;
        }

        var checkNotes = function(data, index){
            return (typeof data[index][5] !='undefined' &&
                data[index][5] != null &&
                data[index][5] != ''
               )
        }

        for(var i = 0, lengthMAP = ELEMENTS_MAP.length; i< lengthMAP && notFound; i++){

            for(var j= 0, lengthDATA = tableData.length; j<lengthDATA && notFound ;j++){

                if(tableData[j][0] == ELEMENTS_MAP[i] && tableData[j][2] == keyDate){
                    debugger;
                }

                if(tableData[j][0] == ELEMENTS_MAP[i] && tableData[j][2] == keyDate && checkNotes(tableData, j)) {
                    notFound = false
                }
            }
        }



        if(notFound){
            for(var i = 0, lengthMAP = ELEMENTS_MAP.length; i< lengthMAP && notFound; i++){

                for(var j= 0, lengthDATA = allData.length; j<lengthDATA && notFound ;j++){

                    if(allData[j][0] == ELEMENTS_MAP[i] && allData[j][2] == keyDate && checkNotes(allData, j)) {
                        notFound = false
                    }
                }
            }


        }

        debugger;

        return notFound
    }

    return OtherUsesPluginNotes;
})