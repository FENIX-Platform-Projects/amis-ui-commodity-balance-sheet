define(['jquery', "exportLoader/logic/DataExportLoader"], function ($, DataLoader) {

    var dataLoader, filterActual;


    function HandlerExportSelection() {
        dataLoader = new DataLoader;
    }


    HandlerExportSelection.prototype.createLastForecastCurrentSeason = function (items, region, product, seasonAndYear) {

        var filterCurrentSeason = this.createFilterForSeasons(region, product, seasonAndYear)

        var filterPopulationCurrentSeason = this.createFilterPopulation(region, seasonAndYear)

        return dataLoader.getAndCreateActualYearForecastMostRecent(filterCurrentSeason, filterCurrentSeason, filterPopulationCurrentSeason, seasonAndYear.label)

    }

    HandlerExportSelection.prototype.init = function (preloadingData, region, product, isExport) {


        var resultForecast = []


        // to change because every commodity could have different years and seasons
        var items = $("#selectionYear").jqxComboBox('getItems');

        var selectedIndex = $("#selectionYear").jqxComboBox('getSelectedIndex');

        resultForecast = this.createLastForecastCurrentSeason(items, region, product, items[selectedIndex]);

        // USe operator of minus(-) for the order of the seasons
        var seasonChecked = [items[selectedIndex].label]
        var seasonLength = items.length -1
        var precedentSeasons = [];
        // exist two season after the one selected

        if (selectedIndex +2 <= seasonLength) {
            precedentSeasons.push(items[selectedIndex +1], items[selectedIndex + 2]);
        }
        // exist only one  season after the one selected
        else if (selectedIndex + 1 <= seasonLength) {
            precedentSeasons.push(items[selectedIndex + 1])
        }
        // exist only the  season  selected
        else {
            precedentSeasons = null;
        }

        var precedentSeasonsForecast = []

        if (precedentSeasons != null) {
            console.log('successive seasone::::::::')
            console.log(precedentSeasons)
            for (var i = 0; i < precedentSeasons.length; i++) {
                var filterSeason = this.createFilterForSeasons(region, product, precedentSeasons[i])
                var filterPopulation = this.createFilterPopulation(region, precedentSeasons[i])
                var seasonForecasts = dataLoader.getAndCreateTwoMostRecentForecast(filterSeason, filterSeason, filterPopulation, preloadingData, precedentSeasons[i].label)

                resultForecast = resultForecast.concat(seasonForecasts[0]);
            }
        }


        console.log(resultForecast)
        resultForecast.reverse()
        return resultForecast;

    }

    HandlerExportSelection.prototype.createFilterPopulation = function (region, season) {
        return  {
            "region": region,
            "element": 1,
            "year": season.value
        }
    }


    HandlerExportSelection.prototype.createFilterForSeasons = function (region, product, selectedSeason) {
        return { "region": region, "product": product, "year": selectedSeason.value}
    }

    HandlerExportSelection.prototype.getRealPreviousYear = function () {
        return dataLoader.getRealPreviousYear();
    }


    HandlerExportSelection.prototype.getPreloadingData = function () {
        return filterActual;
    }


    return HandlerExportSelection;
})
