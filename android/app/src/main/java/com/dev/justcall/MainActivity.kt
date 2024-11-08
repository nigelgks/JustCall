package com.dev.justcall

import android.app.role.RoleManager
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.content.pm.PackageManager
import android.util.Log
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
  private val requestRoleLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
      if (result.resultCode == RESULT_OK) {
          Log.d("Call_Receiver", "[ACTIVITY] JustCall is now default Caller ID & Spam App")
      } else {
          Log.d("Call_Receiver", "[ACTIVITY] Role is not granted")
      }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar
    // This is required for expo-splash-screen
    setTheme(R.style.AppTheme)
    super.onCreate(null)
    Log.d("Call_Receiver", "[ACTIVITY] onCreate called from MainActivity.kt")

    //MAKE JUSTCALL DEFAULT CALLER ID AND SPAM APP FOR API 29+
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        val roleManager = getSystemService(Context.ROLE_SERVICE) as RoleManager

        if (!roleManager.isRoleHeld(RoleManager.ROLE_CALL_SCREENING)) {
            Log.d("Call_Receiver", "[ACTIVITY] Role manager needed")
            val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING)
            requestRoleLauncher.launch(intent)
        } else {
            Log.d("Call_Receiver", "[ACTIVITY] Role already assigned")
        }
    }

    //REQUEST PHONE STATE PERMISSION FOR API 23+
      if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
          Log.d("Call_Receiver", "[ACTIVITY] Call permission request")
          ActivityCompat.requestPermissions(this, arrayOf(android.Manifest.permission.READ_PHONE_STATE), 1)
      } else {
          Log.d("Call_Receiver", "[ACTIVITY] Permission already granted")
      }
  }

  override fun onRequestPermissionsResult(
      requestCode: Int,
      permissions: Array<String>,
      grantResults: IntArray
  ) {
      super.onRequestPermissionsResult(requestCode, permissions, grantResults)
      Log.d("Call_Receiver", "[ACTIVITY] Permission request called")
      if (requestCode == 1) {
          Log.d("Call_Receiver", "[ACTIVITY] Permission request code == 1")
          if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
              Log.d("Call_Receiver", "[ACTIVITY] Permission granted after request")
          } else {
              Log.d("Call_Receiver", "[ACTIVITY] Permission denied")
          }
      }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "main"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }

  /**
    * Align the back button behavior with Android S
    * where moving root activities to background instead of finishing activities.
    * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
    */
  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              // For non-root activities, use the default implementation to finish them.
              super.invokeDefaultOnBackPressed()
          }
          return
      }

      // Use the default back button implementation on Android S
      // because it's doing more than [Activity.moveTaskToBack] in fact.
      super.invokeDefaultOnBackPressed()
  }
}
