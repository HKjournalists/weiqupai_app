Ext.define('WeiQuPai.view.FeedBack', {
    extend: 'Ext.Container',
    xtype: 'feedback',
    config: {
        cls: 'bg_ef',
        scrollable: true,
        items: [{
            xtype: 'vtitlebar',
            title: '意见反馈',
            docked: 'top',
            items: [{
                xtype: 'button',
                baseCls: 'arrow_left',
                action: 'back'
            }]
        }, {
            xtype: 'container',
            cls: 'camera_btn_area',
            itemId: 'cameraArea',
            items: [{
                xtype: 'button',
                baseCls: 'camera',
                action: 'feedBackCamera'
            }]
        }, {
            xtype: 'textareafield',
            placeHolder: '您有什么意见请在这里提出吧~',
            maxLength: 1000,
            maxRows: 4,
            clearIcon: false,
            name: 'content',
            height: '10em',
            cls: 'shai_content'
        }, {
            xtype: 'button',
            baseCls: 'w-button',
            action: 'feedsubmit',
            text: '提交'
        }],
        picList: []
    },


    submitForm: function() {
        var content = this.down('textareafield').getValue().trim();
        if (content.length == 0) {
            return false;
        }
        var url = WeiQuPai.Config.apiUrl + '/?r=appv2/feedback';
        var user = WeiQuPai.Cache.get('currentUser');
        var data = {};
        data.uid = user && user.id || 0;
        data.content = content;
        var me = this;
        WeiQuPai.Util.post(url, data, function(rsp) {
            me.down('textareafield').reset();
            WeiQuPai.Util.toast('您的意见已提交，感谢您的反馈');
        });
    }
});