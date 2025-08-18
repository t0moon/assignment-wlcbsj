// 页面逻辑
document.addEventListener('DOMContentLoaded', function() {
    const noticePage = document.getElementById('noticePage');
    const mainContent = document.getElementById('mainContent');
    const continueBtn = document.getElementById('continueBtn');

    // 点击继续按钮显示主内容。
    continueBtn.addEventListener('click', function() {
        noticePage.style.opacity = '0';
        noticePage.style.transition = 'opacity 0.5s ease';

        setTimeout(function() {
            noticePage.style.display = 'none';
            mainContent.style.display = 'block';
            initMainContent(); // 初始化主内容的交互
        }, 500);
    });
});

// 主内容初始化函数
function initMainContent() {
    // 统一初始化所有图表 (现在全部使用 ECharts，且只包含 HTML 中存在的 canvas)
    initCharts();

    // 墨蝶元素控制
    const butterfly = document.getElementById('ink-butterfly');
    const sections = document.querySelectorAll('section');
    let currentSectionIndex = 0;
    let isTransitioning = false; // 防止过渡中重复触发

    // 随机生成墨蝶的位置（四个角落）
    // 注意：墨蝶是 fixed 定位，所以直接设置 top/bottom/left/right 即可
    function getRandomCorner() {
        const corners = [
            { top: '20px', left: '20px', right: 'auto', bottom: 'auto' }, // 左上角
            { top: '20px', right: '20px', left: 'auto', bottom: 'auto' }, // 右上角
            { bottom: '20px', left: '20px', top: 'auto', right: 'auto' }, // 左下角
            { bottom: '20px', right: '20px', top: 'auto', left: 'auto' }  // 右下角
        ];
        return corners[Math.floor(Math.random() * corners.length)];
    }

    // 移动墨蝶到指定区域的随机角落
    function moveButterflyToSection() {
        const corner = getRandomCorner();

        // 清除之前的定位属性，以防冲突
        butterfly.style.top = corner.top;
        butterfly.style.left = corner.left;
        butterfly.style.right = corner.right;
        butterfly.style.bottom = corner.bottom;

        // 添加旋转动画效果
        butterfly.style.transform = `rotate(${Math.random() * 360}deg)`;
    }

    // 初始化墨蝶位置
    moveButterflyToSection();

    // 叠化过渡效果实现
    const pageTransition = document.getElementById('pageTransition');

    // 初始化页面 - 仅第一页可见，其他页隐藏
    sections.forEach((section, index) => {
        section.classList.add('section-wrapper'); // 确保所有 section 都有过渡样式
        if (index !== 0) {
            section.style.opacity = '0'; // 初始隐藏非首屏内容
            section.style.display = 'none'; // 初始设置为不显示，避免未过渡时的内容闪现
        }
    });

    // 检测当前可见的section (优化逻辑：基于滚动位置和 section 顶部偏移)
    function getCurrentSection() {
        const scrollY = window.scrollY;
        let activeIndex = 0;
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            // 计算 section 顶部距离文档顶部的偏移量
            const offsetTop = section.offsetTop;
            // 当滚动位置超过 section 顶部一半时，认为进入该 section
            if (scrollY >= offsetTop - window.innerHeight / 2) {
                activeIndex = i;
            }
        }
        return activeIndex;
    }

    // 执行叠化过渡动画
    function triggerTransition(newIndex) {
        if (isTransitioning || newIndex === currentSectionIndex) return;
        isTransitioning = true;

        // 隐藏当前页，防止内容重叠
        sections[currentSectionIndex].style.display = 'none';
        sections[currentSectionIndex].style.opacity = '0';


        // 显示过渡层（短暂闪现，增强叠化效果）
        pageTransition.style.opacity = '1';

        setTimeout(() => {
            // 显示新页面并淡入
            sections[newIndex].style.display = 'block';
            sections[newIndex].style.opacity = '1';
            pageTransition.style.opacity = '0'; // 隐藏过渡层

            currentSectionIndex = newIndex;
            isTransitioning = false;

            // 移动墨蝶
            moveButterflyToSection();
        }, 500); // 过渡层显示和页面切换的时间
    }

    // 监听滚动事件 (增加防抖处理)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (isTransitioning) return;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const newIndex = getCurrentSection();
            if (newIndex !== currentSectionIndex) {
                triggerTransition(newIndex);
            }
        }, 150); // 150毫秒的防抖延迟
    });

    // 初始化滚动检测 - 立即检查并显示第一页
    // (因为 DOMContentLoaded 已经处理了 mainContent 的显示，这里仅确保过渡逻辑正确)
    setTimeout(() => {
        const initialIndex = getCurrentSection();
        if (initialIndex !== currentSectionIndex) {
            triggerTransition(initialIndex);
        }
    }, 100);
}

