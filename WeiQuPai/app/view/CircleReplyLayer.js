Ext.define('WeiQuPai.view.CircleReplyLayer', {
    extend: 'Ext.form.Panel',
    xtype: 'circlereplylayer',
    config: {
        scrollable: null,
        layout: {
            'type': 'hbox',
            'align': 'center'
        },
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
            name: 'feed_id'
        }, {
            xtype: 'hiddenfield',
            name: 'to_uid'
        }, {
            xtype: 'hiddenfield',
            name: 'to_nick'
        }]
    },

    /*
    show: function() {
        this.getModal().setHidden(false);
        this.element.setStyle('display', null);
        WeiQuPai.Util.saveLastView.call(this);
        this.down('textfield[name=content]').focus();
    },

    hide: function() {
        this.getModal().setHidden(true);
        this.element.setStyle('display', 'none');
    },
    */

    initialize: function() {
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