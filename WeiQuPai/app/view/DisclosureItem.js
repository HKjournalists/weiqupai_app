Ext.define("WeiQuPai.view.DisclosureItem", {
    extend: 'Ext.Container',
    xtype: 'disclosureitem',

    config: {
        layout: 'hbox',
        title: '标题',
        contentPosition: 'right',
        content: '',
        cls: 'w-disclosure-item',
        disclosureItem: true
    },
    titleNode: null,
    detailNode: null,
    disclosureNode: null,

    pressedTimer: null,
    pressDelay: 100,

    beforeInitialize: function() {
        this.titleNode = Ext.create('Ext.Container', {
            cls: 'w-disclosure-title',
            layout: 'hbox',
        });
        this.detailNode = Ext.create('Ext.Container', {
            cls: 'w-disclosure-content'
        });

        if (this.config.disclosureItem) {
            this.disclosureNode = Ext.create('Ext.Container', {
                baseCls: 'w-disclosure',
                docked: 'right'
            });
        }
        if (this.config.contentPosition == 'right') {
            this.setLayout('hbox');
            this.detailNode.setDocked('right');
        } else {
            this.setLayout('vbox');
        }

        this.addListener({
            element: 'element',
            touchstart: 'doTouchStart',
            touchend: 'doTouchEnd',
            touchmove: 'doTouchEnd'
        });
    },

    initialize: function() {
        this.add(this.titleNode);
        //顺序很重要，discolsure一定要先加
        this.disclosureNode && this.add(this.disclosureNode);
        this.add(this.detailNode);
        this.relayEvents(this.element, ['tap', 'singletap', 'doubletap', 'swipe', 'taphold']);
    },

    setContent: function(html, cls) {
        if (!html) return;
        cls && this.detailNode.addCls(cls);
        this.detailNode.addCls(this.config.contentPosition, 'w-disclosure-content-');
        !Ext.isObject(html) ? this.detailNode.setHtml(html) : this.detailNode.add(html);
    },

    setTitle: function(title, cls) {
        cls && this.titleNode.addCls(cls);
        if (!Ext.isObject(title)) {
            this.titleNode.setHtml(title);
        } else {
            this.titleNode.add(title);
        }
    },

    doTouchStart: function() {
        var me = this;
        this.pressedTimer = Ext.defer(function() {
            me.addCls('w-disclosure-item-pressed');
        }, this.pressDelay);
    },

    doTouchEnd: function() {
        if (this.pressedTimer) {
            clearTimeout(this.pressedTimer);
            delete this.pressedTimer;
        }
        this.removeCls('w-disclosure-item-pressed');
    },

    clearBadge: function() {
        var badgeEl = this.titleNode.element.down('.w-badge');
        if (!badgeEl) return;
        badgeEl.setStyle('display', 'none');
    },

    //设置小红点
    setBadge: function() {
        var badgeEl = this.titleNode.innerHtmlElement.down('.w-badge');
        if (!badgeEl) {
            badgeEl = this.titleNode.innerHtmlElement.createChild({
                tag: 'span',
                cls: 'w-badge'
            });
        }
    }

});