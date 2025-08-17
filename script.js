// 声明页面逻辑
document.addEventListener('DOMContentLoaded', function() {
  const noticePage = document.getElementById('noticePage');
  const mainContent = document.getElementById('mainContent');
  const continueBtn = document.getElementById('continueBtn');
  
  // 点击继续按钮显示主内容
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
  // 初始化水球图
  initLiquidCharts();
  
  // 初始化教材去向分布玫瑰图
  initRadiusChart();
  
  // 初始化支持度与购买率对比图
  initSupportPurchaseChart();
  
  // 墨蝶元素控制
  const butterfly = document.getElementById('ink-butterfly');
  const sections = document.querySelectorAll('section');
  let currentSectionIndex = 0;
  
  // 随机生成墨蝶的位置（四个角落）
  function getRandomCorner(section) {
      const corners = [
          { top: '20px', left: '20px' },    // 左上角
          { top: '20px', right: '20px' },   // 右上角
          { bottom: '20px', left: '20px' }, // 左下角
          { bottom: '20px', right: '20px' } // 右下角
      ];
      return corners[Math.floor(Math.random() * corners.length)];
  }
  
  // 移动墨蝶到指定区域的随机角落
  function moveButterflyToSection(sectionIndex) {
      if (sectionIndex >= sections.length) return;
      
      const section = sections[sectionIndex];
      const rect = section.getBoundingClientRect();
      const corner = getRandomCorner(section);
      
      // 设置墨蝶位置
      butterfly.style.top = `${rect.top + window.scrollY + (corner.top ? parseInt(corner.top) : 0)}px`;
      butterfly.style.left = corner.left || 'auto';
      butterfly.style.right = corner.right || 'auto';
      butterfly.style.bottom = corner.bottom || 'auto';
      
      // 添加旋转动画效果
      butterfly.style.transform = `rotate(${Math.random() * 360}deg)`;
  }
  
  // 初始化墨蝶位置
  moveButterflyToSection(0);
  
  // 叠化过渡效果实现
  const pageTransition = document.getElementById('pageTransition');
  let isTransitioning = false; // 防止过渡中重复触发
  
  // 初始化页面 - 仅第一页可见，其他页隐藏
  sections.forEach((section, index) => {
      section.classList.add('section-wrapper');
      if (index !== 0) {
          section.style.opacity = '0'; // 初始隐藏非首屏内容
      }
  });
  
  // 检测当前可见的section
  function getCurrentSection() {
      let currentIndex = 0;
      let minOffset = Infinity;
      
      sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          const offset = Math.abs(rect.top);
          
          if (offset < minOffset) {
              minOffset = offset;
              currentIndex = index;
          }
      });
      
      return currentIndex;
  }
  
  // 执行叠化过渡动画
  function triggerTransition(newIndex) {
      if (isTransitioning || newIndex === currentSectionIndex) return;
      isTransitioning = true;
      
      // 前一页淡出
      sections[currentSectionIndex].classList.add('section-fading');
      
      // 显示过渡层（短暂闪现，增强叠化效果）
      setTimeout(() => {
          pageTransition.style.opacity = '1';
          
          // 后一页淡入
          setTimeout(() => {
              sections[newIndex].style.opacity = '1';
              sections[currentSectionIndex].style.opacity = '0';
              pageTransition.style.opacity = '0';
              currentSectionIndex = newIndex;
              isTransitioning = false;
              
              // 移动墨蝶
              moveButterflyToSection(newIndex);
          }, 300); // 过渡层显示时间（总动画的一半）
      }, 300);
  }
  
  // 监听滚动事件 - 修复了滚动检测逻辑
  window.addEventListener('scroll', () => {
      if (isTransitioning) return;
      const newIndex = getCurrentSection();
      triggerTransition(newIndex);
  });
  
  // 初始化滚动检测 - 立即检查并显示第一页
  setTimeout(() => {
      const initialIndex = getCurrentSection();
      if (initialIndex !== currentSectionIndex) {
          triggerTransition(initialIndex);
      }
  }, 100);
  
  // 图表初始化
  initCharts();
  
  // 移动端背景图兼容性处理
  handleMobileBackgrounds();
}

