package com.quranfirst.appgate

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.lang.ref.WeakReference

class ExpoAppGateModule : Module() {

    companion object {
        private var instanceRef: WeakReference<ExpoAppGateModule>? = null

        fun emitAppDetected(packageName: String, appName: String) {
            instanceRef?.get()?.let { module ->
                module.sendEvent(
                    "onAppDetected",
                    bundleOf(
                        "packageName" to packageName,
                        "appName" to appName,
                        "timestamp" to System.currentTimeMillis()
                    )
                )
            }
        }
    }

    private val context: Context
        get() = appContext.reactContext ?: throw IllegalStateException("React context is unavailable")

    override fun definition() = ModuleDefinition {
        Name("ExpoAppGate")

        Events("onAppDetected")

        OnCreate {
            instanceRef = WeakReference(this@ExpoAppGateModule)
        }

        OnDestroy {
            if (instanceRef?.get() == this@ExpoAppGateModule) {
                instanceRef = null
            }
        }

        Function("hasUsagePermission") {
            AppDetector.hasUsageStatsPermission(context)
        }

        Function("requestUsagePermission") {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        }

        Function("hasOverlayPermission") {
            AppDetector.hasOverlayPermission(context)
        }

        Function("requestOverlayPermission") {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:${context.packageName}")
                ).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                context.startActivity(intent)
            }
        }

        Function("startMonitoring") { protectedPackages: List<String> ->
            val intent = Intent(context, AppGateForegroundService::class.java).apply {
                action = AppGateForegroundService.ACTION_START
                putStringArrayListExtra(
                    AppGateForegroundService.EXTRA_PROTECTED_PACKAGES,
                    ArrayList(protectedPackages)
                )
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        Function("stopMonitoring") {
            val intent = Intent(context, AppGateForegroundService::class.java).apply {
                action = AppGateForegroundService.ACTION_STOP
            }
            context.startService(intent)
        }

        Function("isMonitoring") {
            AppGateForegroundService.isServiceRunning()
        }

        Function("setQuranPass") { packageName: String, durationMinutes: Int ->
            AppGateForegroundService.setPass(packageName, durationMinutes)
        }

        Function("clearQuranPass") { packageName: String ->
            AppGateForegroundService.clearPass(packageName)
        }
    }
}