// 统一的图表初始化函数 (全部使用 ECharts)
function initCharts() {
    // 初始化水球图 (HTML中存在: china-chart, dev-chart)
    initLiquidCharts();
    // 初始化教材去向分布玫瑰图 (HTML中存在: radius-chart)
    initRadiusChart();
    // 初始化支持度与购买率对比图 (HTML中存在: support-purchase-chart)
    initSupportPurchaseChart();

    // 教材循环环保效益图表 (HTML中存在: 教材循环环保效益)
    renderEChart('教材循环环保效益', {
        title: { text: '5年循环使用可节约资源', left: 'center' },
        tooltip: { trigger: 'axis', formatter: '{b}: {c}万吨' },
        xAxis: {
            type: 'category',
            data: ['文化纸', '木材', '纯净水', '煤'],
            axisLabel: { interval: 0 }
        },
        yAxis: { type: 'value', axisLabel: { formatter: '{value}万吨' } },
        series: [{
            name: '节约资源',
            type: 'bar',
            data: [528, 300, 52800, 633.5],
            itemStyle: {
                color: 'rgba(140, 28, 19, 0.8)'
            },
            label: { show: true, position: 'top', formatter: '{c}' }
        }]
    });
}

// ECharts 通用渲染辅助函数
function renderEChart(canvasId, option) {
    const chartDom = document.getElementById(canvasId);
    if (chartDom) {
        const chart = echarts.init(chartDom);
        chart.setOption(option);
        // 确保图表在窗口大小改变时响应式调整
        window.addEventListener('resize', function() {
            chart.resize();
        });
    } else {
        console.warn(`Error: Canvas element with ID "${canvasId}" not found for ECharts.`);
    }
}

// 初始化水球图
function initLiquidCharts() {
    // 中国教材水球图
    renderEChart('china-chart', {
        title: {
            text: '0.5年',
            left: 'center',
            top: 'center',
            textStyle: { fontSize: 30, fontWeight: 'bold', color: '#8C1C13' }
        },
        series: [{
            type: 'liquidFill',
            data: [0.05], // 0.5年 / 10年 (假设发达国家最高可达10年) = 0.05
            radius: '80%',
            color: ['rgba(140, 28, 19, 0.6)'],
            label: { show: false },
            outline: {
                show: true,
                borderDistance: 5,
                itemStyle: { borderWidth: 3, borderColor: '#8C1C13' }
            }
        }]
    });

    // 发达国家教材水球图
    renderEChart('dev-chart', {
        title: {
            text: '5-10年', // 更新为更精确的范围
            left: 'center',
            top: 'center',
            textStyle: { fontSize: 30, fontWeight: 'bold', color: '#3498db' }
        },
        series: [{
            type: 'liquidFill',
            data: [0.75], // 以 7.5年 为参考，7.5/10 = 0.75
            radius: '80%',
            color: ['rgba(52, 152, 219, 0.6)'],
            label: { show: false },
            outline: {
                show: true,
                borderDistance: 5,
                itemStyle: { borderWidth: 3, borderColor: '#3498db' }
            }
        }]
    });
}
