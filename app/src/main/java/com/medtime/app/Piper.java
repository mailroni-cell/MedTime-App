package com.medtime.app;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioTrack;
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

/**
 * M-087/M-091/M-367: offline Piper voices (sherpa-onnx). Only the small pronunciation data (espeak) is inside
 * the APK. The voice packs download once, only for the app's language (ar/ro/fr/en), from the release "voices"
 * (see tools/voices.txt), then work with no internet. Hebrew and Russian use the phone voice only.
 * Voice name format used everywhere: "piper:<pack>:<speaker>".
 */
class Piper {

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
    private static volatile int pct = 0;
    static final String VOICES_URL = "https://github.com/mailroni-cell/MedTime-App/releases/download/voices/";
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
        if (v == null || !supported() || !hasPack(c, v[2]) || !engineReady(c)) return false;
        if (!packReady(c, "espeak")) copyEspeak(c); // first time: prepare now (takes a second)
        return packReady(c, "espeak");
    }

    static boolean supported() {
        // M-369: the app process itself must be 64-bit (the engine is arm64 only)
        if (Build.VERSION.SDK_INT >= 23 && !android.os.Process.is64Bit()) return false;
        for (String abi : Build.SUPPORTED_ABIS) if ("arm64-v8a".equals(abi)) return true;
        return false;
    }

    // ---------------- M-369: the voice engine (sherpa-onnx, ~8 MB) downloads with the first voice ----------------
    static final String[] LIBS = {"libonnxruntime.so", "libsherpa-onnx-jni.so"};
    private static volatile boolean libLoaded = false;

    static boolean engineInApk(Context c) {
        return new File(c.getApplicationInfo().nativeLibraryDir, "libsherpa-onnx-jni.so").exists();
    }

    static boolean engineReady(Context c) { return engineInApk(c) || packReady(c, "engine"); }

    /** Loads the engine once; false if it cannot (then the phone voice speaks). */
    static boolean loadEngine(Context c) {
        if (libLoaded) return true;
        synchronized (LIBS) {
            if (libLoaded) return true;
            try {
                if (engineInApk(c)) System.loadLibrary("sherpa-onnx-jni");
                else {
                    File d = new File(root(c), "engine");
                    for (String l : LIBS) System.load(new File(d, l).getAbsolutePath());
                }
                libLoaded = true;
            } catch (Throwable t) { libLoaded = false; }
            return libLoaded;
        }
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
                        .put("pct", ok ? 100 : pct));
            }
        } catch (Exception ignored) { }
        return arr;
    }

    // ---------------- M-091: voices are inside the APK (assets/piper); only the small pronunciation data is copied out once ----------------
    static boolean inApk(Context c, String pack) {
        try {
            String[] f = c.getAssets().list("piper/" + pack);
            return f != null && f.length > 0;
        } catch (Exception e) { return false; }
    }

    /** M-367: pack inside the APK (older builds) or downloaded to the phone. */
    static boolean hasPack(Context c, String pack) { return inApk(c, pack) || packReady(c, pack); }

    /** Packs the current app language needs that are not on the phone yet. */
    private static java.util.List<String> missing(Context c) {
        java.util.List<String> m = new java.util.ArrayList<>();
        String lang = Voices.norm(I18n.lang(c));
        for (String[] v : VOICES) if (v[1].equals(lang) && !m.contains(v[2]) && !hasPack(c, v[2])) m.add(v[2]);
        return m;
    }

    static void ensure(Context ctx) {
        final Context c = ctx.getApplicationContext();
        if (!supported() || downloading) return;
        final boolean esp = !packReady(c, "espeak") && inApk(c, "espeak");
        final java.util.List<String> need = missing(c);
        if (!need.isEmpty() && !engineReady(c)) need.add(0, "engine"); // M-369: the engine comes with the first voice
        if (!esp && need.isEmpty()) return;
        downloading = true;
        new Thread(() -> {
            try {
                if (esp) copyEspeak(c);
                for (int i = 0; i < need.size(); i++) download(c, need.get(i), i, need.size());
            } finally { downloading = false; pct = 0; }
        }, "piper-prepare").start();
    }

    /** M-367: downloads <pack>.zip (model.onnx + tokens.txt) once into files/piper/<pack>. */
    private static void download(Context c, String pack, int idx, int count) {
        File tmp = new File(root(c), pack + ".tmp"), dst = new File(root(c), pack);
        java.net.HttpURLConnection con = null;
        try {
            del(tmp); tmp.mkdirs();
            // M-369: the engine lives on the release "media"; voice packs on the release "voices"
            con = Updater.open("engine".equals(pack) ? Media.URL + "engine_arm64.zip" : VOICES_URL + pack + ".zip");
            long total = con.getContentLengthLong(), got = 0;
            try (java.util.zip.ZipInputStream z = new java.util.zip.ZipInputStream(new java.io.BufferedInputStream(con.getInputStream()))) {
                java.util.zip.ZipEntry e; byte[] b = new byte[65536];
                while ((e = z.getNextEntry()) != null) {
                    String n = new File(e.getName()).getName(); // flat: no folders, no ../
                    if (e.isDirectory() || n.isEmpty()) continue;
                    try (OutputStream out = new FileOutputStream(new File(tmp, n))) {
                        int r;
                        while ((r = z.read(b)) > 0) {
                            out.write(b, 0, r); got += r;
                            if (total > 0) pct = (int) Math.min(99, (idx * 100 + Math.min(100, got * 100 / (total * 13 / 10))) / count);
                        }
                    }
                }
            }
            String[] must = "engine".equals(pack) ? LIBS : new String[]{"model.onnx", "tokens.txt"};
            for (String m : must) if (!new File(tmp, m).exists()) return;
            if ("engine".equals(pack)) for (String m : must) new File(tmp, m).setReadOnly(); // Android 14: loaded code must be read-only
            del(dst);
            if (tmp.renameTo(dst)) new File(dst, ".ok").createNewFile();
        } catch (Exception ignored) {
        } finally {
            if (con != null) try { con.disconnect(); } catch (Exception ignored) { }
            if (tmp.exists()) del(tmp);
        }
    }

    private static synchronized void copyEspeak(Context c) {
        if (packReady(c, "espeak")) return;
        File tmp = new File(root(c), "espeak.tmp"), dst = new File(root(c), "espeak");
        try {
            del(tmp);
            copyDir(c, "piper/espeak", tmp);
            del(dst);
            if (tmp.renameTo(dst)) new File(dst, ".ok").createNewFile();
        } catch (Exception ignored) {
        } finally { if (tmp.exists()) del(tmp); }
    }

    private static void copyDir(Context c, String asset, File to) throws java.io.IOException {
        String[] kids = c.getAssets().list(asset);
        if (kids == null || kids.length == 0) {
            to.getParentFile().mkdirs();
            try (InputStream in = c.getAssets().open(asset); OutputStream out = new FileOutputStream(to)) {
                byte[] b = new byte[65536]; int n; while ((n = in.read(b)) > 0) out.write(b, 0, n);
            }
            return;
        }
        to.mkdirs();
        for (String k : kids) copyDir(c, asset + "/" + k, new File(to, k));
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
        if (!loadEngine(c)) throw new IllegalStateException("no engine");
        if (engine != null) { try { engine.free(); } catch (Throwable ignored) { } engine = null; enginePack = ""; }
        OfflineTtsVitsModelConfig vits = new OfflineTtsVitsModelConfig();
        boolean apk = inApk(c, pack);
        File dir = new File(root(c), pack);
        // inside the APK (older builds): read straight from the APK; downloaded (M-367): read from the phone's files
        vits.setModel(apk ? "piper/" + pack + "/model.onnx" : new File(dir, "model.onnx").getAbsolutePath());
        vits.setTokens(apk ? "piper/" + pack + "/tokens.txt" : new File(dir, "tokens.txt").getAbsolutePath());
        vits.setDataDir(new File(new File(root(c), "espeak"), "espeak-ng-data").getAbsolutePath());
        OfflineTtsModelConfig mc = new OfflineTtsModelConfig();
        mc.setVits(vits);
        mc.setNumThreads(2);
        OfflineTtsConfig cfg = new OfflineTtsConfig();
        cfg.setModel(mc);
        engine = new OfflineTts(apk ? c.getAssets() : null, cfg);
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
        // M-120: 0.3 s of silence first, so the audio output wakes up before the first word (it was cut off)
        int pad = a.getSampleRate() * 3 / 10;
        short[] pcm = new short[pad + s.length];
        for (int i = 0; i < s.length; i++) pcm[pad + i] = (short) (Math.max(-1f, Math.min(1f, s[i])) * 32767);
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
            o.put("busy", downloading).put("pct", pct).put("supported", supported());
        } catch (Exception ignored) { }
        return o;
    }
}
