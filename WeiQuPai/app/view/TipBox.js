Ext.define('WeiQuPai.view.TipBox', {
    extend: 'Ext.Container',
    xtype: 'tipbox',
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
                cls: 'dialog_content',
                tpl: new Ext.XTemplate(
                    '<ul>',
                    '<li style="text-align:left">{text}</li>',
                    '{[this.getImage(values)]}',
                    '</ul>', {
                        getImage: function(values){
                            if(!values.pic_url) return '';
                            return '<li><img src="' + WeiQuPai.Util.getImagePath(values.pic_url) + '"/></li>';
                        }
                    }
                ),
                itemId: 'tipcontent'
            }]
        }, {
            xtype: 'button',
            baseCls: 'dialog_btnT',
            itemId: 'tipbutton',
        }]
    },

    initialize: function() {
        this.on('show', WeiQuPai.Util.saveLastView, this);
        this.down('button').on('tap', function() {
            this.hide();
            var link = this.getData().button_link;
            if(link.indexOf('http://') != -1){
                window.open(link, '_system');
            }else{
                WeiQuPai.app.getHistory().fireEvent('change', this.getData().button_link);
            }
        }, this);
    },

    updateData: function(data) {
        this.down('#tipcontent').setData(data);
        this.down('button').setText(data.button_text);
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