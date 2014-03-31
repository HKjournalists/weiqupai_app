/**
 * 修改版的listPaging
 * 去掉加载更多的文字，调整样式，调整是否加载完全的判断
 */
Ext.define('WeiQuPai.plugin.ListPaging', {
    extend: 'Ext.Component',
    alias: 'plugin.wlistpaging',

    config: {
        /**
         * @cfg {Boolean} autoPaging
         * True to automatically load the next page when you scroll to the bottom of the list.
         */
        autoPaging: false,

        /**
         * @cfg {String} loadMoreText The text used as the label of the Load More button.
         */
        loadMoreText: 'Load More...',

        /**
         * @cfg {String} noMoreRecordsText The text used as the label of the Load More button when the Store's
         * {@link Ext.data.Store#totalCount totalCount} indicates that all of the records available on the server are
         * already loaded
         */
        noMoreRecordsText: 'No More Records',

        /**
         * @private
         * @cfg {String} loadTpl The template used to render the load more text
         */
        loadTpl: [
            '<div class="{cssPrefix}loading-spinner" style="font-size: 20px; margin: 0px auto;">',
                 '<span class="{cssPrefix}loading-top"></span>',
                 '<span class="{cssPrefix}loading-right"></span>',
                 '<span class="{cssPrefix}loading-bottom"></span>',
                 '<span class="{cssPrefix}loading-left"></span>',
            '</div>'
        ].join(''),

        /**
         * @cfg {Object} loadMoreCmp
         * @private
         */
        loadMoreCmp: {
            xtype: 'component',
            baseCls: Ext.baseCSSPrefix + 'list-paging',
            scrollDock: 'bottom',
            hidden: true
        },

        /**
         * @private
         * @cfg {Boolean} loadMoreCmpAdded Indicates whether or not the load more component has been added to the List
         * yet.
         */
        loadMoreCmpAdded: false,

        /**
         * @private
         * @cfg {String} loadingCls The CSS class that is added to the {@link #loadMoreCmp} while the Store is loading
         */
        loadingCls: Ext.baseCSSPrefix + 'loading',

        /**
         * @private
         * @cfg {Ext.List} list Local reference to the List this plugin is bound to
         */
        list: null,

        /**
         * @private
         * @cfg {Ext.scroll.Scroller} scroller Local reference to the List's Scroller
         */
        scroller: null,

        /**
         * @private
         * @cfg {Boolean} loading True if the plugin has initiated a Store load that has not yet completed
         */
        loading: false,

        //是否完全加载
        isFullyLoaded: false
    },

    /**
     * @private
     * Sets up all of the references the plugin needs
     */
    init: function(list) {
        var scroller = list.getScrollable().getScroller(),
            store    = list.getStore();

        this.setList(list);
        this.setScroller(scroller);
        this.bindStore(list.getStore());

        this.addLoadMoreCmp();

        // The List's Store could change at any time so make sure we are informed when that happens
        list.updateStore = Ext.Function.createInterceptor(list.updateStore, this.bindStore, this);

        if (this.getAutoPaging()) {
            scroller.on({
                scrollend: this.onScrollEnd,
                scope: this
            });
        }
    },

    /**
     * @private
     */
    bindStore: function(newStore, oldStore) {
        if (oldStore) {
            oldStore.un({
                beforeload: this.onStoreBeforeLoad,
                load: this.onStoreLoad,
                filter: this.onFilter,
                scope: this
            });
        }

        if (newStore) {
            newStore.on({
                beforeload: this.onStoreBeforeLoad,
                load: this.onStoreLoad,
                filter: this.onFilter,
                scope: this
            });
        }
    },

    /**
     * @private
     * Removes the List/DataView's loading mask because we show our own in the plugin. The logic here disables the
     * loading mask immediately if the store is autoloading. If it's not autoloading, allow the mask to show the first
     * time the Store loads, then disable it and use the plugin's loading spinner.
     * @param {Ext.data.Store} store The store that is bound to the DataView
     */
    disableDataViewMask: function() {
        var list = this.getList();
            this._listMask = list.getLoadingText();

        list.setLoadingText(null);
    },

    enableDataViewMask: function() {
        if(this._listMask) {
            var list = this.getList();
            list.setLoadingText(this._listMask);
            delete this._listMask;
        }
    },

    /**
     * @private
     */
    applyLoadTpl: function(config) {
        return (Ext.isObject(config) && config.isTemplate) ? config : new Ext.XTemplate(config);
    },

    /**
     * @private
     */
    applyLoadMoreCmp: function(config) {
        config = Ext.merge(config, {
            html: this.getLoadTpl().apply({
                cssPrefix: Ext.baseCSSPrefix,
                message: this.getLoadMoreText()
            }),
            scrollDock: 'bottom',
            listeners: {
                tap: {
                    fn: this.loadNextPage,
                    scope: this,
                    element: 'element'
                }
            }
        });

        return Ext.factory(config, Ext.Component, this.getLoadMoreCmp());
    },

    /**
     * @private
     * If we're using autoPaging and detect that the user has scrolled to the bottom, kick off loading of the next page
     */
    onScrollEnd: function(scroller, x, y) {
        var list = this.getList();

        if (!this.getLoading() && y >= scroller.maxPosition.y) {
            this.currentScrollToTopOnRefresh = list.getScrollToTopOnRefresh();
            list.setScrollToTopOnRefresh(false);

            this.loadNextPage();
        }
    },

    /**
     * @private
     * Makes sure we add/remove the loading CSS class while the Store is loading
     */
    updateLoading: function(isLoading) {
        var loadMoreCmp = this.getLoadMoreCmp(),
            loadMoreCls = this.getLoadingCls();
        if (isLoading) {
            loadMoreCmp.addCls(loadMoreCls);
        } else {
            loadMoreCmp.removeCls(loadMoreCls);
        }
    },

    /**
     * @private
     * If the Store is just about to load but it's currently empty, we hide the load more button because this is
     * usually an outcome of setting a new Store on the List so we don't want the load more button to flash while
     * the new Store loads
     */
    onStoreBeforeLoad: function(store) {
        if (store.getCount() === 0) {
            this.getLoadMoreCmp().hide();
        }
    },

    /**
     * @private
     */
    onStoreLoad: function(store, records, success) {
        var loadCmp  = this.getLoadMoreCmp();
        var scroller = this.getScroller();
        var pageSize = this.getList().getStore().getPageSize();
        this.setLoading(false);

        if (records.length < pageSize) {
            this.setIsFullyLoaded(true);
            scroller.on({
                scrollend: function(){
                    loadCmp.hide();
                    scroller.refresh();
                },
                single: true
            });
            var offset = -loadCmp.element.getHeight();
            scroller.scrollBy(null, offset, {duration: 300});
        }else{
            loadCmp.show();
        }

        if (this.currentScrollToTopOnRefresh !== undefined) {
            this.getList().setScrollToTopOnRefresh(this.currentScrollToTopOnRefresh);
            delete this.currentScrollToTopOnRefresh;
        }

        this.enableDataViewMask();
    },

    onFilter: function(store) {
        if (store.getCount() === 0) {
            this.getLoadMoreCmp().hide();
        }else {
            this.getLoadMoreCmp().show();
        }
    },

    /**
     * @private
     * Because the attached List's inner list element is rendered after our init function is called,
     * we need to dynamically add the loadMoreCmp later. This does this once and caches the result.
     */
    addLoadMoreCmp: function() {
        var list = this.getList(),
            cmp  = this.getLoadMoreCmp();

        if (!this.getLoadMoreCmpAdded()) {
            list.add(cmp);

            /**
             * @event loadmorecmpadded  Fired when the Load More component is added to the list. Fires on the List.
             * @param {Ext.plugin.ListPaging} this The list paging plugin
             * @param {Ext.List} list The list
             */
            list.fireEvent('loadmorecmpadded', this, list);
            this.setLoadMoreCmpAdded(true);
        }

        return cmp;
    },

    /**
     * @private
     */
    loadNextPage: function() {
        var me = this;
        if (!me.getIsFullyLoaded()){
            me.disableDataViewMask();
            me.setLoading(true);
            me.getList().getStore().nextPage({ addRecords: true}, this);
        }
    }
});
