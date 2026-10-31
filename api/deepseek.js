// 文件路径：api/deepseek.js
module.exports = async (req, res) => {
  // 1. 设置跨域请求头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理浏览器的预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  // 2. 检查环境变量
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '服务端未配置 API Key，请检查 Vercel 环境变量' });
  }

  try {
    // 3. 发送请求给 DeepSeek
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: req.body.messages,
        stream: false,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    // 4. 将 DeepSeek 的返回结果（包含可能存在的 401）原样返回
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('代理请求出错:', error);
    return res.status(500).json({ error: '代理服务器内部错误: ' + error.message });
  }
};
