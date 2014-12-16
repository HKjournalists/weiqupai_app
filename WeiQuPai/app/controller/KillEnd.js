Ext.define('WeiQuPai.controller.KillEnd', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            pageView: 'killend',
            today: 'today',
            killendchannel: 'killendchannel',
            specialsale: 'specialsale',
            discountView: 'discountkillend'
        },
        control: {
            pageView: {
                detail: 'showDetail',
                create: 'createAuction',
                topkiller: 'showTopKiller',
                avatartap: 'showUser',
                auctionhelp: 'showAuctionHelp',
                bang: 'showBang',
                myauction: 'showMyAuction',
                scoretap: 'showScore'
            },
            today: {
                detail: 'showDetail',
                create: 'createAuction'
            },
            killendchannel: {
                detail: 'showDetail',
                create: 'createAuction'
            },
            specialsale: {
                detail: 'showDetail',
                create: 'createAuction'
            },
            discountView: {
                detail: 'showDetail',
                create: 'createAuction'
            }
        }
    },

    //显示拍卖实况，如果没有创建，显示创建拍卖的按钮
    showDetail: function(list, index, dataItem, record, e) {
        var selfId = record.get('selfId');
        if(selfId > 0){
            this.showAuction(selfId);
        }else{
            view = Ext.create('WeiQuPai.view.KillDetail');
            view.setPoolId(record.get('id'));
            WeiQuPai.navigator.push(view);
        }
    },

    showAuction: function(aid) {
        var view = Ext.create('WeiQuPai.view.UserAuction');
        view.setAuctionId(aid);
        WeiQuPai.navigator.push(view);
    },

    showAuctionHelp: function() {
        var view = WeiQuPai.Util.getGlobalView('WeiQuPai.view.AuctionHelpLayer');
        view.show();
    },

    showUser: function(uid) {
        var view = Ext.create('WeiQuPai.view.ShowUser');
        view.setUid(uid);
        WeiQuPai.navigator.push(view);
    },

    showTopKiller: function(list, index, dataItem, record, e) {
        var view = Ext.create('WeiQuPai.view.TopKiller');
        view.setPoolId(record.get('id'));
        WeiQuPai.navigator.push(view);
    },

    showScore: function(){
        var view = Ext.create('WeiQuPai.view.ScoreRule');
        WeiQuPai.navigator.push(view);
    },

    showBang: function(){
        var view = Ext.create('WeiQuPai.view.Bang');
        WeiQuPai.navigator.push(view);
    },

    showMyAuction: function(){
        var user = WeiQuPai.Util.checkLogin();
        if(!user) return;
        WeiQuPai.navigator.pop('maincard');
        WeiQuPai.sidebar.activeTabItem('myauction');
    },

    //创建拍卖
    createAuction: function(list, index, dataItem, record, e) {
        //如果已经创建过，直接显示实况
        var selfId = record.get('selfId');
        if(selfId > 0){
            return this.showAuction(selfId);
        }

        var user = WeiQuPai.Util.checkLogin();
        if(!user) return;

        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/myScore&token=' + user.token;
        var me = this;
        WeiQuPai.Util.get(url, function(rsp){
            if(rsp.canCreateAuction){
               var view = WeiQuPai.Util.getGlobalView('WeiQuPai.view.ConfirmDialog');
               view.setData(rsp);
               view.setConfirmAction(me.doCreate.bind(me, record));
               view.show();
            }else{
               var view = WeiQuPai.Util.getGlobalView('WeiQuPai.view.ScoreNotEnough');
               view.setData(rsp);
               view.show();
            }
        });
    },

    doCreate: function(record){ 
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/userAuction/create';
        var data = {
            pool_id: record.get('id'),
            token: user.token
        };
        WeiQuPai.Util.post(url, data, function(rsp) {
            var view = Ext.create('WeiQuPai.view.UserAuction');
            view.setAuctionId(rsp.id);
            record.set('selfId', parseInt(rsp.id));
            setTimeout(function() {
                WeiQuPai.navigator.push(view);
            }, 0);
        }, {
            mask: true
        });
    }

});