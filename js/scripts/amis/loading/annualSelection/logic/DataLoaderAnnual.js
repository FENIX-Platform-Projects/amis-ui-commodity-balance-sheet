/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "urlConfigurator"], function ($, Formatter, ServicesURL) {


    var urlActualForecast , urlPopulation , urlMostRecentDate, urlPreviousYear, firstForecastDateToInsert,
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


    DataLoaderAnnual.prototype.getAndCreateActualYearForecastMostRecent = function (mostRecentDateFilter, filterPreviousYear, filterPrevPopulation, seasonLabel) {

        var mostRecentForecast = []
        // tak all dates
        var dates, prevYearForecast,
            filter = filterPreviousYear;

        debugger;

        filter['season'] = seasonLabel;
        $.ajax({
            async: false,
            url: urlMostRecentDate,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filter)

        }).done(function (result) {
            dates = result;
        })


        var mostRecentDate = dates[dates.length - 1][0]

        filterPreviousYear["date"] = mostRecentDate;
        filterPreviousYear.season = seasonLabel

        $.ajax({
            async: false,
            url: urlPreviousYear,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterPreviousYear)

        }).done(function (result) {
            mostRecentForecast.push(result);
        })


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

        if (population.length > 0) {

            // insert date
            population[0].splice(2, 0, mostRecentDate);
            // insert null notes
        }

        mostRecentForecast[0].push(population[0])

        var result = mostRecentForecast[0]

        result = this.substitueSeasonToDate(result, seasonLabel);
        return result;
    }


    DataLoaderAnnual.prototype.substitueSeasonToDate = function (forecast, season) {
        for (var i = 0, length = forecast.length; i < length; i++) {

            (typeof forecast[i] === 'undefined')?
                forecast.splice(i,1):

                forecast[i][2] += season;
            }


        return forecast;
    }


    return DataLoaderAnnual;

})