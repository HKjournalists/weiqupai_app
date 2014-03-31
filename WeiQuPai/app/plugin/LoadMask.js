/**
 *  简单的加载状态层
 *
 */
Ext.define('WeiQuPai.plugin.LoadMask', {
    extend: 'Ext.Mask',
    xtype: 'wloadmask',

    config: {
        cls: 'w-loading-mask',
    },

    getTemplate: function() {
        var prefix = Ext.baseCSSPrefix;

        return [
            {
                //it needs an inner so it can be centered within the mask, and have a background
                reference: 'innerElement',
                cls: prefix + 'mask-inner',
                children: [
                    //the elements required for the CSS loading {@link #indicator}
                    {
                        cls: prefix + 'loading-spinner',
                        children: [
                            { tag: 'span', cls: prefix + 'loading-top' },
                            { tag: 'span', cls: prefix + 'loading-right' },
                            { tag: 'span', cls: prefix + 'loading-bottom' },
                            { tag: 'span', cls: prefix + 'loading-left' }
                        ]
                    }
                ]
            }
        ];
    },
});
