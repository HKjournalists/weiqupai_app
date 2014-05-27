/**
 *  简单的加载状态层
 *
 */
Ext.define('WeiQuPai.plugin.Toast', {
    extend: 'Ext.Container',
    xtype: 'toast',

    config: {
        cls: 'w-toast',
        message: '',
        centered: true,
    },

    getTemplate: function() {
        return [
            {
                reference: 'innerElement'
            }
        ];
    },


    setMessage: function(msg){
        this.innerElement.setHtml(msg);
    }
});

