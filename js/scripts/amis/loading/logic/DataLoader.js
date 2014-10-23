/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "urlConfigurator"], function ($, Formatter, ServicesURL) {


    var urlActualForecast , urlPopulation ,  urlMostRecentDate, urlPreviousYear, firstForecastDateToInsert,
        formatter, realPreviousDate, Services;

    function DataLoader() {
        formatter = new Formatter;
        Services = new ServicesURL;
        Services.init()

        urlActualForecast = Services.getAllDataUrl()
        urlPopulation = Services.getPopulationUrl();
        urlMostRecentDate = Services.getMostRecentDateUrl();
        urlPreviousYear = Services.getPreviousYearUrl();


    }

    DataLoader.prototype.getActualYearForecast = function (filterActual, filterPopulationActual) {

        var actualForecast;
        // first call
        $.ajax({
            async: false,
            url: urlActualForecast,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterActual)

        }).done(function (result) {
            actualForecast = result;
        })

        // Put dates in DSD format
        for (var i = 0; i < actualForecast.length ; i++) {
            var data = actualForecast[i][2]
            actualForecast[i][2] = formatter.fromVisualizationToDSDFormat(data, "date")
        }

        var populationActual;
        // Second call with actual population
        $.ajax({
            async: false,
            url: urlPopulation,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterPopulationActual)

        }).done(function (result) {
            populationActual = result;
        })

        // Inside of population insert the date(s)
        firstForecastDateToInsert = actualForecast[0][2]
        if (populationActual.length > 0) {
            populationActual[0].splice(2, 0, firstForecastDateToInsert);

            actualForecast.push(populationActual[0])
        }

        return actualForecast;
    }

    DataLoader.prototype.getPreviousYearForecast = function (mostRecentDateFilter, filterPreviousYear, filterPrevPopulation) {
        var dates;
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

        var mostRecentDate = dates[dates.length-1][0]
        // set the most recent date to make the query
        filterPreviousYear["date"] = mostRecentDate;

        var prevYearForecast
        $.ajax({
            async: false,
            url: urlPreviousYear,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterPreviousYear)

        }).done(function (result) {
            prevYearForecast = result;
        })


        // Put dates in DSD format
        for (var i = 0; i < prevYearForecast.length; i++) {
            var data = prevYearForecast[i][2]
            prevYearForecast[i][2] = formatter.fromVisualizationToDSDFormat(data, "date")
            // also for updateDate
        }

        var populationPrevYear;
        $.ajax({
            async: false,
            url: urlPopulation,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterPrevPopulation)
        }).done(function (result) {
            populationPrevYear = result;
        })

        // Inside of population insert the date(s)

        if (populationPrevYear.length > 0) {
            var firstForecastPreviousDateToInsert = prevYearForecast[0][2]
            populationPrevYear[0].splice(2, 0, firstForecastDateToInsert);

            // Insert population into actual forecast
            prevYearForecast.push(populationPrevYear[0])
        }
        return prevYearForecast;
    }


    DataLoader.prototype.checkIfEqualForecastDates = function(firstActForecast, prevForecast){
        return firstActForecast[2] == prevForecast[2]
    }


    DataLoader.prototype.setFakeForecastDate = function(prevYearForecast){
        realPreviousDate = prevYearForecast[0][2]
        var fakeDate = "20000103";
        for(var i =0; i< prevYearForecast.length; i++){
            prevYearForecast[i][2] = fakeDate;
        }
        return prevYearForecast;
    }

    DataLoader.prototype.getRealPreviousYear = function(){
        return realPreviousDate;
    }

    return DataLoader;

})