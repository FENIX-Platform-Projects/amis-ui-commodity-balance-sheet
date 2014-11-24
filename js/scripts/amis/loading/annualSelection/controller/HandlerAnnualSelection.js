define(['jquery',  "annualLoader/logic/DataLoaderAnnual"], function($, DataLoader){

    var dataLoader, filterActual, region, product, preloadingData, loadingController;


    function HandlerAnnualSelection(){
        dataLoader = new DataLoader;
    }


    HandlerAnnualSelection.prototype.init = function( dataPreLoaded, regionSelected, productSelected ,initBalanceSheet) {

        loadingController = initBalanceSheet;
        region = region;
        product = productSelected
        preloadingData = dataPreLoaded;
    }

    HandlerAnnualSelection.prototype.startSelection= function(){



        console.log('init')
        var resultForecast =[]
        var items = $("#selectionYear").jqxComboBox('getItems');


        for(var i= 0, length= items.length; i<length; i++){
            var temporaryForecast = this.createLastForecastCurrentSeason(items,region,product,items[i])
            if(typeof resultForecast !=='undefined'){
                resultForecast.push(temporaryForecast)
            }else{
                resultForecast[0] = resultForecast[0].concat(temporaryForecast)
            }
        }


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


    return HandlerAnnualSelection;
})
