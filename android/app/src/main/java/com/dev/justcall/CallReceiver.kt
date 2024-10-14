package com.dev.justcall

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.TelephonyManager
import android.util.Log

class CallReceiver: BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val state = intent.getStringExtra(TelephonyManager.EXTRA_STATE)

        if (TelephonyManager.EXTRA_STATE_IDLE == state) {
            Log.d("Call_Receiver", "[RECEIVER] Call ended or rejected")
//            val stopIntent = Intent(context, CallForegroundService::class.java)
//            context.stopService(stopIntent)
        }
    }
}