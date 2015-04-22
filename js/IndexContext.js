define(["preloading/PreloadingObserver"], function( PreloadingObserver ) {

    var observerpreLoading;

    function IndexContext(){
        observerpreLoading = new PreloadingObserver;
    };

    IndexContext.prototype.init = function() {
        observerpreLoading.init() ;
    };

    return IndexContext;



});
