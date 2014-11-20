/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "urlConfigurator"], function ($, Formatter, ServicesURL) {


    var urlActualForecast , urlPopulation ,  urlMostRecentDate, urlPreviousYear, firstForecastDateToInsert,
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

/*
    DataExportLoader.prototype.getActualYearForecast = function (filterActual, filterPopulationActual, isDateFormatted) {

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

        if(isDateFormatted) {
            // Put dates in DSD format
            for (var i = 0; i < actualForecast.length; i++) {
                var data = actualForecast[i][2]

                actualForecast[i][2] = formatter.fromVisualizationToDSDFormat(data, "date")
            }
        }else{
            // Put dates in DSD format
            for (var i = 0; i < actualForecast.length; i++) {
                var data = actualForecast[i][2]
            }
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

        debugger;

        // Inside of population insert the date(s)
        firstForecastDateToInsert = actualForecast[0][2]
        debugger;
        if (populationActual.length > 0) {
            populationActual[0].splice(2, 0, firstForecastDateToInsert);
            populationActual[0].push(null);

            actualForecast.push(populationActual[0])
        }

        return actualForecast;
    }*/

    DataExportLoader.prototype.getAndCreateTwoMostRecentForecast = function(mostRecentDateFilter, filterPreviousYear, filterPrevPopulation,preloadingData, seasonLabel){


        debugger;

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
        if(dates.length>=2) {
             twoMostRecentDates = [dates[dates.length - 2][0], dates[dates.length - 1][0]]
        }else{
             twoMostRecentDates = [dates[dates.length - 1][0]]
        }
        console.log('Two most recent dates')
        console.log(twoMostRecentDates)

        for(var i =0; i<twoMostRecentDates.length; i++){
            debugger;
            var temporaryForecast =[]
            filterPreviousYear["date"] = twoMostRecentDates[i];

            $.ajax({
                async: false,
                url: urlPreviousYear,
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(filterPreviousYear)

            }).done(function (result) {
                temporaryForecast.push( result);
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
            if(typeof twoMostREcentForecasts[0] != 'undefined'){
                debugger;
                twoMostREcentForecasts[0] = twoMostREcentForecasts[0].concat(temporaryForecast[0])
            }else {
                twoMostREcentForecasts.push(temporaryForecast[0])
            }
                debugger;
            console.log('forecastWithoutPopulation')
            console.log(temporaryForecast)
        }

        return twoMostREcentForecasts;
    }


    DataExportLoader.prototype.getAndCreateActualYearForecastMostRecent = function(mostRecentDateFilter, filterPreviousYear, filterPrevPopulation, seasonLabel){

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

        result = this.appendSeasonToDate(result,seasonLabel);
        return result;
    }


    DataExportLoader.prototype.appendSeasonToDate = function(forecast, season){

        for(var i = 0, length = forecast.length; i<length; i++){
            forecast[i][2]+=' ('+ season+')';
        }

        return forecast;
    }


    return DataExportLoader;

})