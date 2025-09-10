// 首页 - 数据概览
function loadDashboard() {
    const pageElement = document.getElementById('dashboard-page');
    const loadingElement = pageElement.querySelector('.loading');
    
    // 获取筛选后的数据
    const filteredOrders = currentFilter === 'all' ? allOrders : allOrders.filter(order => order.site === currentFilter);
    const filteredActivities = currentFilter === 'all' ? allActivities : allActivities.filter(activity => activity.site === currentFilter);
    
    // 计算统计数据
    const stats = calculateDashboardStats(filteredOrders, filteredActivities);
    
    // 构建页面内容
    const content = `
        <!-- 核心指标卡片 -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-title">总访问量</div>
                    <div class="stat-icon">👁️</div>
                </div>
                <div class="stat-number">${stats.totalViews.toLocaleString()}</div>
                <div class="stat-description">用户浏览商品次数</div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-title">购买点击</div>
                    <div class="stat-icon">🛒</div>
                </div>
                <div class="stat-number">${stats.purchaseClicks.toLocaleString()}</div>
                <div class="stat-description">用户点击购买次数</div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-title">订单总数</div>
                    <div class="stat-icon">📦</div>
                </div>
                <div class="stat-number">${stats.totalOrders.toLocaleString()}</div>
                <div class="stat-description">成功提交订单数量</div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-title">总收入</div>
                    <div class="stat-icon">💰</div>
                </div>
                <div class="stat-number">$${stats.totalRevenue.toFixed(2)}</div>
                <div class="stat-description">订单总金额</div>
            </div>
        </div>

        <!-- 站点对比分析 -->
        <div class="dashboard-section">
            <div class="section-title">📊 站点数据对比</div>
            <div class="comparison-grid">
                <div class="comparison-card vintage">
                    <div class="comparison-header">
                        <span class="comparison-icon">🎭</span>
                        <span class="comparison-name">复古女模特</span>
                    </div>
                    <div class="comparison-stats">
                        <div class="comparison-item">
                            <span>订单数:</span>
                            <span>${stats.siteStats.vintage_model.orders}</span>
                        </div>
                        <div class="comparison-item">
                            <span>访问量:</span>
                            <span>${stats.siteStats.vintage_model.views}</span>
                        </div>
                        <div class="comparison-item">
                            <span>收入:</span>
                            <span>$${stats.siteStats.vintage_model.revenue.toFixed(2)}</span>
                        </div>
                        <div class="comparison-item">
                            <span>转化率:</span>
                            <span>${stats.siteStats.vintage_model.conversionRate}%</span>
                        </div>
                    </div>
                </div>

                <div class="comparison-card pop">
                    <div class="comparison-header">
                        <span class="comparison-icon">🎤</span>
                        <span class="comparison-name">流行歌手</span>
                    </div>
                    <div class="comparison-stats">
                        <div class="comparison-item">
                            <span>订单数:</span>
                            <span>${stats.siteStats.pop_singer.orders}</span>
                        </div>
                        <div class="comparison-item">
                            <span>访问量:</span>
                            <span>${stats.siteStats.pop_singer.views}</span>
                        </div>
                        <div class="comparison-item">
                            <span>收入:</span>
                            <span>$${stats.siteStats.pop_singer.revenue.toFixed(2)}</span>
                        </div>
                        <div class="comparison-item">
                            <span>转化率:</span>
                            <span>${stats.siteStats.pop_singer.conversionRate}%</span>
                        </div>
                    </div>
                </div>

                <div class="comparison-card pudgy">
                    <div class="comparison-header">
                        <span class="comparison-icon">🧸</span>
                        <span class="comparison-name">卡通形象</span>
                    </div>
                    <div class="comparison-stats">
                        <div class="comparison-item">
                            <span>订单数:</span>
                            <span>${stats.siteStats.pudgy_character.orders}</span>
                        </div>
                        <div class="comparison-item">
                            <span>访问量:</span>
                            <span>${stats.siteStats.pudgy_character.views}</span>
                        </div>
                        <div class="comparison-item">
                            <span>收入:</span>
                            <span>$${stats.siteStats.pudgy_character.revenue.toFixed(2)}</span>
                        </div>
                        <div class="comparison-item">
                            <span>转化率:</span>
                            <span>${stats.siteStats.pudgy_character.conversionRate}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 趋势图表 -->
        <div class="dashboard-section">
            <div class="section-title">📈 业务趋势</div>
            <div class="chart-container">
                <div class="chart-card">
                    <h3>用户行为漏斗</h3>
                    <div class="funnel-chart">
                        <div class="funnel-step">
                            <div class="funnel-bar" style="width: 100%;">
                                <span>页面访问: ${stats.funnelData.pageViews}</span>
                            </div>
                        </div>
                        <div class="funnel-step">
                            <div class="funnel-bar" style="width: ${stats.funnelData.viewPercent}%;">
                                <span>查看商品: ${stats.funnelData.productViews}</span>
                            </div>
                        </div>
                        <div class="funnel-step">
                            <div class="funnel-bar" style="width: ${stats.funnelData.clickPercent}%;">
                                <span>点击购买: ${stats.funnelData.purchaseClicks}</span>
                            </div>
                        </div>
                        <div class="funnel-step">
                            <div class="funnel-bar" style="width: ${stats.funnelData.orderPercent}%;">
                                <span>提交订单: ${stats.funnelData.orders}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chart-card">
                    <h3>站点收入占比</h3>
                    <div class="pie-chart">
                        <div class="pie-item vintage" style="--percentage: ${stats.revenueDistribution.vintage_model}%;">
                            <span>🎭 ${stats.revenueDistribution.vintage_model}%</span>
                        </div>
                        <div class="pie-item pop" style="--percentage: ${stats.revenueDistribution.pop_singer}%;">
                            <span>🎤 ${stats.revenueDistribution.pop_singer}%</span>
                        </div>
                        <div class="pie-item pudgy" style="--percentage: ${stats.revenueDistribution.pudgy_character}%;">
                            <span>🧸 ${stats.revenueDistribution.pudgy_character}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 最近活动 -->
        <div class="dashboard-section">
            <div class="section-title">📝 最近活动</div>
            <div class="recent-activities">
                ${generateRecentActivities(filteredActivities.slice(0, 10))}
            </div>
        </div>
    `;

    // 添加样式
    const styles = `
        <style>
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .stat-card {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
            }

            .stat-card:hover {
                transform: translateY(-5px);
            }

            .stat-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .stat-title {
                font-size: 1rem;
                font-weight: 600;
                color: #666;
            }

            .stat-icon {
                font-size: 1.5rem;
            }

            .stat-number {
                font-size: 2.5rem;
                font-weight: 700;
                color: #2c3e50;
                margin-bottom: 5px;
            }

            .stat-description {
                color: #7f8c8d;
                font-size: 0.9rem;
            }

            .dashboard-section {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                padding: 30px;
                border-radius: 15px;
                margin-bottom: 30px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            }

            .section-title {
                font-size: 1.3rem;
                font-weight: 700;
                color: #2c3e50;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #e0e0e0;
            }

            .comparison-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }

            .comparison-card {
                padding: 20px;
                border-radius: 10px;
                border: 2px solid;
                transition: transform 0.3s ease;
            }

            .comparison-card:hover {
                transform: scale(1.02);
            }

            .comparison-card.vintage {
                border-color: #8b4513;
                background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(218, 165, 32, 0.1));
            }

            .comparison-card.pop {
                border-color: #e94560;
                background: linear-gradient(135deg, rgba(233, 69, 96, 0.1), rgba(0, 212, 255, 0.1));
            }

            .comparison-card.pudgy {
                border-color: #ff7675;
                background: linear-gradient(135deg, rgba(255, 118, 117, 0.1), rgba(0, 184, 148, 0.1));
            }

            .comparison-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
                font-size: 1.1rem;
                font-weight: 600;
            }

            .comparison-icon {
                font-size: 1.5rem;
            }

            .comparison-stats {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }

            .comparison-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .chart-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 20px;
            }

            .chart-card {
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                background: white;
            }

            .chart-card h3 {
                margin-bottom: 20px;
                color: #2c3e50;
                text-align: center;
            }

            .funnel-chart {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .funnel-step {
                display: flex;
                justify-content: center;
            }

            .funnel-bar {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 12px;
                border-radius: 25px;
                text-align: center;
                font-weight: 600;
                min-width: 200px;
                transition: all 0.3s ease;
            }

            .funnel-bar:hover {
                transform: scale(1.05);
            }

            .pie-chart {
                display: flex;
                flex-direction: column;
                gap: 10px;
                align-items: center;
            }

            .pie-item {
                padding: 10px 20px;
                border-radius: 20px;
                font-weight: 600;
                color: white;
                text-align: center;
                min-width: 120px;
            }

            .pie-item.vintage {
                background: linear-gradient(135deg, #8b4513, #daa520);
            }

            .pie-item.pop {
                background: linear-gradient(135deg, #e94560, #00d4ff);
            }

            .pie-item.pudgy {
                background: linear-gradient(135deg, #ff7675, #00b894);
            }

            .recent-activities {
                max-height: 400px;
                overflow-y: auto;
            }

            .activity-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #e0e0e0;
            }

            .activity-info {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .activity-icon {
                font-size: 1.2rem;
                width: 30px;
                text-align: center;
            }

            .activity-details {
                display: flex;
                flex-direction: column;
            }

            .activity-action {
                font-weight: 600;
                color: #2c3e50;
            }

            .activity-meta {
                font-size: 0.9rem;
                color: #7f8c8d;
            }

            .activity-time {
                color: #95a5a6;
                font-size: 0.9rem;
            }

            @media (max-width: 768px) {
                .stats-grid {
                    grid-template-columns: 1fr;
                }

                .comparison-grid {
                    grid-template-columns: 1fr;
                }

                .chart-container {
                    grid-template-columns: 1fr;
                }

                .comparison-stats {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;

    // 更新页面内容
    pageElement.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">📊 数据概览</h1>
            <p class="page-subtitle">${getSiteFilterText()} - 核心指标和业务数据汇总</p>
        </div>
        ${content}
        ${styles}
    `;
}

