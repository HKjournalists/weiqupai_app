Ext.define('WeiQuPai.view.LoginTip', {
    extend: 'Ext.Container',
    xtype: 'logintip',
    config: {
        centered: true,
        items: [
            {
                xtype: 'container',
                cls: 'w-container',
                html: '您还没有登录哦～'
            },
            {
                xtype: 'button',
                text: '登录',
                cls: 'w-button',
                action: 'toLoginPage'             
            }
        ]        
    },

    initialize: function(){
        this.down('button[action=toLoginPage]').on('tap', WeiQuPai.Util.jumpLogin);
    }
});