package com.dev.justcall

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Build
import android.telecom.Call
import android.telecom.CallScreeningService
import android.util.Log
import androidx.annotation.RequiresApi
import com.facebook.react.ReactApplication

// NOTE: JUSTCALL MUST BE THE DEFAULT CALLER ID AND SPAM APP FOR API 29+
// (MainActivity.kt, Line 37)

@RequiresApi(Build.VERSION_CODES.N)
class CallScreeningService: CallScreeningService() {
    @SuppressLint("VisibleForTests")
    @RequiresApi(Build.VERSION_CODES.Q)
    override fun onScreenCall(callDetails: Call.Details) {
        Log.d("Call_Receiver", "[SERVICE] Fetching caller number")
        val incomingNum = callDetails.handle.schemeSpecificPart
        Log.d("Call_Receiver", "[SERVICE] Incoming call from: $incomingNum")

        val intent = Intent(this, CallForegroundService::class.java)
        startService(intent)
        Log.d("Call_Receiver", "[FOREGROUND] Service called")

        val reactApplication = application as ReactApplication
        val reactContext = reactApplication.reactNativeHost.reactInstanceManager.currentReactContext

        if (reactContext != null) {
            Log.d("Call_Receiver", "[SERVICE] Calling module function")
            val callNativeModule = reactContext.getNativeModule(CallNativeModule::class.java)
            callNativeModule?.sendIncomingCall(incomingNum)
            Log.d("Call_Receiver", "[SERVICE] Module function called")
        }

        val response = CallResponse.Builder()
            .setDisallowCall(false)
            .setSilenceCall(false)
            .build()

        respondToCall(callDetails, response)
    }
}