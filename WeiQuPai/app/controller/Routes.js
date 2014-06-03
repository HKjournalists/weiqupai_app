Ext.define('WeiQuPai.controller.Routes', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main'
        },
        
        routes: {
        	'today': 'showToday',
        	'myauction': 'showMyauction',
        	'circle': 'showCircle',
        	'my': 'showMy',
        	'auction/:id' : 'showAuction',
        	'login': 'showLogin',
        	'register': 'showRegister'
        }
    },

    //4个tab的route
    showToday: function(){ WeiQuPai.Util.showTab('today'); },
    showMyauction: function(){ WeiQuPai.Util.showTab('myauction'); },
    showCircle: function(){ WeiQuPai.Util.showTab('circle'); },
    showMy: function(){ WeiQuPai.Util.showTab('my'); },

    showLogin: function(){
        Ext.Viewport.down('main').push(Ext.create('WeiQuPai.view.Login'));
    },

    showRegister: function(){
        Ext.Viewport.down('main').push(Ext.create('WeiQuPai.view.Register'));
    },

    showAuction: function(id){
    	var detailView = Ext.create('WeiQuPai.view.ItemDetail');
        detailView.setParam({id: id});
        this.getMain().push(detailView);
    }
});
