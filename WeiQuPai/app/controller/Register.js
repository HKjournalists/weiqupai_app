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
        Ext.Msg.alert('注册');
    }
});
