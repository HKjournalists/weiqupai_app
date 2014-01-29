Ext.define('WeiQuPai.controller.ShowOrder', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            main: 'main',
            list: 'showorder'
        },
        control: {
            list: {
                avatartap: 'showUserView'
            }
        }
    },

    showUserView: function(list, index, record){
        console.log(record);
    }
});
