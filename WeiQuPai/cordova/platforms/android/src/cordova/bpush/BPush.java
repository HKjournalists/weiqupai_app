package cordova.bpush;

import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;
import com.baidu.android.pushservice.PushConstants;
import com.baidu.android.pushservice.PushManager;
import com.vqupai.app.MainActivity;
import com.vqupai.app.Utils;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by iceshi on 14-4-24.
 */
public class BPush extends CordovaPlugin {

    public CallbackContext currentCallbackContext;

    public static final String TAG = "cordova.plugin.bpush";

    @Override
    public boolean execute(String action, JSONArray args,
                           CallbackContext callbackContext) throws JSONException {

        if (action.equals("bindChannel")) {
            return bindChannel(args, callbackContext);
        }

        return super.execute(action, args, callbackContext);
    }

    protected boolean bindChannel(JSONArray args, CallbackContext callbackContext){
        JSONObject message = new JSONObject();
        SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(this.cordova.getActivity());
        //如果没拿到就再重新绑定, 这里的回调在MyPushMessageReceiver中
        if(sp.getString("appid", "") == ""){
            currentCallbackContext = callbackContext;
            // run in background
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    PushManager.startWork(BPush.this.cordova.getActivity().getApplicationContext(),
                            PushConstants.LOGIN_TYPE_API_KEY,
                            Utils.getMetaValue(BPush.this.cordova.getActivity(), "api_key"));
                }
            });
            Log.d(TAG, "appid is empty, rebind");
            return true;
        }

        //如果sp里有，就直接返回就可以了
        try {
            message.put("appid", sp.getString("appid", ""));
            message.put("channelId", sp.getString("channel_id", ""));
            message.put("userId", sp.getString("user_id", ""));
            message.put("deviceToken", sp.getString("device_token", ""));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        Log.d(TAG, message.toString());
        callbackContext.success(message);
        return true;
    }
}
