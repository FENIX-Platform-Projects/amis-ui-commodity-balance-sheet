define(['jquery', "monthlyLoader/logic/DataLoader"], function ($, DataLoader) {

    var dataLoader, filterActual;


    function HandlerSelection() {
        dataLoader = new DataLoader;
    }


    HandlerSelection.prototype.init = function (preloadingData, region, product, isExport) {

        var notPreviousYear = false;

        dataFiltered = preloadingData;

        var isDateFormatted = (isExport) ? true : false;

        var currentYearFilter = parseInt(preloadingData.years.currentYear);


        // if a previous year exist
        if (preloadingData.years.previousYearLabel != -1) {
            var previousYearFilter = parseInt(preloadingData.years.previousYear);
        } else {
            notPreviousYear = true;
        }

        filterActual = { "region": region, "product": product, "year": currentYearFilter, "season": preloadingData.years.currentYearLabel }
        var filterPreviousYear = { "region": region, "product": product, "year": previousYearFilter, "season": preloadingData.years.previousYearLabel }

        var filterPrevPopulation = {
            "region": region,
            "element": 1,
            "year": preloadingData.years.previousYearLabel != -1? previousYearFilter:parseInt(preloadingData.years.previousYearLabel.substr(0,4))
        }
        var mostRecentDateFilter = {"region": region, "product": product, "year": previousYearFilter }

        var filterPopulationActual = {
            "region": region,
            "element": 1,
            "year": parseInt(preloadingData.years.currentYearLabel.substr(0,4))
        }
        // take the actual forecast
        var actualForecast = dataLoader.getActualYearForecast(filterActual, filterPopulationActual, isDateFormatted);

        if (!notPreviousYear) { // if exist a previous year

            var prevYearForecast = dataLoader.getPreviousYearForecast(mostRecentDateFilter, filterPreviousYear, filterPrevPopulation, isDateFormatted, preloadingData)

            var totalForecast = (prevYearForecast && prevYearForecast.length >0)?prevYearForecast.concat(actualForecast): prevYearForecasts
                ;
        } else {
            var totalForecast = actualForecast;
        }

        return totalForecast;

    }


    HandlerSelection.prototype.getRealPreviousYear = function () {
        return dataLoader.getRealPreviousYear();
    }


    HandlerSelection.prototype.getPreloadingData = function () {
        return filterActual;
    }


    return HandlerSelection;
})
