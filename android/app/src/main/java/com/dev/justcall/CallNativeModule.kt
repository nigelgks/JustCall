package com.dev.justcall

import android.app.AlertDialog
import android.content.Intent
import android.os.Build
import android.provider.Settings
import android.util.Log
import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = CallNativeModule.MODULE_NAME)
class CallNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val MODULE_NAME = "CallNativeModule"
    }

    override fun getName(): String {
        return MODULE_NAME
    }

    @ReactMethod
    fun receiveCallerID(name: String, phoneNum: String) {
        Log.d("Call_Receiver", "[MODULE] Caller ID received")
        Log.d("Call_Receiver", "[MODULE] $name ($phoneNum) is calling...")

        if (Settings.canDrawOverlays(reactApplicationContext)) {
            Log.d("Call_Receiver", "[MODULE] Checking overlay permission: ${Settings.canDrawOverlays(reactApplicationContext)}")

            val builder = AlertDialog.Builder(reactApplicationContext)
            builder.setTitle("JustCall Caller ID active")
            builder.setMessage("$name ($phoneNum)")
            builder.setPositiveButton("Okay") { dialog, _ -> dialog.dismiss() }
            builder.setCancelable(false)
            val dialog = builder.create()

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                dialog.window?.setType(WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY)
            } else {
                dialog.window?.setType(WindowManager.LayoutParams.TYPE_PHONE)
            }

            dialog.show()
        } else {
            Log.d("Call_Receiver", "[MODULE] Overlay permission not granted. Requesting permission...")
            requestOverlayPermission()
        }
    }

    private fun requestOverlayPermission() {
        val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }
}