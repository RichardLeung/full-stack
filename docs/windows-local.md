# Windows 连接 Mac 服务端

本次准备的是 Windows x64 解压即用测试包，未签名。产物：`apps/desktop/out/Learning Notes-0.1.0-win-x64.zip`。压缩包保留全部依赖，Windows 不需要安装 Node、Flutter 或 PostgreSQL。

1. Mac 和 Windows 连接同一个可信局域网；Mac 保持运行和联网。
2. Mac 的 `apps/api/.env` 使用 `HOST=0.0.0.0`，然后在根目录执行 `pnpm db:start`、`pnpm dev:api`。
3. 在 Mac 的系统设置 → Wi-Fi → 当前网络详情中查看局域网 IP。在 Windows 浏览器打开 `http://<Mac局域网IP>:4000/api/health`，应返回 `status: ok`。下文 `192.168.1.100` 仅为示例，需替换为实际 IP。
4. 将整个 ZIP 复制到 Windows 并完整解压，运行 `Learning Notes.exe`。不能只复制单个 exe，或直接在压缩包内运行。
5. 编辑包内 `learning.config.json`，将地址改为实际 Mac IP，并重启应用：

```json
{
  "apiUrl": "http://192.168.1.100:4000"
}
```

运行时也可通过 `LEARNING_API_URL` 环境变量覆盖；优先级为环境变量、相邻配置文件、默认本机地址。更换服务端地址不需要重新构建。

若 Windows 无法打开健康检查，先检查 Mac IP、网络隔离和 macOS 防火墙对 Node / 4000 端口的入站许可。无需开放 PostgreSQL 端口，也无需在路由器上做公网端口映射。当前无登录开发模式仅供可信局域网使用。

代码修复了 Windows 文件 URL 的判断，麦克风权限不再依赖 macOS 风格路径；实际 Windows 界面与录音仍需在 PC 上验收。

重新构建 Windows ZIP：根目录执行 `pnpm prepare:workspace`，再执行 `pnpm --filter @learning/desktop bundle:win`。构建脚本生成的默认配置使用 `127.0.0.1`。分享安装包前也应检查其中的配置和文件；Git 忽略规则不会清理单独分发的 ZIP。