// 计算首页统计数据
function calculateDashboardStats(orders, activities) {
    const stats = {
        totalViews: activities.filter(a => a.action === '查看商品').length,
        purchaseClicks: activities.filter(a => a.action === '点击购买').length,
        totalOrders: orders.length,
        totalRevenue: 0,
        siteStats: {
            vintage_model: { orders: 0, views: 0, revenue: 0, conversionRate: 0 },
            pop_singer: { orders: 0, views: 0, revenue: 0, conversionRate: 0 },
            pudgy_character: { orders: 0, views: 0, revenue: 0, conversionRate: 0 }
        },
        funnelData: {
            pageViews: activities.filter(a => a.action === 'page_view').length,
            productViews: activities.filter(a => a.action === '查看商品').length,
            purchaseClicks: activities.filter(a => a.action === '点击购买').length,
            orders: orders.length,
            viewPercent: 0,
            clickPercent: 0,
            orderPercent: 0
        },
        revenueDistribution: {
            vintage_model: 0,
            pop_singer: 0,
            pudgy_character: 0
        }
    };

    // 计算总收入和各站点统计
    orders.forEach(order => {
        let amount = 0;
        if (order.total && typeof order.total === 'string') {
            const match = order.total.match(/[\d.]+/);
            amount = match ? parseFloat(match[0]) : 0;
        }
        
        stats.totalRevenue += amount;
        
        if (stats.siteStats[order.site]) {
            stats.siteStats[order.site].orders++;
            stats.siteStats[order.site].revenue += amount;
        }
    });

    // 计算各站点访问量
    activities.forEach(activity => {
        if (activity.action === '查看商品' && stats.siteStats[activity.site]) {
            stats.siteStats[activity.site].views++;
        }
    });

    // 计算转化率
    Object.keys(stats.siteStats).forEach(site => {
        const siteData = stats.siteStats[site];
        siteData.conversionRate = siteData.views > 0 ? 
            ((siteData.orders / siteData.views) * 100).toFixed(1) : '0.0';
    });

    // 计算漏斗百分比
    const maxFunnelValue = Math.max(stats.funnelData.pageViews, stats.funnelData.productViews);
    if (maxFunnelValue > 0) {
        stats.funnelData.viewPercent = Math.round((stats.funnelData.productViews / maxFunnelValue) * 100);
        stats.funnelData.clickPercent = Math.round((stats.funnelData.purchaseClicks / maxFunnelValue) * 100);
        stats.funnelData.orderPercent = Math.round((stats.funnelData.orders / maxFunnelValue) * 100);
    }

    // 计算收入分布
    if (stats.totalRevenue > 0) {
        Object.keys(stats.revenueDistribution).forEach(site => {
            stats.revenueDistribution[site] = Math.round((stats.siteStats[site].revenue / stats.totalRevenue) * 100);
        });
    }

    return stats;
}

