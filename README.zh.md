# dsh-matu-tutor

[English](README.md) | 中文

一个把电子科技大学**码图（APTAT）**C 语言作业变成本地工作台的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）插件：读题、在正经编辑器里写代码、用本机编译器编译运行、真实提交拿到评分，并且由 AI 助教讲评，而不是直接甩给你答案。

它只服务一个特定的课程平台，所以你需要有 `matu.uestc.edu.cn` 的账号才有用。

## 它做什么

- **同步作业**：登录一次，作业分组、题目、提交次数、最近得分都会拉到本机。
- **每题一个本地工程**：每题独立目录，含 `solution.c`（真正提交的文件）、`harness.c`（本地测试用的 `main`，不会上传）和 `input.txt`。
- **真正的代码编辑器**：行号、C 语法高亮、自动缩进、括号配对、多行缩进、`Ctrl+/` 注释切换、`Ctrl+S` 保存、`Ctrl+Enter` 编译并运行。
- **本机编译**：用 `gcc -std=c11 -Wall -Wextra -O2` 编译，再用 stdin 标签页里的内容运行，输出实时流式显示。
- **真实提交**：上传到码图、等待评测、返回分数；低于 100 分时读回扣分原因。
- **AI 助教**：流式回复，上下文里有当前题目、你当前的代码和对话历史。它被要求先原样引用题目里"输出……"那一句再动笔，先给出分层的功能框架，然后一个功能块一个功能块地推进；你说明的长期教学偏好会被记进一个跨题生效的档案。
- **凭据只进系统凭据库**：不写进源码、缓存，也不进模型提示词。

## 安装

需要 DeepSeek Harness **0.2.x**，以及 `PATH` 上的 C 编译器（`gcc`；Windows 上插件还会探测常见的 MSYS2、MinGW、Chocolatey、Scoop 安装位置）。

**桌面版**：打开 **插件 / Plugins**，选 **Add plugin**，填仓库地址：

```
https://github.com/Kostyastudy/dsh-matu-tutor
```

**命令行：**

```sh
dsh plugin --profile <你的profile> add github:Kostyastudy/dsh-matu-tutor
```

然后在左侧栏打开 **码图 C 助教**，用码图账号登录。

没有构建步骤，也没有需要安装的依赖——插件就是几个纯 ES 模块加一个浏览器模块。

## Windows 上没有编译器

本地编译和运行需要 `gcc`。如果装了 MSYS2：

```powershell
winget install MSYS2.MSYS2
C:\msys64\usr\bin\bash -lc "pacman -S --needed mingw-w64-x86_64-gcc"
```

插件会依次查找 `C:\msys64\mingw64\bin`、`ucrt64`、`clang64`、`C:\mingw64`、`C:\MinGW`、Chocolatey 的 MinGW 路径和 Scoop 的 `gcc/current`，都没有才退回 `PATH` 上的 `gcc`。

除了编译/运行，其余功能没有编译器也能用。

## 数据放在哪

默认放在 `~/.dsh-matu-tutor`（Windows 上是 `%USERPROFILE%\.dsh-matu-tutor`）：

```
~/.dsh-matu-tutor/
├─ cache.json           同步下来的作业与题目
├─ tutor-profile.json   助教记住的教学偏好
├─ tutor-model.json     你为助教单独选的模型（改过才有）
├─ projects/task-<id>/  solution.c / harness.c / input.txt / meta.json
└─ chats/task-<id>.json 你的辅导对话
```

可以用配置项 `dataDir` 或环境变量 `DSH_MATU_TUTOR_DATA` 换位置。

## 用之前要知道的

- **提交是真实的**。每次消耗一次课程允许的提交次数，先在本地测。
- **AI 助教会产生模型调用费用**。默认用你 Harness 当前的模型，也可以在面板里给助教单独指定。
- **码图是校内服务**。`matu.uestc.edu.cn` 不保证每个网络都能访问。登录超时的时候先用浏览器打开 `http://matu.uestc.edu.cn`——如果浏览器也打不开，那是服务器或线路的问题，不是插件的问题。
- **它读的是网页 HTML，不是 API**。码图没有公开接口，插件靠解析 JSP 页面工作。站点改版的话，同步或提交会失效，直到解析器跟着更新。
- **一个 Harness profile 对应一个账号**。保存的凭据是一份码图登录信息。
- **插件的 HTTP 路由和 DSH 自己的路由一样受保护**。它们走 `ctx.connection.requestRejection`，所以别的源上的页面调不到；插件令牌也只会交给 DSH 页面本身。

## 它是怎么搭的

| 部分 | 文件 | 说明 |
| --- | --- | --- |
| Host 半 | `index.js`、`aptat.js`、`html.js` | 通过 `ctx.webServer` 提供 `/aptat-api/*`；用到 `ctx.credentials`、`ctx.subprocess`、`ctx.llm`、`ctx.agentDefaultModel` |
| Client 半 | `client.js` | 通过 `ctx.slots` 在 `sidebar.panellist` 注册 `aptat` 入口，在 `main` 注册 `aptat` 面板 |
| Bundle | `cordis.patch.yml` | 插入一行 `matu-tutor` |

没有任何 npm 依赖：`html.js` 里是一个本地实现的小型 HTML 解析器，因为目标站点是老式服务端渲染 JSP，表格层层嵌套。

## 许可

MIT。与电子科技大学及码图团队无关，也未获其背书。
