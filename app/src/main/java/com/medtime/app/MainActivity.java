package com.medtime.app;

import android.annotation.SuppressLint;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import android.Manifest;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // M-004: turn the screen on and show the app above the lock screen (like an alarm clock),
        // and ask Android to remove a swipe-only lock. A PIN / fingerprint lock stays (security).
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
            android.app.KeyguardManager km = (android.app.KeyguardManager) getSystemService(KEYGUARD_SERVICE);
            if (km != null) km.requestDismissKeyguard(this, null);
        } else {
            getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                    | android.view.WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                    | android.view.WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);
        }
        getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.POST_NOTIFICATIONS}, 101);
        }

        webView = new WebView(this);
        setContentView(webView);
        FullScreen.apply(this); // M-012

        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        // M-066: the phone's system font size made the page text bigger than the layout expects and pushed buttons off the screen;
        // the app has its own text size setting (A / A / A) and low-vision mode instead.
        settings.setTextZoom(100);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        // M-005: bridge so the page can book real Android alarms
        webView.addJavascriptInterface(new NativeBridge(this, webView), "MedTimeNative");

        webView.loadUrl("file:///android_asset/index.html");

        // M-034: in full screen Android does not shrink the page for the keyboard, so the keyboard
        // covered the rest of the form. Measure the keyboard and tell the page, which makes room and scrolls.
        webView.getViewTreeObserver().addOnGlobalLayoutListener(() -> {
            android.graphics.Rect r = new android.graphics.Rect();
            webView.getWindowVisibleDisplayFrame(r);
            int[] loc = new int[2];
            webView.getLocationOnScreen(loc);
            int covered = loc[1] + webView.getHeight() - r.bottom;
            float d = getResources().getDisplayMetrics().density;
            int kb = covered > 120 * d ? Math.round(covered / d) : 0;
            if (kb != lastKb) {
                lastKb = kb;
                webView.evaluateJavascript("window.mtKeyboard && mtKeyboard(" + kb + ")", null);
            }
        });
    }

    private int lastKb = -1;

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) FullScreen.apply(this); // M-012: hide the bars again after a swipe
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
