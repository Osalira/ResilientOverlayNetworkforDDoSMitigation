<template>
  <div class="demo">
    <v-card class="mb-6">
      <v-card-title class="text-h4">Project Demo & Presentation</v-card-title>
      <v-card-subtitle>Project Demonstration and Final Presentation Materials</v-card-subtitle>
    </v-card>

    <!-- Admin Upload Section -->
    <v-card v-if="postStore.isAdmin" class="mb-6">
      <v-card-title class="text-h6">Upload Presentation Materials</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleUpload">
          <v-text-field
            v-model="uploadForm.title"
            label="Title"
            required
            :rules="[(v: any) => !!v || 'Title is required']"
          ></v-text-field>

          <v-text-field
            v-model="uploadForm.videoUrl"
            label="YouTube Video URL"
            placeholder="https://www.youtube.com/watch?v=..."
            :rules="[(v: any) => !v || isValidYouTubeUrl(v) || 'Invalid YouTube URL']"
          ></v-text-field>

          <v-file-input
            v-model="uploadForm.slides"
            label="Presentation Slides (PDF)"
            accept=".pdf"
            prepend-icon="mdi-file-presentation-box"
            show-size
          ></v-file-input>

          <v-textarea
            v-model="uploadForm.description"
            label="Description"
            rows="3"
          ></v-textarea>

          <v-btn
            type="submit"
            color="primary"
            :loading="isUploading"
            :disabled="isUploading"
            class="mt-2"
          >
            Upload Materials
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Demo Content -->
    <v-card v-if="isLoading" class="mb-6">
      <v-card-text class="text-center">
        <v-progress-circular indeterminate></v-progress-circular>
        Loading presentation materials...
      </v-card-text>
    </v-card>

    <template v-else>
      <v-card v-for="item in presentations" :key="item.id" class="mb-6">
        <v-card-title class="text-h5">{{ item.title }}</v-card-title>
        <v-card-subtitle>{{ formatDate(item.date) }}</v-card-subtitle>

        <v-card-text>
          <!-- Video Section -->
          <div v-if="item.videoUrl" class="video-container mb-6">
            <iframe
              :src="getEmbedUrl(item.videoUrl)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>

          <!-- Description -->
          <p v-if="item.description" class="text-body-1 mb-4">
            {{ item.description }}
          </p>

          <!-- PDF Slides -->
          <div v-if="item.slidesUrl">
            <pdf-viewer
              :source="item.slidesUrl"
              :show-controls="true"
              :full-width="true"
              class="mb-4"
            />
            
            <v-btn
              :href="item.slidesUrl"
              target="_blank"
              color="primary"
              prepend-icon="mdi-download"
            >
              Download Slides
            </v-btn>
          </div>
        </v-card-text>

        <v-card-actions v-if="postStore.isAdmin">
          <v-btn
            color="error"
            variant="text"
            @click="handleDelete(item.id)"
            :loading="isDeletingId === item.id"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePostStore } from '@/stores/posts'
import PdfViewer from '@/components/PdfViewer.vue'
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { db, storage } from '@/firebaseConfig'

const postStore = usePostStore()
const isLoading = ref(false)
const isUploading = ref(false)
const isDeletingId = ref<string | null>(null)
const presentations = ref<any[]>([])

const uploadForm = ref({
  title: '',
  videoUrl: '',
  slides: null as File | null,
  description: ''
})

const formatDate = (date: any) => {
  return new Date(date.toDate()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const isValidYouTubeUrl = (url: string) => {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  return pattern.test(url)
}

const getEmbedUrl = (url: string) => {
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1]
  return videoId ? 'https://www.youtube.com/embed/' + videoId : ''
}

const fetchPresentations = async () => {
  isLoading.value = true
  try {
    const presentationsRef = collection(db, 'presentations')
    const q = query(presentationsRef, orderBy('date', 'desc'))
    const snapshot = await getDocs(q)
    
    presentations.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching presentations:', error)
  } finally {
    isLoading.value = false
  }
}

const handleUpload = async () => {
  if (!uploadForm.value.title) return
  if (uploadForm.value.videoUrl && !isValidYouTubeUrl(uploadForm.value.videoUrl)) return

  isUploading.value = true
  try {
    let slidesUrl = null
    let fileName = null

    if (uploadForm.value.slides) {
      fileName = Date.now() + '_' + uploadForm.value.slides.name
      const fileRef = storageRef(storage, 'presentations/' + fileName)
      await uploadBytes(fileRef, uploadForm.value.slides)
      slidesUrl = await getDownloadURL(fileRef)
    }

    await addDoc(collection(db, 'presentations'), {
      title: uploadForm.value.title,
      videoUrl: uploadForm.value.videoUrl || null,
      slidesUrl,
      fileName,
      description: uploadForm.value.description,
      date: Timestamp.now()
    })

    // Reset form
    uploadForm.value = {
      title: '',
      videoUrl: '',
      slides: null,
      description: ''
    }

    await fetchPresentations()
  } catch (error) {
    console.error('Error uploading presentation:', error)
  } finally {
    isUploading.value = false
  }
}

const handleDelete = async (presentationId: string) => {
  if (!confirm('Are you sure you want to delete this presentation?')) return
  
  isDeletingId.value = presentationId
  try {
    const presentation = presentations.value.find(p => p.id === presentationId)
    if (presentation?.fileName) {
      const fileRef = storageRef(storage, 'presentations/' + presentation.fileName)
      await deleteObject(fileRef)
    }
    
    await deleteDoc(doc(db, 'presentations', presentationId))
    await fetchPresentations()
  } catch (error) {
    console.error('Error deleting presentation:', error)
  } finally {
    isDeletingId.value = null
  }
}

onMounted(() => {
  fetchPresentations()
})
</script>

<style scoped>
.demo {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

@media (min-width: 1264px) {
  .demo {
    max-width: 1200px;
  }
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style> 