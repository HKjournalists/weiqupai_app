Ext.define("WeiQuPai.Cache", {
    singleton: true,
    
    set: function(k, v){
        return window.localStorage.setItem(k, JSON.stringify(v));
    },

    get: function(k){
        return JSON.parse(window.localStorage.getItem(k));
    },

    remove: function(k){
        return window.localStorage.removeItem(k);
    },

    clear: function(){
        return window.localStorage.clear();
    }
})