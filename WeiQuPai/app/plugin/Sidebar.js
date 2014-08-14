/**
 * @class Ext.ux.mgd.tab.Sidebar
 * @extend Ext.Container
 * @author Torsten Dinkheller
 * @version: 1.0
 *
 * The Sidebar allows a sidemenu typical for Android
 *
 * Example usage:
 *
 *     {
			    xtype: 'tabsidebar',
			    indicator: { // button to open and close the menu
				    text: 'myApp',
				    iconMask: true,
				    iconCls: 'action',
				    iconAlign: 'left',
				    width: '35%'
			    },
			    header: 'm-gd.com', //Header for the menu
			    items: [ // items inside the menu
				    {
					    text: 'Home'
				    },
				    {
					    text: 'Imprint'
				    }
			    ]
		    }
 */

/**
 * SCSS - Variables
 * Button Indicator (to open and close the menu)
	 $mgd-sidebar-indicator-height: 2.4rem;
	 $mgd-sidebar-indicator-width: 4rem;
	 $mgd-sidebar-indicator-color-1: lighten(#1e416c, 8%);
	 $mgd-sidebar-indicator-color-2: darken(#1e416c, 8%);
	 $mgd-sidebar-indicator-right-radius: 0.5rem;
	 $mgd-sidebar-indicator-text-color: white;
	 $mgd-sidebar-indicator-font-size: 0.8em;
	 $mgd-sidebar-indicator-font-style: italic;
 * Sidebar Menu
	 $mgd-sidebar-background: #EEE;
	 $mgd-sidebar-divider: 1px solid #999;
	 $mgd-sidebar-header-height: 2.9rem;
	 $mgd-sidebar-header-color-1: darken(#999, 4%);
	 $mgd-sidebar-header-color-2: lighten(#CCC, 4%);
 */

