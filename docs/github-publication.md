# 同步 GitHub 与开源

源代码公开后，别人可以了解项目实现，但不会因此自动获得本机 `.data` 中的数据。真正的风险是将数据、配置、密钥或历史提交一起上传，以及把当前无认证的 API 暴露到公网。公开仓库与公开运行服务是两件事。

## 当前准备

- 项目已在本机初始化 Git，默认分支为 `main`。
- 根忽略规则覆盖真实 `.env` 及其变体、数据库与媒体、调试截图与日志、SDK、构建产物、签名材料和 IDE 用户状态；仅开放环境配置模板。
- Windows 文档使用示例局域网 IP，不记录维护者实际 IP。现有本机配置和测试包保留原样，仍可继续验证。
- 目标为公开仓库 `git@github.com:RichardLeung/full-stack.git`。项目所有者已选择 [MIT 许可证](../LICENSE)，版权署名采用 GitHub 公开账号 `RichardLeung`。
- 2026-10-28：对按 Git 忽略规则筛选出的源码副本使用 Gitleaks 8.30.1 扫描，未发现其规则可识别的密钥；另检查了个人绝对路径、凭据赋值、候选文件和设计总览图。未发现需要上传的真实学习数据或个人配置。这不构成无泄露或无漏洞的保证；后续新增内容仍需检查。

## 首次提交前

查看将要纳入 Git 的文件：

```sh
git status --short --untracked-files=all
git check-ignore -v apps/api/.env .data/ .tools/ apps/desktop/out/ apps/mobile/build/
```

只提交源码和模板。`compose.yaml` 的 `local-development-only` 是公开的开发占位密码，不应复用于云数据库。`package.json` 的 `private: true` 只防止误发布 npm 包，不会阻止把仓库公开到 GitHub。

Git 提交的作者名称和邮箱也会公开。若不希望公开真实邮箱，在 GitHub Settings → Emails 中取得自己的 noreply 邮箱，并仅对本仓库设置：

本次初始化已仅在本仓库使用公开账号 `RichardLeung` 和 GitHub 账号对应的 noreply 邮箱；没有修改全局 Git 身份。

```sh
git config user.name "你的公开署名"
git config user.email "GitHub 提供的 noreply 邮箱"
```

不要把上述文字占位符原样用于提交。已有作者配置可沿用，但应确认它适合公开。

推荐用 Gitleaks 等工具检查本次待提交文件；以后也应检查新增提交。扫描不能识别全部个人信息，截图、图片和学习内容需要人工检查。若检查历史，使用完整 Git 历史，而不是只扫描当前目录。

## GitHub 仓库与推送

在 GitHub 创建仓库时，可以先设为 Private；核对源码和许可证后再设为 Public。公开后也可启用 Secret scanning、Push protection 和 Dependabot（具体可用性以仓库设置为准）。这些功能不能代替本地检查。

若使用现有本机仓库，创建空的远端，不要额外勾选初始化 README、LICENSE 或 `.gitignore`。选定许可证、确认提交文件及作者信息后：

```sh
git add .
git diff --cached --stat
git diff --cached --check
git commit -m "Initial Learning Notes MVP"
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
```

替换仓库地址后再运行。GitHub HTTPS 推送需要凭据管理器或其他已配置的认证；不要把访问令牌拼在 URL、源码或命令示例中，也不要把令牌发送到聊天里。若远端已有提交，先检查历史再同步，不要强制推送覆盖。

## 许可证与第三方内容

项目采用 MIT：允许使用、修改、再分发和商用，要求保留版权及许可声明。许可证只覆盖项目所有者有权授权的部分。

项目自己的许可证不能替代第三方依赖的许可证。本次查看到的直接 JavaScript 依赖声明主要为 MIT、Apache-2.0、BSD 和 ISC；这不是所有间接依赖或二进制分发的完整许可审计。分发 App / Electron 安装包时还要保留所包含组件要求的 notices / licenses。

只公开有权分发的学习素材。个人录音、教材扫描、真实简历或聊天截图不应作为示例数据上传；使用合成内容。微信配色与布局参考不代表与微信或腾讯有关联，也不应复制其商标或专有素材。
