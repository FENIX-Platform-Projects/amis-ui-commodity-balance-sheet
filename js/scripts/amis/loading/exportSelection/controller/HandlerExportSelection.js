define(['jquery',  "exportLoader/logic/DataExportLoader"], function($, DataLoader){

    var dataLoader, filterActual;


    function HandlerExportSelection(){
        dataLoader = new DataLoader;
    }


    HandlerExportSelection.prototype.createLastForecastCurrentSeason = function(items, region, product, seasonAndYear){

        var filterCurrentSeason = this.createFilterForSeasons(region,product,seasonAndYear)
        console.log('filterCurrentSeason')
        console.log(filterCurrentSeason)
        var filterPopulationCurrentSeason = this.createFilterPopulation(region,seasonAndYear)

        return dataLoader.getAndCreateActualYearForecastMostRecent(filterCurrentSeason,filterCurrentSeason,filterPopulationCurrentSeason, seasonAndYear.label)

    }

    HandlerExportSelection.prototype.init = function( preloadingData, region, product ,isExport){


        console.log('init')
       var resultForecast =[]
        var items = $("#selectionYear").jqxComboBox('getItems');

        var selectedIndex =$("#selectionYear").jqxComboBox('getSelectedIndex');

        resultForecast =this.createLastForecastCurrentSeason(items, region,product, items[selectedIndex]);


        console.log('afterCreatedMostRecentForecast')

        console.log('Forecast actual season most recente is : ' +
        '')
        console.log(resultForecast);



        // USe operator of minus(-) for the order of the seasons
        var seasonChecked=[items[selectedIndex].label]
        var successiveSeasons =[];
        // exist two season after the one selected

        if(selectedIndex -2 >= 0){
            successiveSeasons.push(items[selectedIndex-1],items[selectedIndex-2]);
        }
        // exist only one  season after the one selected
        else if(selectedIndex -1 >= 0){
            successiveSeasons.push(items[selectedIndex-1])
        }
        // exist only the  season  selected
        else{
            successiveSeasons =null;
            }

        var successiveSeasonsForecast = []
        console.log("successive Seasons ++++++++++++++")
        console.log(successiveSeasons)
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++")


        if(successiveSeasons != null) {
            for (var i = 0; i < successiveSeasons.length; i++) {
                debugger;
                var filterSeason = this.createFilterForSeasons(region, product, successiveSeasons[i])
                var filterPopulation = this.createFilterPopulation(region, successiveSeasons[i])
                var seasonForecasts = dataLoader.getAndCreateTwoMostRecentForecast(filterSeason, filterSeason, filterPopulation, preloadingData, successiveSeasons[i].label)
                console.log('seasonForeacsts:  ')
                console.log(seasonForecasts)
                resultForecast = resultForecast.concat(seasonForecasts[0]);

                console.log('resultForecast:  ')
                console.log(resultForecast)
            }
        }



        console.log("*************************************************************")
        console.log(resultForecast)
        console.log("*************************************************************")

        return resultForecast;

    }

    HandlerExportSelection.prototype.createFilterPopulation = function(region, season){
        return  {
            "region" : region,
            "element": 1,
            "year": season.value
        }
    }


    HandlerExportSelection.prototype.createFilterForSeasons  = function(region,product, selectedSeason){
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