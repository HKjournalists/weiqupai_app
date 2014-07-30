//
//  NSLogger.h
//  SnapShot
//
//  Created by Timothy Pfafman on 1/5/14.
//
//

#import <UIKit/UIKit.h>
#import <Cordova/CDVPlugin.h>


@interface NSLogger : CDVPlugin
{}

- (void)log:(CDVInvokedUrlCommand*)command;

@end
