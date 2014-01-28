Ext.define("WeiQuPai.Util", {
	singleton: true,
   
    createOverlay : function(com, conf){
    	var config = {
            bottom: 0,
            left:0,
            hidden: true,
            height: '50%',
            width: '100%',
            showAnimation:{
                type: 'slideIn',
                direction: 'up'
            },
            hideAnimation:{
                type: 'slideOut',
                direction: 'down'
            },
            modal: true,
            hideOnMaskTap: true
    	};

        var cmp = Ext.create(com, Ext.merge(config, conf));
        Ext.Viewport.add(cmp);
        return cmp;
    }
})