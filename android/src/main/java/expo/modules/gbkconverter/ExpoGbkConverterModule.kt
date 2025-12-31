package expo.modules.gbkconverter

import android.util.Base64
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.nio.charset.Charset

class ExpoGbkConverterModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoGbkConverter")

    AsyncFunction("decode") { base64: String ->
      val bytes = Base64.decode(base64, Base64.DEFAULT)
      String(bytes, Charset.forName("GB18030"))
    }
  }
}