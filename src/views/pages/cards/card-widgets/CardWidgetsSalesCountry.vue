<script setup>
import { useTheme } from 'vuetify'
import { hexToRgb } from '@core/utils/colorConverter'

const moreList = [
  {
    title: 'Refresh',
    value: 'refresh',
  },
  {
    title: 'Update',
    value: 'update',
  },
  {
    title: 'Share',
    value: 'share',
  },
]

const vuetifyTheme = useTheme()

const chartConfig = computed(() => {
  const themeColors = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const borderColor = `rgba(${ hexToRgb(String(variableTheme['border-color'])) },${ variableTheme['border-opacity'] })`
  const disabledText = `rgba(${ hexToRgb(String(themeColors['on-background'])) },${ variableTheme['disabled-opacity'] })`
  const primaryText = `rgba(${ hexToRgb(String(themeColors['on-background'])) },${ variableTheme['high-emphasis-opacity'] })`
  
  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    tooltip: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '60%',
        horizontal: true,
        distributed: true,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: 6,
      style: {
        fontSize: '0.8125rem',
        fontWeight: 500,
      },
    },
    grid: {
      strokeDashArray: 8,
      borderColor,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: {
        top: -18,
        left: 21,
        right: 33,
        bottom: 10,
      },
    },
    colors: [
      `rgba(${ hexToRgb(String(themeColors.primary)) }, 1)`,
      `rgba(${ hexToRgb(String(themeColors.success)) }, 1)`,
      `rgba(${ hexToRgb(String(themeColors.warning)) }, 1)`,
      `rgba(${ hexToRgb(String(themeColors.info)) }, 1)`,
      `rgba(${ hexToRgb(String(themeColors.error)) }, 1)`,
    ],
    legend: { show: false },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: [
        'US',
        'IN',
        'JA',
        'CA',
        'AU',
      ],
      labels: {
        formatter: val => `${ Number(val) / 1000 }k`,
        style: {
          fontSize: '0.8125rem',
          colors: disabledText,
        },
      },
    },
    yaxis: {
      labels: {
        align: 'right',
        style: {
          fontWeight: 500,
          fontSize: '0.9375rem',
          colors: primaryText,
        },
      },
    },
  }
})

const series = [{
  name: 'Sales',
  data: [
    17165,
    13850,
    12375,
    9567,
    7880,
  ],
}]
</script>

<template>
  <VCard
    title="Sales Country"
    subtitle="Total $42,580 Sales"
  >
    <template #append>
      <div class="mt-n8 me-n3">
        <MoreBtn :menu-list="moreList" />
      </div>
    </template>

    <VueApexCharts
      type="bar"
      height="294"
      :options="chartConfig"
      :series="series"
    />
  </VCard>
</template>
