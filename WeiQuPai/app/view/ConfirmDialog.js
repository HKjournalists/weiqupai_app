Ext.define('WeiQuPai.view.ConfirmDialog', {
    extend: 'Ext.Container',
    xtype: 'dialog',
    config: {
        cls: 'dialog-box',
        centered: true,
        modal: true,
        width: '90%',
        hideOnMaskTap: true,
        items: [{
            xtype: 'container',
            cls: 'dialog_content',
            items: [{
                xtype: 'container',
                cls: 'dialog-title',
                html: '确定创建该商品的血战吗？'
            }, {
                xtype: 'container',
                id: 'changea',
                cls: 'dialog_content',
                tpl: new Ext.XTemplate(
                    '<ul>',
                    '<li>您的积分是：<span>{score}</span></li>',
                    '<li>创建一次血战需要<span>{costScore}</span>积分哦</li>',
                    '</ul>'
                )
            }]
        }, {
            xtype: 'container',
            layout: 'hbox',
            items: [{
                flex: 1,
                xtype: 'button',
                baseCls: 'dialog_btnT',
                text: '取消',
                action: 'cancel',
                style:'margin-right:2px'
            }, {
                flex: 1,
                xtype: 'button',
                baseCls: 'dialog_btnT',
                text: '确定',
                action: 'confirm'
            }]
        }],

        confirmAction: null,
        data: {
            score: 0,
            costScore: 0
        }

    },

    initialize: function() {
        this.on('show', WeiQuPai.Util.saveLastView, this);
        this.down('button[action=cancel]').on('tap', this.hide, this);
        this.down('button[action=confirm]').on('tap', function() {
            this.hide();
            this.getConfirmAction().call(this);
        }, this);
    },

    updateData: function(data) {
        this.down('#changea').setData(data);
    },

    //这里为了fix红米上浮层不显示的bug，重写了show和hide的方法
    show: function() {
        this.setZIndex(1000);
        this.getModal().setZIndex(999);
        this.getModal().show();
        Ext.Anim.run(this.element, 'pop', {
            out: false,
            autoClear: false
        });
        WeiQuPai.Util.saveLastView.call(this);
    },

    hide: function() {
        this.getModal().hide();
        Ext.Anim.run(this.element, 'pop', {
            out: true,
            autoClear: false
        });
        WeiQuPai.lastView = null;
    },
})