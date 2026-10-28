# Android 模拟器本机运行

无需 Android 手机。Android Studio 管理模拟器，Flutter 负责构建和启动应用。

本机现已完成配置：`Learning_API_36`（Pixel 8、API 36、ARM64），已安装并启动应用，连接 Mac 服务端成功。Android Studio Device Manager 中可直接找到这个设备。

## Android Studio 操作

1. 打开 Android Studio，在欢迎页 More Actions → SDK Manager，或项目 Settings → Languages & Frameworks → Android SDK。
2. SDK Platforms 勾选 Android 16 / API 36。SDK Tools 安装 Android SDK Build-Tools 36、Platform-Tools、Command-line Tools、Android Emulator。
3. 在仓库根目录运行 `.tools/flutter/bin/flutter doctor --android-licenses`，阅读并接受 SDK 许可。
4. More Actions → Virtual Device Manager，或 Tools → Device Manager → Create Virtual Device。选择 Pixel 8；Apple Silicon Mac 选择 Google APIs、API 36、`arm64-v8a` 系统镜像，命名 `Learning_API_36`。
5. 点击设备旁的启动按钮，等到出现 Android 首页。

菜单名称可能随 Android Studio 版本略有变化。现有 Android Studio 较旧，若提示不支持项目的 Android Gradle Plugin，请更新 Android Studio，或使用下面的 Flutter 终端命令运行。

## 启动服务与应用

Mac 仓库根目录：

```sh
pnpm db:start
pnpm dev:api
```

首次安装或数据库结构变更后，启动 API 前执行 `pnpm db:migrate`；新安装还需 `pnpm install` 和 `pnpm prepare:workspace`。

另开终端：

```sh
cd apps/mobile
../../.tools/flutter/bin/flutter devices
../../.tools/flutter/bin/flutter run -d <列表中的Android设备ID> --dart-define=API_URL=http://10.0.2.2:4000
```

`10.0.2.2` 是 Android 官方模拟器访问宿主机的地址；模拟器中的 `127.0.0.1` 指模拟器自身。Mac 上运行模拟器时，使用上述地址无需依赖 Mac 的 Wi-Fi IP。

## 在 Android Studio 中点击 Run

安装 Flutter 插件（同时安装 Dart 插件），打开仓库的 `apps/mobile` 目录。Flutter SDK 路径设为仓库中的 `.tools/flutter`。选择已启动的 Android 虚拟设备，在 Run → Edit Configurations 的 Flutter 配置里将 Additional run args 设为：

```text
--dart-define=API_URL=http://10.0.2.2:4000
```

然后 Run。项目当前使用较新的 Gradle / AGP，旧版 Android Studio 的 Gradle 同步可能需要升级 IDE；Flutter CLI 使用项目自带 Gradle Wrapper。

## 同步与录音验收

同时打开 Web 或 Mac 应用，创建会话、发送文字和图片，确认 Android 立即更新。录音时在 Android 中允许麦克风权限；模拟器能否采集宿主机麦克风还受 macOS 权限和模拟器音频设置影响，不能代替真机最终验收。

构建本地测试 APK：在 `apps/mobile` 执行 `flutter build apk --debug --dart-define=API_URL=http://10.0.2.2:4000`。产物为 `build/app/outputs/flutter-apk/app-debug.apk`。此地址适用于运行在 Mac 上的官方 Android 模拟器；真机或另一台电脑上的模拟器应改为 Mac 局域网地址。

## 重启后复验本次版本

先启动 Mac 的数据库与 API，再在仓库根目录启动已有模拟器：

```sh
.tools/flutter/bin/flutter emulators --launch Learning_API_36
```

等待 Android 首页出现，在 `apps/mobile` 运行：

```sh
../../.tools/flutter/bin/flutter run -d emulator-5554 --use-application-binary=build/app/outputs/flutter-apk/app-debug.apk
```

这是复验已经构建的 APK，不会包含后续源代码变更；APK 内的 API 地址已经设为 `http://10.0.2.2:4000`。设备 ID 变化时先执行 `flutter devices` 确认。也可直接在模拟器里点击 Learning Notes 图标，无需重新构建。

源码开发仍使用前面的标准 `flutter run --dart-define=...` 流程。Java / Gradle 不一定自动使用 macOS 系统代理；本次网络诊断脚本暂存在忽略的 `.data/maven-cache-proxy.py`、`.data/android-mirrors.init.gradle`，用于特定网络环境，未写入项目默认构建配置。
