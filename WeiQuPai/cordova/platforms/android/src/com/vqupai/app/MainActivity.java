/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.vqupai.app;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.telephony.TelephonyManager;
import android.util.Log;
import com.baidu.android.pushservice.PushConstants;
import com.baidu.android.pushservice.PushManager;
import org.apache.cordova.Config;
import org.apache.cordova.CordovaActivity;
import org.apache.cordova.CordovaPlugin;

public class MainActivity extends CordovaActivity 
{
    public static MainActivity instance;

    //获取插件的实例
    public CordovaPlugin getPlugin(String plugin){
        return this.appView.pluginManager.getPlugin(plugin);
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        Log.d("MainActivity", "create");
        //保存mainActivity的实例
        instance = this;

        super.onCreate(savedInstanceState);
        super.init();
        // 以apikey的方式登录，一般放在主Activity的onCreate中
        PushManager.startWork(getApplicationContext(),
                PushConstants.LOGIN_TYPE_API_KEY,
                Utils.getMetaValue(MainActivity.this, "api_key"));

        //保存device_token
        String sn = ((TelephonyManager) getSystemService(TELEPHONY_SERVICE)).getDeviceId();
        SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(this);
        SharedPreferences.Editor editor = sp.edit();
        editor.putString("device_token", sn);
        editor.commit();

        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public void onStart() {
        super.onStart();
    }

    @Override
    public void onStop() {
        super.onStop();
    }

    public void onNewIntent(Intent intent){
       super.onNewIntent(intent);
    }
}

