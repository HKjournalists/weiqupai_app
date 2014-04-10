/*
 * 使用localStorage做cahce
 */
Ext.define("WeiQuPai.Cache", {
    singleton: true,

    set: function(k, v){
        if(!v) return true;
        return window.localStorage.setItem(k, JSON.stringify(v));
    },

    get: function(k){
        var v = window.localStorage.getItem(k);
        return v ? JSON.parse(v) : null;
    },

    remove: function(k){
        return window.localStorage.removeItem(k);
    },

    clear: function(){
        return window.localStorage.clear();
    }
})