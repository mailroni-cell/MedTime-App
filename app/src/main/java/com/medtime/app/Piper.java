package com.medtime.app;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioTrack;
import android.net.ConnectivityManager;
import android.os.Build;

import com.k2fsa.sherpa.onnx.GeneratedAudio;
import com.k2fsa.sherpa.onnx.OfflineTts;
import com.k2fsa.sherpa.onnx.OfflineTtsConfig;
import com.k2fsa.sherpa.onnx.OfflineTtsModelConfig;
import com.k2fsa.sherpa.onnx.OfflineTtsVitsModelConfig;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * M-087: offline Piper voices (sherpa-onnx). The packs are downloaded by the app itself, once,
 * on Wi-Fi, from the release "voices" (see tools/voices.txt). After that they work with no internet.
 * Voice name format used everywhere: "piper:<pack>:<speaker>".
 */
class Piper {
    static final String BASE = "https://github.com/mailroni-cell/MedTime-App/releases/download/voices/";

    /** One voice = pack + speaker, its language, a friendly name and m / f. */
    static final String[][] VOICES = {
            // name, lang, pack, speaker, label, gender
            {"piper:ar_kareem:0", "ar", "ar_kareem", "0", "كريم", "m"},
            {"piper:ro_mihai:0", "ro", "ro_mihai", "0", "Mihai", "m"},
            {"piper:fr_upmc:0", "fr", "fr_upmc", "0", "Jessica", "f"},
            {"piper:fr_upmc:1", "fr", "fr_upmc", "1", "Pierre", "m"},
            {"piper:en_amy:0", "en", "en_amy", "0", "Amy", "f"},
            {"piper:en_ryan:0", "en", "en_ryan", "0", "Ryan", "m"},
    };
    static final String[] PACKS = {"espeak", "ar_kareem", "ro_mihai", "fr_upmc", "en_amy", "en_ryan"};

    private static volatile boolean downloading = false;
    private static volatile String current = "";
    private static volatile int pct = 0;
    private static OfflineTts engine;
    private static String enginePack = "";
    private static AudioTrack track;
    private static final Object LOCK = new Object();

    static boolean isPiper(String name) { return name != null && name.startsWith("piper:"); }

    static File root(Context c) { return new File(c.getFilesDir(), "piper"); }

    static boolean packReady(Context c, String pack) { return new File(new File(root(c), pack), ".ok").exists(); }

    static String[] voice(String name) {
        for (String[] v : VOICES) if (v[0].equals(name)) return v;
        return null;
    }

    /** True when this voice can speak now (pack and pronunciation data on the phone, 64-bit phone). */
    static boolean ready(Context c, String name) {
        String[] v = voice(name);
        return v != null && supported() && packReady(c, "espeak") && packReady(c, v[2]);
    }

    static boolean supported() {
        for (String abi : Build.SUPPORTED_ABIS) if ("arm64-v8a".equals(abi)) return true;
        return false;
    }

    /** First ready Piper voice of a language (used when the phone itself has no voice for it). */
    static String firstReady(Context c, String lang) {
        for (String[] v : VOICES) if (v[1].equals(lang) && ready(c, v[0])) return v[0];
        return null;
    }

    /** Voices of one language for the voice list in settings. */
    static JSONArray list(Context c, String lang) {
        JSONArray arr = new JSONArray();
        try {
            if (!supported()) return arr;
            for (String[] v : VOICES) {
                if (!v[1].equals(lang)) continue;
                boolean ok = ready(c, v[0]);
                arr.put(new JSONObject().put("name", v[0]).put("piper", true).put("label", v[4]).put("g", v[5])
                        .put("local", true).put("installed", ok).put("ready", ok)
                        .put("pct", ok ? 100 : (current.equals(v[2]) ? pct : 0)));
            }
        } catch (Exception ignored) { }
        return arr;
    }

