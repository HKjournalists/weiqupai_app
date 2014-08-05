Ext.define('WeiQuPai.view.InputComment', {
    extend: 'Ext.form.Panel',
    xtype: 'commentform',
    config: {
        layout: {
            'type': 'hbox',
            'align': 'center'
        },
        scrollable: null,
        items: [{
            xtype: 'textfield',
            name: 'content',
            placeHolder: '评论',
            baseCls: 'input_text',
            clearIcon: false,
            flex: 1
        }, {
            xtype: 'button',
            baseCls: 'btn_e7',
            cls: 'send_btn',
            action: 'publish',
            text: '发送',
            disabled: true,
            style: 'margin-right:10px;'
        }, {
            xtype: 'hiddenfield',
            name: 'reply_id'
        }, {
            xtype: 'hiddenfield',
            name: 'item_id'
        }, {
            xtype: 'hiddenfield',
            name: 'auction_id'
        }]
    },

    initialize: function() {
        this.on('show', WeiQuPai.Util.saveLastView, this);
        this.on('show', function() {
            this.down('textfield[name=content]').focus();
        });
        this.down('button[action=publish]').on('tap', function() {
            this.fireEvent('publish', this);
        }, this);

        this.down('textfield').on('keyup', function() {
            var disabled = this.down('textfield').getValue().trim().length == 0;
            this.down('button[action=publish]').setDisabled(disabled);
        }, this);

        var me = this;
        this.element.dom.addEventListener('submit', function(e) {
            e.preventDefault();
            if (me.down('textfield').getValue().trim().length > 0) {
                me.fireEvent('publish', me);
            }
        }, this);
    }

});