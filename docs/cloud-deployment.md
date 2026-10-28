# 云部署建议（尚未实施）

当前代码只完成本机 / 局域网运行，没有创建云资源、接入云存储或上线域名。下面是建议的下一阶段方案，不能把现在的无登录本机版本直接当作可公开部署版本。

## 免费个人演示方案

| 部分 | 推荐 | 原因与限制 |
| --- | --- | --- |
| Next.js Web | Vercel Hobby | 原生适配 Next，自动 HTTPS 和 Git 部署；仅限非商业个人用途，受免费额度约束 |
| NestJS HTTP + WS | Render Free Web Service | 单个常驻 Node 进程承载 HTTP 与原生 WebSocket；无入站流量 15 分钟后休眠，冷启动约 1 分钟 |
| PostgreSQL | Supabase Free | 与现有 Prisma / PostgreSQL 兼容；免费数据库 500 MB，闲置一周可能暂停 |
| 图片与录音 | Supabase Storage Free | 私有 bucket 存媒体，免费文件存储 1 GB；有出站流量额度 |
| 登录 | Supabase Auth | 由 Nest 验证令牌，继续保留现有业务 API 与 WS 协议 |

适合个人学习和作品演示，不能承诺一直在线或永久免费。不要用 Render 免费服务本地目录存录音，文件会在重启 / 部署 / 休眠后丢失；不建议采用 Render 免费 PostgreSQL 作为长期数据库，因为它 30 天到期。也不要把 Nest WS 服务放进普通 Vercel Functions，WebSocket 服务需要独立运行。

## 需要实现的改动

1. 接入登录，替换固定 `ownerId = local-user`。HTTP 校验 access token，WS 建连时认证并把连接绑定到用户；广播按用户隔离，重连时刷新令牌。当前所有客户端共用本地身份，尚不具备公开多用户隔离能力。
2. 抽出媒体存储接口，保留本地实现，增加 Supabase Storage 实现。数据库仅存对象 key 与元数据；私有对象通过校验身份后的下载接口 / 短时签名 URL 提供访问。不要将 expiring signed URL 持久化进消息，也不要只缓存地址而不处理过期。
3. 25 MiB 的上传直接到 Nest 或通过短时授权上传到存储，避免经由 Web 部署平台的函数上传限制。保持文件大小、媒体类型和归属校验。
4. 增加 API 生产启动脚本与可复现容器构建，工作区先构建 protocol / client，生成 Prisma Client 后构建 API。数据库迁移作为一次性部署步骤执行，服务监听 `0.0.0.0` 与平台分配的 `PORT`。
5. 配置 Web 的 `NEXT_PUBLIC_API_URL`、API 的 `DATABASE_URL` 和精确 Web 来源。所有客户端使用 HTTPS / WSS；桌面配置支持 HTTPS 地址，Flutter 用 `--dart-define` 指定云 API。
6. 加入持续集成：TS 检查与测试、Flutter 检查、构建、数据库迁移检查。连接生产数据库的密钥和存储管理密钥只放服务端环境变量，不能放 `NEXT_PUBLIC_*` 或客户端包。

浏览器的 WebSocket API 不能随意设置 Authorization 请求头。鉴权实现可选 HTTPS 接口签发短时一次性 WS 票据，或连接后的认证首帧；认证完成前禁止业务消息与广播。避免把长期 access token 放在可能被日志记录的连接 URL 中。

## 部署顺序

先完成认证和云媒体适配，再创建同一区域的 Supabase 与 Render 项目，配置数据库连接和存储密钥、执行迁移、部署 Nest，确认 HTTPS 健康检查和 WSS。Prisma 在长驻 Nest 中使用单个客户端；按 Supabase 实际网络条件选择直连或 session pooler，迁移连接单独配置，避免不加区分地套用 transaction pooler。

随后在 Vercel 配置 monorepo 构建与 Next 项目输出，设置构建时 API 地址；把最终 Web 域名加入 Nest 允许来源，再验证中英切换、登录、文字、录音、图片、断线重连和跨用户隔离。最后让桌面与手机切换到同一个云 API。

本地数据迁移要同时迁移 PostgreSQL 记录和对应媒体文件，并把原本的本地身份映射到实际用户。首次演示也可使用独立空数据库，保留本机数据作为日常学习环境。

## 可靠性与成本取舍

当前最适合先把 Android / Windows 验收完，再做上述免费演示环境。应用应显示冷启动 / 重连状态，允许用户等待或重试，不用定时访问绕过服务商休眠政策。媒体容量很容易先于文本数据库用尽，需要设置配额与保留策略，并自行保存数据备份。

正式日常使用时，建议升级为不休眠的 API 实例，并选择有备份的数据库；也可用一台按月付费的小型 VPS，通过 Docker Compose + HTTPS 反向代理承载 Nest / Next / PostgreSQL，媒体使用对象存储。VPS 更集中，但数据库备份和机器维护需要自己负责。中国大陆实际访问海外免费服务的延迟需单独测试。

## 官方依据

2026-10-27 已核对以下官方页面；开通时再次检查额度和政策：

- [Vercel Hobby](https://vercel.com/docs/plans/hobby)
- [Render 免费服务：休眠、文件系统、750 小时与数据库到期](https://render.com/docs/free)
- [Supabase 价格与免费额度](https://supabase.com/pricing)
