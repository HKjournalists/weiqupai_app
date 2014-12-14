Ext.define('WeiQuPai.view.SelectUser', {
    extend: 'Ext.Container',
    xtype: 'selectuser',
    config: {
        items: [{
            xtype: 'vtitlebar',
            title: '选择关注',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            cls: 'caretow',
            id: 'carelist',
            tpl: new Ext.XTemplate(
                '<div class="change_container"><span class="left">推荐你关注TA们：</span><span class="right change_another">换一批</span><div class="clear"></div></div>',
                '<div class="carelist">',
                '<tpl for=".">',
                '<div class="ban" data-uid="{id}">',
                '<img src="{[WeiQuPai.Util.getAvatar(values.avatar, 140)]}" class="img" />',
                '<div class="name">{nick}</div>',
                '<div class="mask active"><div class="gou"></div></div><div class="clear"></div>',
                '</div>',
                '</tpl>',
                '<div class="clear"></div>',
                '</div>',
                '<div class="center w-button">已选择(<span id="selectedNum">{[values.length]}</span>)人&nbsp;&nbsp;确定</div>'
            )

        }],

        //换一批的翻页
        page: 1
    },

    selectedUid: [],

    initialize: function() {
        this.loadData();
        this.down('#carelist').on('tap', this.handleTap, this, {
            element: 'element',
        });
    },

    loadData: function() {
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/follow/select&page=' + this.getPage();
        var me = this;
        WeiQuPai.Util.get(url, function(rsp) {
            me.selectedUid = [];
            rsp.forEach(function(row){
                me.selectedUid.push(parseInt(row.id));
            });
            me.down('#carelist').setData(rsp);
        });
    },

    handleTap: function(e) {
        //换一批
        if (Ext.get(e.target).findParent('.change_another')) {
            this.setPage(this.getPage() + 1);
            this.loadData();
        }

        //下一步
        if (Ext.get(e.target).findParent('.w-button')) {
            this.doSelect();
        }

        var ban = Ext.get(e.target).findParent('.ban');
        if (ban) {
            ban = Ext.get(ban);
            var uid = parseInt(ban.getAttribute('data-uid'));
            ban.down('.mask').toggleCls('active');
            if (ban.down('.mask').hasCls('active')) {
                this.selectedUid.push(uid);
            } else {
                this.selectedUid = Ext.Array.remove(this.selectedUid, uid);
            }
            this.element.down('#selectedNum').setHtml(this.selectedUid.length);
        }
    },

    doSelect: function() {
        if(this.selectedUid.length == 0){
            //WeiQuPai.Util.toast('请选择一个要关注的人');
            return;
        }
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '?r=appv2/follow/multiFollow';
        var data = {
            token: user.token,
            id: this.selectedUid.join(",")
        }
        var self = this;
        WeiQuPai.Util.post(url, data, function(rsp) {
            //清空选择列表
            self.selectedUid = [];
            setTimeout(function(){
                WeiQuPai.app.fireEvent('addfollow');
                WeiQuPai.navigator.pop();
            }, 100);
        }, {
            mask: true
        });
    }
});