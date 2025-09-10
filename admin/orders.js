// 订单管理页面
function loadOrders() {
    const pageElement = document.getElementById('orders-page');
    const loadingElement = pageElement.querySelector('.loading');
    
    // 获取筛选后的数据
    const filteredOrders = currentFilter === 'all' ? allOrders : allOrders.filter(order => order.site === currentFilter);
    
    // 计算订单统计数据
    const orderStats = calculateOrderStats(filteredOrders);
    
    // 构建页面内容
    const content = `
        <!-- 订单统计概览 -->
        <div class="order-stats-grid">
            <div class="order-stat-card">
                <div class="stat-header">
                    <div class="stat-title">订单总数</div>
                    <div class="stat-icon">📦</div>
                </div>
                <div class="stat-number">${orderStats.totalOrders}</div>
                <div class="stat-description">全部订单数量</div>
            </div>

            <div class="order-stat-card">
                <div class="stat-header">
                    <div class="stat-title">待付款</div>
                    <div class="stat-icon">⏳</div>
                </div>
                <div class="stat-number">${orderStats.pendingOrders}</div>
                <div class="stat-description">等待付款订单</div>
            </div>

            <div class="order-stat-card">
                <div class="stat-header">
                    <div class="stat-title">总金额</div>
                    <div class="stat-icon">💰</div>
                </div>
                <div class="stat-number">$${orderStats.totalAmount.toFixed(2)}</div>
                <div class="stat-description">订单总金额</div>
            </div>

            <div class="order-stat-card">
                <div class="stat-header">
                    <div class="stat-title">平均订单</div>
                    <div class="stat-icon">📊</div>
                </div>
                <div class="stat-number">$${orderStats.averageOrder.toFixed(2)}</div>
                <div class="stat-description">平均订单金额</div>
            </div>
        </div>

        <!-- 订单状态分布 -->
        <div class="orders-section">
            <div class="section-title">📋 订单状态分布</div>
            <div class="status-distribution">
                <div class="status-item pending">
                    <div class="status-bar" style="width: ${orderStats.statusDistribution.pending}%"></div>
                    <span class="status-label">⏳ 待付款: ${orderStats.statusCounts.pending} 个</span>
                </div>
                <div class="status-item processing">
                    <div class="status-bar" style="width: ${orderStats.statusDistribution.processing}%"></div>
                    <span class="status-label">🔄 处理中: ${orderStats.statusCounts.processing} 个</span>
                </div>
                <div class="status-item completed">
                    <div class="status-bar" style="width: ${orderStats.statusDistribution.completed}%"></div>
                    <span class="status-label">✅ 已完成: ${orderStats.statusCounts.completed} 个</span>
                </div>
                <div class="status-item cancelled">
                    <div class="status-bar" style="width: ${orderStats.statusDistribution.cancelled}%"></div>
                    <span class="status-label">❌ 已取消: ${orderStats.statusCounts.cancelled} 个</span>
                </div>
            </div>
        </div>

        <!-- 商品销售统计 -->
        <div class="orders-section">
            <div class="section-title">🛍️ 商品销售统计</div>
            <div class="product-stats-grid">
                ${generateProductStats(orderStats.productStats)}
            </div>
        </div>

        <!-- 订单操作工具栏 -->
        <div class="orders-section">
            <div class="section-title">🔧 订单管理工具</div>
            <div class="order-toolbar">
                <div class="search-bar">
                    <input type="text" id="order-search" placeholder="搜索订单ID、客户姓名或邮箱..." onkeyup="searchOrders(this.value)">
                    <button onclick="searchOrders(document.getElementById('order-search').value)">🔍 搜索</button>
                </div>
                <div class="toolbar-buttons">
                    <button onclick="exportOrders()" class="export-btn">📤 导出订单</button>
                    <button onclick="refreshOrders()" class="refresh-btn">🔄 刷新数据</button>
                    <select id="status-filter" onchange="filterByStatus(this.value)">
                        <option value="">全部状态</option>
                        <option value="Pending Payment">待付款</option>
                        <option value="Processing">处理中</option>
                        <option value="Completed">已完成</option>
                        <option value="Cancelled">已取消</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- 订单详细列表 -->
        <div class="orders-section">
            <div class="section-title">📋 订单详细清单</div>
            <div class="orders-table-container">
                <table class="orders-table">
                    <thead>
                        <tr>
                            <th onclick="sortOrders('id')">订单ID <span class="sort-icon">⚡</span></th>
                            <th onclick="sortOrders('customer')">客户信息 <span class="sort-icon">⚡</span></th>
                            <th onclick="sortOrders('product')">商品 <span class="sort-icon">⚡</span></th>
                            <th onclick="sortOrders('quantity')">数量 <span class="sort-icon">⚡</span></th>
                            <th onclick="sortOrders('total')">金额 <span class="sort-icon">⚡</span></th>
                            <th onclick="sortOrders('time')">下单时间 <span class="sort-icon">⚡</span></th>
                            <th onclick="sortOrders('status')">状态 <span class="sort-icon">⚡</span></th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="orders-tbody">
                        ${generateOrderRows(filteredOrders)}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 分页控制 -->
        <div class="pagination-container">
            <div class="pagination-info">
                显示 ${Math.min(filteredOrders.length, 20)} / ${filteredOrders.length} 条订单
            </div>
            <div class="pagination-buttons">
                <button onclick="changePage(-1)" ${filteredOrders.length <= 20 ? 'disabled' : ''}>← 上一页</button>
                <span class="page-number">1</span>
                <button onclick="changePage(1)" ${filteredOrders.length <= 20 ? 'disabled' : ''}>下一页 →</button>
            </div>
        </div>
    `;

    // 添加样式
    const styles = `
        <style>
            .order-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .order-stat-card {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
            }

            .order-stat-card:hover {
                transform: translateY(-5px);
            }

            .orders-section {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                padding: 30px;
                border-radius: 15px;
                margin-bottom: 30px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            }

            .status-distribution {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .status-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 10px 0;
            }

            .status-bar {
                height: 20px;
                border-radius: 10px;
                min-width: 20px;
                transition: width 0.5s ease;
            }

            .status-item.pending .status-bar {
                background: linear-gradient(135deg, #f39c12, #e67e22);
            }

            .status-item.processing .status-bar {
                background: linear-gradient(135deg, #3498db, #2980b9);
            }

            .status-item.completed .status-bar {
                background: linear-gradient(135deg, #27ae60, #229954);
            }

            .status-item.cancelled .status-bar {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
            }

            .status-label {
                font-weight: 600;
                min-width: 120px;
            }

            .product-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }

            .product-stat-card {
                padding: 20px;
                border: 2px solid;
                border-radius: 10px;
                text-align: center;
                transition: transform 0.3s ease;
            }

            .product-stat-card:hover {
                transform: scale(1.02);
            }

            .product-stat-card.vintage {
                border-color: #8b4513;
                background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(218, 165, 32, 0.1));
            }

            .product-stat-card.pop {
                border-color: #e94560;
                background: linear-gradient(135deg, rgba(233, 69, 96, 0.1), rgba(0, 212, 255, 0.1));
            }

            .product-stat-card.pudgy {
                border-color: #ff7675;
                background: linear-gradient(135deg, rgba(255, 118, 117, 0.1), rgba(0, 184, 148, 0.1));
            }

            .product-name {
                font-size: 1.2rem;
                font-weight: 700;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .product-metrics {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-top: 15px;
            }

            .product-metric {
                text-align: center;
                padding: 8px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 5px;
            }

            .metric-value {
                font-size: 1.1rem;
                font-weight: 600;
                color: #2c3e50;
            }

            .metric-label {
                font-size: 0.9rem;
                color: #7f8c8d;
            }

            .order-toolbar {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                align-items: center;
                justify-content: space-between;
            }

            .search-bar {
                display: flex;
                gap: 10px;
                flex: 1;
                min-width: 300px;
            }

            .search-bar input {
                flex: 1;
                padding: 10px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 25px;
                outline: none;
                transition: border-color 0.3s ease;
            }

            .search-bar input:focus {
                border-color: #667eea;
            }

            .search-bar button {
                padding: 10px 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                transition: transform 0.3s ease;
            }

            .search-bar button:hover {
                transform: translateY(-2px);
            }

            .toolbar-buttons {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .toolbar-buttons button, .toolbar-buttons select {
                padding: 8px 16px;
                border: 2px solid #e0e0e0;
                border-radius: 20px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .toolbar-buttons button:hover {
                border-color: #667eea;
                color: #667eea;
            }

            .export-btn {
                background: linear-gradient(135deg, #27ae60, #229954) !important;
                color: white !important;
                border: none !important;
            }

            .refresh-btn {
                background: linear-gradient(135deg, #3498db, #2980b9) !important;
                color: white !important;
                border: none !important;
            }

            .orders-table-container {
                overflow-x: auto;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }

            .orders-table {
                width: 100%;
                border-collapse: collapse;
                background: white;
                min-width: 1000px;
            }

            .orders-table th {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 15px 10px;
                text-align: left;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.3s ease;
                position: relative;
            }

            .orders-table th:hover {
                background: linear-gradient(135deg, #5a6fd8, #6a4190);
            }

            .sort-icon {
                position: absolute;
                right: 5px;
                opacity: 0.7;
                font-size: 0.8rem;
            }

            .orders-table td {
                padding: 12px 10px;
                border-bottom: 1px solid #e0e0e0;
                vertical-align: middle;
            }

            .orders-table tbody tr:hover {
                background: rgba(102, 126, 234, 0.05);
            }

            .customer-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .customer-name {
                font-weight: 600;
                color: #2c3e50;
            }

            .customer-email {
                font-size: 0.9rem;
                color: #7f8c8d;
            }

            .product-info {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .site-badge {
                padding: 4px 8px;
                border-radius: 10px;
                font-size: 0.8rem;
                font-weight: 600;
                color: white;
            }

            .site-badge.vintage {
                background: linear-gradient(135deg, #8b4513, #daa520);
            }

            .site-badge.pop {
                background: linear-gradient(135deg, #e94560, #00d4ff);
            }

            .site-badge.pudgy {
                background: linear-gradient(135deg, #ff7675, #00b894);
            }

            .status-badge {
                padding: 6px 12px;
                border-radius: 15px;
                font-size: 0.9rem;
                font-weight: 600;
                text-align: center;
                color: white;
            }

            .status-badge.pending {
                background: linear-gradient(135deg, #f39c12, #e67e22);
            }

            .status-badge.processing {
                background: linear-gradient(135deg, #3498db, #2980b9);
            }

            .status-badge.completed {
                background: linear-gradient(135deg, #27ae60, #229954);
            }

            .status-badge.cancelled {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
            }

            .order-actions {
                display: flex;
                gap: 5px;
            }

            .action-btn {
                padding: 4px 8px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: transform 0.2s ease;
            }

            .action-btn:hover {
                transform: scale(1.1);
            }

            .view-btn {
                background: #3498db;
                color: white;
            }

            .edit-btn {
                background: #f39c12;
                color: white;
            }

            .delete-btn {
                background: #e74c3c;
                color: white;
            }

            .pagination-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.9);
                padding: 20px 30px;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            }

            .pagination-info {
                color: #7f8c8d;
                font-weight: 600;
            }

            .pagination-buttons {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .pagination-buttons button {
                padding: 8px 16px;
                border: 2px solid #667eea;
                background: white;
                color: #667eea;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .pagination-buttons button:hover:not(:disabled) {
                background: #667eea;
                color: white;
            }

            .pagination-buttons button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .page-number {
                padding: 8px 16px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border-radius: 20px;
                font-weight: 600;
            }

            @media (max-width: 768px) {
                .order-stats-grid {
                    grid-template-columns: 1fr;
                }

                .product-stats-grid {
                    grid-template-columns: 1fr;
                }

                .order-toolbar {
                    flex-direction: column;
                    align-items: stretch;
                }

                .search-bar {
                    min-width: auto;
                }

                .toolbar-buttons {
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .pagination-container {
                    flex-direction: column;
                    gap: 15px;
                }
            }
        </style>
    `;

    // 更新页面内容
    pageElement.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">📦 订单管理</h1>
            <p class="page-subtitle">${getSiteFilterText()} - 用户订单统计分析和详细清单管理</p>
        </div>
        ${content}
        ${styles}
    `;
}

// 计算订单统计数据
function calculateOrderStats(orders) {
    const stats = {
        totalOrders: orders.length,
        pendingOrders: 0,
        totalAmount: 0,
        averageOrder: 0,
        statusCounts: {
            pending: 0,
            processing: 0,
            completed: 0,
            cancelled: 0
        },
        statusDistribution: {
            pending: 0,
            processing: 0,
            completed: 0,
            cancelled: 0
        },
        productStats: {
            vintage_model: { name: 'Classic Beauty Figurine', icon: '🎭', orders: 0, revenue: 0, quantity: 0 },
            pop_singer: { name: 'Ultimate Pop Star', icon: '🎤', orders: 0, revenue: 0, quantity: 0 },
            pudgy_character: { name: 'Adorable PudgyPal', icon: '🧸', orders: 0, revenue: 0, quantity: 0 }
        }
    };

    // 统计订单数据
    orders.forEach(order => {
        // 计算金额
        let amount = 0;
        if (order.total && typeof order.total === 'string') {
            const match = order.total.match(/[\d.]+/);
            amount = match ? parseFloat(match[0]) : 0;
        }
        stats.totalAmount += amount;

        // 统计状态
        const status = order.status.toLowerCase().replace(' ', '');
        if (status.includes('pending')) {
            stats.statusCounts.pending++;
            stats.pendingOrders++;
        } else if (status.includes('processing')) {
            stats.statusCounts.processing++;
        } else if (status.includes('completed')) {
            stats.statusCounts.completed++;
        } else if (status.includes('cancelled')) {
            stats.statusCounts.cancelled++;
        }

        // 统计商品
        if (stats.productStats[order.site]) {
            stats.productStats[order.site].orders++;
            stats.productStats[order.site].revenue += amount;
            stats.productStats[order.site].quantity += order.quantity || 1;
        }
    });

    // 计算平均订单金额
    stats.averageOrder = stats.totalOrders > 0 ? stats.totalAmount / stats.totalOrders : 0;

    // 计算状态分布百分比
    if (stats.totalOrders > 0) {
        Object.keys(stats.statusCounts).forEach(status => {
            stats.statusDistribution[status] = Math.round((stats.statusCounts[status] / stats.totalOrders) * 100);
        });
    }

    return stats;
}

// 生成商品统计卡片
function generateProductStats(productStats) {
    return Object.keys(productStats).map(site => {
        const product = productStats[site];
        const siteClass = site === 'vintage_model' ? 'vintage' : site === 'pop_singer' ? 'pop' : 'pudgy';
        
        return `
            <div class="product-stat-card ${siteClass}">
                <div class="product-name">
                    <span>${product.icon}</span>
                    <span>${product.name}</span>
                </div>
                <div class="product-metrics">
                    <div class="product-metric">
                        <div class="metric-value">${product.orders}</div>
                        <div class="metric-label">订单数</div>
                    </div>
                    <div class="product-metric">
                        <div class="metric-value">${product.quantity}</div>
                        <div class="metric-label">总销量</div>
                    </div>
                    <div class="product-metric">
                        <div class="metric-value">$${product.revenue.toFixed(2)}</div>
                        <div class="metric-label">收入</div>
                    </div>
                    <div class="product-metric">
                        <div class="metric-value">$${product.orders > 0 ? (product.revenue / product.orders).toFixed(2) : '0.00'}</div>
                        <div class="metric-label">客单价</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 生成订单行
function generateOrderRows(orders) {
    if (orders.length === 0) {
        return `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #7f8c8d;">
                    📦 暂无订单数据
                </td>
            </tr>
        `;
    }

    return orders.slice(0, 20).map(order => {
        const siteClass = order.site === 'vintage_model' ? 'vintage' : order.site === 'pop_singer' ? 'pop' : 'pudgy';
        const statusClass = order.status.toLowerCase().replace(' ', '');
        
        return `
            <tr>
                <td>
                    <strong>${order.id}</strong>
                </td>
                <td>
                    <div class="customer-info">
                        <span class="customer-name">${order.customer}</span>
                        <span class="customer-email">${order.email}</span>
                    </div>
                </td>
                <td>
                    <div class="product-info">
                        <span class="site-badge ${siteClass}">${getSiteInfo(order.site).name}</span>
                        <span>${order.product}</span>
                    </div>
                </td>
                <td>
                    <strong>${order.quantity}</strong>
                </td>
                <td>
                    <strong>${order.total}</strong>
                </td>
                <td>
                    ${order.time}
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${order.status}</span>
                </td>
                <td>
                    <div class="order-actions">
                        <button class="action-btn view-btn" onclick="viewOrder('${order.id}')" title="查看详情">👁️</button>
                        <button class="action-btn edit-btn" onclick="editOrder('${order.id}')" title="编辑订单">✏️</button>
                        <button class="action-btn delete-btn" onclick="deleteOrder('${order.id}')" title="删除订单">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 订单操作函数
function searchOrders(query) {
    console.log('搜索订单:', query);
    // 实现搜索逻辑
}

function filterByStatus(status) {
    console.log('按状态筛选:', status);
    // 实现状态筛选逻辑
}

function sortOrders(column) {
    console.log('排序订单:', column);
    // 实现排序逻辑
}

function exportOrders() {
    console.log('导出订单数据');
    alert('订单数据导出功能开发中...');
}

function refreshOrders() {
    console.log('刷新订单数据');
    refreshCurrentPage();
}

function viewOrder(orderId) {
    console.log('查看订单:', orderId);
    alert(`查看订单详情: ${orderId}\n\n功能开发中...`);
}

function editOrder(orderId) {
    console.log('编辑订单:', orderId);
    alert(`编辑订单: ${orderId}\n\n功能开发中...`);
}

function deleteOrder(orderId) {
    if (confirm(`确定要删除订单 ${orderId} 吗？`)) {
        console.log('删除订单:', orderId);
        alert('订单删除功能开发中...');
    }
}

function changePage(direction) {
    console.log('切换页面:', direction);
    // 实现分页逻辑
}
