Phonegap-Plugin for doing NSLog on iOS 
=======================================

This is a sample plugin for cordova (>= 3.5). This library has only one method that sends a string to NSLog on iOS devices.  I am also using this to test [Meteor-cordova](https://github.com/SpaceCapsule/Meteor-cordova)

## Supported platforms

- iOS


## Installing

To use this plugin, add this to your project using the PhoneGap CLI:
```
cordova plugin add https://github.com/pfafman/phonegap-nsLogger.git
```

## Using
```JavaScript   
NSLogger.log("message")
```

## Using in Meteor Cordova
```JavaScript   
cordova.call("NSLogger.log",["message"])
```







