Ext.define('WeiQuPai.controller.Profile', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            profileView: 'profile',
            gender: 'disclosureitem[itemId=gender]',
            genderList: 'genderlist list',
            nick: 'disclosureitem[itemId=nick]',
            email: 'disclosureitem[itemId=email]',
            phone: 'disclosureitem[itemId=phone]',
            sign: 'disclosureitem[itemId=sign]',
            realName: 'disclosureitem[itemId=real_name]',
            avatar: 'disclosureitem[itemId=avatar]'
        },
        control: {
            gender: {
                tap: 'showGenderList'
            },
            genderList: {
                itemtap: 'selectGender'
            },
            avatar: {
                tap: 'showCameraLayer'
            },
            nick: {
                tap: function(){
                    this.showFieldForm('nick', '昵称');
                }
            },
            email: {
                tap: function(){
                    this.showFieldForm('email', '邮箱');
                }
            },
            phone: {
                tap: function(){
                    this.showFieldForm('phone', '联系电话');
                }
            },
            sign: {
                tap: function(){
                    this.showFieldForm('sign', '个性签名');
                }
            },
            realName: {
                tap: function(){
                    this.showFieldForm('real_name', '真实姓名');
                }
            }
        }
    },

    showCameraLayer: function(){
        var self = this;
        WeiQuPai.Util.showCameraLayer(140, 140, function(url){
            self.getProfileView().setAvatar(url);
        });
    },

    showGenderList: function(){
       this.getGenderList().up('genderlist').show();
    },

    showFieldForm : function(field, title){
        var data = WeiQuPai.Cache.get('currentUser');
        var view = Ext.create('WeiQuPai.view.FieldForm', {
            title: title,
            field: field,
            value: data[field]
        });
        this.getMain().push(view);
    },

    
    //选择性别
    selectGender: function(list, index, dataItem, record, e){
        if(list.getSelection()[0] == record){
            list.up('genderlist').hide();
            return;
        }
        var user = WeiQuPai.Cache.get('currentUser');
        var title = record.get('title');
        var id = record.get('id');
        list.up('genderlist').hide();
        this.getGender().setContent(title);
        WeiQuPai.Util.updateProfile({gender: id});
    }
});
