package com.dev.justcall

import android.content.Intent
import android.util.Log
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class CallHeadlessService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig {
        Log.d("Call_Receiver", "[HEADLESS] Task called")
        val incomingNumber = intent?.getStringExtra("incomingNumber") ?: ""
        Log.d("Call_Receiver", "[HEADLESS] Incoming Number: $incomingNumber")
        val taskData: WritableMap = Arguments.createMap()
        taskData.putString("incomingNumber", incomingNumber)
        Log.d("Call_Receiver", "[HEADLESS] Task Data: $taskData")

        return HeadlessJsTaskConfig(
            "IncomingCallTask",
            taskData,
            1000,
            true
        )
    }
}