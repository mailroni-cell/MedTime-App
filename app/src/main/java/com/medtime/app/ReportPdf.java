package com.medtime.app;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.graphics.pdf.PdfDocument;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextPaint;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;

/**
 * M-099: weekly medicine report as a clean A4 PDF (for the doctor or the family).
 * The page (more.js) sends the content as JSON; this only draws it.
 * {rtl, title, sub, stats:[[label, value, color]], meds:[[name, "5/7", pct]], medsHead, daysHead,
 *  days:[{h, rows:[[time, items, status, color]]}], foot}
 */
class ReportPdf {
    private static final int W = 595, H = 842, M = 40; // A4 in points, margin
    private final Context c;
    private final boolean rtl;
    private PdfDocument doc;
    private PdfDocument.Page page;
    private Canvas cv;
    private int y, pageNo;
    private final String foot;

    private ReportPdf(Context c, boolean rtl, String foot) { this.c = c; this.rtl = rtl; this.foot = foot; }

    static File make(Context c, String json, File out) throws Exception {
        JSONObject r = new JSONObject(json);
        ReportPdf p = new ReportPdf(c, r.optBoolean("rtl", true), r.optString("foot"));
        p.doc = new PdfDocument();
        p.newPage();
        p.header(r.optString("title"), r.optString("sub"));
        p.stats(r.optJSONArray("stats"));
        p.meds(r.optString("medsHead"), r.optJSONArray("meds"));
        p.days(r.optString("daysHead"), r.optJSONArray("days"));
        if (r.optJSONArray("vitals") != null && r.optJSONArray("vitals").length() > 0) p.days(r.optString("vitalsHead"), r.optJSONArray("vitals")); // M-149
        p.finishPage();
        try (FileOutputStream o = new FileOutputStream(out)) { p.doc.writeTo(o); }
        p.doc.close();
        return out;
    }

    private void newPage() {
        pageNo++;
        page = doc.startPage(new PdfDocument.PageInfo.Builder(W, H, pageNo).create());
        cv = page.getCanvas();
        y = M;
    }

    private void finishPage() {
        TextPaint tp = paint(9, Color.parseColor("#64748b"), false);
        draw(foot + "   ·   " + pageNo, tp, M, H - M + 12, W - 2 * M, Layout.Alignment.ALIGN_CENTER);
        doc.finishPage(page);
    }

    private void need(int h) { if (y + h > H - M - 10) { finishPage(); newPage(); } }

    private TextPaint paint(float size, int color, boolean bold) {
        TextPaint t = new TextPaint(Paint.ANTI_ALIAS_FLAG);
        t.setTextSize(size);
        t.setColor(color);
        t.setTypeface(Typeface.create(Typeface.DEFAULT, bold ? Typeface.BOLD : Typeface.NORMAL));
        return t;
    }

    /** Draws text in a box; returns its height. Alignment NORMAL = start side (right in Hebrew). */
    private int draw(String s, TextPaint tp, int x, int top, int w, Layout.Alignment a) {
        StaticLayout l = StaticLayout.Builder.obtain(s, 0, s.length(), tp, Math.max(10, w))
                .setAlignment(a).setTextDirection(rtl ? android.text.TextDirectionHeuristics.RTL : android.text.TextDirectionHeuristics.LTR)
                .build();
        cv.save();
        cv.translate(x, top);
        l.draw(cv);
        cv.restore();
        return l.getHeight();
    }

    private int height(String s, TextPaint tp, int w) {
        return StaticLayout.Builder.obtain(s, 0, s.length(), tp, Math.max(10, w)).build().getHeight();
    }

    private void header(String title, String sub) {
        Paint bg = new Paint(Paint.ANTI_ALIAS_FLAG);
        bg.setShader(new android.graphics.LinearGradient(0, 0, W, 0, Color.parseColor("#0e7490"), Color.parseColor("#4f46e5"), android.graphics.Shader.TileMode.CLAMP));
        cv.drawRoundRect(new RectF(M, y, W - M, y + 74), 16, 16, bg);
        draw("💊 " + title, paint(20, Color.WHITE, true), M + 16, y + 12, W - 2 * M - 32, Layout.Alignment.ALIGN_NORMAL);
        draw(sub, paint(11, Color.parseColor("#e0f2fe"), false), M + 16, y + 44, W - 2 * M - 32, Layout.Alignment.ALIGN_NORMAL);
        y += 90;
    }

