/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "urlConfigurator"], function ($, Formatter, ServicesURL) {


    var urlActualForecast , urlPopulation , urlMostRecentDate, urlPreviousYear, firstForecastDateToInsert,
        formatter, realPreviousDate, Services;


    function DataExportLoader() {
        formatter = new Formatter;
        Services = new ServicesURL;
        Services.init()

        urlActualForecast = Services.getAllDataUrl()
        urlPopulation = Services.getPopulationUrl();
        urlMostRecentDate = Services.getMostRecentDateUrl();
        urlPreviousYear = Services.getPreviousYearUrl();

    }


    DataExportLoader.prototype.getAndCreateTwoMostRecentForecast = function (mostRecentDateFilter, filterPreviousYear, filterPrevPopulation, preloadingData, seasonLabel) {


        var twoMostREcentForecasts = []
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

        var twoMostRecentDates;
        debugger;
        var mostRecentMonthDates = this.lookForTwoActualMonths(dates);

        if (mostRecentMonthDates.length == 0) {
            if (dates.length >= 2) {




            /*

             BUSINESS for taking the two most recent months

             */
            twoMostRecentDates = [dates[dates.length - 2][0], dates[dates.length - 1][0]]
        } else {
            twoMostRecentDates = [dates[dates.length - 1][0]]
        }
    }
        else{
            twoMostRecentDates = mostRecentMonthDates;
        }
        console.log('Two most recent dates')
        console.log(twoMostRecentDates)

        for (var i = 0; i < twoMostRecentDates.length; i++) {
            var temporaryForecast = []
            filterPreviousYear["date"] = twoMostRecentDates[i];

            $.ajax({
                async: false,
                url: urlPreviousYear,
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(filterPreviousYear)

            }).done(function (result) {
                temporaryForecast.push(result);
            })

            console.log('forecastWithoutPopulation')
            console.log(temporaryForecast)


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
                population[0].splice(2, 0, twoMostRecentDates[i]);
                // insert null notes
                population[0].push(null);

                temporaryForecast[0].push(population[0])

            }


            temporaryForecast[0] = this.appendSeasonToDate(temporaryForecast[0], seasonLabel)
            if (typeof twoMostREcentForecasts[0] != 'undefined') {
                twoMostREcentForecasts[0] = twoMostREcentForecasts[0].concat(temporaryForecast[0])
            } else {
                twoMostREcentForecasts.push(temporaryForecast[0])
            }
            console.log('forecastWithoutPopulation')
            console.log(temporaryForecast)
        }
        console.log("****************************************************************************************")
        console.log(twoMostREcentForecasts)


        console.log("****************************************************************************************")

        return twoMostREcentForecasts;
    }


    DataExportLoader.prototype.getAndCreateActualYearForecastMostRecent = function (mostRecentDateFilter, filterPreviousYear, filterPrevPopulation, seasonLabel) {

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

        var mostRecentDate = dates[dates.length - 1][0]

        filterPreviousYear["date"] = mostRecentDate;

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

        var result = mostRecentForecast[0]

        result = this.appendSeasonToDate(result, seasonLabel);
        return result;
    }


    DataExportLoader.prototype.appendSeasonToDate = function (forecast, season) {

        for (var i = 0, length = forecast.length; i < length; i++) {
            forecast[i][2] += ' (' + season + ')';
        }

        return forecast;
    }


    DataExportLoader.prototype.lookForTwoActualMonths = function(dates){

        var result = []
        var actualMonth = new Date().getMonth()+1;
        var previousMonth = (actualMonth-1 == 0)? 1 : actualMonth-1
        for(var i =0; i< dates.length; i++){
            debugger;
            if(dates[i][0].substr(5, 2) == actualMonth || dates[i][0].substr(5, 2) == previousMonth){

                result.push(dates[i][0]);
            }
        }

        return result

    }


    return DataExportLoader;

})