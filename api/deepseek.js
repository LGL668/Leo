// 文件路径：api/deepseek.js
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: '只支持 POST 请求' });

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return res.status(500).json({ error: '服务端未配置 API Key' });

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner', // 👈 【修改这里】切换为深度思考模型
        messages: req.body.messages,
        stream: false,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
    
  } catch (error) {
    return res.status(500).json({ error: '代理服务器内部错误: ' + error.message });
  }
};
