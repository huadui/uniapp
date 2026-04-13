<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="data-row">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-header">总用户数</div>
          <div class="card-value">{{ stats.totalUsers }}</div>
          <div class="card-footer">
            今日新增: <span class="highlight">+{{ stats.todayNewUsers }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-header">AI 舌诊次数</div>
          <div class="card-value">{{ stats.totalTongue }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-header">AI 面诊次数</div>
          <div class="card-value">{{ stats.totalFace }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-header">体质辨识/智能问诊次数</div>
          <div class="card-value">{{ stats.totalConstitution }} / {{ stats.totalInquiry }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-title">用户体质分布</div>
          </template>
          <div ref="pieChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-title">近七日舌诊/面诊趋势</div>
          </template>
          <div ref="lineChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import request from '../utils/request'
import * as echarts from 'echarts'

const stats = ref({
  totalUsers: 0,
  todayNewUsers: 0,
  totalTongue: 0,
  totalFace: 0,
  totalConstitution: 0,
  totalInquiry: 0,
  constitutionPie: [],
  trendDates: [],
  trendTongue: [],
  trendFace: []
})

const pieChartRef = ref(null)
const lineChartRef = ref(null)
let pieChart = null
let lineChart = null

const loadStats = async () => {
  try {
    const res = await request.get('/admin/dashboard/stats')
    if (res.code === '200') {
      stats.value = res.data
      initCharts()
    }
  } catch (e) {
    console.error('Failed to load dashboard stats', e)
  }
}

  const initCharts = () => {
  // 1. 体质分布饼图
  if (pieChartRef.value) {
    if (!pieChart) pieChart = echarts.init(pieChartRef.value)
    const pieOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        bottom: '5%',
        left: 'center'
      },
      series: [
        {
          name: '体质类型',
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: stats.value.constitutionPie
        }
      ]
    }
    pieChart.setOption(pieOption)
  }

  // 2. 近七日趋势折线图
  if (lineChartRef.value) {
    if (!lineChart) lineChart = echarts.init(lineChartRef.value)
    const lineOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['舌诊', '面诊'],
        top: '0%',
        right: 'center'
      },
      grid: {
        top: '15%',
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: stats.value.trendDates
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '舌诊',
          type: 'line',
          smooth: true,
          data: stats.value.trendTongue,
          itemStyle: { color: '#FF7A8A' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 122, 138, 0.5)' },
              { offset: 1, color: 'rgba(255, 122, 138, 0)' }
            ])
          }
        },
        {
          name: '面诊',
          type: 'line',
          smooth: true,
          data: stats.value.trendFace,
          itemStyle: { color: '#4DA8DA' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(77, 168, 218, 0.5)' },
              { offset: 1, color: 'rgba(77, 168, 218, 0)' }
            ])
          }
        }
      ]
    }
    lineChart.setOption(lineOption)
  }
}

onMounted(() => {
  loadStats()
  window.addEventListener('resize', () => {
    if (pieChart) pieChart.resize()
    if (lineChart) lineChart.resize()
  })
})
</script>

<style scoped>
.dashboard-container {
  padding: 10px;
}

.data-row {
  margin-bottom: 20px;
}

.data-card {
  border-radius: 8px;
  background: #fdfbf7;
  border: 1px solid #E0D6C8;
}

.card-header {
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #3E2723; /* 棕色 */
  margin-bottom: 10px;
}

.card-footer {
  font-size: 13px;
  color: #999;
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
}

.highlight {
  color: #67C23A;
  font-weight: bold;
}

.chart-card {
  border-radius: 8px;
  background: #fff;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #3E2723;
  font-family: "Kaiti SC", "STKaiti", "KaiTi", serif;
}

.chart-box {
  height: 350px;
  width: 100%;
}
</style>
