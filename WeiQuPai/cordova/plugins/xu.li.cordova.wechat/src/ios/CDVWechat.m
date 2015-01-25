//
//  CDVWechat.m
//  cordova-plugin-wechat
//
//  Created by xu.li on 12/23/13.
//
//

#import "CDVWechat.h"
//#import "AFHTTPRequestOperationManager.h"

@implementation CDVWechat

#pragma mark "API"

- (void)share:(CDVInvokedUrlCommand *)command
{
    [WXApi registerApp:self.wechatAppId];

    CDVPluginResult *result = nil;
    // if not installed
    if (![WXApi isWXAppInstalled])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"未安装微信"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return ;
    }

    // check arguments
    NSDictionary *params = [command.arguments objectAtIndex:0];
    if (!params)
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"参数错误"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return ;
    }
    
    // save the callback id
    self.currentCallbackId = command.callbackId;
    
    SendMessageToWXReq* req = [[SendMessageToWXReq alloc] init];
    
    // check the scene
    if ([params objectForKey:@"scene"])
    {
        req.scene = [[params objectForKey:@"scene"] integerValue];
    }
    else
    {
        req.scene = WXSceneTimeline;
    }
    
    // message or text?
    NSDictionary *message = [params objectForKey:@"message"];

    if (message)
    {
        req.bText = NO;

        // async
        [self.commandDelegate runInBackground:^{
            req.message = [self buildSharingMessage:message];
            
            [WXApi sendReq:req];
        }];
    }
    else
    {
        req.bText = YES;
        req.text = [params objectForKey:@"text"];
        
        [WXApi sendReq:req];
    }
}

- (void)login:(CDVInvokedUrlCommand *)command{
    [WXApi registerApp:self.wechatAppId];
    
    CDVPluginResult *result = nil;
    // if not installed
    if (![WXApi isWXAppInstalled])
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"未安装微信"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return ;
    }
    
    // save the callback id
    self.currentCallbackId = command.callbackId;
    
    SendAuthReq* req = [[SendAuthReq alloc ] init];
    req.scope = @"snsapi_userinfo";
    req.state = @"cdvwechat";
    [WXApi sendReq: req];
}

#pragma mark "WXApiDelegate"

- (void)onResp:(BaseResp *)resp
{
    CDVPluginResult *result = nil;
    
    BOOL success = NO;
    switch (resp.errCode)
    {
        case WXSuccess:
            if([resp isKindOfClass:[SendAuthResp class]]){
                SendAuthResp *rsp = (SendAuthResp *) resp;
                NSDictionary *data = @{
                                       @"code": rsp.code ?: @"",
                                       @"lang": rsp.lang ?: @"",
                                       @"country": rsp.country ?: @""
                                       };
                NSLog(@"wechat login: %@", data);
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:data];
            }else {
                result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            }
            success = YES;
        break;
        
        case WXErrCodeCommon:
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"普通错误类型"];
        break;
        
        case WXErrCodeUserCancel:
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"用户点击取消并返回"];
        break;
        
        case WXErrCodeSentFail:
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"发送失败"];
        break;
        
        case WXErrCodeAuthDeny:
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"授权失败"];
        break;
        
        case WXErrCodeUnsupport:
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"微信不支持"];
        break;
    }
    
    if (!result)
    {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Unknown"];
    }
    
    [self.commandDelegate sendPluginResult:result callbackId:self.currentCallbackId];
    self.currentCallbackId = nil;
}

#pragma mark "CDVPlugin Overrides"

- (void)handleOpenURL:(NSNotification *)notification
{
    NSURL* url = [notification object];
    
    if ([url isKindOfClass:[NSURL class]] && [url.scheme isEqualToString:self.wechatAppId])
    {
        [WXApi handleOpenURL:url delegate:self];
    }
}

#pragma mark "Private methods"

- (NSString *)wechatAppId
{
    if (!_wechatAppId)
    {
        CDVViewController *viewController = (CDVViewController *)self.viewController;
        _wechatAppId = [viewController.settings objectForKey:@"wechatappid"];
    }
    
    return _wechatAppId;
}

