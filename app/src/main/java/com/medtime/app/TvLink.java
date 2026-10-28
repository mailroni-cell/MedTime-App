// MedTime · M-385 · 2026-10-28
// Signed: Claude · project "NOVA" · thread "להמשיך את SUPER NOVA אחרי פרסום 147" (Roni: an answer on the phone closes the TV window).
// What: when a reminder is answered on the phone (taken / skipped), tell the linked SUPER NOVA TV at once
//       (functions/api/tv.js op "ans"), even when the app's screen is closed. Only the random phone key is kept here.
package com.medtime.app;

import android.content.Context;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

class TvLink {
    private static final String PREFS = "medtime_tv";
    private static final String API = "https://medtime.pages.dev/api/tv";

    /** The phone key of the TV link ("" = not linked); the 📺 tile sets it. */
    static void setKey(Context ctx, String key) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString("key", key == null ? "" : key).apply();
    }

    static void answered(Context ctx, int id, String day) {
        final String key = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString("key", "");
        if (key == null || key.isEmpty()) return;
        new Thread(() -> {
            HttpURLConnection c = null;
            try {
                byte[] body = new JSONObject().put("op", "ans").put("key", key).put("id", id).put("d", day).toString().getBytes(StandardCharsets.UTF_8);
                c = (HttpURLConnection) new URL(API).openConnection();
                c.setConnectTimeout(8000); c.setReadTimeout(8000);
                c.setRequestMethod("POST"); c.setDoOutput(true);
                c.setRequestProperty("Content-Type", "text/plain");
                try (OutputStream o = c.getOutputStream()) { o.write(body); }
                c.getResponseCode();
            } catch (Exception ignored) {
            } finally { if (c != null) c.disconnect(); }
        }).start();
    }
}