// 初始化水球图
function initLiquidCharts() {
  // 中国教材水球图
  const chinaChart = echarts.init(document.getElementById('china-chart'));
  const chinaOption = {
      title: {
          text: '0.5年',
          left: 'center',
          top: 'center',
          textStyle: {
              fontSize: 30,
              fontWeight: 'bold',
              color: '#8C1C13'
          }
      },
      series: [{
          type: 'liquidFill',
          data: [0.5],
          radius: '80%',
          color: ['rgba(140, 28, 19, 0.6)'],
          label: {
              show: false
          },
          outline: {
              show: true,
              borderDistance: 5,
              itemStyle: {
                  borderWidth: 3,
                  borderColor: '#8C1C13'
              }
          }
      }]
  };
  
  // 发达国家教材水球图
  const devChart = echarts.init(document.getElementById('dev-chart'));
  const devOption = {
      title: {
          text: '7.5年',
          left: 'center',
          top: 'center',
          textStyle: {
              fontSize: 30,
              fontWeight: 'bold',
              color: '#3498db'
          }
      },
      series: [{
          type: 'liquidFill',
          data: [0.75],
          radius: '80%',
          color: ['rgba(52, 152, 219, 0.6)'],
          label: {
              show: false
          },
          outline: {
              show: true,
              borderDistance: 5,
              itemStyle: {
                  borderWidth: 3,
                  borderColor: '#3498db'
              }
          }
      }]
  };
  
  // 渲染水球图
  chinaChart.setOption(chinaOption);
  devChart.setOption(devOption);
  
  // 响应式处理
  window.addEventListener('resize', function() {
      chinaChart.resize();
      devChart.resize();
  });
}

// 初始化教材去向分布玫瑰图
function initRadiusChart() {
  // 初始化图表
  const radiusChart = echarts.init(document.getElementById('radius-chart'));
  
  // 教材去向数据
  const data = [
      { name: '作为废品出售', value: 43.18 },
      { name: '捐赠给学弟学妹', value: 15.91 },
      { name: '捐赠给公益组织', value: 2.27 },
      { name: '二手平台转售', value: 11.36 },
      { name: '校园跳蚤市场/社群转售', value: 4.55 },
      { name: '其他处理方式', value: 22.73 }
  ];
  
  // 颜色配置
  const colors = [
      '#e74c3c', '#2ecc71', '#3498db', 
      '#f39c12', '#9b59b6', '#95a5a6'
  ];
  
  // 半径模式玫瑰图配置
  const radiusOption = {
      tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}%'
      },
      legend: {
          bottom: 10,
          type: 'scroll',
          orient: 'horizontal',
          textStyle: {
              fontSize: 12
          }
      },
      series: [
          {
              name: '教材去向',
              type: 'pie',
              radius: ['30%', '80%'],
              center: ['50%', '45%'],
              roseType: 'radius',
              itemStyle: {
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: '#fff'
              },
              label: {
                  show: true,
                  formatter: '{b}: {c}%',
                  fontSize: 12
              },
              emphasis: {
                  itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              },
              data: data.map((item, index) => ({
                  ...item,
                  itemStyle: { color: colors[index] }
              }))
          }
      ]
  };
  
  // 渲染图表
  radiusChart.setOption(radiusOption);
  
  // 响应式调整
  window.addEventListener('resize', function() {
      radiusChart.resize();
  });
  
  // 添加加载动画
  setTimeout(() => {
      radiusChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0
      });
  }, 500);
}

// 初始化支持度与购买率对比图
function initSupportPurchaseChart() {
  // 初始化图表
  const chart = echarts.init(document.getElementById('support-purchase-chart'));
  
  // 数据
  const data = {
      categories: ['非常赞同', '赞同', '总体支持度', '实际购买率'],
      values: [45.45, 40.91, 86.36, 36.36],
      colors: ['#3498db', '#2ecc71', '#9b59b6', '#e74c3c']
  };
  
  // 配置项
  const option = {
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          },
          formatter: '{b}: {c}%'
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: {
          type: 'category',
          data: data.categories,
          axisLabel: {
              rotate: 15,
              interval: 0
          }
      },
      yAxis: {
          type: 'value',
          max: 100,
          axisLabel: {
              formatter: '{value}%'
          }
      },
      series: [{
          data: data.values,
          type: 'bar',
          itemStyle: {
              color: function(params) {
                  return data.colors[params.dataIndex];
              }
          },
          emphasis: {
              itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
          }
      }]
  };
  
  // 渲染图表
  chart.setOption(option);
  
  // 响应式调整
  window.addEventListener('resize', function() {
      chart.resize();
  });
}

