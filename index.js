export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/search' && request.method === 'GET') {
      return handleSearch(request);
    }
    
    if (url.pathname === '/' && request.method === 'GET') {
      return handleIndex();
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

async function handleSearch(request) {
  const url = new URL(request.url);
  const keywords = url.searchParams.get('q');
  
  if (!keywords) {
    return new Response(JSON.stringify({ error: 'Missing search query' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const apiUrl = `http://api-shoulei-ssl.xunlei.com/oracle/subtitle?name=${encodeURIComponent(keywords)}`;
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 添加CORS头
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleIndex() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>字幕搜索工具</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .search-section {
            padding: 40px 30px;
        }
        
        .search-form {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }
        
        .search-input {
            flex: 1;
            padding: 15px 20px;
            font-size: 16px;
            border: 2px solid #e0e0e0;
            border-radius: 50px;
            outline: none;
            transition: border-color 0.3s;
        }
        
        .search-input:focus {
            border-color: #667eea;
        }
        
        .search-button {
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.3s;
        }
        
        .search-button:hover {
            transform: translateY(-2px);
        }
        
        .search-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .results-section {
            padding: 0 30px 40px;
        }
        
        .result-item {
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 15px;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .result-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .result-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }
        
        .result-info {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #666;
            font-size: 0.9rem;
        }
        
        .download-btn {
            display: inline-block;
            padding: 10px 20px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-size: 0.9rem;
            transition: background 0.3s;
        }
        
        .download-btn:hover {
            background: #764ba2;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .error {
            background: #fee;
            color: #c33;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .empty {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .search-section, .results-section {
                padding: 30px 20px;
            }
            
            .search-form {
                flex-direction: column;
            }
            
            .result-info {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>字幕搜索工具</h1>
            <p>快速搜索并下载各种视频字幕</p>
        </div>
        
        <div class="search-section">
            <form class="search-form" id="searchForm">
                <input type="text" class="search-input" id="searchInput" placeholder="输入视频名称或关键词..." required>
                <button type="submit" class="search-button" id="searchButton">搜索字幕</button>
            </form>
        </div>
        
        <div class="results-section" id="resultsSection">
            <div class="empty">输入关键词开始搜索字幕</div>
        </div>
    </div>

    <script>
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const resultsSection = document.getElementById('resultsSection');

        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const query = searchInput.value.trim();
            if (!query) return;
            
            searchButton.disabled = true;
            searchButton.textContent = '搜索中...';
            resultsSection.innerHTML = '<div class="loading">正在搜索字幕...</div>';
            
            try {
                const response = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`);
                const data = await response.json();
                
                if (data.code === 0 && data.data && data.data.length > 0) {
                    displayResults(data.data);
                } else {
                    resultsSection.innerHTML = '<div class="empty">未找到相关字幕</div>';
                }
            } catch (error) {
                resultsSection.innerHTML = \`<div class="error">搜索失败: \${error.message}</div>\`;
            } finally {
                searchButton.disabled = false;
                searchButton.textContent = '搜索字幕';
            }
        });
        
        function displayResults(results) {
            const html = results.map(item => \`
                <div class="result-item">
                    <div class="result-title">\${item.name}</div>
                    <div class="result-info">
                        <div class="info-item">
                            <span>📁</span>
                            <span>格式: \${item.ext?.toUpperCase() || 'SRT'}</span>
                        </div>
                        <div class="info-item">
                            <span>⏱️</span>
                            <span>时长: \${formatDuration(item.duration)}</span>
                        </div>
                        <div class="info-item">
                            <span>📊</span>
                            <span>来源: \${item.extra_name || '未知'}</span>
                        </div>
                    </div>
                    <a href="\${item.url}" class="download-btn" download>下载字幕</a>
                </div>
            \`).join('');
            
            resultsSection.innerHTML = html;
        }
        
        function formatDuration(ms) {
            if (!ms) return '未知';
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            
            if (hours > 0) {
                return \`\${hours}小时\${minutes % 60}分钟\`;
            } else if (minutes > 0) {
                return \`\${minutes}分钟\`;
            } else {
                return \`\${seconds}秒\`;
            }
        }
        
        // 支持回车搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchForm.dispatchEvent(new Event('submit'));
            }
        });
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}