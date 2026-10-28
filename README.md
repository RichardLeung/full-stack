# Learning Notes · 英语学习记录

个人英语学习、雅思备考的多端 MVP：通过会话整理文字、录音和图片，并实时同步。当前全部服务运行在本机，采用无登录的个人模式，所有客户端共用 `local-user`。

## 已实现

- 新建会话、标题搜索、历史分页。
- 发送文字、录音预听与回放、图片预览与发送。
- WebSocket + 二进制 Protobuf、落库后 ACK、幂等重试、重连刷新。
- 微信风格配色；浅色、深色、跟随系统；中英界面切换。设备设置独立保存，用户内容保持原文。
- 手机会话 / 设置 Tab，桌面左下角设置入口。

## 技术与目录

| 目录 | 实现 |
| --- | --- |
| `apps/api` | NestJS、Prisma、PostgreSQL、原生 WebSocket |
| `apps/web` | Next.js App Router、React、Tailwind CSS |
| `apps/desktop` | Electron、Vite、React，macOS / Windows 配置 |
| `apps/mobile` | Flutter、Riverpod、AAC 录音、图片选择、音频回放 |
| `packages/ui` | Web / Electron 共用界面、React Query、设备设置 |
| `packages/client` | HTTP 和 WebSocket TypeScript 客户端 |
| `packages/protocol` | `.proto` 契约、TypeScript 编解码 |
| `packages/locales` | 中英词条源文件，同时生成 Flutter 词条 |
| `design` | 已确认的静态设计稿 |

服务端数据使用 React Query，草稿、预览和设置使用 React state；Flutter 使用 Riverpod。

## 本机启动

验证环境：macOS arm64、Node **22.23.4**、pnpm **9.14.4**、Flutter **3.47.8** / Dart **3.13.7**、Xcode **26.2**、PostgreSQL **17.10**。Node 至少 22.12；项目脚本使用锁定的本地 Node。首次安装需要网络。

仓库根目录执行：

```sh
pnpm install
# 已有配置时保留自己的 apps/api/.env
cp .env.example apps/api/.env
pnpm db:start
pnpm db:migrate
pnpm dev
```

仅启动服务端时，使用 `pnpm dev:api` 替代 `pnpm dev`。数据库、API、Web、桌面分别是独立进程。

根目录 `.env.example` 是模板，不会自动加载。API 读取 `apps/api/.env`。`pnpm dev` 先生成协议和共享包，再启动 API / Web。

| 服务 | 地址 |
| --- | --- |
| Web | http://localhost:3000 |
| 健康检查 | http://127.0.0.1:4000/api/health |
| HTTP API 文档 | http://127.0.0.1:4000/api/docs |
| WebSocket | ws://127.0.0.1:4000/ws |
| PostgreSQL | 127.0.0.1:54329 / learning |

数据库脚本使用项目依赖中的原生 PostgreSQL，无需 Docker / Homebrew。数据在 `.data/postgres`，媒体在 `.data/media`，均不入库。首次启动自动创建三个空的示例会话。Ctrl+C 停止开发服务；`pnpm db:stop` 停止数据库。

也可自行配置 PostgreSQL 的 `DATABASE_URL`。Docker 用户可用 `docker compose up -d postgres` 替代 `pnpm db:start`，连接串改为 `postgresql://learning:local-development-only@127.0.0.1:54329/learning`。两种方式共用端口，选择一种。

### Electron

保持 API 运行，另开终端：

```sh
pnpm dev:desktop
```

API 默认 `http://127.0.0.1:4000`。桌面可通过 `LEARNING_API_URL` 环境变量或 `learning.config.json` 在运行时切换服务端，修改后重启应用，无需重打包。开发模式配置文件位于 `apps/desktop`；Windows 包配置文件与 exe 放在一起；macOS 新包配置文件位于 `.app/Contents`。Web 在 `apps/web/.env.local` 设置 `NEXT_PUBLIC_API_URL`，生产地址在构建时写入。

