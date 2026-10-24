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
    private android.webkit.GeolocationPermissions.Callback geoCb; // M-307
    private String geoOrigin;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try { ((android.app.NotificationManager) getSystemService(NOTIFICATION_SERVICE)).cancel(7714); } catch (Exception ignored) { } // M-212: the app is open, the 'tap to open' note is not needed

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
        // M-337 (battery): the screen no longer stays on all the time; the phone's own screen timeout applies.
        // Only calm mode keeps it on (NativeBridge.keepScreenOn from relax.js).

        // M-076: no bare permission pop-up at launch any more; the page shows a friendly
        // setup screen first (setup.js) and asks through MedTimeNative.requestNotifications().

        webView = new WebView(this);
        webView.setBackgroundColor(0x00000000); // M-364: see-through until the page paints, so the window's film frame shows at once (WebView default is white)
        setContentView(webView);
        getOnBackPressedDispatcher().addCallback(this, backCb);
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

        // M-140: quick web updates on the owner's test phone. The PC watcher may push changed page files (html/js/css)
        // to Android/data/com.medtime.app/files/web/ with base.txt = the versionCode they were made for.
        // They replace the built-in files only for that exact installed version; a new APK ignores them.
        webOverride = validWebOverride();
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public android.webkit.WebResourceResponse shouldInterceptRequest(WebView v, android.webkit.WebResourceRequest req) {
                android.webkit.WebResourceResponse r = fromOverride(req.getUrl().toString());
                return r != null ? r : super.shouldInterceptRequest(v, req);
            }
            @Override
            public void onPageFinished(WebView v, String url) {
                // M-364: the page now paints its own opening; free the window's launch picture
                v.postDelayed(() -> getWindow().setBackgroundDrawableResource(android.R.color.black), 1500);
            }
        });
        settings.setGeolocationEnabled(true); // M-307: nearby pharmacies
        webView.setWebChromeClient(new WebChromeClient() {
            // M-307: the page asks for the place (nearby pharmacies): Android asks the owner once, then the page gets it
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, android.webkit.GeolocationPermissions.Callback cb) {
                boolean has = androidx.core.content.ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == android.content.pm.PackageManager.PERMISSION_GRANTED
                        || androidx.core.content.ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION) == android.content.pm.PackageManager.PERMISSION_GRANTED;
                if (has) { cb.invoke(origin, true, false); return; }
                geoOrigin = origin; geoCb = cb;
                ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, 7307);
            }
        });

        // M-005: bridge so the page can book real Android alarms
        webView.addJavascriptInterface(new NativeBridge(this, webView), "MedTimeNative");

        // M-146: with a quick web update the page is built from the updated files (changed scripts / styles inlined)
        // on the same base address, so stored data stays; otherwise the built-in page as always
        loadPage();

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

    // M-359 (owner): back to the start as it was: no internet web updates (M-334) and no app-wide timer pause (M-337).
    // calm is still set by NativeBridge.keepScreenOn (calm mode keeps the screen on).
    static volatile boolean calm = false;

    private void loadPage() {
        String upd = webOverride != null ? overridePage() : null;
        if (upd != null) webView.loadDataWithBaseURL("file:///android_asset/index.html", upd, "text/html", "UTF-8", null);
        else webView.loadUrl("file:///android_asset/index.html");
    }

    // ---------- M-140: quick web updates (owner's test phone only) ----------
    private java.io.File webOverride;

    private java.io.File validWebOverride() {
        try {
            java.io.File dir = getExternalFilesDir("web");
            if (dir == null) return null;
            java.io.File base = new java.io.File(dir, "base.txt");
            if (!base.exists()) return null;
            String want;
            try (java.io.BufferedReader br = new java.io.BufferedReader(new java.io.FileReader(base))) { want = String.valueOf(br.readLine()).trim(); }
            long vc = Build.VERSION.SDK_INT >= 28 ? getPackageManager().getPackageInfo(getPackageName(), 0).getLongVersionCode()
                    : getPackageManager().getPackageInfo(getPackageName(), 0).versionCode;
            return want.equals(String.valueOf(vc)) ? dir : null;
        } catch (Exception e) { return null; }
    }

    private static String readAll(java.io.InputStream in) throws java.io.IOException {
        try (java.io.InputStream i = in) {
            java.io.ByteArrayOutputStream o = new java.io.ByteArrayOutputStream();
            byte[] b = new byte[65536]; int n;
            while ((n = i.read(b)) > 0) o.write(b, 0, n);
            return o.toString("UTF-8");
        }
    }

    /** M-146: updated index.html; every script / stylesheet that differs from the built-in one is put inline. */
    private String overridePage() {
        try {
            java.io.File idx = new java.io.File(webOverride, "index.html");
            if (!idx.isFile()) return null;
            String html = readAll(new java.io.FileInputStream(idx));
            java.util.regex.Matcher m = java.util.regex.Pattern.compile(
                    "<script src=\"([^\"]+)\"></script>|<link rel=\"stylesheet\" href=\"([^\"]+)\">").matcher(html);
            StringBuffer sb = new StringBuffer();
            int changed = 0;
            while (m.find()) {
                boolean js = m.group(1) != null;
                String path = js ? m.group(1) : m.group(2);
                String rep = m.group(0);
                java.io.File f = new java.io.File(webOverride, path);
                if (!path.contains("..") && f.isFile()) {
                    String mine = readAll(new java.io.FileInputStream(f));
                    String built = "";
                    try { built = readAll(getAssets().open(path)); } catch (Exception ignored) { }
                    if (!mine.equals(built)) {
                        rep = js ? "<script>" + mine.replace("</script", "<\\/script") + "\n</script>" : "<style>" + mine.replace("</style", "<\\/style") + "\n</style>";
                        changed++;
                    }
                }
                m.appendReplacement(sb, java.util.regex.Matcher.quoteReplacement(rep));
            }
            m.appendTail(sb);
            android.util.Log.i("MedTimeWeb", "quick web update in use, inlined files: " + changed);
            return sb.toString();
        } catch (Exception e) {
            android.util.Log.w("MedTimeWeb", "quick web update failed: " + e);
            return null;
        }
    }

    private android.webkit.WebResourceResponse fromOverride(String url) {
        final String pre = "file:///android_asset/";
        if (webOverride == null || url == null || !url.startsWith(pre)) return null;
        String path = url.substring(pre.length());
        int q = path.indexOf('?'); if (q >= 0) path = path.substring(0, q);
        int h = path.indexOf('#'); if (h >= 0) path = path.substring(0, h);
        if (path.contains("..")) return null;
        String mime = path.endsWith(".html") ? "text/html" : path.endsWith(".js") ? "application/javascript"
                : path.endsWith(".css") ? "text/css" : path.endsWith(".json") ? "application/json" : null;
        if (mime == null) return null;
        java.io.File f = new java.io.File(webOverride, path);
        if (!f.isFile()) return null;
        try { return new android.webkit.WebResourceResponse(mime, "UTF-8", new java.io.FileInputStream(f)); }
        catch (Exception e) { return null; }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) FullScreen.apply(this); // M-012: hide the bars again after a swipe
    }

    // M-323 (battery): when the app goes to the background the page stops its animations and work
    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) webView.onPause();
    }

    // M-076: tell the page when we come back from an Android permission screen
    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume(); // M-323: the page runs again
        NativeBridge.stopWatch(); // M-095
        Piper.ensure(this); // M-087: offline voices download once by themselves (Wi-Fi only)
        if (webView != null) webView.evaluateJavascript("window.mtResumed && mtResumed()", null);
    }

    // M-080: backup file chosen in the picker -> the page restores it
    static final int REQ_RESTORE = 77;
    static final int REQ_CONTACT = 78; // M-100
    static final int REQ_PHOTO = 79; // M-148

    // ---------- M-148: photo of a medicine: camera or gallery ----------
    private String photoFor;
    private java.io.File camFile;

    void pickPhoto(String name) {
        photoFor = name;
        try {
            java.io.File d = new java.io.File(getCacheDir(), "photos");
            if (!d.exists()) d.mkdirs();
            camFile = new java.io.File(d, "cam.jpg");
            if (camFile.exists()) camFile.delete();
            android.net.Uri out = androidx.core.content.FileProvider.getUriForFile(this, getPackageName() + ".updates", camFile);
            android.content.Intent cam = new android.content.Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
            cam.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, out);
            cam.addFlags(android.content.Intent.FLAG_GRANT_WRITE_URI_PERMISSION | android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);
            cam.setClipData(android.content.ClipData.newRawUri("", out));
            android.content.Intent gal = new android.content.Intent(android.content.Intent.ACTION_GET_CONTENT);
            gal.setType("image/*");
            gal.addCategory(android.content.Intent.CATEGORY_OPENABLE);
            android.content.Intent chooser = android.content.Intent.createChooser(gal, "📷");
            chooser.putExtra(android.content.Intent.EXTRA_INITIAL_INTENTS, new android.content.Intent[]{cam});
            startActivityForResult(chooser, REQ_PHOTO);
        } catch (Exception e) {
            webView.evaluateJavascript("window.mtPhotoDone && mtPhotoDone(false)", null);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, android.content.Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_PHOTO) { // M-148
            boolean ok = false;
            if (resultCode == RESULT_OK && photoFor != null) {
                android.net.Uri u = data != null && data.getData() != null ? data.getData()
                        : (camFile != null && camFile.length() > 0 ? android.net.Uri.fromFile(camFile) : null);
                ok = Photos.save(this, photoFor, u);
            }
            if (camFile != null) camFile.delete();
            webView.evaluateJavascript("window.mtPhotoDone && mtPhotoDone(" + ok + ")", null);
            return;
        }
        if (requestCode == REQ_CONTACT) { // M-100
            if (resultCode != RESULT_OK || data == null || data.getData() == null) return;
            try (android.database.Cursor c = getContentResolver().query(data.getData(), new String[]{
                    android.provider.ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
                    android.provider.ContactsContract.CommonDataKinds.Phone.NUMBER}, null, null, null)) {
                if (c != null && c.moveToFirst())
                    webView.evaluateJavascript("window.mtContact && mtContact(" + org.json.JSONObject.quote(c.getString(0) == null ? "" : c.getString(0))
                            + "," + org.json.JSONObject.quote(c.getString(1) == null ? "" : c.getString(1)) + ")", null);
            } catch (Exception ignored) { }
            return;
        }
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
        if (requestCode == 7307 && geoCb != null) { // M-307
            boolean ok = false; for (int g : grantResults) ok |= g == android.content.pm.PackageManager.PERMISSION_GRANTED;
            geoCb.invoke(geoOrigin, ok, false); geoCb = null; return;
        }
        if (webView != null) webView.evaluateJavascript("window.mtResumed && mtResumed()", null);
    }

    // Target API 36: Android no longer calls onBackPressed(); the back gesture goes through this callback
    private final androidx.activity.OnBackPressedCallback backCb = new androidx.activity.OnBackPressedCallback(true) {
        @Override
        public void handleOnBackPressed() {
            if (webView != null && webView.canGoBack()) { webView.goBack(); return; }
            setEnabled(false);
            getOnBackPressedDispatcher().onBackPressed();
            setEnabled(true);
        }
    };
}
