define(['jquery',  "annualLoader/logic/DataLoaderAnnual"], function($, DataLoader){

    var dataLoader, filterActual, region, product, preloadingData, loadingController, seasonMap;


    function HandlerAnnualSelection(){
        dataLoader = new DataLoader;
    }


    HandlerAnnualSelection.prototype.init = function( dataPreLoaded, regionSelected, productSelected ,initBalanceSheet) {

        loadingController = initBalanceSheet;
        region = regionSelected;
        product = productSelected
        preloadingData = dataPreLoaded;
        return this.startSelection();
    }

    HandlerAnnualSelection.prototype.startSelection= function(){

        console.log('init')
        var resultForecast =[]
        var items = $("#selectionYear").jqxComboBox('getItems');


        for(var i= 0, length= items.length; i<length; i++){
            var temporaryForecast = this.createLastForecastCurrentSeason(items,region,product,items[i])
            resultForecast = resultForecast.concat(temporaryForecast);

        }

        resultForecast = this.createSeasonMapDate(resultForecast);

        console.log('**********************RESULT FORECAST****************************')
        console.log(resultForecast)
        console.log('**********************RESULT FORECAST****************************')

        return resultForecast;


    }


    HandlerAnnualSelection.prototype.createLastForecastCurrentSeason = function(items, region, product, seasonAndYear){

        var filterCurrentSeason = this.createFilterForSeasons(region,product,seasonAndYear)
        console.log('filterCurrentSeason')
        console.log(filterCurrentSeason)
        var filterPopulationCurrentSeason = this.createFilterPopulation(region,seasonAndYear)

        return dataLoader.getAndCreateActualYearForecastMostRecent(filterCurrentSeason,filterCurrentSeason,filterPopulationCurrentSeason, seasonAndYear.label)

    }

    HandlerAnnualSelection.prototype.createFilterPopulation = function(region, season){
        return  {
            "region" : region,
            "element": 1,
            "year": season.value
        }
    }


    HandlerAnnualSelection.prototype.createFilterForSeasons  = function(region,product, selectedSeason){
        return { "region": region, "product": product, "year": selectedSeason.value}
    }

    HandlerAnnualSelection.prototype.getRealPreviousYear =function(){
        return dataLoader.getRealPreviousYear();
    }


    HandlerAnnualSelection.prototype.getPreloadingData = function(){
        return filterActual;
    }

    HandlerAnnualSelection.prototype.createSeasonMapDate = function(forecasts){
        seasonMap = {}

        for (var i = 0, length = forecasts.length; i<length; i++){
            var date = forecasts[i][2].substr(0,11);
            forecasts[i][2] = forecasts[i][2].substr(10,17);
            var season = forecasts[i][2];
            seasonMap[season] = date;
        }

        return forecasts;
    }

    HandlerAnnualSelection.prototype.getSeasonMapDate = function(){
      return seasonMap;
    }


    return HandlerAnnualSelection;
})
