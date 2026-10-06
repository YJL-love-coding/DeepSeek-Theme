# DeepSeek 液态玻璃美化 (deepseek-glass-theme)

给 DeepSeek 网页版（chat.deepseek.com）穿上苹果风液态玻璃皮肤，并支持自定义背景图与侧边栏换色。

## 功能

- 🧊 侧边栏 / 对话框 / 聊天内容区磨砂玻璃质感
- ⚙️ 右下角齿轮设置面板（液态玻璃风格）
- 🎨 一键导入本地图片作为页面背景
- 💾 背景图自动保存，刷新页面不丢失
- 🎨 侧边栏 10 色换色（红橙黄绿青蓝紫粉灰深蓝黑）
- ↩️ 一键恢复默认（清除自定义颜色）

## 安装

1. 安装 [Tampermonkey（篡改猴）](https://www.tampermonkey.net/)
2. 安装 [Better DeepSeek](https://microsoftedge.microsoft.com/addons/detail/better-deepseek/goboedojlaeplneahnmnobmendoeblld)
3. 打开 `deepseek-glass-theme.user.js`，点击安装
4. 打开 [chat.deepseek.com](https://chat.deepseek.com) 即可生效

## 使用

- 右下角齿轮 ⚙ 打开设置面板
- 「🎨 换背景」：选择本地图片，立即铺满页面，刷新不丢
- 「🎨 边栏颜色」：展开 10 色色板，点击即可给侧边栏换色；斜线圆点恢复默认

## 技术栈

- HTML / CSS / JavaScript
- Tampermonkey 油猴脚本（GM_addStyle + localStorage 持久化）

## 许可证

[MIT](LICENSE)
