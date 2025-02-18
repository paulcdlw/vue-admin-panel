<script setup>
import { useTheme } from 'vuetify'
import { hexToRgb } from '@core/utils/colorConverter'

const moreList = [
  {
    title: 'Last 28 Days',
    value: 'Last 28 Days',
  },
  {
    title: 'Last Month',
    value: 'Last Month',
  },
  {
    title: 'Last Year',
    value: 'Last Year',
  },
]

const vuetifyTheme = useTheme()

const chartConfig = computed(() => {
  const themeColors = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const secondaryText = `rgba(${ hexToRgb(String(themeColors['on-background'])) },${ variableTheme['medium-emphasis-opacity'] })`
  const primaryText = `rgba(${ hexToRgb(String(themeColors['on-background'])) },${ variableTheme['high-emphasis-opacity'] })`
  
  return {
    chart: { sparkline: { enabled: true } },
    colors: [
      `rgba(${ hexToRgb(String(themeColors.warning)) },1)`,
      `rgba(${ hexToRgb(String(themeColors.warning)) },0.8)`,
      `rgba(${ hexToRgb(String(themeColors.warning)) },0.6)`,
      `rgba(${ hexToRgb(String(themeColors.warning)) },0.4)`,
      `rgba(${ hexToRgb(String(themeColors.warning)) },0.2)`,
    ],
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 3,
      lineCap: 'round',
      colors: ['rgba(var(--v-theme-surface), 1)'],
    },
    labels: [
      'USA',
      'India',
      'Canada',
      'Japan',
      'France',
    ],
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    plotOptions: {
      pie: {
        endAngle: 130,
        startAngle: -130,
        customScale: 0.9,
        donut: {
          size: '83%',
          labels: {
            show: true,
            name: {
              offsetY: 25,
              fontSize: '0.9375rem',
              color: secondaryText,
            },
            value: {
              offsetY: -15,
              fontWeight: 500,
              fontSize: '1.75rem',
              lineHeight: 1.5,
              formatter: value => `${ value }k`,
              color: primaryText,
            },
            total: {
              show: true,
              label: '2022',
              fontSize: '0.9375rem',
              color: secondaryText,
              formatter: value => `${ value.globals.seriesTotals.reduce((total, num) => total + num) }k`,
            },
          },
        },
      },
    },
    responsive: [{
      breakpoint: 1709,
      options: { chart: { height: 270 } },
    }],
  }
})

const series = [
  13,
  18,
  18,
  24,
  16,
]

const customChartLegends = [
  {
    title: 'USA',
    opacity: 1,
  },
  {
    title: 'India',
    opacity: 0.8,
  },
  {
    title: 'Canada',
    opacity: 0.6,
  },
  {
    title: 'Japan',
    opacity: 0.4,
  },
  {
    title: 'France',
    opacity: 0.2,
  },
]
</script>

<template>
  <VCard title="Organic Sessions">
    <template #append>
      <div class="me-n3 mt-n2">
        <MoreBtn :menu-list="moreList" />
      </div>
    </template>

    <VCardText>
      <VueApexCharts
        type="donut"
        height="290"
        :options="chartConfig"
        :series="series"
      />

      <div class="d-flex align-center justify-center flex-wrap gap-x-6">
        <div
          v-for="legend in customChartLegends"
          :key="legend.title"
          class="d-flex align-center gap-1"
        >
          <VIcon
            icon="ri-circle-fill"
            size="10"
            color="warning"
          />
          <span>{{ legend.title }}</span>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>
