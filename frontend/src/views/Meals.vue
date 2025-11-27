<script setup>
import { ref, computed } from 'vue'

const currentDate = ref(new Date())

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const monthLabel = computed(() =>
  currentDate.value.toLocaleString('en-GB', {
    month: 'long',
    year: 'numeric'
  })
)

// build the calendar cells for the current month
function buildCalendar(date) {
  const year = date.getFullYear()
  const month = date.getMonth() // 0–11

  const firstDay = new Date(year, month, 1)
  // JS: Sunday = 0, Monday = 1 ... we want Monday=0
  const startIndex = (firstDay.getDay() + 6) % 7

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []

  // empty cells before day 1
  for (let i = 0; i < startIndex; i++) {
    cells.push({ key: `b-${i}`, label: '', inMonth: false, date: null })
  }

  // real days
  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(year, month, d)
    cells.push({
      key: `d-${d}`,
      label: d,
      inMonth: true,
      date: thisDate
    })
  }

  return cells
}

const cells = computed(() => buildCalendar(currentDate.value))

const prevMonth = () => {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
}

const nextMonth = () => {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
}

// optional: selected day (for future: attach recipes / planning)
const selectedDate = ref(null)

const selectDay = (cell) => {
  if (!cell.inMonth || !cell.date) return
  selectedDate.value = cell.date
}
</script>

<template>
  <div class="planning-page">
    <div class="calendar-header">
      <button @click="prevMonth">‹</button>
      <h2>{{ monthLabel }}</h2>
      <button @click="nextMonth">›</button>
    </div>

    <div class="calendar-grid">
      <div class="day-name" v-for="name in dayNames" :key="name">
        {{ name }}
      </div>

      <button
        v-for="cell in cells"
        :key="cell.key"
        class="day-cell"
        :class="{
          'day-empty': !cell.inMonth,
          'day-selected':
            cell.date &&
            selectedDate &&
            cell.date.toDateString() === selectedDate?.toDateString()
        }"
        @click="selectDay(cell)"
      >
        {{ cell.label }}
      </button>
    </div>

    <!-- zone where later you can show meals for selected day -->
    <div v-if="selectedDate" class="planning-details">
      <h3>
        Planning for
        {{ selectedDate.toLocaleDateString('en-GB') }}
      </h3>
      <p>(Here you could show recipes planned for this day.)</p>
    </div>
  </div>
</template>

<style scoped>
.planning-page {
  padding: 1rem;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.calendar-header h2 {
  margin: 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
}

.day-name {
  font-weight: bold;
  text-align: center;
  padding: 0.25rem 0;
}

.day-cell {
  min-height: 40px;
  border: 1px solid #ddd;
  background: #fff;
  text-align: right;
  padding: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.day-empty {
  background: #f8f8f8;
  cursor: default;
}

.day-selected {
  border-color: #007bff;
  box-shadow: 0 0 0 1px #007bff;
}

.planning-details {
  margin-top: 1rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}
</style>