// 图表初始化函数
function initCharts() {
  // 教材回收模式对比图表已删除
  
  // 学生对二手教材的态度图表
  initChart('学生对二手教材的态度', 'bar', {
      labels: ['支持理念', '实际购买'],
      datasets: [{
          label: '学生比例（%）',
          data: [90, 62],
          backgroundColor: [
              'rgba(60, 120, 90, 0.6)',
              'rgba(140, 28, 19, 0.6)'
          ],
          borderColor: [
              'rgba(60, 120, 90, 1)',
              'rgba(140, 28, 19, 1)'
          ],
          borderWidth: 1
      }]
  }, {
      responsive: true,
      scales: {
          y: {
              beginAtZero: true,
              max: 100,
              title: {
                  display: true,
                  text: '百分比（%）'
              }
          }
      }
  });
  
  // 二手教材选择动机图表
  initChart('二手教材选择动机', 'doughnut', {
      labels: ['节约费用', '环保', '获得附赠笔记', '其他'],
      datasets: [{
          data: [78, 12, 7, 3],
          backgroundColor: [
              'rgba(140, 28, 19, 0.6)',
              'rgba(60, 120, 90, 0.6)',
              'rgba(50, 100, 150, 0.6)',
              'rgba(150, 150, 150, 0.6)'
          ],
          borderColor: [
              'rgba(140, 28, 19, 1)',
              'rgba(60, 120, 90, 1)',
              'rgba(50, 100, 150, 1)',
              'rgba(150, 150, 150, 1)'
          ],
          borderWidth: 1
      }]
  }, {
      responsive: true
  });
  
  // 二手教材获取途径图表
  initChart('二手教材获取途径', 'doughnut', {
      labels: ['同学转手', '校园跳蚤市场', '专业二手平台', '其他'],
      datasets: [{
          data: [52, 30, 18, 0],
          backgroundColor: [
              'rgba(140, 28, 19, 0.6)',
              'rgba(60, 120, 90, 0.6)',
              'rgba(50, 100, 150, 0.6)',
              'rgba(150, 150, 150, 0.6)'
          ],
          borderColor: [
              'rgba(140, 28, 19, 1)',
              'rgba(60, 120, 90, 1)',
              'rgba(50, 100, 150, 1)',
              'rgba(150, 150, 150, 1)'
          ],
          borderWidth: 1
      }]
  }, {
      responsive: true
  });
  
  // 教材循环环保效益图表
  initChart('教材循环环保效益', 'bar', {
      labels: ['文化纸', '木材', '纯净水', '煤'],
      datasets: [{
          label: '5年循环使用可节约资源（万吨）',
          data: [528, 300, 52800, 633.5],
          backgroundColor: 'rgba(140, 28, 19, 0.6)',
          borderColor: 'rgba(140, 28, 19, 1)',
          borderWidth: 1
      }]
  }, {
      responsive: true,
      scales: {
          y: {
              beginAtZero: true,
              title: {
                  display: true,
                  text: '单位：万吨（水为万吨）'
              }
          }
      }
  });
}

// 图表初始化辅助函数
function initChart(canvasId, type, data, options) {
  const canvas = document.getElementById(canvasId);
  if (canvas) {
      new Chart(canvas, {
          type: type,
          data: data,
          options: options
      });
  }
}

// 移动端背景图兼容性处理
function handleMobileBackgrounds() {
  if (window.innerWidth <= 768) {
      const backgroundImages = document.querySelectorAll('.section-bg');
      backgroundImages.forEach(img => {
          // 强制应用背景图属性
          img.style.backgroundImage = img.style.backgroundImage;
          img.style.backgroundSize = 'cover';
          img.style.backgroundPosition = 'center';
          img.style.backgroundRepeat = 'no-repeat';
          img.style.opacity = '0.15';
      });
  }
}

// 窗口大小改变时重新处理
window.addEventListener('resize', function() {
  if (document.getElementById('mainContent').style.display === 'block') {
      handleMobileBackgrounds();
  }
});