    private void stats(JSONArray st) {
        if (st == null || st.length() == 0) return;
        int n = st.length(), gap = 10, w = (W - 2 * M - gap * (n - 1)) / n;
        for (int i = 0; i < n; i++) {
            JSONArray s = st.optJSONArray(i);
            int k = rtl ? n - 1 - i : i, x = M + k * (w + gap);
            Paint box = new Paint(Paint.ANTI_ALIAS_FLAG);
            box.setColor(Color.parseColor("#f1f5f9"));
            cv.drawRoundRect(new RectF(x, y, x + w, y + 62), 12, 12, box);
            int col = parse(s.optString(2), "#0f172a");
            draw(s.optString(1), paint(22, col, true), x, y + 8, w, Layout.Alignment.ALIGN_CENTER);
            draw(s.optString(0), paint(10, Color.parseColor("#475569"), false), x, y + 40, w, Layout.Alignment.ALIGN_CENTER);
        }
        y += 80;
    }

    private void sectionTitle(String h) {
        need(40);
        draw(h, paint(14, Color.parseColor("#0e7490"), true), M, y, W - 2 * M, Layout.Alignment.ALIGN_NORMAL);
        y += 22;
        Paint ln = new Paint(); ln.setColor(Color.parseColor("#cbd5e1")); ln.setStrokeWidth(1);
        cv.drawLine(M, y, W - M, y, ln);
        y += 8;
    }

    private void meds(String head, JSONArray meds) {
        if (meds == null || meds.length() == 0) return;
        sectionTitle(head);
        int bw = 150, cw = W - 2 * M;
        for (int i = 0; i < meds.length(); i++) {
            JSONArray m = meds.optJSONArray(i);
            need(26);
            int pct = m.optInt(2);
            int col = pct >= 90 ? Color.parseColor("#16a34a") : pct >= 70 ? Color.parseColor("#d97706") : Color.parseColor("#dc2626");
            int nameW = cw - bw - 70;
            int bx = rtl ? M : W - M - bw;          // bar on the end side
            int vx = rtl ? M + bw + 8 : W - M - bw - 62;
            int nx = rtl ? W - M - nameW : M;
            draw(m.optString(0), paint(12, Color.parseColor("#0f172a"), true), nx, y + 2, nameW, Layout.Alignment.ALIGN_NORMAL);
            draw(m.optString(1) + "  (" + pct + "%)", paint(11, col, true), vx, y + 3, 56, Layout.Alignment.ALIGN_CENTER);
            Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
            p.setColor(Color.parseColor("#e2e8f0"));
            cv.drawRoundRect(new RectF(bx, y + 6, bx + bw, y + 16), 5, 5, p);
            p.setColor(col);
            float fw = bw * Math.max(0, Math.min(100, pct)) / 100f;
            if (rtl) cv.drawRoundRect(new RectF(bx + bw - fw, y + 6, bx + bw, y + 16), 5, 5, p);
            else cv.drawRoundRect(new RectF(bx, y + 6, bx + fw, y + 16), 5, 5, p);
            y += 24;
        }
        y += 10;
    }

    private void days(String head, JSONArray days) {
        if (days == null || days.length() == 0) return;
        sectionTitle(head);
        int cw = W - 2 * M, tw = 46, sw = 110, iw = cw - tw - sw - 16;
        TextPaint itP = paint(11, Color.parseColor("#1e293b"), false);
        for (int d = 0; d < days.length(); d++) {
            JSONObject day = days.optJSONObject(d);
            need(46);
            Paint hb = new Paint(Paint.ANTI_ALIAS_FLAG); hb.setColor(Color.parseColor("#e0f2fe"));
            cv.drawRoundRect(new RectF(M, y, W - M, y + 20), 6, 6, hb);
            draw(day.optString("h"), paint(11, Color.parseColor("#075985"), true), M + 8, y + 4, cw - 16, Layout.Alignment.ALIGN_NORMAL);
            y += 24;
            JSONArray rows = day.optJSONArray("rows");
            for (int i = 0; rows != null && i < rows.length(); i++) {
                JSONArray r = rows.optJSONArray(i);
                int h = Math.max(16, height(r.optString(1), itP, iw)) + 4;
                need(h);
                int tx = rtl ? W - M - tw : M, ix = rtl ? M + sw + 8 : M + tw + 8, sx = rtl ? M : W - M - sw;
                draw(r.optString(0), paint(11, Color.parseColor("#0f172a"), true), tx, y, tw, Layout.Alignment.ALIGN_CENTER);
                draw(r.optString(1), itP, ix, y, iw, Layout.Alignment.ALIGN_NORMAL);
                draw(r.optString(2), paint(11, parse(r.optString(3), "#0f172a"), true), sx, y, sw, Layout.Alignment.ALIGN_CENTER);
                y += h;
                Paint ln = new Paint(); ln.setColor(Color.parseColor("#f1f5f9"));
                cv.drawLine(M + 6, y - 2, W - M - 6, y - 2, ln);
            }
            y += 6;
        }
    }

    private static int parse(String s, String def) {
        try { return Color.parseColor(s); } catch (Exception e) { return Color.parseColor(def); }
    }
}
