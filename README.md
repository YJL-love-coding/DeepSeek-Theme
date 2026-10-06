# DeepSeek 玻璃美化 (Better-DeepSeek-theme)

给 DeepSeek 网页版（chat.deepseek.com）穿上苹果风液态玻璃皮肤的油猴脚本，支持自定义背景图、玻璃参数调节与字体黑白切换。

## 更新日志

### v1.1（2026-10-06）

**新增**
- 🔧 玻璃调参面板：模糊度 / 透明度 / 圆角 / 边框粗细，4 个滑块实时调参
- 🎨 6 种玻璃颜色：白、冰蓝、暖黄、淡紫、薄荷、粉
- ⚪⚫ 字体颜色切换（黑 / 白）
- ↩️ 恢复背景图（一键清空自定义背景，回到默认）
- ↩️ 恢复默认玻璃（一键还原全部调参）
- 💾 所有设置自动保存，刷新页面不丢（localStorage）

**移除**
- 🗑️ 边栏颜色功能——由玻璃调参统一管理颜色，全页面风格一致

### v1.0（2026-10-05）

**首个发布版本**
- 🧊 液态玻璃皮肤：侧边栏 / 对话框 / 聊天内容区磨砂玻璃质感
- ⚙️ 右下角齿轮设置面板（液态玻璃风格）
- 🎨 一键导入本地图片作为页面背景
- 💾 背景图自动保存，刷新页面不丢失
- 🎨 侧边栏 10 色换色（红橙黄绿青蓝紫粉灰深蓝黑）
- ↩️ 一键恢复默认（清除自定义颜色）

## 安装

1. 安装 [Tampermonkey（篡改猴）](https://www.tampermonkey.net/)
2. 安装 [Better DeepSeek](https://microsoftedge.microsoft.com/addons/detail/better-deepseek/goboedojlaeplneahnmnobmendoeblld)
3. 打开 `better-deepseek-theme.user.js`，点击安装
4. 打开 [chat.deepseek.com](https://chat.deepseek.com) 即可生效

## 使用

- 右下角齿轮 ⚙ 打开设置面板
- 「🎨 换背景」：选择本地图片，立即铺满页面，刷新不丢
- 「↩️ 恢复背景」：清除背景图，回到默认底色
- 「🔧 玻璃调参」：展开 4 个滑块 + 颜色 + 字体色 + 恢复默认，全部实时生效

## 技术栈

- HTML / CSS / JavaScript
- Tampermonkey 油猴脚本（GM_addStyle + CSS 变量 + localStorage 持久化）

## 许可证

[MIT](LICENSE)
