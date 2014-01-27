Ext.define('WeiQuPai.view.SwipeButtonList', {
	extend: 'Ext.dataview.List',
	xtype: 'swipebuttonlist',
	config: {
		itemCls: 'w-icon-list-item-container',
		disableSelection: true
	},

	maxOffset: 5,
	moveReady: false,
	canMove: true,
	mouseX: 0, 
	mouseY: 0, 
	currentItem: null,

	itemSelector: '.w-icon-list-item, .w-list-item',

	initialize: function(){
		this.callParent(arguments);
		this.on('itemtouchstart', this.onTouchStart);
		this.onBefore('itemtouchstart', this.beforeTouchStart);
		this.onBefore('itemtap', this.doItemTap);
	},

	onItemTouchStart: function(e) {
		var args = this.parseEvent(e);
		var me = args[0], target=args[1], index=args[2], e = args[3],
            store = me.getStore(),
            record = store && store.getAt(index);
        me.fireAction('itemtouchstart', [me, index, target, record, e], 'doItemTouchStart');
        this.container.innerElement.on({
            touchmove: 'onItemTouchMove',
            delegate: '.' + Ext.baseCSSPrefix + 'list-item',
            scope: this
        });
    },

	onTouchStart: function(list, index, dataItem, record, e){
		console.log('start');
		this.currentItem = dataItem.element.dom;
        this.mouseX = e.pageX;
		this.mouseY = e.pageY;
		this.canMove = true;
		this.moveReady = false;
		this.on('itemtouchmove', this.onTouchMove);
		this.on('itemtouchend', this.onTouchEnd);
	}, 

	onTouchMove: function(list, index, dataItem, record, e){
		if(!this.canMove)  return false;
		if(this.moveReady){
			var buttons = Ext.DomQuery.selectNode('.button-area', this.currentItem);
			distance = e.pageX - this.mouseX;
			if(distance > 0) distance = 0; 
			if(distance < -buttons.offsetWidth) distance = -buttons.offsetWidth;
			var domItem = Ext.DomQuery.selectNode(this.itemSelector, this.currentItem);
			this.moveToPoisition(domItem, distance);
		}else{
			//先禁用滚动条
			this.getScrollable().getScroller().setDisabled(true);
			//X轴的移动先达到了maxOffset
			if(Math.abs(e.pageX - this.mouseX) > this.maxOffset){
				this.moveReady = true
				return;
			}
			//这里确定是垂直滑动，要打开滚动条
			if(Math.abs(e.pageY - this.mouseY) > this.maxOffset){
				this.getScrollable().getScroller().setDisabled(false);
				this.canMove = false;
			}
		}
	}, 

	onTouchEnd: function(list, index, dataItem, record, e){
		this.un('itemtouchmove', this.onTouchMove);
		this.un('itemtouchend', this.onTouchEnd);
		if(!this.canMove) return;
		//保证swipe动画的完成
		var domItem = Ext.DomQuery.selectNode(this.itemSelector, this.currentItem);
		var buttons = Ext.DomQuery.selectNode('.button-area', this.currentItem);
		var distance = e.pageX - this.mouseX;
		var targetPosition = distance < -20 ? -buttons.offsetWidth : 0;
		this.moveToPoisition(domItem, targetPosition, true);
		//转换到有按钮的状态，这时候再点或滑动都要回到最初状态，不做任何效果
		if(targetPosition < 0){
			buttons.style.zIndex = 0;
			var self = this;
			this.un('itemtouchstart', this.onTouchStart);
			this.on('itemtouchstart', this.restoreState, this, {single: true});
		}
	},

	beforeTouchStart: function(list, index, dataItem ,record, e){
		if(e.getTarget('.button-area')){
			return false;
		}
	}, 

	//回到初始状态
	restoreState: function(list, index, dataItem, record, e){
		var domItem = Ext.DomQuery.selectNode(this.itemSelector, this.currentItem);
		var buttons = Ext.DomQuery.selectNode('.button-area', this.currentItem);
		buttons.style.zIndex = -1;
		var self = this;
		domItem.addEventListener('webkitTransitionEnd', function(){
			domItem.removeEventListener('webkitTransitionEnd', arguments.callee);
			self.on('itemtouchstart', self.onTouchStart);
		});
		self.moveToPoisition(domItem, 0, true);
	},

	moveToPoisition: function(dom, position, animate){
        dom.style.webkitTransitionDuration = animate ? '200ms' : 0;
		dom.style.webkitTransform = 'translate3d(' + position + 'px, 0, 0)';
	},

	doItemTap: function(list, index, dataItem, record, e){
		var slice = e.target.className.split("-");
		var action = slice.pop();
		if(slice.join("-") == 'swipe-button'){
			this.fireEvent('item' + action, list, index, dataItem, record, e);
			return false;
		}
	}
});
