// AI关键词库
const AI_KEYWORDS = [
    'AI', 'ai', '人工智能', '机器学习', '深度学习', '神经网络',
    'ChatGPT', 'chatgpt', 'GPT', 'gpt', '大模型', 'AIGC', 'aigc',
    '文心一言', '通义千问', 'Kimi', 'kimi', 'Claude', 'claude',
    'Gemini', 'gemini', 'Midjourney', 'midjourney', 'Sora', 'sora',
    'Copilot', 'copilot', 'LLM', 'llm', 'prompt', 'Prompt', '提示词',
    '大语言模型', 'AI绘画', 'AI作图', '文生视频', 'AI视频',
    '智能助手', '机器人', '自然语言处理', 'NLP', 'nlp',
    '计算机视觉', 'CV', '图像识别', '语音识别',
    'Stable Diffusion', 'stable diffusion', 'Transformer', 'transformer'
];

// 应用状态
let isCollecting = false;
let collectedCount = 0;
let xhsWindow = null;

// DOM元素
const elements = {
    status: document.getElementById('status'),
    collectedCount: document.getElementById('collected-count'),
    postsList: document.getElementById('posts-list'),
    startBtn: document.getElementById('start-btn'),
    stopBtn: document.getElementById('stop-btn'),
    openXhsBtn: document.getElementById('open-xhs-btn'),
    loadBtn: document.getElementById('load-btn'),
    urlInput: document.getElementById('url-input'),
    exportBtn: document.getElementById('export-btn'),
    clearBtn: document.getElementById('clear-btn'),
    manualAddBtn: document.getElementById('manual-add-btn'),
    manualDialog: document.getElementById('manual-dialog'),
    closeDialog: document.getElementById('close-dialog'),
    saveManual: document.getElementById('save-manual'),
    cancelManual: document.getElementById('cancel-manual')
};

// 初始化应用
async function initApp() {
    try {
        await db.init();
        await loadPosts();
        updateCount();
        setupEventListeners();
        updateStatus('准备就绪');
    } catch (error) {
        console.error('初始化失败:', error);
        updateStatus('初始化失败');
    }
}

// 设置事件监听器
function setupEventListeners() {
    elements.startBtn.addEventListener('click', startCollecting);
    elements.stopBtn.addEventListener('click', stopCollecting);
    elements.openXhsBtn.addEventListener('click', openXiaohongshu);
    elements.loadBtn.addEventListener('click', loadUrl);
    elements.exportBtn.addEventListener('click', exportData);
    elements.clearBtn.addEventListener('click', clearAllPosts);
    elements.manualAddBtn.addEventListener('click', () => {
        elements.manualDialog.style.display = 'flex';
    });
    elements.closeDialog.addEventListener('click', closeManualDialog);
    elements.cancelManual.addEventListener('click', closeManualDialog);
    elements.saveManual.addEventListener('click', saveManualPost);
}

// 打开小红书
function openXiaohongshu() {
    const url = elements.urlInput.value || 'https://www.xiaohongshu.com/search_result?keyword=AI';
    xhsWindow = window.open(url, 'XiaohongshuWindow', 'width=1200,height=800');
    updateStatus('已打开小红书窗口，请登录后返回');
}

// 加载URL
function loadUrl() {
    openXiaohongshu();
}

// 开始收集
async function startCollecting() {
    if (!xhsWindow || xhsWindow.closed) {
        alert('请先打开小红书窗口！');
        return;
    }

    isCollecting = true;
    elements.startBtn.disabled = true;
    elements.stopBtn.disabled = false;
    updateStatus('正在收集AI相关帖子...');

    // 模拟收集过程（实际需要用户在小红书窗口中手动操作）
    showCollectionInstructions();
}

// 显示收集说明
function showCollectionInstructions() {
    const instructions = `
📋 收集步骤：

1. 在打开的小红书窗口中，浏览AI相关内容
2. 找到感兴趣的帖子后，复制帖子链接
3. 返回此页面，点击"手动添加"按钮
4. 粘贴链接并填写信息
5. 点击"保存"即可收集

💡 提示：由于浏览器安全限制，暂时需要手动添加帖子。
我们正在开发浏览器扩展版本，届时可实现自动收集！
    `;

    alert(instructions);
}

// 停止收集
function stopCollecting() {
    isCollecting = false;
    elements.startBtn.disabled = false;
    elements.stopBtn.disabled = true;
    updateStatus('已停止收集');
}

