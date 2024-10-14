package com.dev.justcall

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.IBinder
import android.telephony.TelephonyManager
import android.util.Log
import androidx.core.app.NotificationCompat

class CallForegroundService : Service() {
    private val channelID = "CallServiceChannel"
    private lateinit var callReceiver: BroadcastReceiver

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("Call_Receiver", "[FOREGROUND] Setting up")

        createNotificationChannel()
        val notificationIntent = Intent(this, MainActivity::class.java)
        val contentIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, channelID)
            .setContentTitle("Call Service")
            .setContentText("JustCall is active")
            .setContentIntent(contentIntent)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        startForeground(1, notification)
        Log.d("Call_Receiver", "[FOREGROUND] Service started")

        val filter = IntentFilter(TelephonyManager.ACTION_PHONE_STATE_CHANGED)
        callReceiver = CallReceiver()
        registerReceiver(callReceiver, filter)
        Log.d("Call_Receiver", "[FOREGROUND] Receiver registered")

        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(callReceiver)
        Log.d("Call_Receiver", "[FOREGROUND] Receiver unregistered")
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                channelID,
                "Caller ID Active",
                NotificationManager.IMPORTANCE_HIGH
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
            Log.d("Call_Receiver", "[FOREGROUND] Notification channel created")
        }
    }
}