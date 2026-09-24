package com.quranfirst.appgate

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import java.util.concurrent.ConcurrentHashMap

class AppGateForegroundService : Service() {

    companion object {
        const val CHANNEL_ID = "quran_first_gate_service_channel"
        const val NOTIFICATION_ID = 1001

        const val ACTION_START = "com.quranfirst.appgate.START"
        const val ACTION_STOP = "com.quranfirst.appgate.STOP"
        const val EXTRA_PROTECTED_PACKAGES = "protected_packages"

        private val quranPasses = ConcurrentHashMap<String, Long>()
        private var isRunning = false
        private var protectedPackages = setOf("com.instagram.android")

        fun isServiceRunning(): Boolean = isRunning

        fun setPass(packageName: String, durationMinutes: Int) {
            val expiry = System.currentTimeMillis() + (durationMinutes * 60 * 1000L)
            quranPasses[packageName] = expiry
        }

        fun clearPass(packageName: String) {
            quranPasses.remove(packageName)
        }

        fun hasActivePass(packageName: String): Boolean {
            val expiry = quranPasses[packageName] ?: return false
            if (System.currentTimeMillis() < expiry) {
                return true
            }
            quranPasses.remove(packageName)
            return false
        }
    }

    private val handler = Handler(Looper.getMainLooper())
    private var lastTriggeredPackage: String? = null
    private var lastTriggerTime: Long = 0

    private val pollRunnable = object : Runnable {
        override fun run() {
            try {
                checkForegroundApp()
            } catch (e: Exception) {
                // Ignore exceptions in monitoring loop
            }
            if (isRunning) {
                handler.postDelayed(this, 750)
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            stopMonitoring()
            stopSelf()
            return START_NOT_STICKY
        }

        val packages = intent?.getStringArrayListExtra(EXTRA_PROTECTED_PACKAGES)
        if (!packages.isNullOrEmpty()) {
            protectedPackages = packages.toSet()
        }

        startForeground(NOTIFICATION_ID, createNotification())
        isRunning = true
        handler.removeCallbacks(pollRunnable)
        handler.post(pollRunnable)

        return START_STICKY
    }

    private fun checkForegroundApp() {
        if (!AppDetector.hasUsageStatsPermission(this)) {
            return
        }

        val foregroundApp = AppDetector.getForegroundApp(this) ?: return

        // Ignore our own app and Android system UI
        if (foregroundApp == packageName ||
            foregroundApp == "com.android.systemui" ||
            foregroundApp.contains("launcher", ignoreCase = true)
        ) {
            // User went back home or opened our app, reset debounce
            if (foregroundApp == packageName) {
                lastTriggeredPackage = null
            }
            return
        }

        if (protectedPackages.contains(foregroundApp)) {
            if (hasActivePass(foregroundApp)) {
                // Pass is valid, let user enjoy the app
                return
            }

            val now = System.currentTimeMillis()
            // Debounce: don't trigger repeatedly within 3 seconds for the same app
            if (lastTriggeredPackage == foregroundApp && (now - lastTriggerTime) < 3000) {
                return
            }

            lastTriggeredPackage = foregroundApp
            lastTriggerTime = now

            val appName = AppDetector.getApplicationName(this, foregroundApp)

            // Emit event to React Native
            ExpoAppGateModule.emitAppDetected(foregroundApp, appName)

            // Trigger Quran First Gate activity to front
            triggerGateUI(foregroundApp, appName)
        }
    }

    private fun triggerGateUI(targetPackage: String, appName: String) {
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName) ?: return
        launchIntent.apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
            putExtra("triggerGate", true)
            putExtra("packageName", targetPackage)
            putExtra("appName", appName)
        }
        startActivity(launchIntent)
    }

    private fun stopMonitoring() {
        isRunning = false
        handler.removeCallbacks(pollRunnable)
        stopForeground(STOP_FOREGROUND_REMOVE)
    }

    override fun onDestroy() {
        stopMonitoring()
        super.onDestroy()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Quran First Gate Monitor",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Memonitor aplikasi pilihan untuk menghadirkan jeda tilawah"
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    private fun createNotification(): Notification {
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            launchIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Quran First Aktif")
            .setContentText("Menjaga niat tilawah sebelum membuka aplikasi")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }
}
