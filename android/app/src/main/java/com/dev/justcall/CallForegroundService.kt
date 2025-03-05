package com.dev.justcall

import android.annotation.SuppressLint
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Intent
import android.content.IntentFilter
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.provider.Settings
import android.telephony.TelephonyManager
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import android.widget.TextView
import androidx.core.app.NotificationCompat

import org.web3j.protocol.Web3j
import org.web3j.protocol.http.HttpService
import org.web3j.crypto.Credentials
import org.web3j.abi.datatypes.Utf8String
import org.web3j.abi.datatypes.Type
import org.web3j.abi.datatypes.Function
import org.web3j.abi.FunctionEncoder
import org.web3j.abi.FunctionReturnDecoder
import org.web3j.abi.TypeReference

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

// Configure Web3j connection to Sepolia
val web3j: Web3j = Web3j.build(HttpService("https://sepolia.infura.io/v3/6ec31da19e8b4d44a456b8ed4b8a6846"))

// Replace with your wallet's private key and Sepolia smart contract address
val credentials: Credentials = Credentials.create("[Wallet private key]")
const val contractAddress = "[Smart contract address]"

class CallForegroundService : Service() {
    private val channelID = "CallServiceChannel"
    private lateinit var callReceiver: BroadcastReceiver
    private var overlayView: View? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("Call_Receiver", "[FOREGROUND - onStart] Setting up")

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
        Log.d("Call_Receiver", "[FOREGROUND - onStart] Foreground service started")

        val incomingNumber = intent?.getStringExtra("incomingNumber")
        if (incomingNumber != null) {
            Log.d("Call_Receiver", "[FOREGROUND - onStart] Calling fetch method for $incomingNumber")
            getUserInfoFromContract(incomingNumber)
        } else {
            Log.d("Call_Receiver", "[FOREGROUND - onStart] Fetch parameter is null")
        }

        val filter = IntentFilter(TelephonyManager.ACTION_PHONE_STATE_CHANGED)
        callReceiver = CallReceiver()
        registerReceiver(callReceiver, filter)
        Log.d("Call_Receiver", "[FOREGROUND - onStart] Receiver registered")

        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(callReceiver)
        Log.d("Call_Receiver", "[FOREGROUND] Receiver unregistered")
    }

    private fun getUserInfoFromContract(phoneNumber: String) {
        // Start a coroutine for the network call
        CoroutineScope(Dispatchers.IO).launch {
            // Clean the phone number format
            val cleanedPhoneNumber = cleanPhoneNumber(phoneNumber)
            Log.d(
                "Call_Receiver",
                "[FOREGROUND - getUser] Fetching $cleanedPhoneNumber from blockchain"
            )

            // Define the function call as previously shown
            val function = Function(
                "getUserByPhoneNumber",
                listOf<Type<*>>(Utf8String(cleanedPhoneNumber)),
                listOf<TypeReference<*>>(
                    object : TypeReference<Utf8String>() {},
                    object : TypeReference<Utf8String>() {}
                )
            )

            val encodedFunction = FunctionEncoder.encode(function)

            try {
                val response = web3j.ethCall(
                    org.web3j.protocol.core.methods.request.Transaction.createEthCallTransaction(
                        credentials.address, contractAddress, encodedFunction
                    ),
                    org.web3j.protocol.core.DefaultBlockParameterName.LATEST
                ).send()

                val result =
                    FunctionReturnDecoder.decode(response.result, function.outputParameters)
                Log.d("Call_Receiver", "[FOREGROUND - getUser] The fetch result: $result")

                // Process the result and update the UI in the main thread
                withContext(Dispatchers.Main) {
                    if (result.size >= 2) {
                        val name = result[0].value as String
                        val phone = result[1].value as String
                        showVerifiedOverlay(name, phone)
                    } else {
                        showCautionOverlay(cleanedPhoneNumber)
                    }
                }

            } catch (e: Exception) {
                e.printStackTrace()
                Log.d("Call_Receiver", "[FOREGROUND - getUser] Error: $e")
            }
        }

        Log.d("Call_Receiver", "[FOREGROUND - getUser] Fetching completed")
    }

    @SuppressLint("InflateParams")
    private fun showVerifiedOverlay(name: String, phoneNum: String) {
        Log.d("Call_Receiver", "[FOREGROUND - receiveCaller] Caller ID received")
        Log.d("Call_Receiver", "[FOREGROUND - receiveCaller] $name ($phoneNum) is calling...")

        if (Settings.canDrawOverlays(this)) {
            Log.d("Call_Receiver", "[MODULE] Checking overlay permission: ${Settings.canDrawOverlays(this)}")

            // Inflate the custom overlay layout
            val inflater = getSystemService(LAYOUT_INFLATER_SERVICE) as LayoutInflater
            overlayView = inflater.inflate(R.layout.overlay, null).apply {
                findViewById<TextView>(R.id.caller_name).text = name
                findViewById<TextView>(R.id.caller_number).text = phoneNum

                // Find and set an OnClickListener on the close button
                findViewById<ImageView>(R.id.close_verified_button).setOnClickListener {
                    removeOverlay()
                }
            }

            // Set layout parameters for the overlay
            val layoutParams = WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                } else {
                    WindowManager.LayoutParams.TYPE_PHONE
                },
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                        WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
                PixelFormat.TRANSLUCENT
            )

            layoutParams.gravity = Gravity.CENTER

            // Add the overlay to the window
            val windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
            windowManager.addView(overlayView, layoutParams)

        } else {
            Log.d("Call_Receiver", "[FOREGROUND] Overlay permission not granted. Requesting permission...")
            requestOverlayPermission()
        }
    }

    @SuppressLint("InflateParams")
    private fun showCautionOverlay(cleanedPhoneNumber: String) {
        if (Settings.canDrawOverlays(this)) {
            val inflater = getSystemService(LAYOUT_INFLATER_SERVICE) as LayoutInflater
            overlayView = inflater.inflate(R.layout.caution, null).apply {
                findViewById<TextView>(R.id.caller_number).text = cleanedPhoneNumber
                // Find and set an OnClickListener on the close button
                findViewById<ImageView>(R.id.close_caution_button).setOnClickListener {
                    removeOverlay()
                }
            }

            val layoutParams = WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                } else {
                    WindowManager.LayoutParams.TYPE_PHONE
                },
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                        WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
                PixelFormat.TRANSLUCENT
            )

            layoutParams.gravity = Gravity.CENTER

            val windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
            windowManager.addView(overlayView, layoutParams)

        } else {
            requestOverlayPermission()
        }
    }

    private fun requestOverlayPermission() {
        val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(intent)
    }

    private fun removeOverlay() {
        overlayView?.let {
            val windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
            windowManager.removeView(it)
            overlayView = null
        }
    }

    private fun cleanPhoneNumber(phoneNumber: String): String {
        Log.d("Call_Receiver", "[FOREGROUND - cleaning] Cleaning phone number")

        // Step 1: Remove any non-numeric characters except '+'
        var cleanedNumber = phoneNumber.replace(Regex("[^0-9+]"), "")

        // Step 2: Ensure the number starts with +601 for Malaysian numbers
        cleanedNumber = when {
            cleanedNumber.startsWith("0") -> cleanedNumber.replaceFirst("^0".toRegex(), "+60")
            cleanedNumber.startsWith("60") -> cleanedNumber.replaceFirst("^60".toRegex(), "+60")
            else -> cleanedNumber
        }

        Log.d("Call_Receiver", "[FOREGROUND - cleaning] Cleaning completed")
        return cleanedNumber
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
