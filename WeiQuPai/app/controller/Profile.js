Ext.define('WeiQuPai.controller.Profile', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'main',
            profileView: 'profile',
            gender: 'disclosureitem[itemId=gender]',
            genderList: 'genderlist',
            nick: 'disclosureitem[itemId=nick]',
            email: 'disclosureitem[itemId=email]',
            phone: 'disclosureitem[itemId=phone]',
            sign: 'disclosureitem[itemId=sign]',
            score: 'disclosureitem[itemId=score]',
            realName: 'disclosureitem[itemId=real_name]',
            avatar: 'disclosureitem[itemId=avatar]',
            consignee: 'profile disclosureitem[itemId=consignee]'
        },
        control: {
            gender: {
                tap: 'showGenderList'
            },
            genderList: {
                selected: 'selectGender'
            },
            avatar: {
                tap: 'doAvatarTap'
            },
            nick: {
                tap: function() {
                    this.showFieldForm('nick', '昵称');
                }
            },
            email: {
                tap: function() {
                    this.showFieldForm('email', '邮箱');
                }
            },
            phone: {
                tap: function() {
                    this.showFieldForm('phone', '联系电话');
                }
            },
            sign: {
                tap: function() {
                    this.showFieldForm('sign', '个性签名');
                }
            },
            realName: {
                tap: function() {
                    this.showFieldForm('real_name', '真实姓名');
                }
            },
            consignee: {
                tap: 'showConsignee'
            },
            score: {
                tap: 'showScoreRule'
            }
        }
    },

    doAvatarTap: function(e) {
        if (Ext.get(e.target).hasCls('big-avatar')) {
            this.showBigAvatar();
            return;
        }
        this.showCameraLayer();
    },

    showScoreRule: function(){
        var view = Ext.create('WeiQuPai.view.ScoreRule');
        WeiQuPai.navigator.push(view);
    },
    
    showConsignee: function() {
        var view = Ext.create('WeiQuPai.view.MyConsignee');
        WeiQuPai.navigator.push(view);
    },

    showCameraLayer: function() {
        var self = this;
        WeiQuPai.Util.showCameraLayer(140, 140, true, function(url) {
            self.getProfileView().setAvatar(url);
            WeiQuPai.app.statReport({
                act: 'setavatar'
            });
        });
    },

    showGenderList: function() {
        this.getGenderList().show();
    },

    showFieldForm: function(field, title) {
        var data = WeiQuPai.Cache.get('currentUser');
        var view = Ext.create('WeiQuPai.view.FieldForm', {
            title: title,
            field: field,
            value: data[field]
        });
        this.getMain().push(view);
    },

    //显示头像大图
    showBigAvatar: function() {
        var user = WeiQuPai.Cache.get('currentUser');
        url = user.avatar;
        if (!url) return false;
        var viewer = WeiQuPai.Util.getGlobalView('WeiQuPai.view.SimpleViewer');
        var spic = WeiQuPai.Util.getImagePath(url, '140');
        var bpic = WeiQuPai.Util.getImagePath(url);
        viewer.setPic(spic, bpic);
        viewer.show();
        return false;
    },

    //选择性别
    selectGender: function(list, record) {
        this.getGenderList().hide();
        var title = record.get('title');
        var id = record.get('id');
        this.getGender().setContent(title);
        WeiQuPai.Util.updateProfile({
            gender: id
        });
    }
});