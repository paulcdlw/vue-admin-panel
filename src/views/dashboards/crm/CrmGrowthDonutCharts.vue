<script setup>
import { useTheme } from 'vuetify'
import { hexToRgb } from '@core/utils/colorConverter'

const vuetifyTheme = useTheme()

const series = [
  35,
  30,
  23,
]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const textSecondary = `rgba(${ hexToRgb(currentTheme['on-surface']) },${ variableTheme['medium-emphasis-opacity'] })`
  
  return {
    legend: { show: false },
    stroke: {
      width: 5,
      colors: ['rgba(var(--v-theme-surface),1)'],
    },
    colors: [
      currentTheme.primary,
      currentTheme.success,
      currentTheme.secondary,
    ],
    labels: [
      `${ new Date().getFullYear() }`,
      `${ new Date().getFullYear() - 1 }`,
      `${ new Date().getFullYear() - 2 }`,
    ],
    tooltip: { y: { formatter: val => `${ val }%` } },
    dataLabels: { enabled: false },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { show: false },
            total: {
              label: '',
              show: true,
              fontWeight: 600,
              fontSize: '1rem',
              color: textSecondary,
              formatter: val => typeof val === 'string' ? `${ val }%` : '12%',
            },
            value: {
              offsetY: 6,
              fontWeight: 600,
              fontSize: '1rem',
              formatter: val => `${ val }%`,
              color: textSecondary,
            },
          },
        },
      },
    },
  }
})
</script>

<template>
  <VCard>
    <VCardText class="pb-4 pb-sm-0">
      <div class="d-flex align-center gap-1">
        <h5 class="text-h5">
          $27.9k
        </h5>
        <span class="text-success text-body-1">+16%</span>
      </div>
      <div class="text-subtitle-1">
        Total Growth
      </div>
      <VueApexCharts
        type="donut"
        :options="chartOptions"
        :series="series"
        :height="135"
        class="mt-4"
      />
    </VCardText>
  </VCard>
</template>
