/*
 * 使用localStorage做cahce
 */
Ext.define("WeiQuPai.Cache", {
    singleton: true,
    
    //过期时间
    expireTime: 86400 * 6,

    set: function(k, v, expire){
        return window.localStorage.setItem(k, JSON.stringify(v));
    },

    get: function(k){
        var v = window.localStorage.getItem(k);
        return JSON.parse(v);
    },

    remove: function(k){
        return window.localStorage.removeItem(k);
    },

    clear: function(){
        return window.localStorage.clear();
    }
})