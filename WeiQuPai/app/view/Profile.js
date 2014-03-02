Ext.define('WeiQuPai.view.Profile', {
	extend: 'Ext.Container',
	xtype: 'profile',
	requires: ['WeiQuPai.model.Profile', 'WeiQuPai.view.GenderList', 'WeiQuPai.view.FieldForm'],

	config: {
		scrollable: true,
		items:[
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

    setContent: function(data){
    	img = '<img class="big-avatar"' + (data.avatar ? ' src="' + data.avatar + '"' : '')  + '/>';
    	this.down('#avatar').setContent(img);

    	this.addGenderList(data.gender);

    	var fields = ['nick', 'real_name', 'email', 'phone', 'sign'];
    	var self = this;
    	Ext.each(fields, function(f){
    		self.down('#' + f).setContent(data[f]);
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
