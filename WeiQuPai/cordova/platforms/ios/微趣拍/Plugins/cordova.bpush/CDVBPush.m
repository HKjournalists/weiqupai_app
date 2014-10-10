//
//  CDVBPush.m
//  cordova-plugin-bpush
//
//  Created by icesyc on 04/04/13.
//

#import "CDVBPush.h"

@implementation CDVBPush

#pragma mark "API"

- (void)bindChannel:(CDVInvokedUrlCommand *)command
{
    // save the callback id
    self.currentCallbackId = command.callbackId;
    [BPush bindChannel];
}

- (void)unbindChannel:(CDVInvokedUrlCommand *)command
{
    self.currentCallbackId = command.callbackId;
    [BPush unbindChannel];
}

#pragma mark "BPushDelegate"

- (void) onMethod:(NSString *)method response:(NSDictionary *)data
{
    CDVPluginResult *result = nil;
    int returnCode = [[data valueForKey:BPushRequestErrorCodeKey] intValue];
    if (returnCode == BPushErrorCode_Success) {
        if([method isEqual: BPushRequestMethod_Bind]){
            self.appId = [data valueForKey:BPushRequestAppIdKey];
            self.userId = [data valueForKey:BPushRequestUserIdKey];
            self.channelId = [data valueForKey:BPushRequestChannelIdKey];
            NSDictionary *res = @{
                @"appId" : self.appId,
                @"userId" : self.userId,
                @"channelId" : self.channelId,
                @"deviceToken" : self.deviceToken
            };
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:res];
        }else{
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        }
        [self success:result callbackId:self.currentCallbackId];
    }else{
        NSString *msg;
        switch(returnCode)
        {
            case BPushErrorCode_MethodTooOften:
                msg = @"调用过于频繁";
            break;
            case BPushErrorCode_InternalError:
                msg = @"服务器内部错误";
            break;
            case BPushErrorCode_MethodNodAllowed:
                msg = @"请求方法不允许";
            break;
            case BPushErrorCode_ParamsNotValid:
                msg = @"请求参数错误";
            break;
            case BPushErrorCode_AuthenFailed:
                msg = @"权限验证失败";
            break;
            case BPushErrorCode_DataNotFound:
                msg = @"请求数据不存在";
            break;
            case BPushErrorCode_RequestExpired:
                msg = @"请求时间戳验证超时";
            break;
            case BPushErrorCode_BindNotExists:
                msg = @"绑定关系不存在";
            break;
        }
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:msg];
        [self error:result callbackId:self.currentCallbackId];
    }
    self.currentCallbackId = nil;
}

//init method
- (void) setup:(NSDictionary *)launchOptions
{
    UIApplication *app = [UIApplication sharedApplication];
    [BPush setupChannel:launchOptions]; // 必须
    [BPush setDelegate: self];
    
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
        UIUserNotificationType myTypes = UIRemoteNotificationTypeBadge |
        UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound;
        UIUserNotificationSettings *settings =
        [UIUserNotificationSettings settingsForTypes:myTypes categories:nil];
        [app registerUserNotificationSettings:settings];
    }else{
        [app registerForRemoteNotificationTypes:
         UIRemoteNotificationTypeAlert
         | UIRemoteNotificationTypeBadge
         | UIRemoteNotificationTypeSound];
    }
}

//receive notification
- (void) handleNotification:(NSDictionary *)userInfo
{
    UIApplication *app = [UIApplication sharedApplication];
    NSString *alert = [[userInfo objectForKey:@"aps"] objectForKey:@"alert"];
    if (app.applicationState == UIApplicationStateActive) {
        UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"微趣拍新通知"
            message:[NSString stringWithFormat:@"%@", alert]
            delegate:app.delegate
            cancelButtonTitle:@"OK"
            otherButtonTitles:nil];
        [alertView show];
    }
    [app setApplicationIconBadgeNumber:0];
    [BPush handleNotification:userInfo];
}

- (void) registerDeviceToken:(NSData *)deviceToken
{
    self.deviceToken = [[[[deviceToken description]
                      stringByReplacingOccurrencesOfString:@"<" withString:@""]
                     stringByReplacingOccurrencesOfString:@">" withString:@""]
                    stringByReplacingOccurrencesOfString:@" " withString:@""];
    [BPush registerDeviceToken: deviceToken];
}

@end
