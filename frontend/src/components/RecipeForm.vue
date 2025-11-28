<script setup>
import { ref, watch } from 'vue'
import { createRecipe, updateRecipe } from '@/services/recipesService'
import { uploadFile } from '@/services/uploadService'

const props = defineProps({
  initialRecipe: { type: Object, default: null }
})
const emit = defineEmits(['saved', 'close'])

const form = ref({
  Title: '',
  CookTime: '00:00:00',
  PrepTime: '00:00:00',
  Difficulty: 'normal',
  Illustration: '',
  Servings: 1,
  Description: '',
  Steps: ''
})
const editingId = ref(null)
const imagePreview = ref(null)

const handleFiles = async (files) => {
  if (!files || !files.length) return
  const file = files[0]
  try {
    // upload to backend, get just the filename
    const filename = await uploadFile(file)
    // show preview with full URL
    imagePreview.value = `http://localhost:3000/uploads/${filename}`
    // store just the filename in form (will be saved to DB)
    form.value.Illustration = filename
  } catch (err) {
    console.error('Upload failed', err)
    alert('Image upload failed')
  }
}

const onFileChange = (e) => handleFiles(e.target.files)
const onDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }
const onDragOver = (e) => e.preventDefault()

const resetForm = () => {
  form.value = {
    Title: '',
    CookTime: '00:00:00',
    PrepTime: '00:00:00',
    Difficulty: 'normal',
    Illustration: '',
    Servings: 1,
    Description: '',
    Steps: ''
  }
}

watch(() => props.initialRecipe, (r) => {
  if (!r) {
    resetForm()
    editingId.value = null
    imagePreview.value = null
  } else {
    form.value = {
      Title: r.Title || '',
      CookTime: r.CookTime || '00:00:00',
      PrepTime: r.PrepTime || '00:00:00',
      Difficulty: r.Difficulty || 'normal',
      Illustration: r.Illustration || '',
      Servings: r.Servings || 1,
      Description: r.Description || '',
      Steps: r.Steps || ''
    }
    editingId.value = r.IDRecipes || null
    // show preview: if Illustration is just a filename, construct full URL
    if (r.Illustration) {
      if (r.Illustration.startsWith('http')) {
        imagePreview.value = r.Illustration
      } else {
        imagePreview.value = `http://localhost:3000/uploads/${r.Illustration}`
      }
    }
  }
}, { immediate: true })

const submit = async () => {
  if (!form.value.Title) { alert('Title is required'); return }

  try {
    const payload = { ...form.value }

    if (editingId.value === null) {
      const created = await createRecipe(payload)
      emit('saved', { action: 'create', recipe: created })
    } else {
      const updated = await updateRecipe(editingId.value, payload)
      emit('saved', { action: 'update', recipe: updated })
    }

    resetForm()
  } catch (err) {
    console.error(err)
    alert('Failed to save recipe')
  }
}

const cancel = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <div class="card">
    <div class="modal">
      <h2>{{ editingId === null ? 'Add recipe' : 'Edit recipe' }}</h2>

      <form @submit.prevent="submit">
        <div class="form-row">
          <label>Title</label>
          <input v-model="form.Title" required />
        </div>

        <div class="form-row dropzone" @dragover="onDragOver" @drop="onDrop">
          <label>Image</label>
          <div class="dropzone-inner">
            <p>Drop an image here or choose a file</p>
            <input type="file" accept="image/*" @change="onFileChange" />
          </div>
        </div>

        <div v-if="imagePreview">
          <label>Preview</label>
          <img :src="imagePreview" class="ImgPreview" alt="Preview" />
        </div>

        <div class="form-row">
          <label>Cooking time</label>
          <input v-model="form.CookTime" type="time" />
        </div>

        <div class="form-row">
          <label>Preparation time</label>
          <input v-model="form.PrepTime" type="time" />
        </div>

        <div class="form-row">
          <label>Difficulty</label>
          <input v-model="form.Difficulty" />
        </div>

        <div class="actions">
          <button type="submit">Save</button>
          <button type="button" @click="cancel">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.ImgPreview { max-width: 200px; display:block; margin-top:10px }
</style>
