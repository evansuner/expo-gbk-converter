Pod::Spec.new do |s|
  s.name           = 'ExpoGbkConverter'
  s.version        = '1.0.0'
  s.summary        = 'Expo module to decode GBK/GB18030 encoded text'
  s.description    = 'An Expo native module that decodes GBK/GB18030 encoded base64 strings to UTF-8 text, useful for parsing Chinese encoded files.'
  s.author         = 'Evan Sun'
  s.homepage       = 'https://github.com/evansuner/expo-gbk-converter'
  s.license        = 'MIT'
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.source         = { git: 'https://github.com/evansuner/expo-gbk-converter.git', tag: "v#{s.version}" }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
