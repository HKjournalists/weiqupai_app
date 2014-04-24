package cordova.bpush;

import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by iceshi on 14-4-24.
 */
public class BPush extends CordovaPlugin {

    protected CallbackContext currentCallbackContext;

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

        try {
            message.put("appid", sp.getString("appid", ""));
            message.put("channelId", sp.getString("channel_id", ""));
            message.put("userId", sp.getString("user_id", ""));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Log.d(TAG, message.toString());
        callbackContext.success(message);
        return true;
    }
}
