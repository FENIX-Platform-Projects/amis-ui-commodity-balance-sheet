define(['jquery', "annualLoader/logic/DataLoaderAnnual"], function ($, DataLoader) {

    var dataLoader, filterActual, region, product, preloadingData, loadingController, seasonMap, seasonYearMap;


    function HandlerAnnualSelection() {
        dataLoader = new DataLoader;
    }


    HandlerAnnualSelection.prototype.init = function (dataPreLoaded, regionSelected, productSelected, initBalanceSheet) {

        loadingController = initBalanceSheet;
        region = regionSelected;
        product = productSelected
        preloadingData = dataPreLoaded;
        return this.startSelection();
    }

    HandlerAnnualSelection.prototype.startSelection = function () {
        seasonYearMap = {}
        var resultForecast = []
        var items = $("#selectionYear").jqxComboBox('getItems');
        for (var i = 0, length = items.length; i < length; i++) {
            var temporaryForecast = this.createLastForecastCurrentSeason(items, region, product, items[i])
            seasonYearMap[items[i].label] = items[i].value

            resultForecast = resultForecast.concat(temporaryForecast);

        }

        resultForecast = this.createSeasonMapDate(resultForecast);


        return resultForecast;
    }


    HandlerAnnualSelection.prototype.createLastForecastCurrentSeason = function (items, region, product, seasonAndYear) {

        var filterCurrentSeason = this.createFilterForSeasons(region, product, seasonAndYear)

        var filterPopulationCurrentSeason = this.createFilterPopulation(region, seasonAndYear)

        return dataLoader.getAndCreateActualYearForecastMostRecent(filterCurrentSeason, filterCurrentSeason, filterPopulationCurrentSeason, seasonAndYear.label)

    }

    HandlerAnnualSelection.prototype.createFilterPopulation = function (region, season) {
        return  {
            "region": region,
            "element": 1,
            "year": season.value
        }
    }


    HandlerAnnualSelection.prototype.createFilterForSeasons = function (region, product, selectedSeason) {
        return { "region": region, "product": product, "year": selectedSeason.value}
    }

    HandlerAnnualSelection.prototype.getRealPreviousYear = function () {
        return dataLoader.getRealPreviousYear();
    }


    HandlerAnnualSelection.prototype.getPreloadingData = function () {
        return filterActual;
    }

    HandlerAnnualSelection.prototype.createSeasonMapDate = function (oldF) {
        seasonMap = {}

        var forecasts = $.extend(true,[],oldF)

        for (var i = 0, length = forecasts.length; i < length; i++) {
            var date = forecasts[i][2].substr(0, 10);
            forecasts[i][2] = forecasts[i][2].substr(10, 17);
            var season = forecasts[i][2];
            seasonMap[season] = date;
        }

        return forecasts;
    }

    HandlerAnnualSelection.prototype.getSeasonMapDate = function () {
        return seasonMap;
    }

    HandlerAnnualSelection.prototype.getSeasonYearMap = function () {
        return seasonYearMap;
    }


    return HandlerAnnualSelection;
})
