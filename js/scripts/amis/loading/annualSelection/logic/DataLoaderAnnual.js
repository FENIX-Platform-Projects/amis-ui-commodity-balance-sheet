/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "urlConfigurator"], function ($, Formatter, ServicesURL) {


    var urlActualForecast , urlPopulation ,  urlMostRecentDate, urlPreviousYear, firstForecastDateToInsert,
        formatter, realPreviousDate, Services;


    function DataLoaderAnnual() {
        formatter = new Formatter;
        Services = new ServicesURL;
        Services.init()

        urlActualForecast = Services.getAllDataUrl()
        urlPopulation = Services.getPopulationUrl();
        urlMostRecentDate = Services.getMostRecentDateUrl();
        urlPreviousYear = Services.getPreviousYearUrl();

    }


    DataLoaderAnnual.prototype.getAndCreateActualYearForecastMostRecent = function(mostRecentDateFilter, filterPreviousYear, filterPrevPopulation, seasonLabel){

        console.log('getAndCreate Acutal year cforecasts')

        var mostRecentForecast = []
        // tak all dates
        var dates, prevYearForecast;

        $.ajax({
            async: false,
            url: urlMostRecentDate,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(mostRecentDateFilter)

        }).done(function (result) {
            dates = result;
        })


        console.log('dates for actual season: ')
        console.log(dates)
        var mostRecentDate =dates[dates.length-1][0]

        console.log('dates fchosen ')
        console.log(mostRecentDate)

        filterPreviousYear["date"] = mostRecentDate;

        $.ajax({
            async: false,
            url: urlPreviousYear,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterPreviousYear)

        }).done(function (result) {
            mostRecentForecast.push( result);
        })

        console.log('most recent forecast after taking data ')
        console.log(mostRecentForecast)


        var population
        $.ajax({
            async: false,
            url: urlPopulation,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterPrevPopulation)
        }).done(function (result) {
            population = result;
        })
        console.log('most recent forecast  population ')
        console.log(population)
        if (population.length > 0) {

            // insert date
            population[0].splice(2, 0, mostRecentDate);
            // insert null notes
            population[0].push(null);
        }


        mostRecentForecast[0].push(population[0])

        var result= mostRecentForecast[0]
        console.log('most recent forecast after population')
        console.log(mostRecentForecast)

        result = this.substitueSeasonToDate(result,seasonLabel);
        return result;
    }


    DataLoaderAnnual.prototype.substitueSeasonToDate = function(forecast, season){

        for(var i = 0, length = forecast.length; i<length; i++){
            forecast[i][2]+=season;
        }

        return forecast;
    }


    return DataLoaderAnnual;

})