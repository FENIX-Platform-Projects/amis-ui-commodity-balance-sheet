/**
 * Created by fabrizio on 10/3/14.
 */
define(['jquery'], function($){

    var urlConfiguration  =   './js/scripts/services/configuration/servicesTestLocal.json'

    function ServicesConfigurator(){}

    var configuration

    ServicesConfigurator.prototype.init = function(){

        // dsd
        $.ajax({
            async: false,
            type: 'GET',
            url: urlConfiguration,
            success: function (data) {
                configuration = data;
            }
        })
    }

    ServicesConfigurator.prototype.getDataSourceUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[0].filters[0].dataSourceUrl;
    }

    ServicesConfigurator.prototype.getYearUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[0].filters[1].yearUrl;

    }

    ServicesConfigurator.prototype.getCountryListUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[0].filters[2].countryUrl;
    }

    ServicesConfigurator.prototype.getCommodityUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[0].filters[3].commodityUrl;
    }

    ServicesConfigurator.prototype.getAllDataUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[1].loading[0].loadingElements;
    }

    ServicesConfigurator.prototype.getPopulationUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[1].loading[1].loadingPopulation;
    }

    ServicesConfigurator.prototype.getMostRecentDateUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[1].loading[2].mostRecentDate;

    }

    ServicesConfigurator.prototype.getPreviousYearUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[1].loading[3].previousYear;

    }

    ServicesConfigurator.prototype.getCropsNumberUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[1].loading[4].numberOfCrops;

    }

    ServicesConfigurator.prototype.getPopulationDataURL = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[1].loading[5].loadingPopulationData;
    }

    ServicesConfigurator.prototype.getSavingDataUrlWithDate = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[2].saving.savingWithDate;

    }

    ServicesConfigurator.prototype.getSavingDataUrlWithoutDate = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[2].saving.savingWithoutDate;

    }

    ServicesConfigurator.prototype.getSavingPopulationURL = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[2].saving.savingPopulation;

    }



    ServicesConfigurator.prototype.getExportingUrl = function(){
        if(!configuration){
            this.init()
        }
        return configuration.services[3].exportDataServletUrl;
    }



    return ServicesConfigurator;
})