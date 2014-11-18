define(['jquery',  "monthlyLoader/logic/DataLoader"], function($, DataLoader){

    var dataLoader, filterActual;


    function HandlerExportSelection(){
        dataLoader = new DataLoader;
    }


    HandlerExportSelection.prototype.init = function( preloadingData, region, product ,isExport){
        var items = $("#cbs-search-form-year").jqxComboBox('getItems');

        var selectedIndex =$("#cbs-search-form-year").jqxComboBox('getSelectedIndex');


        var seasonChecked=[items[selectedIndex].label]
        var seasonSelected =[];
        if(items.length > selectedIndex+2+1){
            seasonSelected.push(items[selectedIndex+1],items[selectedIndex+2]);
        }
        else if(items.length == selectedIndex+2+1){
            seasonSelected.push(items[selectedIndex+1], null)
        }
        else{
            seasonSelected.push(null)
            }


        console.log('HAndler Selection.init)')
        var notPreviousYear = false;

        dataFiltered = preloadingData;

        // creatio9n of the filter:

        for(var i =0; i< seasonSelected.length; i++){
            if(seasonSelected[i] != null){

                console.log("qui!")
                this.createFilterForNextSeasons(region,product,seasonSelected[i])
            }
        }
        

/*
        console.log('HAndler Selection.init)')
        var notPreviousYear = false;

        dataFiltered = preloadingData;

        var isDateFormatted = (isExport)? true: false;

        var currentYearFilter = parseInt(preloadingData.years.currentYearLabel.substring(0, 4));

        // if a previous year exist
        if(preloadingData.years.previousYearLabel != -1) {
            var previousYearFilter = parseInt(preloadingData.years.previousYearLabel.substring(0, 4));
        }else{
            notPreviousYear = true;
        }

        filterActual = { "region": region, "product": product, "year": currentYearFilter}
        var filterPreviousYear = { "region": region, "product": product, "year": previousYearFilter}

        var filterPrevPopulation = {
            "region": region,
            "element": 1,
            "year": previousYearFilter}
        var mostRecentDateFilter  = {"region": region, "product":product,"year":previousYearFilter }

        var filterPopulationActual = {
            "region" : region,
            "element": 1,
            "year": currentYearFilter
        }
        // take the actual forecast
        var actualForecast = dataLoader.getActualYearForecast(filterActual,filterPopulationActual, isDateFormatted);

        console.log('finished actualForeacst')
        if(!notPreviousYear) { // if exist a previous year

            var prevYearForecast = dataLoader.getPreviousYearForecast(mostRecentDateFilter, filterPreviousYear, filterPrevPopulation, isDateFormatted,preloadingData)

            console.log('finished prevForeacst')
            console.log(prevYearForecast)

            var totalForecast = prevYearForecast.concat(actualForecast)
        }else{
            var totalForecast = actualForecast;
        }*/

        return totalForecast;

    }


    HandlerExportSelection.prototype.createFilterForNextSeasons  = function(region,product, selectedSeason){
       return { "region": region, "product": product, "year": selectedSeason.value}
    }

    HandlerExportSelection.prototype.getRealPreviousYear =function(){
        return dataLoader.getRealPreviousYear();
    }


    HandlerExportSelection.prototype.getPreloadingData = function(){
        return filterActual;
    }


    return HandlerExportSelection;
})
