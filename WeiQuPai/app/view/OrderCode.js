/**
 * Created by apple on 15-1-16.
 */
Ext.define('WeiQuPai.view.OrderCode', {
    extend: 'Ext.form.Panel',
    xtype: 'ordercode',
    config: {
        cls: 'register',
        items: [{
            xtype: 'vtitlebar',
            title: '输入优惠码',
            docked: 'top',
            items: [{
                baseCls: 'arrow_left',
                action: 'back'
            }]
        },{
            name: 'vcode',
            xtype: 'textfield',
            component:{
                type: 'tel'
            },
            cls: 'w-input-text w-margin',
            placeHolder: '填写优惠码',
            autoComplete: false
        }, {
            xtype: 'button',
            text: '确定',
            baseCls: 'w-button',
            action: 'submitCode'
        }]
    },

    initialize: function() {

    }
});