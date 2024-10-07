package com.dev.justcall

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class CallHeadlessService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig {
        val incomingNumber = intent?.getStringExtra("incomingNumber") ?: ""
        val taskData: WritableMap = Arguments.createMap()
        taskData.putString("incomingNumber", incomingNumber)

        return HeadlessJsTaskConfig(
            "IncomingCallTask",
            taskData,
            10000,
            true
        )
    }
}