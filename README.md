# 小红书AI收集器 - PWA版本

一个渐进式Web应用（PWA），可以收集小红书上所有AI相关的帖子，并使用PWABuilder打包成Android APK。

## ✨ 特性

- 🌐 **纯Web技术** - HTML + CSS + JavaScript
- 📱 **PWA支持** - 可安装到桌面和手机
- 💾 **离线功能** - 使用Service Worker缓存
- 🗄️ **本地存储** - IndexedDB保存数据
- 📦 **一键打包** - 使用PWABuilder生成APK
- 🎨 **Material Design** - 现代化UI设计

## 🚀 快速开始

### 方式1：本地运行

1. **启动本地服务器**

使用Python（推荐）：
```bash
cd C:\Users\simon\.gemini\antigravity\scratch\XiaohongshuPWA
python -m http.server 8000
```

或使用Node.js：
```bash
npx http-server -p 8000
```

2. **打开浏览器**

访问：`http://localhost:8000`

### 方式2：部署到GitHub Pages

1. **创建GitHub仓库**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/xiaohongshu-pwa.git
git push -u origin main
```

2. **启用GitHub Pages**
- 进入仓库Settings
- 找到Pages设置
- Source选择main分支
- 保存后获得HTTPS链接

### 方式3：使用PWABuilder打包APK

1. **部署PWA到网络**（必须是HTTPS）
   - 使用GitHub Pages（免费）
   - 或使用Netlify、Vercel等

2. **访问PWABuilder**
   - 打开 https://www.pwabuilder.com/
   - 输入您的PWA网址
   - 点击"Start"

3. **生成APK**
   - 等待分析完成
   - 选择"Android"平台
   - 配置应用信息：
     - Package ID: com.example.xhscollector
     - App name: 小红书AI收集器
     - Version: 1.0.0
   - 点击"Generate"
   - 下载生成的APK文件

4. **安装到Android设备**
   - 将APK传输到手机
   - 启用"未知来源"安装
   - 安装并使用

## 📖 使用说明

### 1. 打开小红书
- 点击"打开小红书"按钮
- 在新窗口中登录您的小红书账号
- 浏览AI相关内容

### 2. 收集帖子
由于浏览器安全限制，目前采用手动添加方式：

1. 在小红书窗口中找到感兴趣的AI帖子
2. 复制帖子链接
3. 返回收集器页面
4. 点击"手动添加"按钮
5. 粘贴链接并填写信息
6. 点击"保存"

### 3. 管理收集
- **查看列表** - 右侧面板显示所有收集的帖子
- **导出数据** - 点击"导出"按钮下载JSON文件
- **清空数据** - 点击"清空"按钮删除所有帖子

## 🎯 AI关键词库

应用会自动识别包含以下关键词的帖子：

**中文**：AI、人工智能、机器学习、深度学习、神经网络、ChatGPT、文心一言、通义千问、Kimi、Claude、Gemini、Midjourney、Sora、AIGC、提示词、大模型等

**英文**：artificial intelligence, machine learning, deep learning, LLM, GPT, prompt等

## 📁 项目结构

```
XiaohongshuPWA/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── app.js              # 应用逻辑
├── db.js               # IndexedDB数据库
├── manifest.json       # PWA配置
├── service-worker.js   # Service Worker
├── icons/              # 应用图标
│   ├── icon-192.png
│   └── icon-512.png
└── README.md           # 说明文档
```

## 🔧 技术栈

- **前端框架**：Vanilla JavaScript（无框架）
- **样式**：CSS3 + Material Design
- **数据库**：IndexedDB
- **PWA**：Service Worker + Manifest
- **打包工具**：PWABuilder

## ⚠️ 注意事项

### 浏览器限制
- Service Worker需要HTTPS或localhost
- IndexedDB在隐私模式下可能受限
- 跨域限制可能影响iframe嵌入

### 使用建议
- 建议使用Chrome或Edge浏览器
- 首次使用需要允许安装PWA
- 定期导出数据备份

### 法律声明
- ⚠️ 仅供个人学习和研究使用
- ⚠️ 请遵守小红书服务条款
- ⚠️ 不要用于商业用途或大规模数据采集

## 🔮 未来计划

- [ ] 开发浏览器扩展版本实现自动收集
- [ ] 添加更多过滤和搜索功能
- [ ] 支持标签分类管理
- [ ] 添加数据统计和可视化
- [ ] 支持云端同步

## 📝 PWABuilder配置建议

在PWABuilder中配置时，建议使用以下设置：

**Android选项**：
- Package ID: `com.example.xhscollector`
- App name: `小红书AI收集器`
- Theme color: `#FF2442`
- Background color: `#FFFFFF`
- Display mode: `standalone`
- Orientation: `portrait`

**高级选项**：
- Enable notifications: ✅
- Enable location: ❌
- Signing key: 自动生成

## 🆘 常见问题

**Q: 为什么不能自动收集？**
A: 由于浏览器安全策略，跨域访问受限。我们正在开发浏览器扩展版本。

**Q: 数据存储在哪里？**
A: 使用IndexedDB存储在浏览器本地，不会上传到服务器。

**Q: 如何备份数据？**
A: 点击"导出"按钮下载JSON文件，可随时导入。

**Q: PWABuilder生成的APK安全吗？**
A: 是的，PWABuilder是微软官方工具，生成的APK只是Web应用的包装器。

## 📄 许可证

本项目仅供学习和研究使用。请遵守小红书的服务条款和相关法律法规。

## 🙏 致谢

- PWABuilder - Microsoft
- Material Design - Google
- IndexedDB API - W3C
