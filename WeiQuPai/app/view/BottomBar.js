Ext.define('WeiQuPai.view.BottomBar', {
    extend: 'Ext.Toolbar',
    xtype: 'bottombar',
    config: {
        docked: 'bottom',
        layout: {
            type: 'hbox'
        },
        cls: 'dock_bottom',
        items: [{
            xtype: 'container',
            flex: 1,
            itemId: 'counterContainer',
            baseCls: 'text',
            tpl: '本轮倒计时 <span id="countdown">{counter}</span>'
        }, {
            xtype: 'container',
            flex: '1',
            pack: 'right',
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                flex: '1',
                baseCls: 'dock_dis',
                action: 'comment'
            }, {
                xtype: 'button',
                flex: '1',
                baseCls: 'dock_share',
                action: 'share'
            }, {
                flex: '2',
                xtype: "button",
                baseCls: 'dock_btn',
                text: '立刻购买',
                action: 'pai'
            }]
        }]
    },

    setData: function(data){
        var text = this.formatCountdown(data.auction);
        var d = {
            counter : text
        }
        this.down('#counterContainer').setData(d);
    },

    formatCountdown: function(auction) {
        if (auction.status == WeiQuPai.Config.auctionStatus.STATUS_NOT_START) {
            return '等待开始';
        } else if (auction.status == WeiQuPai.Config.auctionStatus.STATUS_FINISH) {
            return '已结束';
        } else {
            var sec = auction.left_time % 60;
            var min = (auction.left_time - sec) / 60;
            var countdown = (min < 10 ? '0' + min : min) + ":" + (sec < 10 ? '0' + sec : sec);
            return countdown;
        }
    },
});