# M-368 (app diet): code shrinking is on. Keep everything the page, Android and the voice engine reach by name.
# The app's own classes: small, and the web page calls them through @JavascriptInterface.
-keep class com.medtime.app.** { *; }
# Offline voice engine (sherpa-onnx): the native library reads these classes and fields by name.
-keep class com.k2fsa.** { *; }
-keepclassmembers class * { @android.webkit.JavascriptInterface <methods>; }
-keepattributes *Annotation*,JavascriptInterface,Signature,InnerClasses,EnclosingMethod
-dontwarn **
