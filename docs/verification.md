# 本机验证记录

2026-10-27 至 28，macOS arm64。

| 检查 | 结果与范围 |
| --- | --- |
| `pnpm typecheck` | TypeScript 工作区通过 |
| `pnpm build` | API、Next.js 生产构建、Electron Vite 渲染器构建通过 |
| `pnpm test` | 输入校验、媒体签名、Protobuf Unicode / 版本校验通过 |
| `pnpm test:integration` | 真实 Nest + PostgreSQL：双连接广播、并发幂等、冲突与归属校验、媒体上传读取、Range 206、重连历史与 45 条分页通过 |
| Flutter analyze / test | 静态分析通过；4 项测试覆盖偏好恢复、翻译一致性、Protobuf、离线空缺分页游标 |
| Dart smoke | 实际连接：二进制协议、ACK、幂等、HTTP 历史、图片上传通过 |
| iOS | Simulator debug 构建通过；iPhone 16 Pro / iOS 18.1 已启动，显示真实会话和已连接状态 |
| Electron macOS | 原生应用启动；渲染器读取真实会话、WS 已连接；切换英文和深色模式通过；无渲染器错误。未签名 arm64 应用目录打包成功，产物已启动 |

后续用户已验证 Web、macOS 和 iOS。Windows x64 解压测试包已生成，并验证压缩包完整性、PE x64 可执行格式与配置文件；没有 Windows 运行环境，尚未声称 PC 实机运行通过。桌面新配置功能通过 3 项测试、类型检查、构建及 macOS 连接局域网 API 的实际渲染检查。

文件加载方式检查发现 Electron 打包模式使用 `Origin: file://`，服务端原先仅接受 `null`，导致 WS 被拒绝。现已统一 HTTP / WS 来源校验，补充 1 项来源测试，真实集成测试使用 file:// 客户端通过，文件加载的 Electron 界面与局域网 API 实时连接也已通过检查。

Android SDK 已补齐 API 35 / 36、Build-Tools 36、ARM64 系统镜像、NDK 28.2，并通过 doctor 工具链与许可检查。已创建并启动 Pixel 8 / API 36 ARM64 的 `Learning_API_36` 模拟器（ADB `emulator-5554`）。2026-10-28 APK 构建成功，安装、启动成功，首页加载真实会话并显示“已连接”；截图为 `.data/screenshots/android-app.png`。调试 APK 为 `apps/mobile/build/app/outputs/flutter-apk/app-debug.apk`，约 87 MiB，仅包含此次测试所需的 ARM64 ABI。真机麦克风与跨端媒体仍待最终验收。

首次构建先后遇到 Gradle ZIP 下载超时、Java TLS 握手失败和个别仓库下载缓慢。Gradle ZIP 使用官方 SHA-256 校验；临时本机缓存代理使用 curl 校验 HTTPS，向 Gradle 提供 loopback 缓存。诊断文件在忽略的 `.data/`，没有修改项目默认仓库或关闭远端 TLS 校验。最终构建结果为 `BUILD SUCCESSFUL`，302 项任务完成。

Web 开发服务可返回页面；本次内置浏览器自动化工具因 `sandboxPolicy` 元数据缺失而无法启动，因此未完成浏览器点击流程验收。HTTP 可用或构建通过不等于完整 UI 验证。

Electron 实际运行截图位于本机 `.data/screenshots/desktop-home.png`、`.data/screenshots/desktop-settings.png`；iOS 首页位于 `.data/screenshots/mobile-home.png`。这些运行产物不入库。

手动验收：同时打开两个客户端，新建会话、发送文字，检查另一端更新；录音、预听并发送，在另一端回放；发送图片并查看大图；切换中英和外观，重启检查恢复；断开并恢复服务，检查重连历史并重试失败消息。
