package com.dev.justcall

import android.app.AlertDialog
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.IBinder
import android.provider.Settings
import android.telephony.TelephonyManager
import android.util.Log
import android.view.WindowManager
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
val web3j: Web3j = Web3j.build(HttpService("https://sepolia.infura.io/v3/${BuildConfig.EXPO_PUBLIC_INFURA_PROJECT_ID}"))

// Replace with your wallet's private key and Sepolia smart contract address
val credentials: Credentials = Credentials.create(BuildConfig.EXPO_PUBLIC_PRIVATE_KEY_ACCOUNT_1)
const val contractAddress = BuildConfig.EXPO_PUBLIC_CONTRACT_ADDR

class CallForegroundService : Service() {
    private val channelID = "CallServiceChannel"
    private lateinit var callReceiver: BroadcastReceiver

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
                        showOverlay(name, phone)
                    }
                }

            } catch (e: Exception) {
                e.printStackTrace()
                Log.d("Call_Receiver", "[FOREGROUND - getUser] Error: $e")
            }
        }

        Log.d("Call_Receiver", "[FOREGROUND - getUser] Fetching completed")
    }

    private fun showOverlay(name: String, phoneNum: String) {
        Log.d("Call_Receiver", "[FOREGROUND - receiveCaller] Caller ID received")
        Log.d("Call_Receiver", "[FOREGROUND - receiveCaller] $name ($phoneNum) is calling...")

        if (Settings.canDrawOverlays(this)) {
            Log.d("Call_Receiver", "[MODULE] Checking overlay permission: ${Settings.canDrawOverlays(this)}")

            val builder = AlertDialog.Builder(this)
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
            Log.d("Call_Receiver", "[FOREGROUND] Overlay permission not granted. Requesting permission...")
            requestOverlayPermission()
        }
    }

    private fun requestOverlayPermission() {
        val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(intent)
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