# 字幕搜索工具

一个基于Cloudflare Workers的在线字幕搜索工具，使用迅雷字幕API提供搜索服务。

## 功能特点

- 🎯 快速搜索各种视频字幕
- 📱 响应式设计，支持移动设备
- ⚡ 基于Cloudflare Workers，全球CDN加速
- 🎨 现代化UI设计，用户体验优秀
- 📥 一键下载字幕文件

## 技术栈

- **后端**: Cloudflare Workers
- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **API**: 迅雷字幕搜索API

## 部署说明

### 1. 准备工作

- 安装 [Node.js](https://nodejs.org/)
- 安装 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

```bash
npm install -g wrangler
```

### 2. 克隆项目

```bash
git clone [your-repo-url]
cd srt-subtitle-search
```

### 3. 安装依赖

```bash
npm install
```

### 4. 配置Wrangler

登录到Cloudflare账户：

```bash
wrangler login
```

### 5. 本地开发

```bash
npm run dev
```

### 6. 部署到Cloudflare

```bash
npm run deploy
```

## API 接口

### 搜索字幕

```
GET /api/search?q={keywords}
```

**参数说明:**
- `q`: 搜索关键词

**返回格式:**
```json
{
  "code": 0,
  "data": [
    {
      "gcid": "...",
      "cid": "...",
      "url": "https://...",
      "ext": "srt",
      "name": "filename.srt",
      "duration": 7089000,
      "languages": [""],
      "source": 0,
      "score": 0,
      "fingerprintf_score": 0,
      "extra_name": "（网友上传）",
      "mt": 2
    }
  ]
}
```

## 项目结构

```
srt-subtitle-search/
├── index.js          # 主Worker文件
├── package.json      # 项目配置
├── wrangler.toml     # Cloudflare配置
└── README.md         # 项目文档
```

## 使用说明

1. 访问部署的URL
2. 在搜索框中输入视频名称或关键词
3. 点击"搜索字幕"按钮
4. 浏览搜索结果并下载所需字幕

## 注意事项

- 本工具仅供学习和研究使用
- 请尊重版权，合理使用字幕资源
- 部分字幕可能来自用户上传，质量参差不齐

## 许可证

MIT License