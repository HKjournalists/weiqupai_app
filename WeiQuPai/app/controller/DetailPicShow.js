Ext.define('WeiQuPai.controller.DetailPicShow', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            prevButton: 'button[action=detail-pic-prev]',
            nextButton: 'button[action=detail-pic-next]',
            carousel : 'detailpicshow carousel'
        },
        control: {
           prevButton: {
                tap : function(){
                    var car = this.getCarousel();
                    car.previous();
                }
           },
           nextButton: {
                tap : function(){
                    var car = this.getCarousel();
                    car.next();
                }
           }
        }
    }
});
