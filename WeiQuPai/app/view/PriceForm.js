Ext.define('WeiQuPai.view.PriceForm', {
    extend: 'Ext.form.Panel',
    xtype: 'priceform',
    config: {
        scrollable: null,
        submitAction: null,
        baseCls: '',
        layout: {
            'type': 'hbox',
            'align': 'center'
        },
        items: [{
            xtype: 'numberfield',
            name: 'price',
            placeHolder: '输入您的期望价',
            baseCls: 'input_text',
            clearIcon: false,
            flex: 1
        }, {
            xtype: 'button',
            baseCls: 'btn_e7',
            cls: 'send_btn',
            action: 'submit',
            text: '确定',
            disabled: true,
            style: 'margin-right:10px;'
        }]
    },

    initialize: function() {
        this.on('show', WeiQuPai.Util.saveLastView, this);
        this.down('button[action=submit]').on('tap', function() {
            this.getSubmitAction().call(this);
        }, this);

        this.down('textfield').on('keyup', function() {
            var disabled = this.down('textfield').getValue().trim().length == 0;
            this.down('button[action=submit]').setDisabled(disabled);
        }, this);

        var me = this;
        this.element.dom.addEventListener('submit', function(e) {
            e.preventDefault();
            if (me.down('textfield').getValue().trim().length > 0) {
                me.getSubmitAction().call(this);
            }
        });
    }

});