```sh
# 在 macOS 构建 macOS 应用目录
pnpm --filter @learning/desktop pack:mac
# 在 Windows 构建 Windows 应用目录
pnpm --filter @learning/desktop pack:win
```

产物在 `apps/desktop/out/`。当前为本地未签名应用目录；安装包、签名、公证和更新渠道后续配置。客户端不会内嵌 API 或数据库。

本机已有 `apps/desktop/out/mac-arm64/Learning Notes.app`，以及 `apps/desktop/out/Learning Notes-0.1.0-win-x64.zip`。Windows ZIP 已配置本次 Mac 局域网地址，完整解压后运行 exe，详见 [Windows 验证](docs/windows-local.md)。新版桌面 CSP 由主进程按所配置的服务端来源生成，同时允许对应的 HTTP(S) 与 WS(S)，生产脚本限制保持严格。之前生成的 Mac 包仍为首次验证版本，新增配置能力需要重新打包才会包含。

### Flutter

安装 Flutter 3.47.8 或兼容 Dart 3.13.7 的稳定版本，并准备目标平台工具链。本机 SDK 已放在忽略的 `.tools/flutter`，也可使用自行安装的 `flutter`。

```sh
cd apps/mobile
../../.tools/flutter/bin/flutter pub get
../../.tools/flutter/bin/flutter devices
../../.tools/flutter/bin/flutter run -d <设备ID>
```

iOS 模拟器使用默认 `127.0.0.1:4000`。Android 模拟器访问宿主机需使用：

```sh
flutter run -d <Android设备ID> --dart-define=API_URL=http://10.0.2.2:4000
```

Android Studio 创建模拟器、配置 Flutter SDK 和 Run 参数的具体步骤见 [Android 本机运行](docs/android-local.md)。

本机已创建 `Learning_API_36`，完成 Android APK 构建、安装和启动；首页真实数据与连接状态检查通过。已有 APK 位于 `apps/mobile/build/app/outputs/flutter-apk/app-debug.apk`。

真机与电脑连接同一局域网，将 API 的 `HOST` 改为 `0.0.0.0` 后重启，并将 `API_URL` 指向电脑局域网地址。当前个人模式仅在可信局域网使用。手机浏览器录音需 HTTPS；本机桌面浏览器的 `localhost` 可用。Flutter 原生录音不受浏览器安全上下文限制。

## 开发与验证

```sh
pnpm typecheck
pnpm test
pnpm build
# 需先启动 API 和数据库，会清理自己创建的测试数据
pnpm test:integration
```

Flutter 命令在 `apps/mobile` 执行：

```sh
flutter analyze
flutter test
flutter build ios --simulator --debug
# API 运行时可验证 Dart 客户端；会保留一条 smoke 会话
dart run tool/smoke.dart
```

修改 `packages/protocol/learning.proto` 后，在根目录执行 `pnpm prepare:workspace`。生成 Dart 协议前先在移动端执行 `flutter pub get`，再在根目录执行 `pnpm protocol:dart`，使用 Buf 和项目内 Dart 插件，无需系统 `protoc`。翻译修改 `packages/locales/*.json` 后，执行 `pnpm prepare:workspace` 同步 Flutter 词条。

参阅 [架构说明](docs/architecture.md) 和 [验证记录](docs/verification.md)。当前未实现账号、AI 评分、离线持久化待发箱和云存储；录音上限 10 分钟，单文件上限 25 MiB。

云资源尚未创建。推荐的免费演示组合及需要补齐的认证、媒体存储和部署步骤见 [云部署方案](docs/cloud-deployment.md)。

## GitHub 与安全

本项目当前为无认证的个人开发模式，勿将 API 直接开放到公网。源代码与示例配置可单独整理到 GitHub；实际学习数据、环境配置、签名材料与安装包保留在本机。参阅 [安全边界](SECURITY.md) 与 [GitHub 同步和开源说明](docs/github-publication.md)。项目原创代码采用 [MIT 许可证](LICENSE)，第三方组件遵循各自许可证。
