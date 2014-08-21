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
            xtype: 'container',
            cls: 'input_text',
            html: '<input type="tel" name="price" id="price" placeHolder="输入您的期望价" class="x-input-el"/>',
            flex: 1
        }, {
            xtype: 'button',
            baseCls: 'btn_e7',
            cls: 'send_btn',
            action: 'submit',
            text: '确定',
            style: 'margin-right:10px;'
        }]
    },

    initialize: function() {
        this.on('show', WeiQuPai.Util.saveLastView, this);
        this.down('button[action=submit]').on('tap', function() {
            this.getSubmitAction().call(this);
        }, this);

        var me = this;
        this.element.dom.addEventListener('submit', function(e) {
            e.preventDefault();
            me.getSubmitAction().call(this);
        });
    }

});