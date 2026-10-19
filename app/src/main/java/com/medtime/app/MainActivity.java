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

        // M-076: no bare permission pop-up at launch any more; the page shows a friendly
        // setup screen first (setup.js) and asks through MedTimeNative.requestNotifications().

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

    // M-076: tell the page when we come back from an Android permission screen
    @Override
    protected void onResume() {
        super.onResume();
        NativeBridge.stopWatch(); // M-095
        Piper.ensure(this); // M-087: offline voices download once by themselves (Wi-Fi only)
        if (webView != null) webView.evaluateJavascript("window.mtResumed && mtResumed()", null);
    }

    // M-080: backup file chosen in the picker -> the page restores it
    static final int REQ_RESTORE = 77;

    @Override
    protected void onActivityResult(int requestCode, int resultCode, android.content.Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQ_RESTORE || resultCode != RESULT_OK || data == null || data.getData() == null) return;
        try (java.io.InputStream in = getContentResolver().openInputStream(data.getData())) {
            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            byte[] buf = new byte[16384]; int n; long total = 0;
            while ((n = in.read(buf)) > 0) { out.write(buf, 0, n); total += n; if (total > 5_000_000) throw new Exception("big"); }
            String text = out.toString("UTF-8");
            webView.evaluateJavascript("window.mtRestore && mtRestore(" + org.json.JSONObject.quote(text) + ")", null);
        } catch (Exception e) {
            webView.evaluateJavascript("window.mtRestore && mtRestore(null)", null);
        }
    }

    // M-076: answered (or skipped by Android without showing anything): same as coming back
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (webView != null) webView.evaluateJavascript("window.mtResumed && mtResumed()", null);
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
