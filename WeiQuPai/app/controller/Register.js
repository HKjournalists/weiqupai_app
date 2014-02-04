Ext.define('WeiQuPai.controller.Register', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            regForm: 'register',
            register: 'register button[action=register]'
        },
        control: {
            register:{
                tap: 'doRegister'
            }
        }
    },
    
    doRegister: function(btn){
        if(!this.checkForm()){
            return false;
        }
        var data = this.getRegForm().getValues();
        WeiQuPai.Util.register(data.uname, data.password, function(){
            var main = Ext.Viewport.down('main');
            var maintab = main.down('maintab');
            maintab.setActiveItem('today');
            main.pop(maintab);
        });
    }, 

    checkForm: function(){
        var d = this.getRegForm().getValues();
        var msg = null;
        if(d.uname.length < 6){
            msg = '用户名不能少于6个字符';
        }
        else if(d.password.length < 6 || d.password2 < 6){
            msg = '密码不能少于6位';
        }
        else if(d.password != d.password2){
            msg = '两次密码不相同';
        }
        if(msg){
            Ext.Msg.alert(null, msg);
            return false;
        }
        return true;
    }
});