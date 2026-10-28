# 新 iPhone 模拟器与 Xcode 更新

2026-10-27 检查本机：macOS 26.0、Xcode 26.2。可用设备类型最高包含 iPhone 17 Pro / Pro Max、iPhone Air、iPhone 17；没有 iPhone 18 Pro 或 iPhone Duo。已安装的 iOS Runtime 包含 17.5、18.1、18.3、26.3。

苹果当前官网已列出 iPhone 18 Pro 和 iPhone Duo。缺少对应模拟器的直接原因是本机 Xcode 没有这些设备类型，不能只靠下载新 Runtime 或重命名旧模拟器补齐。

苹果兼容性表当前列出的 Xcode 27 / 27.1 / 27.2 RC 要求 macOS 26.6 或更高，而本机 26.0 不满足要求。App Store 没有提示更新不代表本机 Xcode 是最新；兼容性会限制可安装版本。尚未核实 App Store 未提示其他兼容版本的具体原因。

建议先通过系统设置更新到兼容的稳定 macOS，再安装兼容的正式 Xcode（预览版在开发者下载页单独提供），首次打开完成组件安装，然后在 Xcode Settings 的 Platforms / Components 中下载对应 iOS Runtime，最后在 Window → Devices and Simulators 创建目标设备。菜单名称可能随版本变化。

更新后检查：

```sh
xcodebuild -version
xcode-select -p
xcrun simctl list devicetypes
xcrun simctl list runtimes
```

若安装了多个 Xcode，确认命令行选择的是目标版本。此记录没有执行 macOS / Xcode 升级。

来源：[苹果 Xcode 兼容性表](https://developer.apple.com/support/xcode/)、[iPhone 产品页](https://www.apple.com/iphone/)、[Xcode 下载](https://developer.apple.com/download/all/?q=Xcode)。