// 生成最近活动列表
function generateRecentActivities(activities) {
    if (activities.length === 0) {
        return '<div class="activity-item"><span>暂无最近活动记录</span></div>';
    }

    return activities.map(activity => {
        const icon = getActivityIcon(activity.action);
        const siteInfo = getSiteInfo(activity.site);
        
        return `
            <div class="activity-item">
                <div class="activity-info">
                    <span class="activity-icon">${icon}</span>
                    <div class="activity-details">
                        <span class="activity-action">${activity.action}</span>
                        <span class="activity-meta">${siteInfo.name} - ${activity.page}</span>
                    </div>
                </div>
                <span class="activity-time">${activity.time}</span>
            </div>
        `;
    }).join('');
}

// 获取活动图标
function getActivityIcon(action) {
    const icons = {
        'page_view': '👁️',
        '查看商品': '🛍️',
        '点击购买': '🛒',
        '填写表单': '📝',
        '提交订单': '📦'
    };
    return icons[action] || '📌';
}

// 获取站点信息
function getSiteInfo(site) {
    const siteInfo = {
        'vintage_model': { name: '🎭 复古女模特', color: '#8b4513' },
        'pop_singer': { name: '🎤 流行歌手', color: '#e94560' },
        'pudgy_character': { name: '🧸 卡通形象', color: '#ff7675' }
    };
    return siteInfo[site] || { name: '未知站点', color: '#666' };
}

// 获取筛选文本
function getSiteFilterText() {
    const filterTexts = {
        'all': '全部站点',
        'vintage_model': '复古女模特站点',
        'pop_singer': '流行歌手站点',
        'pudgy_character': '卡通形象站点'
    };
    return filterTexts[currentFilter] || '当前站点';
}
