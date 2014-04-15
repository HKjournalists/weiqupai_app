Ext.define('WeiQuPai.view.About', {
	extend: 'Ext.Container',
	xtype: 'about',
	config: {
		scrollable: true,
		items:[
			{
                xtype: 'titlebar',
                title: '关于微趣拍',
                docked: 'top',
                cls: 'w-title'
            },
			{
				xtype: 'container',
				cls: 'w-content',
				html: [
					'我们是一个创业团队，',
					'我们是一群快乐的小伙伴儿，',
					'我们热情、友善、勤奋、坚持，',
					'我们是微趣拍。',
					'',
					'我们坚持快乐是人生之本，',
					'观察生活，体验生活，',
					'我们努力发现可以给人们带来快乐的点滴，',
					'汇聚成欢乐的汪洋。',
					'',
					'我们以购物为切入点，',
					'甄选优质的商品，',
					'以相对低廉的价格提供给用户选购，',
					'并在购物过程中增加众多趣味的环节以及实时的交互，',
					'使购物变得更加有趣。',
					'',
					'我们期望通过我们的产品，',
					'使得大家都成为朋友，',
					'希望为您，',
					'也为我们自己的生活，',
					'增添一抹亮色。',
				].join('<br/>')
			},
			{
				xtype: 'bottombar'
			}
		]
	}
	
});
