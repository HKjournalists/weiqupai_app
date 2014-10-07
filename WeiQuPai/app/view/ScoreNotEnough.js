Ext.define('WeiQuPai.view.ScoreNotEnough', {
    extend: 'Ext.Container',
    xtype: 'scorenotenough',
    config: {
        cls: 'dialog-box',
        centered: true,
        modal: true,
        width: '90%',
        hideOnMaskTap: true,
        items: [{
            xtype: 'container',
            cls:'dialog_content',
            items: [{
                xtype: 'container',
                baseCls: 'dialog_title'
            },{
                xtype:'container',
                id:'changea',
                cls:'dialog_content',
                tpl: new Ext.XTemplate(
                    '<ul>',
                      '<li>您的积分是：<span>{score}</span></li>',
                      '<li>创建一次血战需要<span>{costScore}</span>积分哦</li>',
                    '</ul>'
                )
            }]
        },{
            xtype:'button',
            baseCls:'dialog_btnT',
            text:'看看如何赚积分&gt;&gt;',
            action: 'getScore'
        }]
    },

    initialize: function() {
        this.down('button[action=getScore]').on('tap', function(){
            this.hide();
            WeiQuPai.app.getController('KillEnd').showScore();
        }, this);
    },

    updateData: function(data){
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