// 检查文本是否包含AI关键词
function containsAIKeyword(text) {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return AI_KEYWORDS.some(keyword =>
        text.includes(keyword) || lowerText.includes(keyword.toLowerCase())
    );
}

// 提取匹配的关键词
function getMatchedKeywords(text) {
    if (!text) return [];
    const matched = [];
    const lowerText = text.toLowerCase();

    AI_KEYWORDS.forEach(keyword => {
        if (text.includes(keyword) || lowerText.includes(keyword.toLowerCase())) {
            matched.push(keyword);
        }
    });

    return [...new Set(matched)];
}

// 添加帖子
async function addPost(post) {
    try {
        await db.addPost(post);
        await loadPosts();
        updateCount();
        updateStatus(`成功添加帖子: ${post.title}`);
        return true;
    } catch (error) {
        if (error.message.includes('已存在')) {
            updateStatus('该帖子已经收集过了');
        } else {
            console.error('添加帖子失败:', error);
            updateStatus('添加帖子失败');
        }
        return false;
    }
}

// 加载帖子列表
async function loadPosts() {
    try {
        const posts = await db.getAllPosts();
        renderPosts(posts);
    } catch (error) {
        console.error('加载帖子失败:', error);
    }
}

// 渲染帖子列表
function renderPosts(posts) {
    if (posts.length === 0) {
        elements.postsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p>还没有收集任何帖子</p>
                <p class="empty-hint">点击"开始收集"按钮开始收集AI相关帖子</p>
            </div>
        `;
        return;
    }

    elements.postsList.innerHTML = posts.map(post => `
        <div class="post-card" onclick="openPost('${post.link}')">
            <div class="post-title">${escapeHtml(post.title)}</div>
            <div class="post-meta">
                <span>👤 ${escapeHtml(post.author)}</span>
            </div>
            <div class="post-content">${escapeHtml(post.contentSnippet)}</div>
            <div class="post-keywords">
                ${post.keywords.map(kw => `<span class="keyword-tag">${escapeHtml(kw)}</span>`).join('')}
            </div>
            <div class="post-time">${formatTime(post.collectedTime)}</div>
        </div>
    `).join('');
}

// 打开帖子
function openPost(link) {
    window.open(link, '_blank');
}

// 更新计数
async function updateCount() {
    try {
        const count = await db.getCount();
        collectedCount = count;
        elements.collectedCount.textContent = count;
    } catch (error) {
        console.error('更新计数失败:', error);
    }
}

// 更新状态
function updateStatus(status) {
    elements.status.textContent = status;
}

// 导出数据
async function exportData() {
    try {
        const json = await db.exportToJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `xiaohongshu-ai-posts-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        updateStatus('数据导出成功');
    } catch (error) {
        console.error('导出失败:', error);
        updateStatus('导出失败');
    }
}

// 清空所有帖子
async function clearAllPosts() {
    if (!confirm('确定要清空所有收集的帖子吗？此操作不可恢复！')) {
        return;
    }

    try {
        await db.clearAll();
        await loadPosts();
        updateCount();
        updateStatus('已清空所有帖子');
    } catch (error) {
        console.error('清空失败:', error);
        updateStatus('清空失败');
    }
}

// 关闭手动添加对话框
function closeManualDialog() {
    elements.manualDialog.style.display = 'none';
    // 清空表单
    document.getElementById('manual-link').value = '';
    document.getElementById('manual-title').value = '';
    document.getElementById('manual-author').value = '';
    document.getElementById('manual-content').value = '';
    document.getElementById('manual-keywords').value = '';
}

// 保存手动添加的帖子
async function saveManualPost() {
    const link = document.getElementById('manual-link').value.trim();
    const title = document.getElementById('manual-title').value.trim();
    const author = document.getElementById('manual-author').value.trim();
    const content = document.getElementById('manual-content').value.trim();
    const keywordsInput = document.getElementById('manual-keywords').value.trim();

    if (!link || !title) {
        alert('请至少填写帖子链接和标题！');
        return;
    }

    const keywords = keywordsInput ? keywordsInput.split(',').map(k => k.trim()) : [];

    // 如果没有手动输入关键词，尝试从标题和内容中提取
    if (keywords.length === 0) {
        const allText = `${title} ${content}`;
        const matched = getMatchedKeywords(allText);
        keywords.push(...matched);
    }

    const post = {
        link,
        title,
        author: author || '未知作者',
        contentSnippet: content || '',
        keywords
    };

    const success = await addPost(post);
    if (success) {
        closeManualDialog();
    }
}

// 工具函数：转义HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 工具函数：格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 启动应用
initApp();