Ext.define('WeiQuPai.plugin.Sidebar', {
    extend: 'Ext.Container',
    xtype: 'tabsidebar',

    requires: [
        'Ext.Anim',
        'Ext.Button' // make sure .x-button class is defined
    ],

    config: {
        /**
         * @cfg {Object || Boolean} indicator
         * if false, no idicator is shown, otherwise this defines the indicator
         */
        indicator: {
            itemId: 'mgd-tab-sidebar-button',
            /**
             * @cfg {String} text
             * the button text
             */
            text: '',

            /**
             * @cfg {String} #closeStateCls
             * add additional classes to the button
             */
            openCls: 'mgd-tab-sidebar-button-open',

            /**
             * @cfg {String} #openStateCls
             * add additional classes to the button
             */
            cls: 'mgd-tab-sidebar-button',

            /**
             * @cfg {String} btnPressedCls
             * add additional classes to the pressed button state
             */
            pressedCls: 'mgd-tab-sidebar-button-pressing',

            /**
             * @cfg {Number} [left=0]
             * The absolute left position of this Component
             */
            left: 0,

            /**
             * @cfg {Number} top
             * The absolute top position of this Component
             */
            top: 3,

            /**
             * @cfg {Number} zIndex
             * The z-index to give this Component when it is rendered
             */
            zIndex: 5
        },

        /**
         * @cfg itemId
         * the itemId of the sidebar
         */
        itemId: 'mgd-tab-sidebar',

        /**
         * @cfg menuWidth
         * Percentage of the screen width to use for the menu
         */
        menuWidth: 75,

        /**
         * @cfg {String} cls
         * add additional classes to the navigation bar
         */
        cls: '',

        /**
         * @cfg {Array/Object} sidebarItems
         * The child items to add to this Container. This is usually an array of Component configurations or instances.
         * alternatively you may set items for more control
         */
        items: [],

        /**
         * @cfg {Array/Object} sidebarHeader
         * If you are using the sidebarItems it will add a headerbar. You may set the title of the headerbar
         */
        header: '',

        /**
         * @cfg scrollable
         * is set during initialization for maintaince reasons
         */
        scrollable: null,

        /**
         * @cfg moveActiveView
         * if true, the active view will be pushed over to the side.
         */
        moveActiveView: true
    },

    cachedConfig: {
        /**
         * @cfg {String} state
         * keep track of the state of the content panel.
         * 'open', 'closed'
         */
        state: 'closed',

        /**
         * @cfg {Number} duration
         * time it takes to open and close the contentContainer
         */
        duration: 250,

        /**
         * @cfg baseCls
         * The base CSS class used to render the component.
         * @accessor
         */
        //baseCls: 'mgd-tab-sidebar',

        /**
         * @cfg defaultType
         * defines the default type of all items to be buttons
         */
        defaultType: 'button',

        /**
         * @cfg defaults
         * defines the baseCls of all items
         */
        defaults: {
            //baseCls: 'mgd-tab-sidebar-menu-item'
        },

        /**
         * @cfg left
         * makes the container floating
         */
        left: 0,
        width: 0
    },

    constructor: function(config) {
        this.callParent(arguments);
    },

    /**
     * Component initialization function.
     * @private
     */
    initialize: function() {
        /**
         * add the animation if not available
         */
        if (!(Ext.aims || Ext.anims.tabsidebar)) {
            this.tabsidebarAnimation();
        }

        // Create full menu
        this.createIndicator();
        this.createSideMenu();

        // Initialize the Ext.Component component
        this.callParent(arguments);
    },

    /* ------------------------------------- SIDE-MENU -------------------------------------- */
    createSideMenu: function() {
        this.setHidden(true);
        // if the header and items are required
        if (!Ext.isEmpty(this.getHeader())) {
            var header = {
                xtype: 'container',
                docked: 'top',
                html: this.getHeader(),
                cls: 'mgd-tab-sidebar-menu-header'
            };
            this.add([header]);
        }
        // make sure the smaller side is taken, so ensure correct dispay onOrientationChange
        var dX = Ext.Viewport.element.dom.clientWidth;
        var dY = Ext.Viewport.element.dom.clientHeight;
        var width = (dX < dY ? dX : dY) / 100 * this.getMenuWidth();
        this.setWidth(width);
        this.setScrollable(this.scrollConfig());
    },

    /**
     * after initialization change the width of the menu container
     * @param {Number || String} width
     *     The width of the container Number for Percentage
     *     String as '50px'
     */
    updateMenuWidth: function(width) {
        if (this.getWidth() !== 0) {
            var startWidth = this.getWidth();
            if (this.getState() === 'open')
                this.toggle();
            Ext.defer(function() {
                if (typeof width !== 'string') {
                    var dX = Ext.Viewport.element.dom.clientWidth,
                        dY = Ext.Viewport.element.dom.clientHeight;

                    width = (dX < dY ? dX : dY) / 100 * width;
                } else {
                    if (!width.substr(width.length - 2) === 'px') {
                        Console.warn('Change width either as type Number for percentage or type String like "50px"')
                    } else {
                        width = parseInt(width.substr(0, width.length - 2));
                    }
                }
                this.setWidth(width);
                this.getIndicator().config.sidebar.setWidth(width);
                if (width > startWidth)
                    this.element.dom.style.webkitTransform = "translate3d(-" + width + "px, 0px, 0)";
            }, this.getDuration(), this);
        }
    },

    /* --------------------------------------- BUTTON --------------------------------------- */
    /**
     * create the indicator
     */
    createIndicator: function() {
        if (this.getIndicator() !== false) {
            // Set the text on the button
            var button = this.getIndicator();
            button.xtype = 'button';
            button.handler = this.toggle;
            button.sidebar = this;
            Ext.Viewport.add(button);
            this.setIndicator(Ext.Viewport.down('#' + button.itemId));
            // Set the handler on the button to listen for opening/closing and the pressed state.
            //			createdButton.on('touchstart', 'addPressedCls', this);
            Ext.Viewport.on('orientationchange', this.orientationchange, this.getIndicator());
        }
    },

    orientationchange: function() {
        this.config.sidebar.toggle();
    },

    /**
     * after initialization change the icon and/or the alignment of the indicator
     * @param {String} icon CSS class to add to the icon element.
     * @param {String} [align='left'] Options are: 'top', 'right', 'bottom', 'left' and 'center'
     */
    updateIndicatorIcon: function(icon, align) {
        align = align || 'left';
        this.getIndicator().setIconMask(true);
        this.getIndicator().setIconCls(icon);
        this.getIndicator().setIconAlign(align);
    },
    /**
     * after initialization remove the icon of the indicator
     */
    removeIndicatorIcon: function() {
        this.getIndicator().setIconCls(null);
    },
    /**
     * after initialization change the text of the indicator
     * @param text
     */
    updateIndicatorText: function(text) {
        this.getIndicator().setText(text);
    },
    /**
     * after initialization change the cls of the indicator
     * @param cls
     */
    updateIndicatorCls: function(cls) {
        this.getIndicator().setCls(cls);
    },

    /* --------------------------------------- ACTION --------------------------------------- */
    toggle: function(button) {
        button = button || this.getIndicator();
        var activeView = Ext.Viewport.getActiveItem(),
            sidebar = button ? button.config.sidebar : this;
        var width = sidebar.getWidth();

        if (sidebar.getState() === 'closed') {
            // set State
            sidebar.setState('open');
            sidebar.setHidden(false);
            // run the opening animation
            Ext.Anim.run(sidebar, 'tabsidebar', {
                duration: sidebar.getDuration(),
                fromX: -width
            });
            if (sidebar.getMoveActiveView())
                Ext.Anim.run(activeView, 'tabsidebar', {
                    duration: sidebar.getDuration(),
                    toX: width
                });
            if (button) {
                Ext.Anim.run(button, 'tabsidebar', {
                    duration: sidebar.getDuration(),
                    toX: width
                });
                // show a different symbol in the button
                button.addCls(button.config.openCls);
            }
        } else {
            // set State
            sidebar.setState('closed');
            // run the closing animation
            Ext.Anim.run(sidebar, 'tabsidebar', {
                out: true,
                duration: sidebar.getDuration(),
                toX: -width
            });
            if (sidebar.getMoveActiveView())
                Ext.Anim.run(activeView, 'tabsidebar', {
                    out: true,
                    duration: sidebar.getDuration(),
                    fromX: width
                });
            if (button) {
                Ext.Anim.run(button, 'tabsidebar', {
                    out: true,
                    duration: sidebar.getDuration(),
                    fromX: width
                });
                // revert to original symbol in the button
                button.removeCls(button.config.openCls);
            }
        }
    },

    /* -------------------------------------- ANIMATION -------------------------------------- */
    /**
     * Add the opening animation for containers
     *
     *     Ext.Anim.run(Ext.Viewport.down('.myItem').element, 'tabsidebar', {
     *         out: true,
     *         duration: sidebar.getDuration(),
     *         toX: -width,
     *         fromX: 0
     *     });
     *
     * definition Object
     * -----------------
     * @cfg {Boolean} [out=false]
     * out: true to close the el, false to open the el
     */
    tabsidebarAnimation: function() {
        Ext.apply(Ext.anims, {
            tabsidebar: new Ext.Anim({
                zIndex: 0,
                out: false,
                toX: 0,
                fromX: 0,
                autoClear: false,

                before: function(el) {
                    var currentZIndex = this.zIndex,
                        zIndex = currentZIndex - 1,
                        out = this.out,
                        toX = this.toX,
                        fromX = this.fromX;

                    this.from = {
                        '-webkit-transform': 'translate3d(' + fromX + 'px, 0px, 0)',
                    };
                    this.to = {
                        '-webkit-transform': 'translate3d(' + toX + 'px, 0px, 0)'
                    };
                }
            })
        });
    },

    scrollConfig: function() {
        return {
            direction: 'vertical',
            directionLock: true,
            momentumEasing: {
                momentum: {
                    acceleration: 30,
                    friction: 0.5
                },
                bounce: {
                    acceleration: 0.0001,
                    springTension: 0.9999
                },
                minVelocity: 1
            },
            outOfBoundRestrictFactor: 0.1
        };
    }
});