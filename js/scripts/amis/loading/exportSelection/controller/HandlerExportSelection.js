define(['jquery', "exportLoader/logic/DataExportLoader", "underscore-min"], function ($, DataLoader, _) {

    var dataLoader, filterActual;


    function HandlerExportSelection() {
        dataLoader = new DataLoader;
    }


    HandlerExportSelection.prototype.createLastForecastCurrentSeason = function (items, region, product, seasonAndYear) {

        var filterCurrentSeason = this.createFilterForSeasons(region, product, seasonAndYear)

        var filterPopulationCurrentSeason = this.createFilterPopulation(region, seasonAndYear)

        return dataLoader.getAndCreateActualYearForecastMostRecent(filterCurrentSeason, filterCurrentSeason, filterPopulationCurrentSeason, seasonAndYear.label)

    }

    HandlerExportSelection.prototype.init = function (preloadingData,  isExport, items, selectedIndex, isDifferentCommodity) {

        var resultForecast = []



        // --------------- to be changed --------
        // to change because every commodity could have different years and seasons


        var seasonsToChoose, seasonSelected, yearSelected;



        // --------------- to be changed --------


        var region = preloadingData.post.regionCode
        var product = preloadingData.post.productCode



        if(isDifferentCommodity) {



            var years = dataLoader.lookForSeasonsCommodityBelonging(region, product, items, selectedIndex)
            seasonsToChoose = years
            var season = items[selectedIndex].label
            if(seasonsToChoose[selectedIndex].yearLabel == season){

            }
        }else{
            seasonsToChoose = items;
            seasonSelected =  items[selectedIndex].label;
            yearSelected = items[selectedIndex].value;

        }
        console.log('YEARSSSs')
        console.log(years)




        // Selected season:
        var filterSeason = this.createFilterForSeasons(region, product, items[selectedIndex])
        var filterPopulation = this.createFilterPopulation(region, items[selectedIndex])
        resultForecast = dataLoader.getAndCreateTwoMostRecentForecast(filterSeason, filterSeason, filterPopulation, preloadingData, items[selectedIndex].label)

        resultForecast = resultForecast[0]
     //   resultForecast = this.createLastForecastCurrentSeason(items, region, product, items[selectedIndex]);

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

            for (var i = 0; i < precedentSeasons.length; i++) {
                var filterSeason = this.createFilterForSeasons(region, product, precedentSeasons[i])
                var filterPopulation = this.createFilterPopulation(region, precedentSeasons[i])
                var seasonForecasts = dataLoader.getAndCreateTwoMostRecentForecast(filterSeason, filterSeason, filterPopulation, preloadingData, precedentSeasons[i].label)

                resultForecast = resultForecast.concat(seasonForecasts[0]);
            }
        }

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
