# 我的游戏网站（AI 游戏合集）

这里是我用 AI 辅助开发的小游戏合集。所有游戏都是单文件 HTML，打开即玩，无需下载安装。

## 在线访问

- 网站首页：`https://<你的 Cloudflare Pages 地址>.pages.dev/`
- 游戏列表：`/games.html`（自动生成，列出所有游戏）
- 试玩示例：`/guess-number.html`（猜数字）、`/NeonBreakout.html`（霓虹弹球）

## 目录结构

| 文件 | 说明 |
|------|------|
| `index.html` | 网站首页（介绍 + 入口 + 相关链接） |
| `games.html` | 游戏导航页，**由 `build.mjs` 自动生成，不纳入版本库** |
| `template.html` | 新建游戏的模板（含「返回首页」链接） |
| `build.mjs` | 零依赖 Node 脚本：扫描根目录所有 `.html`，生成 `games.html` |
| `guess-number.html` | 猜数字小游戏（含数字键盘） |
| `NeonBreakout.html` | 霓虹弹球游戏 |
| `.gitignore` | 忽略 `.workbuddy/`、`games.html` 等杂项 |

> 新增游戏后，`games.html` 会自动出现在导航里，无需手动维护。

## 如何新增一个游戏

1. 复制 `template.html`，重命名为 `xxx.html`（放在仓库根目录，URL 即 `/xxx.html`）
2. 修改文件里的 `<title>` 和页面内容
3. 提交并推送：
   ```bash
   git add .
   git commit -m "新增 xxx 游戏"
   git push
   ```
4. Cloudflare 会自动运行 `node build.mjs` 重建 `games.html` 并重新部署，新游戏立刻上线

## 部署（Cloudflare Pages）

仓库已连接 GitHub，每次 push 到 `main` 都会自动构建并部署：

- **Framework preset**：`None`
- **Build command**：`node build.mjs`
- **Build output directory**：`.`（仓库根目录）
- **Production branch**：`main`

> `build.mjs` 零依赖，无需 `npm install`。脚本会扫描根目录所有 `.html`，排除 `index.html` / `games.html` / `template.html`，把其余页面提取标题后生成 `games.html` 导航页。

## 相关链接

- 源码（GitHub 仓库）：<https://github.com/aigamehtml/game>
- 源码备份（夸克网盘）：<https://pan.quark.cn/s/c0e77584800d>
- 开发过程记录（微信公众号「边玩边赚日记」）：<https://mp.weixin.qq.com/s/Tigq5s7gFOb2LtR8kdKRHg>

## 本地预览

```bash
# 生成导航页
node build.mjs
# 然后用浏览器打开 index.html 即可
```
