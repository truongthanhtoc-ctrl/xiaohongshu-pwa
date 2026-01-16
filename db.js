// IndexedDB 数据库管理
class PostDatabase {
    constructor() {
        this.dbName = 'XHSCollectorDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains('posts')) {
                    const objectStore = db.createObjectStore('posts', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    objectStore.createIndex('link', 'link', { unique: true });
                    objectStore.createIndex('collectedTime', 'collectedTime', { unique: false });
                }
            };
        });
    }

    async addPost(post) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['posts'], 'readwrite');
            const objectStore = transaction.objectStore('posts');

            // 检查是否已存在
            const linkIndex = objectStore.index('link');
            const checkRequest = linkIndex.get(post.link);

            checkRequest.onsuccess = () => {
                if (checkRequest.result) {
                    reject(new Error('帖子已存在'));
                } else {
                    const addRequest = objectStore.add({
                        ...post,
                        collectedTime: Date.now()
                    });
                    addRequest.onsuccess = () => resolve(addRequest.result);
                    addRequest.onerror = () => reject(addRequest.error);
                }
            };
        });
    }

    async getAllPosts() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['posts'], 'readonly');
            const objectStore = transaction.objectStore('posts');
            const request = objectStore.getAll();

            request.onsuccess = () => {
                const posts = request.result;
                // 按时间倒序排列
                posts.sort((a, b) => b.collectedTime - a.collectedTime);
                resolve(posts);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async deletePost(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['posts'], 'readwrite');
            const objectStore = transaction.objectStore('posts');
            const request = objectStore.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clearAll() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['posts'], 'readwrite');
            const objectStore = transaction.objectStore('posts');
            const request = objectStore.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getCount() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['posts'], 'readonly');
            const objectStore = transaction.objectStore('posts');
            const request = objectStore.count();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async exportToJSON() {
        const posts = await this.getAllPosts();
        return JSON.stringify(posts, null, 2);
    }
}

// 导出数据库实例
const db = new PostDatabase();
