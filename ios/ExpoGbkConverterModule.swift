import ExpoModulesCore

public class ExpoGbkConverterModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoGbkConverter")

    AsyncFunction("decode") { (base64: String) -> String in
      guard let data = Data(base64Encoded: base64) else {
        throw NSError(domain: "GBK", code: 1)
      }

      let cfEncoding = CFStringEncoding(
        CFStringEncodings.GB_18030_2000.rawValue
      )
      let encoding = String.Encoding(
        rawValue: CFStringConvertEncodingToNSStringEncoding(cfEncoding)
      )

      guard let text = String(data: data, encoding: encoding) else {
        throw NSError(domain: "GBK", code: 2)
      }

      return text
    }
  }
}
