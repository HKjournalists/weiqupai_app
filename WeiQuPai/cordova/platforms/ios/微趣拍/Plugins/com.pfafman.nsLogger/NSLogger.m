//
//  NSLogger.m
//  SnapShot
//
//  Created by Timothy Pfafman on 1/5/14.
//
//

#import <Cordova/CDV.h>
#import "NSLogger.h"

@implementation NSLogger

- (void)log:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* message = [command.arguments objectAtIndex:0];
    
    NSLog(@"Phonegap: %@", message);
    
    if (message != nil && [message length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:message];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
