<script setup>
import { ref, computed, watch } from 'vue'
import { getMealsByDate, removeMealFromPlanning } from '@/services/planningService'
import { getStoredUser } from '@/services/authService'

const currentUser = ref(getStoredUser())
const currentUserId = computed(() => currentUser.value?.id || 1)

const today = new Date()
const currentDate = ref(new Date())
const selectedDate = ref(new Date())

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const monthLabel = computed(() =>
  currentDate.value.toLocaleString('en-GB', {
    month: 'long',
    year: 'numeric'
  })
)

// Helpers to build the calendar grid
function startOfMonth (date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth (date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function sameDay (a, b) {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

const calendarDays = computed(() => {
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)

  // getDay: 0=Sun,1=Mon,... → convert to 0=Mon,...,6=Sun
  const startIdx = (start.getDay() + 6) % 7
  const days = []

  // previous month days
  for (let i = 0; i < startIdx; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() - (startIdx - i))
    days.push({ date: d, inCurrentMonth: false })
  }

  // current month days
  for (let d = 1; d <= end.getDate(); d++) {
    const dt = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), d)
    days.push({ date: dt, inCurrentMonth: true })
  }

  // fill to complete weeks
  while (days.length % 7 !== 0) {
    const last = days[days.length - 1].date
    const d = new Date(last)
    d.setDate(last.getDate() + 1)
    days.push({ date: d, inCurrentMonth: false })
  }

  return days
})

function selectDay (day) {
  selectedDate.value = new Date(day.date)
}

function goPrevMonth () {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
}

function goNextMonth () {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
}

// Meal types mapping DB <-> UI
const mealTypes = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' }
]

const meals = ref({
  breakfast: [],
  lunch: [],
  dinner: []
})

const isLoadingMeals = ref(false)
const mealsError = ref(null)

function formatDate (date) {
  if (!date) return ''
  return date.toLocaleDateString('en-GB') // dd/mm/yyyy
}

// Helper: build YYYY-MM-DD string in local time for API / DB
function formatDateForApi (date) {
  if (!date) return ''
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  )
}

// Load meals for a given date from backend and group by meal type
async function loadMealsForDate (date) {
  if (!date) return
  isLoadingMeals.value = true
  mealsError.value = null

  try {
    const iso = formatDateForApi(date)

    const data = await getMealsByDate({
      accountId: currentUserId.value,
      dateMeal: iso
    })

    // console.log('Meals from API for', iso, data)

    const grouped = {
      breakfast: [],
      lunch: [],
      dinner: []
    }

    data.forEach((item) => {
      // item.MealType should be 'breakfast' | 'lunch' | 'dinner'
      const key = (item.MealType || '').toLowerCase()
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(item)
    })

    meals.value = grouped
  } catch (err) {
    console.error(err)
    mealsError.value = 'Error while loading meals.'
    meals.value = {
      breakfast: [],
      lunch: [],
      dinner: []
    }
  } finally {
    isLoadingMeals.value = false
  }
}

// Delete a planned meal (one row in Connects)
async function deletePlannedMeal (mealType, recipe) {
  if (!selectedDate.value) return

  try {
    const iso = formatDateForApi(selectedDate.value)

    await removeMealFromPlanning({
      accountId: currentUserId.value,
      recipeId: recipe.IDRecipes,
      dateMeal: iso,
      mealType // 'breakfast' | 'lunch' | 'dinner'
    })

    // Reload meals for this day after deletion
    await loadMealsForDate(selectedDate.value)
  } catch (err) {
    console.error('Failed to delete planned meal:', err)
  }
}

// When selected date changes → reload meals
watch(
  selectedDate,
  (d) => {
    loadMealsForDate(d)
  },
  { immediate: true }
)

// Optional: if you want to reload when month changes, you can keep this,
// but it is not strictly required for planning logic.
// watch(currentDate, () => {
//   loadMealsForDate(selectedDate.value)
// })
</script>

<template>
  <div class="planning-page">
    <div class="calendar-header">
      <button type="button" @click="goPrevMonth">‹</button>
      <h2>{{ monthLabel }}</h2>
      <button type="button" @click="goNextMonth">›</button>
    </div>

    <div class="calendar-grid">
      <div v-for="name in dayNames" :key="name" class="day-name">
        {{ name }}
      </div>

      <button
        v-for="day in calendarDays"
        :key="day.date.toISOString()"
        type="button"
        class="day-cell"
        :class="{
          'day-outside': !day.inCurrentMonth,
          'day-today': sameDay(day.date, today),
          'day-selected': sameDay(day.date, selectedDate)
        }"
        @click="selectDay(day)"
      >
        {{ day.date.getDate() }}
      </button>
    </div>

    <div class="planning-details">
      <h3>Planning for {{ formatDate(selectedDate) }}</h3>
      <p v-if="mealsError" class="error">{{ mealsError }}</p>
      <p v-else-if="isLoadingMeals">Loading...</p>

      <div class="meals-grid">
        <div
          v-for="type in mealTypes"
          :key="type.key"
          class="meal-column"
        >
          <h4>{{ type.label }}</h4>

          <div
            v-if="!meals[type.key] || meals[type.key].length === 0"
            class="meal-empty"
          >
            No recipe for this meal.
          </div>

          <div
            v-for="recipe in meals[type.key]"
            :key="recipe.IDRecipes"
            class="meal-card"
          >
            <div class="meal-card-header">
              <h5 class="meal-title">{{ recipe.Title }}</h5>
              <button
                type="button"
                class="meal-delete-btn"
                @click="deletePlannedMeal(type.key, recipe)"
                title="Remove this meal from planning"
              >
                ✕
              </button>
            </div>

            <p v-if="recipe.Description" class="meal-description">
              {{ recipe.Description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.planning-page {
  padding: 1rem 2rem;
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
  font-size: 1.5rem;
}

.calendar-header button {
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.day-name {
  font-weight: bold;
  text-align: center;
  padding: 0.25rem 0;
}

.day-cell {
  border: 1px solid #ddd;
  background: #fff;
  padding: 0.4rem 0;
  text-align: center;
  cursor: pointer;
  min-height: 2.2rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.day-outside {
  color: #aaa;
  background: #fafafa;
}

.day-today {
  border-color: #007bff;
}

.day-selected {
  border-color: #007bff;
  box-shadow: 0 0 0 1px #007bff;
}

.planning-details {
  margin-top: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.meals-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 0.75rem;
}

.meal-column h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.meal-empty {
  font-size: 0.9rem;
  color: #777;
}

.meal-card {
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  background: #fafafa;
}

.meal-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meal-title {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
}

.meal-delete-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
}

.meal-description {
  margin: 0;
  font-size: 0.85rem;
  color: #555;
}

.error {
  color: #b00020;
  margin-top: 0.25rem;
}
</style>
