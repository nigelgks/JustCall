package com.dev.justcall

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Build
import android.telecom.Call
import android.telecom.CallScreeningService
import android.util.Log
import androidx.annotation.RequiresApi
import com.facebook.react.HeadlessJsTaskService

// NOTE: JUSTCALL MUST BE THE DEFAULT CALLER ID AND SPAM APP FOR API 29+
// (MainActivity.kt, Line 37)

@RequiresApi(Build.VERSION_CODES.N)
class CallScreeningService: CallScreeningService() {
    @SuppressLint("VisibleForTests")
    @RequiresApi(Build.VERSION_CODES.S)
    override fun onScreenCall(callDetails: Call.Details) {
        Log.d("Call_Receiver", "[SERVICE] Fetching caller number")
        val incomingNum = callDetails.handle.schemeSpecificPart
        Log.d("Call_Receiver", "[SERVICE] Incoming call from: $incomingNum")

        val intentForeground = Intent(this, CallForegroundService::class.java)
        //intentForeground.putExtra("incomingNumber", incomingNum)
        startService(intentForeground)
        Log.d("Call_Receiver", "[SERVICE] Foreground called")

        val intent = Intent(this, CallHeadlessService::class.java)
        intent.putExtra("incomingNumber", incomingNum)
        this.startService(intent)

        HeadlessJsTaskService.acquireWakeLockNow(this)
        Log.d("Call_Receiver", "[SERVICE] Headless task waking up")

        val response = CallResponse.Builder()
            .setDisallowCall(false)
            .setSilenceCall(false)
            .build()

        respondToCall(callDetails, response)
    }
}