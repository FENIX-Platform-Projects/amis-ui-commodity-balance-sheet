/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "urlConfigurator"], function ($, Formatter, ServicesURL) {


    var urlActualForecast , urlPopulation , urlMostRecentDate, urlPreviousYear, firstForecastDateToInsert,
        formatter, realPreviousDate, Services, urlYear;


    function DataExportLoader() {
        formatter = new Formatter;
        Services = new ServicesURL;
        Services.init()

        urlYear = Services.getYearUrl();
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
        var mostRecentMonthDates = this.lookForTwoActualMonths(dates);


        if (mostRecentMonthDates.length == 0) {


            // tak only the most recent in the seson
            twoMostRecentDates = [dates[dates.length - 1][0]]

        }
        else {
            twoMostRecentDates = mostRecentMonthDates;
        }

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

        }

        return twoMostREcentForecasts;
    }


    DataExportLoader.prototype.getAndCreateActualYearForecastMostRecent = function (mostRecentDateFilter, filterPreviousYear, filterPrevPopulation, preloadingData, seasonLabel) {

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


    DataExportLoader.prototype.lookForTwoActualMonths = function (dates) {

        var result = []
        var actualMonth = new Date().getMonth() + 1;
        var previousMonth = (actualMonth - 1 == 0) ? 12 : actualMonth - 1
        var counterTwoMostRecent = 0;
        for (var i = dates.length-1; i >0 && counterTwoMostRecent<2; i--) {

            if (dates[i][0].substr(5, 2) == actualMonth || dates[i][0].substr(5, 2) == previousMonth) {

                counterTwoMostRecent++;
                result.push(dates[i][0]);
                result.reverse()
            }
        }

        return result

    }


    DataExportLoader.prototype.lookForSeasonsCommodityBelonging = function (regionCode, productCode) {


        var result;


        var payload = {
            "regionCode": regionCode,
            "productCode": productCode
        }


        $.ajax({
            async: false,
            url: urlYear,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(payload),
            success: function (data) {

                result = data;
            }
        });

        return result;
    }

    return DataExportLoader;
})