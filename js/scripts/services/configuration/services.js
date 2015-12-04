define([], function() {
    
    var url = "http://fenixapps2.fao.org";
    //var url = "http://168.202.28.87:8080";

    return {
        "services":[
            {
                "filters": [
                    {
                        "dataSourceUrl": url + "/amis-services/dataset/datasource"
                    },
                    {
                        "yearUrl": url + "/amis-services/dataset/year"
                    },
                    {
                        "countryUrl": url + "/d3sp/service/msd/cl/system/AMIS_GAUL/1.0"
                    },
                    {
                        "commodityUrl" : url + "/d3sp/service/msd/cl/system/AMIS_PRODUCTS/1.0"
                    }
                ]
            },
            {
                "loading": [
                    {
                        "loadingElements" : url + "/amis-services/dataset/national"
                    },
                    {
                        "loadingPopulation" :url + "/amis-services/dataset/population"
                    },
                    {
                        "mostRecentDate" : url + "/amis-services/dataset/recentDate"
                    },
                    {
                        "previousYear" : url + "/amis-services/dataset/previousYear"
                    },
                    {
                        "numberOfCrops" : url + "/amis-services/dataset/crops"
                    },
                    {
                        "loadingPopulationData" :url + "/amis-services/dataset/populationData"

                    }
                ]
            },
            {
                "saving":{

                    "savingWithoutDate" : url + "/amis-services/dataset/national",
                    "savingWithDate"    : url + "/amis-services/dataset/previous/national",
                    "savingPopulation" : url + "/amis-services/dataset/populationData"

                }
            },
            {
                "exportDataServletUrl": url + "/amis-services/amisCBS/export",
                "exportData" : url + "/amis-services/dataset/annualExport"
            }
        ]
    }
});