    // ---------------- download once, on Wi-Fi ----------------
    static void ensure(Context ctx) {
        final Context c = ctx.getApplicationContext();
        if (!supported() || downloading) return;
        boolean all = true;
        for (String p : PACKS) if (!packReady(c, p)) { all = false; break; }
        if (all) return;
        try {
            ConnectivityManager cm = (ConnectivityManager) c.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm == null || cm.getActiveNetworkInfo() == null || !cm.getActiveNetworkInfo().isConnected()) return;
            if (cm.isActiveNetworkMetered()) return; // wait for Wi-Fi, do not use the data plan
        } catch (Exception e) { return; }
        downloading = true;
        new Thread(() -> {
            try {
                for (String p : PACKS) {
                    if (packReady(c, p)) continue;
                    current = p; pct = 0;
                    if (!fetch(c, p)) break;
                }
            } finally { downloading = false; current = ""; }
        }, "piper-download").start();
    }

    private static boolean fetch(Context c, String pack) {
        File zip = new File(c.getCacheDir(), pack + ".zip");
        File tmp = new File(root(c), pack + ".tmp"), dst = new File(root(c), pack);
        try {
            HttpURLConnection con = (HttpURLConnection) new URL(BASE + pack + ".zip").openConnection();
            con.setInstanceFollowRedirects(true);
            con.setConnectTimeout(20000); con.setReadTimeout(30000);
            if (con.getResponseCode() != 200) return false;
            long total = con.getContentLength(), got = 0;
            try (InputStream in = con.getInputStream(); OutputStream out = new FileOutputStream(zip)) {
                byte[] b = new byte[65536]; int n;
                while ((n = in.read(b)) > 0) { out.write(b, 0, n); got += n; if (total > 0) pct = (int) (got * 100 / total); }
            }
            del(tmp); tmp.mkdirs();
            String base = tmp.getCanonicalPath() + File.separator;
            try (ZipInputStream zin = new ZipInputStream(new java.io.FileInputStream(zip))) {
                ZipEntry e; byte[] b = new byte[65536];
                while ((e = zin.getNextEntry()) != null) {
                    File f = new File(tmp, e.getName());
                    if (!f.getCanonicalPath().startsWith(base)) continue; // stay inside the folder
                    if (e.isDirectory()) { f.mkdirs(); continue; }
                    f.getParentFile().mkdirs();
                    try (OutputStream out = new FileOutputStream(f)) { int n; while ((n = zin.read(b)) > 0) out.write(b, 0, n); }
                }
            }
            del(dst);
            if (!tmp.renameTo(dst)) return false;
            new File(dst, ".ok").createNewFile();
            return true;
        } catch (Exception e) {
            return false;
        } finally {
            zip.delete();
            if (tmp.exists()) del(tmp);
        }
    }

    private static void del(File f) {
        if (f == null || !f.exists()) return;
        File[] k = f.listFiles();
        if (k != null) for (File x : k) del(x);
        f.delete();
    }

    // ---------------- speaking ----------------
    private static OfflineTts engineFor(Context c, String pack) {
        if (engine != null && pack.equals(enginePack)) return engine;
        if (engine != null) { try { engine.free(); } catch (Throwable ignored) { } engine = null; enginePack = ""; }
        File dir = new File(root(c), pack);
        OfflineTtsVitsModelConfig vits = new OfflineTtsVitsModelConfig();
        vits.setModel(new File(dir, "model.onnx").getAbsolutePath());
        vits.setTokens(new File(dir, "tokens.txt").getAbsolutePath());
        vits.setDataDir(new File(new File(root(c), "espeak"), "espeak-ng-data").getAbsolutePath());
        OfflineTtsModelConfig mc = new OfflineTtsModelConfig();
        mc.setVits(vits);
        mc.setNumThreads(2);
        OfflineTtsConfig cfg = new OfflineTtsConfig();
        cfg.setModel(mc);
        engine = new OfflineTts(null, cfg);
        enginePack = pack;
        return engine;
    }

    /** Makes the sound for a sentence (slow and clear: speed 0.9). Null on any problem. */
    static GeneratedAudio make(Context c, String name, String text) {
        String[] v = voice(name);
        if (v == null || !ready(c, name)) return null;
        synchronized (LOCK) {
            try {
                return engineFor(c, v[2]).generate(text, Integer.parseInt(v[3]), 0.9f);
            } catch (Throwable t) {
                return null;
            }
        }
    }

    /** Plays the sound on the alarm volume and waits until it ends. */
    static void play(Context c, GeneratedAudio a) {
        if (a == null || a.getSamples().length == 0) return;
        float[] s = a.getSamples();
        short[] pcm = new short[s.length];
        for (int i = 0; i < s.length; i++) pcm[i] = (short) (Math.max(-1f, Math.min(1f, s[i])) * 32767);
        stop();
        AudioTrack t = new AudioTrack.Builder()
                .setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build())
                .setAudioFormat(new AudioFormat.Builder().setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(a.getSampleRate()).setChannelMask(AudioFormat.CHANNEL_OUT_MONO).build())
                .setBufferSizeInBytes(pcm.length * 2)
                .setTransferMode(AudioTrack.MODE_STATIC)
                .build();
        track = t;
        t.write(pcm, 0, pcm.length);
        t.setVolume(Sounds.voiceVolume(c));
        t.play();
        long ms = pcm.length * 1000L / a.getSampleRate() + 150;
        try { Thread.sleep(ms); } catch (InterruptedException ignored) { }
        if (track == t) stop();
    }

    static void stop() {
        AudioTrack t = track; track = null;
        if (t != null) { try { t.stop(); } catch (Exception ignored) { } try { t.release(); } catch (Exception ignored) { } }
    }

    /** Reminder: wait for the notification sound, then say the text twice. onFail runs if this voice cannot speak. */
    static void speakTwice(Context c, String name, String text, long delayMs, Runnable onDone, Runnable onFail) {
        new Thread(() -> {
            GeneratedAudio a = make(c, name, text);
            if (a == null) { onFail.run(); return; }
            try { Thread.sleep(delayMs); } catch (InterruptedException ignored) { }
            play(c, a);
            try { Thread.sleep(1500); } catch (InterruptedException ignored) { }
            play(c, a);
            onDone.run();
        }, "piper-speak").start();
    }

    /** Sample in settings. */
    static void preview(Context c, String name, String text) {
        new Thread(() -> play(c, make(c, name, text)), "piper-preview").start();
    }

    /** {ready:n, total:n, busy:bool, pct} for the settings screen. */
    static JSONObject status(Context c) {
        JSONObject o = new JSONObject();
        try {
            int r = 0;
            for (String p : PACKS) if (packReady(c, p)) r++;
            o.put("ready", r).put("total", PACKS.length).put("busy", downloading).put("pack", current).put("pct", pct).put("supported", supported());
        } catch (Exception ignored) { }
        return o;
    }
}
