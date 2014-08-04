Ext.define('WeiQuPai.view.Profile', {
    extend: 'Ext.Container',
    xtype: 'profile',
    requires: ['WeiQuPai.model.Profile', 'WeiQuPai.view.GenderList', 'WeiQuPai.view.FieldForm'],

    config: {
        scrollable: true,
        cls: 'bg_ef',
        plugins: [{
            type: 'wpullrefresh',
            lastUpdatedText: '上次刷新：',
            lastUpdatedDateFormat: 'H点i分',
            loadingText: '加载中...',
            pullText: '下拉刷新',
            releaseText: '释放立即刷新',
            loadedText: '下拉刷新',
            scrollerAutoRefresh: true,
            refreshFn: 'fetchLastest',
        }],
        items: [{
            xtype: 'vtitlebar',
            title: '个人信息',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'user',
                action: 'ucenter'
            }]
        }, {
            xtype: 'container',
            cls: 'w-disclosure-group',
            items: [{
                xtype: 'disclosureitem',
                title: '头像',
                itemId: 'avatar',
            }, {
                xtype: 'disclosureitem',
                title: '用户名',
                itemId: 'uname',
                disclosureItem: false,
            }, {
                xtype: 'disclosureitem',
                title: '昵称',
                itemId: 'nick',
            }, {
                xtype: 'disclosureitem',
                title: '真实姓名',
                itemId: 'real_name',
            }, {
                xtype: 'disclosureitem',
                title: '积分',
                itemId: 'score',
                disclosureItem: false
            }]
        }, {
            xtype: 'container',
            cls: 'w-disclosure-group',
            items: [{
                xtype: 'disclosureitem',
                title: '性别',
                itemId: 'gender',
            }, {
                xtype: 'disclosureitem',
                title: '邮箱',
                itemId: 'email',
            }, {
                xtype: 'disclosureitem',
                title: '联系电话',
                itemId: 'phone',
            }]
        }, {
            xtype: 'disclosureitem',
            title: '个性签名',
            itemId: 'sign',
        }, {
            xtype: 'disclosureitem',
            title: '收货信息',
            itemId: 'consignee'
        }]
    },

    initialize: function() {
        this.loadData();
    },

    loadData: function(callback) {
        var user = WeiQuPai.Cache.get('currentUser');
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/profile&token=' + user.token;
        var self = this;
        WeiQuPai.Util.get(url, function(rsp) {
            var record = Ext.create('WeiQuPai.model.Profile');
            record.setData(rsp);
            self.setRecord(record);
            callback && callback();
        });
    },

    //下拉刷新, 这里的this是pullRefresh对象
    fetchLastest: function() {
        var me = this;
        this.getList().loadData(function() {
            me.setState('loaded');
            me.snapBack();
        });
    },

    setAvatar: function(url) {
        var absurl = WeiQuPai.Util.getAvatar(url, '100');
        img = '<img class="avatar100"' + (url ? ' src="' + absurl + '"' : '') + '/>';
        this.down('#avatar').setContent(img);
        WeiQuPai.Util.updateProfile({
            avatar: url
        });
    },

    applyRecord: function(record) {
        var data = record.data;
        this.setAvatar(data.avatar);
        this.addGenderList(data.gender);
        var fields = ['uname', 'nick', 'real_name', 'email', 'phone', 'sign', 'score'];
        var self = this;
        Ext.each(fields, function(f) {
            var value = Ext.String.htmlEncode(data[f]);
            self.down('#' + f).setContent(value);
        });
        return record;
    },

    addGenderList: function(id) {
        var genderList = WeiQuPai.Util.createOverlay('WeiQuPai.view.GenderList');
        var dataview = genderList.down('dataview');
        var record = dataview.getStore().getById(id);
        dataview.select(record);
        this.down('#gender').setContent(record.get('title'));
    }

});