// 数据统计页面 - 用户行为分析
function loadAnalytics() {
    const pageElement = document.getElementById('analytics-page');
    const loadingElement = pageElement.querySelector('.loading');
    
    // 获取筛选后的数据
    const filteredActivities = currentFilter === 'all' ? allActivities : allActivities.filter(activity => activity.site === currentFilter);
    const filteredOrders = currentFilter === 'all' ? allOrders : allOrders.filter(order => order.site === currentFilter);
    
    // 计算分析数据
    const analyticsData = calculateAnalyticsData(filteredActivities, filteredOrders);
    
    // 构建页面内容
    const content = `
        <!-- 用户行为概览 -->
        <div class="analytics-stats-grid">
            <div class="analytics-stat-card">
                <div class="stat-header">
                    <div class="stat-title">页面访问</div>
                    <div class="stat-icon">👁️</div>
                </div>
                <div class="stat-number">${analyticsData.totalPageViews.toLocaleString()}</div>
                <div class="stat-description">用户访问页面次数</div>
            </div>

            <div class="analytics-stat-card">
                <div class="stat-header">
                    <div class="stat-title">商品浏览</div>
                    <div class="stat-icon">🛍️</div>
                </div>
                <div class="stat-number">${analyticsData.totalProductViews.toLocaleString()}</div>
                <div class="stat-description">用户查看商品次数</div>
            </div>

            <div class="analytics-stat-card">
                <div class="stat-header">
                    <div class="stat-title">购买意向</div>
                    <div class="stat-icon">🛒</div>
                </div>
                <div class="stat-number">${analyticsData.totalPurchaseClicks.toLocaleString()}</div>
                <div class="stat-description">用户点击购买次数</div>
            </div>

            <div class="analytics-stat-card">
                <div class="stat-header">
                    <div class="stat-title">转化率</div>
                    <div class="stat-icon">📈</div>
                </div>
                <div class="stat-number">${analyticsData.conversionRate}%</div>
                <div class="stat-description">浏览到购买转化率</div>
            </div>
        </div>

        <!-- 用户行为漏斗分析 -->
        <div class="analytics-section">
            <div class="section-title">📊 用户行为漏斗分析</div>
            <div class="funnel-analysis">
                <div class="funnel-container">
                    <div class="funnel-step-large" data-step="1">
                        <div class="funnel-content">
                            <div class="funnel-icon">🌐</div>
                            <div class="funnel-title">页面访问</div>
                            <div class="funnel-number">${analyticsData.funnelData.pageViews}</div>
                            <div class="funnel-percentage">100%</div>
                        </div>
                    </div>
                    
                    <div class="funnel-arrow">↓</div>
                    
                    <div class="funnel-step-large" data-step="2">
                        <div class="funnel-content">
                            <div class="funnel-icon">🛍️</div>
                            <div class="funnel-title">查看商品</div>
                            <div class="funnel-number">${analyticsData.funnelData.productViews}</div>
                            <div class="funnel-percentage">${analyticsData.funnelData.viewPercent}%</div>
                        </div>
                    </div>
                    
                    <div class="funnel-arrow">↓</div>
                    
                    <div class="funnel-step-large" data-step="3">
                        <div class="funnel-content">
                            <div class="funnel-icon">🛒</div>
                            <div class="funnel-title">点击购买</div>
                            <div class="funnel-number">${analyticsData.funnelData.purchaseClicks}</div>
                            <div class="funnel-percentage">${analyticsData.funnelData.clickPercent}%</div>
                        </div>
                    </div>
                    
                    <div class="funnel-arrow">↓</div>
                    
                    <div class="funnel-step-large" data-step="4">
                        <div class="funnel-content">
                            <div class="funnel-icon">📝</div>
                            <div class="funnel-title">填写表单</div>
                            <div class="funnel-number">${analyticsData.funnelData.formFills}</div>
                            <div class="funnel-percentage">${analyticsData.funnelData.formPercent}%</div>
                        </div>
                    </div>
                    
                    <div class="funnel-arrow">↓</div>
                    
                    <div class="funnel-step-large" data-step="5">
                        <div class="funnel-content">
                            <div class="funnel-icon">📦</div>
                            <div class="funnel-title">提交订单</div>
                            <div class="funnel-number">${analyticsData.funnelData.orders}</div>
                            <div class="funnel-percentage">${analyticsData.funnelData.orderPercent}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 站点行为对比 -->
        <div class="analytics-section">
            <div class="section-title">🎯 站点行为对比分析</div>
            <div class="site-comparison">
                ${generateSiteComparison(analyticsData.siteComparison)}
            </div>
        </div>

        <!-- 用户活跃度时间分布 -->
        <div class="analytics-section">
            <div class="section-title">⏰ 用户活跃度时间分布</div>
            <div class="time-distribution">
                ${generateTimeDistribution(analyticsData.timeDistribution)}
            </div>
        </div>

        <!-- 行为路径分析 -->
        <div class="analytics-section">
            <div class="section-title">🔄 用户行为路径分析</div>
            <div class="path-analysis">
                ${generatePathAnalysis(analyticsData.pathAnalysis)}
            </div>
        </div>

        <!-- 详细行为记录 -->
        <div class="analytics-section">
            <div class="section-title">📋 用户行为详细记录</div>
            <div class="behavior-toolbar">
                <div class="toolbar-left">
                    <select id="action-filter" onchange="filterByAction(this.value)">
                        <option value="">全部行为</option>
                        <option value="page_view">页面访问</option>
                        <option value="查看商品">查看商品</option>
                        <option value="点击购买">点击购买</option>
                        <option value="填写表单">填写表单</option>
                        <option value="提交订单">提交订单</option>
                    </select>
                    <input type="date" id="date-filter" onchange="filterByDate(this.value)" title="按日期筛选">
                </div>
                <div class="toolbar-right">
                    <button onclick="exportBehaviorData()" class="export-btn">📤 导出数据</button>
                    <button onclick="refreshAnalytics()" class="refresh-btn">🔄 刷新</button>
                </div>
            </div>
            
            <div class="behavior-table-container">
                <table class="behavior-table">
                    <thead>
                        <tr>
                            <th onclick="sortBehavior('time')">时间 <span class="sort-icon">⚡</span></th>
                            <th onclick="sortBehavior('action')">行为 <span class="sort-icon">⚡</span></th>
                            <th onclick="sortBehavior('page')">页面 <span class="sort-icon">⚡</span></th>
                            <th onclick="sortBehavior('site')">站点 <span class="sort-icon">⚡</span></th>
                            <th onclick="sortBehavior('userId')">用户ID <span class="sort-icon">⚡</span></th>
                            <th onclick="sortBehavior('ip')">IP地址 <span class="sort-icon">⚡</span></th>
                            <th>用户代理</th>
                        </tr>
                    </thead>
                    <tbody id="behavior-tbody">
                        ${generateBehaviorRows(filteredActivities)}
                    </tbody>
                </table>
            </div>
            
            <!-- 分页控制 -->
            <div class="pagination-container">
                <div class="pagination-info">
                    显示 ${Math.min(filteredActivities.length, 50)} / ${filteredActivities.length} 条行为记录
                </div>
                <div class="pagination-buttons">
                    <button onclick="changeBehaviorPage(-1)" ${filteredActivities.length <= 50 ? 'disabled' : ''}>← 上一页</button>
                    <span class="page-number">1</span>
                    <button onclick="changeBehaviorPage(1)" ${filteredActivities.length <= 50 ? 'disabled' : ''}>下一页 →</button>
                </div>
            </div>
        </div>
    `;

    // 添加样式
    const styles = `
        <style>
            .analytics-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .analytics-stat-card {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
                border-left: 5px solid;
            }

            .analytics-stat-card:nth-child(1) {
                border-left-color: #3498db;
            }

            .analytics-stat-card:nth-child(2) {
                border-left-color: #e74c3c;
            }

            .analytics-stat-card:nth-child(3) {
                border-left-color: #f39c12;
            }

            .analytics-stat-card:nth-child(4) {
                border-left-color: #27ae60;
            }

            .analytics-stat-card:hover {
                transform: translateY(-5px);
            }

            .analytics-section {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                padding: 30px;
                border-radius: 15px;
                margin-bottom: 30px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            }

            .funnel-analysis {
                display: flex;
                justify-content: center;
                padding: 20px 0;
            }

            .funnel-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                max-width: 400px;
            }

            .funnel-step-large {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 20px;
                border-radius: 15px;
                text-align: center;
                width: 100%;
                position: relative;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .funnel-step-large:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
            }

            .funnel-step-large[data-step="1"] {
                background: linear-gradient(135deg, #3498db, #2980b9);
            }

            .funnel-step-large[data-step="2"] {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
            }

            .funnel-step-large[data-step="3"] {
                background: linear-gradient(135deg, #f39c12, #e67e22);
            }

            .funnel-step-large[data-step="4"] {
                background: linear-gradient(135deg, #9b59b6, #8e44ad);
            }

            .funnel-step-large[data-step="5"] {
                background: linear-gradient(135deg, #27ae60, #229954);
            }

            .funnel-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }

            .funnel-icon {
                font-size: 2rem;
            }

            .funnel-title {
                font-size: 1.1rem;
                font-weight: 600;
            }

            .funnel-number {
                font-size: 1.8rem;
                font-weight: 700;
            }

            .funnel-percentage {
                font-size: 0.9rem;
                opacity: 0.9;
            }

            .funnel-arrow {
                font-size: 2rem;
                color: #667eea;
                animation: bounce 2s infinite;
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-10px);
                }
                60% {
                    transform: translateY(-5px);
                }
            }

            .site-comparison {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 20px;
            }

            .site-comparison-card {
                padding: 25px;
                border-radius: 15px;
                border: 2px solid;
                position: relative;
                transition: transform 0.3s ease;
            }

            .site-comparison-card:hover {
                transform: translateY(-5px);
            }

            .site-comparison-card.vintage {
                border-color: #8b4513;
                background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(218, 165, 32, 0.1));
            }

            .site-comparison-card.pop {
                border-color: #e94560;
                background: linear-gradient(135deg, rgba(233, 69, 96, 0.1), rgba(0, 212, 255, 0.1));
            }

            .site-comparison-card.pudgy {
                border-color: #ff7675;
                background: linear-gradient(135deg, rgba(255, 118, 117, 0.1), rgba(0, 184, 148, 0.1));
            }

            .site-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 20px;
                font-size: 1.2rem;
                font-weight: 700;
            }

            .behavior-metrics {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }

            .behavior-metric {
                background: rgba(255, 255, 255, 0.7);
                padding: 15px;
                border-radius: 10px;
                text-align: center;
            }

            .metric-number {
                font-size: 1.5rem;
                font-weight: 700;
                color: #2c3e50;
                margin-bottom: 5px;
            }

            .metric-label {
                font-size: 0.9rem;
                color: #7f8c8d;
            }

            .time-distribution {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
            }

            .time-slot {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                transition: transform 0.3s ease;
            }

            .time-slot:hover {
                transform: scale(1.05);
            }

            .time-period {
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 8px;
            }

            .time-count {
                font-size: 1.5rem;
                font-weight: 700;
            }

            .path-analysis {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .path-item {
                display: flex;
                align-items: center;
                padding: 15px;
                background: rgba(102, 126, 234, 0.1);
                border-radius: 10px;
                border-left: 4px solid #667eea;
            }

            .path-steps {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }

            .path-step {
                background: #667eea;
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
            }

            .path-arrow {
                color: #667eea;
                font-weight: bold;
            }

            .path-count {
                background: #27ae60;
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-weight: 600;
            }

            .behavior-toolbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
                gap: 15px;
            }

            .toolbar-left, .toolbar-right {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .toolbar-left select, .toolbar-left input {
                padding: 8px 12px;
                border: 2px solid #e0e0e0;
                border-radius: 20px;
                outline: none;
                transition: border-color 0.3s ease;
            }

            .toolbar-left select:focus, .toolbar-left input:focus {
                border-color: #667eea;
            }

            .behavior-table-container {
                overflow-x: auto;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                margin-bottom: 20px;
            }

            .behavior-table {
                width: 100%;
                border-collapse: collapse;
                background: white;
                min-width: 1000px;
            }

            .behavior-table th {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 15px 10px;
                text-align: left;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.3s ease;
                position: relative;
            }

            .behavior-table th:hover {
                background: linear-gradient(135deg, #5a6fd8, #6a4190);
            }

            .behavior-table td {
                padding: 12px 10px;
                border-bottom: 1px solid #e0e0e0;
                vertical-align: middle;
            }

            .behavior-table tbody tr:hover {
                background: rgba(102, 126, 234, 0.05);
            }

            .action-badge {
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 0.85rem;
                font-weight: 600;
                color: white;
                display: inline-block;
            }

            .action-badge.page_view {
                background: linear-gradient(135deg, #3498db, #2980b9);
            }

            .action-badge.product_view {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
            }

            .action-badge.purchase_click {
                background: linear-gradient(135deg, #f39c12, #e67e22);
            }

            .action-badge.form_fill {
                background: linear-gradient(135deg, #9b59b6, #8e44ad);
            }

            .action-badge.order_submit {
                background: linear-gradient(135deg, #27ae60, #229954);
            }

            .user-id-cell {
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
                color: #666;
            }

            .user-agent-cell {
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 0.8rem;
                color: #999;
            }

            @media (max-width: 768px) {
                .analytics-stats-grid {
                    grid-template-columns: 1fr;
                }

                .site-comparison {
                    grid-template-columns: 1fr;
                }

                .time-distribution {
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                }

                .behavior-toolbar {
                    flex-direction: column;
                    align-items: stretch;
                }

                .toolbar-left, .toolbar-right {
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .funnel-container {
                    max-width: 300px;
                }
            }
        </style>
    `;

    // 更新页面内容
    pageElement.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">📈 数据统计</h1>
            <p class="page-subtitle">${getSiteFilterText()} - 用户行为数据分析和详细明细记录</p>
        </div>
        ${content}
        ${styles}
    `;
}

// 计算分析数据
function calculateAnalyticsData(activities, orders) {
    const data = {
        totalPageViews: activities.filter(a => a.action === 'page_view').length,
        totalProductViews: activities.filter(a => a.action === '查看商品').length,
        totalPurchaseClicks: activities.filter(a => a.action === '点击购买').length,
        conversionRate: 0,
        funnelData: {
            pageViews: activities.filter(a => a.action === 'page_view').length,
            productViews: activities.filter(a => a.action === '查看商品').length,
            purchaseClicks: activities.filter(a => a.action === '点击购买').length,
            formFills: activities.filter(a => a.action === '填写表单').length,
            orders: activities.filter(a => a.action === '提交订单').length,
            viewPercent: 0,
            clickPercent: 0,
            formPercent: 0,
            orderPercent: 0
        },
        siteComparison: {
            vintage_model: { pageViews: 0, productViews: 0, purchaseClicks: 0, orders: 0 },
            pop_singer: { pageViews: 0, productViews: 0, purchaseClicks: 0, orders: 0 },
            pudgy_character: { pageViews: 0, productViews: 0, purchaseClicks: 0, orders: 0 }
        },
        timeDistribution: {},
        pathAnalysis: []
    };

    // 计算转化率
    if (data.totalProductViews > 0) {
        data.conversionRate = ((data.totalPurchaseClicks / data.totalProductViews) * 100).toFixed(1);
    }

    // 计算漏斗百分比
    const maxFunnelValue = Math.max(data.funnelData.pageViews, data.funnelData.productViews);
    if (maxFunnelValue > 0) {
        data.funnelData.viewPercent = Math.round((data.funnelData.productViews / maxFunnelValue) * 100);
        data.funnelData.clickPercent = Math.round((data.funnelData.purchaseClicks / maxFunnelValue) * 100);
        data.funnelData.formPercent = Math.round((data.funnelData.formFills / maxFunnelValue) * 100);
        data.funnelData.orderPercent = Math.round((data.funnelData.orders / maxFunnelValue) * 100);
    }

    // 统计各站点数据
    activities.forEach(activity => {
        if (data.siteComparison[activity.site]) {
            if (activity.action === 'page_view') data.siteComparison[activity.site].pageViews++;
            if (activity.action === '查看商品') data.siteComparison[activity.site].productViews++;
            if (activity.action === '点击购买') data.siteComparison[activity.site].purchaseClicks++;
            if (activity.action === '提交订单') data.siteComparison[activity.site].orders++;
        }
    });

    // 计算时间分布
    const timeSlots = {
        '00:00-06:00': 0,
        '06:00-12:00': 0,
        '12:00-18:00': 0,
        '18:00-24:00': 0
    };

    activities.forEach(activity => {
        const hour = new Date(activity.time).getHours();
        if (hour >= 0 && hour < 6) timeSlots['00:00-06:00']++;
        else if (hour >= 6 && hour < 12) timeSlots['06:00-12:00']++;
        else if (hour >= 12 && hour < 18) timeSlots['12:00-18:00']++;
        else timeSlots['18:00-24:00']++;
    });

    data.timeDistribution = timeSlots;

    // 生成路径分析
    data.pathAnalysis = [
        { steps: ['页面访问', '查看商品'], count: Math.min(data.funnelData.pageViews, data.funnelData.productViews) },
        { steps: ['查看商品', '点击购买'], count: Math.min(data.funnelData.productViews, data.funnelData.purchaseClicks) },
        { steps: ['点击购买', '填写表单'], count: Math.min(data.funnelData.purchaseClicks, data.funnelData.formFills) },
        { steps: ['填写表单', '提交订单'], count: Math.min(data.funnelData.formFills, data.funnelData.orders) }
    ].filter(path => path.count > 0);

    return data;
}

// 生成站点对比
function generateSiteComparison(siteComparison) {
    const sites = [
        { key: 'vintage_model', name: '🎭 复古女模特', class: 'vintage' },
        { key: 'pop_singer', name: '🎤 流行歌手', class: 'pop' },
        { key: 'pudgy_character', name: '🧸 卡通形象', class: 'pudgy' }
    ];

    return sites.map(site => {
        const data = siteComparison[site.key];
        return `
            <div class="site-comparison-card ${site.class}">
                <div class="site-header">
                    <span>${site.name}</span>
                </div>
                <div class="behavior-metrics">
                    <div class="behavior-metric">
                        <div class="metric-number">${data.pageViews}</div>
                        <div class="metric-label">页面访问</div>
                    </div>
                    <div class="behavior-metric">
                        <div class="metric-number">${data.productViews}</div>
                        <div class="metric-label">商品浏览</div>
                    </div>
                    <div class="behavior-metric">
                        <div class="metric-number">${data.purchaseClicks}</div>
                        <div class="metric-label">购买点击</div>
                    </div>
                    <div class="behavior-metric">
                        <div class="metric-number">${data.orders}</div>
                        <div class="metric-label">提交订单</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 生成时间分布
function generateTimeDistribution(timeDistribution) {
    return Object.keys(timeDistribution).map(period => {
        return `
            <div class="time-slot">
                <div class="time-period">${period}</div>
                <div class="time-count">${timeDistribution[period]}</div>
            </div>
        `;
    }).join('');
}

// 生成路径分析
function generatePathAnalysis(pathAnalysis) {
    if (pathAnalysis.length === 0) {
        return '<div style="text-align: center; color: #7f8c8d; padding: 20px;">暂无用户行为路径数据</div>';
    }

    return pathAnalysis.map(path => {
        return `
            <div class="path-item">
                <div class="path-steps">
                    ${path.steps.map((step, index) => `
                        <span class="path-step">${step}</span>
                        ${index < path.steps.length - 1 ? '<span class="path-arrow">→</span>' : ''}
                    `).join('')}
                </div>
                <div class="path-count">${path.count} 次</div>
            </div>
        `;
    }).join('');
}

// 生成行为记录行
function generateBehaviorRows(activities) {
    if (activities.length === 0) {
        return `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #7f8c8d;">
                    📊 暂无用户行为数据
                </td>
            </tr>
        `;
    }

    return activities.slice(0, 50).map(activity => {
        const actionClass = activity.action.replace(/[^a-zA-Z]/g, '_').toLowerCase();
        const siteInfo = getSiteInfo(activity.site);
        
        return `
            <tr>
                <td>${activity.time}</td>
                <td>
                    <span class="action-badge ${actionClass}">${activity.action}</span>
                </td>
                <td>${activity.page}</td>
                <td>
                    <span class="site-badge ${activity.site === 'vintage_model' ? 'vintage' : activity.site === 'pop_singer' ? 'pop' : 'pudgy'}">
                        ${siteInfo.name}
                    </span>
                </td>
                <td class="user-id-cell">${activity.userId}</td>
                <td>${activity.ip}</td>
                <td class="user-agent-cell" title="${activity.userAgent}">${activity.userAgent}</td>
            </tr>
        `;
    }).join('');
}

// 分析页面操作函数
function filterByAction(action) {
    console.log('按行为筛选:', action);
    // 实现行为筛选逻辑
}

function filterByDate(date) {
    console.log('按日期筛选:', date);
    // 实现日期筛选逻辑
}

function sortBehavior(column) {
    console.log('排序行为数据:', column);
    // 实现排序逻辑
}

function exportBehaviorData() {
    console.log('导出行为数据');
    alert('行为数据导出功能开发中...');
}

function refreshAnalytics() {
    console.log('刷新分析数据');
    refreshCurrentPage();
}

function changeBehaviorPage(direction) {
    console.log('切换行为数据页面:', direction);
    // 实现分页逻辑
}
