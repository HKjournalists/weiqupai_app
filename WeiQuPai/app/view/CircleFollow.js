/**
 * 拍圈广场
 */
Ext.define('WeiQuPai.view.CircleFollow', {
    extend: 'WeiQuPai.view.FeedList',
    xtype: 'circlefollow',
    config: {
        store: 'CircleFollow'
    },

    _noFollowCfg: {
        itemId: 'noFollow',
        cls: 'itemcare',
        html: '<div class="care_one">关注好拍友，杀价更便捷！<br/> 你还没有关注哦，多关注一些人吧！</div>' +
            '<div class="care_two">关注后，TA们的动态就会出现在这里</div>' +
            '<div><input type="button" class="care_btn" value="去关注" /></div>'
    },

    initialize: function(){
    	this.callParent(arguments);
    	WeiQuPai.app.on('login', this.loadData, this);
        WeiQuPai.app.on('addfollow', this.loadData, this);
        WeiQuPai.app.on('cancelfollow', this.loadData, this);
    	WeiQuPai.app.on('logout', this.onLogout, this);
    },

    getNoFollowCmp: function() {
        if (!this.noFollowCmp) {
            this.noFollowCmp = Ext.create('Ext.Container', this._noFollowCfg);
            this.add(this.noFollowCmp);
            this.noFollowCmp.on('tap', function() {
            	var user = WeiQuPai.Util.checkLogin();
            	if(!user) return;
            	var view = Ext.create('WeiQuPai.view.SelectUser');
                WeiQuPai.navigator.push(view);
            }, this, {
            	element: 'element',
                delegate: '.care_btn'
            });
        }
        return this.noFollowCmp;
    },

    loadData: function(callback) {
        var user = WeiQuPai.Cache.get('currentUser');
        var store = this.getStore();
        if (this.getStore().isLoading()) {
            return false;
        }
        this.setLoadingText(null);
        var query = WeiQuPai.Util.getDefaultParam();
        this.getStore().getProxy().setExtraParams(query);
        this.getStore().loadPage(1, function() {
            this.onStoreLoad.apply(this, arguments);
            Ext.isFunction(callback) && callback.apply(arguments);
        }, this);
    },

    onStoreLoad: function(records, operation, success) {
        if (records.length > 0) {
	        this.getNoFollowCmp().hide();
	        this.getLoadMoreCmp().show();
            return;
        }
        //如果没有关注人，显示关注列表
        this.getNoFollowCmp().show();
        this.getLoadMoreCmp().hide();
    },

    //退出登录时重置状态
    onLogout: function(){
    	this.getStore().removeAll();
    	this.getNoFollowCmp().show();
    	this.getLoadMoreCmp().hide();
    	this.setIsFullyLoaded(false);
    }

});