define([], function() {

/*
    var previuosURL = "http://fenixapps2.fao.org/amis-services";
*/

/*
    var url = "http://168.202.36.134:8080";
*/
    var url = "http://statistics.amis-outlook.org/amis-cbs-services";
    var urlD3S = "http://fenixservices.fao.org";
  //  var url = "http://statistics.amis-outlook.org/amis-cbs-services";
/*
    var url = "http://statistics.amis-outlook.org/cbsmonths";
*/


    return {
        "services":[
            {
                "filters": [
                    {
                        "dataSourceUrl": url + "/dataset/datasource"
                    },
                    {
                        "yearUrl": url + "/dataset/year"
                    },
                    {
                        "countryUrl": urlD3S + "/d3s/msd/resources/uid/amis_countries"
                    },
                    {
                        "commodityUrl" : urlD3S + "/d3s/msd/resources/uid/amis_commodities"
                    }
                ]
            },
            {
                "loading": [
                    {
                        "loadingElements" : url + "/dataset/national"
                    },
                    {
                        "loadingPopulation" :url + "/dataset/population"
                    },
                    {
                        "mostRecentDate" : url + "/dataset/recentDate"
                    },
                    {
                        "previousYear" : url + "/dataset/previousYear"
                    },
                    {
                        "numberOfCrops" : url + "/dataset/crops"
                    },
                    {
                        "loadingPopulationData" :url + "/dataset/populationData"

                    }
                ]
            },
            {
                "saving":{

                    "savingAnnualMode" : url+ "/dataset/annual/national",

                    "savingWithoutDate" : url + "/dataset/national",

                    "savingWithDate"    : url + "/dataset/previous/national",

                    "savingPopulation" : url + "/dataset/populationData"
                }
            },
            {
                "exportDataServletUrl": url + "/amisCBS/export",
                "exportData" : url + "/dataset/annualExport",
                "exportMostRecentDate" : url+"/dataset/mostRecentDateForYears"
            }
        ]
    };
});