- (WXMediaMessage *)buildSharingMessage:(NSDictionary *)message
{
    WXMediaMessage *wxMediaMessage = [WXMediaMessage message];
    wxMediaMessage.title = [message objectForKey:@"title"];
    wxMediaMessage.description = [message objectForKey:@"description"];
    wxMediaMessage.mediaTagName = [message objectForKey:@"mediaTagName"];
    [wxMediaMessage setThumbImage:[self getUIImageFromURL:[message objectForKey:@"thumb"]]];
    
    // media parameters
    id mediaObject = nil;
    NSDictionary *media = [message objectForKey:@"media"];
    
    // check types
    NSInteger type = [[media objectForKey:@"type"] integerValue];
    switch (type)
    {
        case CDVWXSharingTypeApp:
        break;
    
        case CDVWXSharingTypeEmotion:
        break;
        
        case CDVWXSharingTypeFile:
        break;
        
        case CDVWXSharingTypeImage:
        break;
        
        case CDVWXSharingTypeMusic:
        break;
        
        case CDVWXSharingTypeVideo:
        break;
        
        case CDVWXSharingTypeWebPage:
        default:
        mediaObject = [WXWebpageObject object];
        ((WXWebpageObject *)mediaObject).webpageUrl = [media objectForKey:@"webpageUrl"];
    }

    wxMediaMessage.mediaObject = mediaObject;
    return wxMediaMessage;
}

- (UIImage *)getUIImageFromURL:(NSString *)thumb
{
    NSURL *thumbUrl = [NSURL URLWithString:thumb];
    NSData *data = nil;
    
    if ([thumbUrl isFileURL])
    {
        // local file
        data = [NSData dataWithContentsOfFile:thumb];
    }
    else
    {
        data = [NSData dataWithContentsOfURL:thumbUrl];
    }

    UIImage *img = [UIImage imageWithData:data];
    return [self resizeImage:img withMaxDimension:150];
}

//调整图片大小
-(UIImage *)resizeImage:(UIImage *)image
        withMaxDimension:(CGFloat)maxDimension
{
    if (fmax(image.size.width, image.size.height) <= maxDimension) {
        return image;
    }

    CGFloat aspect = image.size.width / image.size.height;
    CGSize newSize;

    if (image.size.width > image.size.height) {
        newSize = CGSizeMake(maxDimension, maxDimension / aspect);
    } else {
        newSize = CGSizeMake(maxDimension * aspect, maxDimension);
    }

    UIGraphicsBeginImageContextWithOptions(newSize, NO, 1.0);
    CGRect newImageRect = CGRectMake(0.0, 0.0, newSize.width, newSize.height);
    [image drawInRect:newImageRect];
    UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    return newImage;
}

/*
- (void)getUserInfo: (NSString * ) code{
    UIView *mask = [self maskView];
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    NSString *apiUrl = @"https://api.weixin.qq.com/sns/oauth2/";
    NSDictionary *param = @{
                            @"grant_type" : @"authorization_code",
                            @"appid" : @"wxc0d1e67c6159b69e",
                            @"secret" : @"042f13bf72e04ec111f6b249fec3c595",
                            @"code" : code
                            };
    manager.responseSerializer = [AFJSONRequestSerializer]
    [manager GET:[NSString stringWithFormat:@"%@%@", apiUrl, @"access_token"] parameters:param
    success:^(AFHTTPRequestOperation *operation, id responseObject){
        NSLog(@"%@", responseObject);
        NSDictionary *res = (NSDictionary *)responseObject;
        NSString *url = @"https://api.weixin.qq.com/sns/userinfo";
        NSDictionary *param = @{
                  @"openid" : [res objectForKey:@"openid"],
                  @"access_token" : [res objectForKey:@"access_token"]
                  };
        [manager GET:url parameters:param
        success:^(AFHTTPRequestOperation *operation, id responseObject){
            [mask removeFromSuperview];
            NSLog(@"%@", responseObject);
        }
        failure:^(AFHTTPRequestOperation *operation, NSError *error) {
            NSLog(@"Error: %@", error);
        }];
    }
    failure:^(AFHTTPRequestOperation *operation, NSError *error) {
         NSLog(@"Error: %@", error);
    }];
}

- (UIView *)maskView {
    CGRect screen = [UIScreen mainScreen].bounds;
    UIView *mask = [[UIView alloc] initWithFrame:screen];
    mask.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.4];
    UIActivityIndicatorView *indicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhite];
    indicator.center = CGPointMake(screen.size.width / 2, screen.size.height / 2);
    [indicator startAnimating];
    [mask addSubview:indicator];
    [self.viewController.view addSubview:mask];
    return mask;
}
 */
@end
