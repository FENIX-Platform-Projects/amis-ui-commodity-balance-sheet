define(['jquery', 'FenixValidator'], function ($, Validator) {

    'use strict'


    var validator


    function FenixReports() {
        validator = new Validator
    }


    FenixReports.prototype.exportData = function (payload, url) {

        validator.checkPayload(payload, url)

        var that = this;

        debugger;

        $.ajax({
            url: url,
            crossDomain: true,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            beforeSend: that.loadAnimatedGif(),
            success: function (data) {
                that.removeAnimatedGif();
                console.log('success export')
                window.location = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("error occurred");
                console.log('jqXHR error:')
                console.log(jqXHR)
                console.log('textStatus error:')
                console.log(textStatus)
                console.log('errorThrown error:')
                console.log(errorThrown)
            }
        })

    }

    FenixReports.prototype.loadAnimatedGif = function(){
        $( "body" ).append('<div id="fenixExportLoading" ' +
            'style=" position: fixed;'+
        'top: 50%;'+
        'left: 50%;'+
        'transform: translate(-50%, -50%);'+
        'width: 30px;'+
        'height: 30px;'+
        'background: url("images/report/ajax-loader%20.gif") !important;"></div>');
        debugger;
    }

    FenixReports.prototype.removeAnimatedGif = function(){
        var element = document.getElementById("fenixExportLoading")
        if(element){element.parentNode.removeChild(element)}
    }


    return FenixReports;
})