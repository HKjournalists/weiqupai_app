package com.vqupai.app.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import com.tencent.mm.sdk.constants.ConstantsAPI;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.modelmsg.SendAuth;
import com.tencent.mm.sdk.modelmsg.ShowMessageFromWX;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.vqupai.app.MainActivity;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONException;
import org.json.JSONObject;
import xu.li.cordova.wechat.Wechat;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler{

	// IWXAPI 是第三方app和微信通信的openapi接口
    private IWXAPI api;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // 通过WXAPIFactory工厂，获取IWXAPI的实例
    	api = WXAPIFactory.createWXAPI(this, "");
        api.handleIntent(getIntent(), this);
    }

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		
		setIntent(intent);
        api.handleIntent(intent, this);
	}

    @Override
    public void onReq(BaseReq baseReq) {

    }

    // 第三方应用发送到微信的请求处理后的响应结果，会回调到该方法
	@Override
	public void onResp(BaseResp resp) {
        JSONObject message = new JSONObject();
		String result;

		switch (resp.errCode) {
		case BaseResp.ErrCode.ERR_OK:
            if(resp.getType() == ConstantsAPI.COMMAND_SENDAUTH){
                result = "授权成功";
               try{
                   message.put("code", ((SendAuth.Resp)resp).code);
               }catch(JSONException e){}
            }else {
                result = "发送成功";
            }
			break;
		case BaseResp.ErrCode.ERR_USER_CANCEL:
			result = "发送取消";
			break;
		case BaseResp.ErrCode.ERR_AUTH_DENIED:
			result = "发送被拒绝";
			break;
		default:
			result = "发送返回";
			break;
		}
        Wechat plugin = (Wechat)MainActivity.instance.getPlugin("Wechat");
        try {
            message.put("errcode", resp.errCode);
            message.put("msg", result);
        }catch (JSONException e){
        }
        if(resp.errCode == BaseResp.ErrCode.ERR_OK){
            plugin.currentCallbackContext.success(message);
        }else{
            plugin.currentCallbackContext.error(message);
        }
		finish();

	}
}