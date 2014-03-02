Ext.define('WeiQuPai.view.Profile', {
	extend: 'Ext.Container',
	xtype: 'profile',
	requires: ['WeiQuPai.model.Profile', 'WeiQuPai.view.GenderList', 'WeiQuPai.view.FieldForm'],

	config: {
		scrollable: true,
		items:[
			{
                xtype: 'titlebar',
                title: '个人信息',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'disclosureitem',
				title: '头像',
				itemId: 'avatar',
				titleStyle: 'normal'
			},
			{
				xtype: 'disclosureitem',
				title: '昵称',
				itemId: 'nick',
				titleStyle: 'normal'
			},
			{
				xtype: 'disclosureitem',
				title: '真实姓名',
				itemId: 'real_name',
				titleStyle: 'normal'
			},
			{
				xtype: 'spacer',
				height: '1em'
			},
			{
				xtype: 'disclosureitem',
				title: '性别',
				itemId: 'gender',
				titleStyle: 'normal'
			},
			{
				xtype: 'disclosureitem',
				title: '邮箱',
				itemId: 'email',
				titleStyle: 'normal'
			},
			{
				xtype: 'disclosureitem',
				title: '联系电话',
				itemId: 'phone',
				titleStyle: 'normal'
			},
			{
				xtype: 'spacer',
				height: '1em'
			},
			{
				xtype: 'disclosureitem',
				title: '个性签名',
				itemId: 'sign',
				titleStyle: 'normal'
			},
			{
				xtype: 'bottombar'
			}
		]
	},

	initialize: function(){
		var user = WeiQuPai.Cache.get('currentUser');
		if(!user) return;
		this.setContent(user);
    },

    setAvatar: function(url){
    	absurl = WeiQuPai.Config.host + url;
    	img = '<img class="big-avatar"' + (url ? ' src="' + absurl + '"' : '')  + '/>';
    	this.down('#avatar').setContent(img);
    	WeiQuPai.Util.updateProfile({avatar: url});
    },

    setContent: function(data){
    	this.setAvatar(data.avatar);
    	this.addGenderList(data.gender);

    	var fields = ['nick', 'real_name', 'email', 'phone', 'sign'];
    	var self = this;
    	Ext.each(fields, function(f){
    		var value = Ext.String.htmlEncode(data[f]);
    		self.down('#' + f).setContent(value);
    	});
    },

    addGenderList: function(id){
		var genderListView = WeiQuPai.Util.createOverlay('WeiQuPai.view.GenderList', {height: 90});
		var list = genderListView.down('list');
		var record = list.getStore().getById(id);
		list.select(record);
		this.down('#gender').setContent(record.get('title'));
    }

});
