Ext.define("WeiQuPai.FollowTip", {
    singleton: true,
    
    create: function(showByElement, callback){
        var view = WeiQuPai.Util.getGlobalView('WeiQuPai.view.FollowTip');
        view.showBy(showByElement, 'cc-cc');
        view.setTapAction(callback);
        return view;
    },

    showIndex: function(){
        if (!WeiQuPai.app.firstLaunch || this.showIndexFlag) return;
        this.showIndexFlag = true;
        var btn = Ext.Viewport.down('today button[action=killend]');
        WeiQuPai.FollowTip.create(btn, function(){
            var detailView = Ext.create('WeiQuPai.view.KillEnd');
            WeiQuPai.navigator.push(detailView)
        });
    },

    showKillEnd: function(){
        if (!WeiQuPai.app.firstLaunch || this.showKillEndFlag) return;
        this.showKillEndFlag = true;
        var view = WeiQuPai.Util.getGlobalView('WeiQuPai.view.AuctionHelpLayer');
        view.show();
    },

    showCreateAuction: function(){
        if (!WeiQuPai.app.firstLaunch || this.showCreateAuctionFlag) return;
        this.showCreateAuctionFlag = true;
        setTimeout(function(){
            var btn = Ext.Viewport.down('killdetail').element.down('.create');
            WeiQuPai.FollowTip.create(btn, function(){
                WeiQuPai.app.getController('KillDetail').createAuction();
            });
        }, 400);
    }
})