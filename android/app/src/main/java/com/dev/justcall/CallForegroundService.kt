package com.dev.justcall

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat

class CallForegroundService : Service() {
    private val channelID = "CallServiceChannel"

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("Call_Receiver", "[FOREGROUND] Setting up")

        createNotificationChannel()

        val notification = NotificationCompat.Builder(this, channelID)
            .setContentTitle("Call Service")
            .setContentText("JustCall is active")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        startForeground(1, notification)
        Log.d("Call_Receiver", "[FOREGROUND] Service started")

        return START_STICKY
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