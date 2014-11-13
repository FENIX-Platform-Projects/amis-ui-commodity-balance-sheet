define(['jquery',  "monthlyLoader/logic/DataLoader"], function($, DataLoader){

    var dataLoader, filterActual;


    function HandlerSelection(){
        dataLoader = new DataLoader;
    }


    HandlerSelection.prototype.init = function( preloadingData, region, product ,isExport){

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
        }

        return totalForecast;

    }


    HandlerSelection.prototype.getRealPreviousYear =function(){
        return dataLoader.getRealPreviousYear();
    }


    HandlerSelection.prototype.getPreloadingData = function(){
        return filterActual;
    }


    return HandlerSelection;
})
