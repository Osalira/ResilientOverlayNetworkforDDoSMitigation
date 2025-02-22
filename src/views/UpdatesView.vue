<template>
  <div class="updates">
    <v-card class="mb-6">
      <v-card-title class="text-h4">BiWeekly Updates</v-card-title>
      <v-card-subtitle>Project Progress Reports</v-card-subtitle>
    </v-card>

    <!-- Admin Upload Section -->
    <v-card v-if="postStore.isAdmin" class="mb-6">
      <v-card-title class="text-h6">Upload New Update</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleUpload">
          <v-text-field
            v-model="uploadForm.title"
            label="Update Title"
            required
            :rules="[(v: any) => !!v || 'Title is required']"
          ></v-text-field>
          
          <v-select
            v-model="uploadForm.period"
            :items="biweeklyPeriods"
            label="Update Period"
            required
            :rules="[(v: any) => !!v || 'Period is required']"
          ></v-select>

          <v-file-input
            v-model="uploadForm.file"
            label="PDF Report"
            accept=".pdf"
            required
            :rules="[(v: any) => !!v || 'PDF file is required']"
            prepend-icon="mdi-file-pdf-box"
            show-size
          ></v-file-input>

          <v-btn
            type="submit"
            color="primary"
            :loading="isUploading"
            :disabled="isUploading"
            class="mt-2"
          >
            Upload Update
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Updates List -->
    <v-card v-if="isLoading" class="mb-6">
      <v-card-text class="text-center">
        <v-progress-circular indeterminate></v-progress-circular>
        Loading updates...
      </v-card-text>
    </v-card>

    <template v-else>
      <v-card v-for="update in updates" :key="update.id" class="mb-6">
        <v-card-title class="text-h5">{{ update.title }}</v-card-title>
        <v-card-subtitle class="text-subtitle-1">{{ update.period }}</v-card-subtitle>
        
        <v-card-text>
          <div class="pdf-section">
            <pdf-viewer
              v-if="update.pdfUrl"
              :source="update.pdfUrl"
              :show-controls="true"
              :full-width="true"
              class="mb-4"
            />
            
            <div class="pdf-actions">
              <v-btn
                v-if="update.pdfUrl"
                :href="update.pdfUrl"
                target="_blank"
                color="primary"
                prepend-icon="mdi-download"
                class="mr-2"
              >
                Download PDF
              </v-btn>
              <v-btn
                v-if="update.pdfUrl"
                :href="update.pdfUrl"
                target="_blank"
                variant="text"
                prepend-icon="mdi-open-in-new"
              >
                Open in new tab
              </v-btn>
            </div>
          </div>
        </v-card-text>

        <v-card-actions v-if="postStore.isAdmin">
          <v-btn
            color="error"
            variant="text"
            @click="handleDelete(update.id)"
            :loading="isDeletingId === update.id"
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
const updates = ref<any[]>([])

const uploadForm = ref({
  title: '',
  period: '',
  file: null as File | null
})

// Generate biweekly periods from Feb 1 to Apr 11
const biweeklyPeriods = [
  'Feb 1 - Feb 14',
  'Feb 15 - Feb 28',
  'Mar 1 - Mar 14',
  'Mar 15 - Mar 28',
  'Mar 29 - Apr 11'
]

const fetchUpdates = async () => {
  isLoading.value = true
  try {
    const updatesRef = collection(db, 'biweekly_updates')
    const q = query(updatesRef, orderBy('date', 'desc'))
    const snapshot = await getDocs(q)
    
    updates.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching updates:', error)
  } finally {
    isLoading.value = false
  }
}

const handleUpload = async () => {
  if (!uploadForm.value.title || !uploadForm.value.period || !uploadForm.value.file) return

  isUploading.value = true
  try {
    const file = uploadForm.value.file
    const fileName = Date.now() + '_' + file.name
    const fileRef = storageRef(storage, 'biweekly_updates/' + fileName)
    
    await uploadBytes(fileRef, file)
    const pdfUrl = await getDownloadURL(fileRef)

    await addDoc(collection(db, 'biweekly_updates'), {
      title: uploadForm.value.title,
      period: uploadForm.value.period,
      pdfUrl,
      date: Timestamp.now(),
      fileName
    })

    // Reset form
    uploadForm.value = {
      title: '',
      period: '',
      file: null
    }

    await fetchUpdates()
  } catch (error) {
    console.error('Error uploading update:', error)
  } finally {
    isUploading.value = false
  }
}

const handleDelete = async (updateId: string) => {
  if (!confirm('Are you sure you want to delete this update?')) return
  
  isDeletingId.value = updateId
  try {
    const update = updates.value.find(u => u.id === updateId)
    if (update?.fileName) {
      const fileRef = storageRef(storage, 'biweekly_updates/' + update.fileName)
      await deleteObject(fileRef)
    }
    
    await deleteDoc(doc(db, 'biweekly_updates', updateId))
    await fetchUpdates()
  } catch (error) {
    console.error('Error deleting update:', error)
  } finally {
    isDeletingId.value = null
  }
}

onMounted(() => {
  fetchUpdates()
})

</script>

<style scoped>
.updates {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  min-height: 90vh;
  min-width: 80vw;
  display: flex;
  flex-direction: column;
}

@media (min-width: 1264px) {
  .updates {
    min-width: 80vw;
    max-width: 90vw;
  }
}

.pdf-section {
  background: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin: -16px;
}

.pdf-actions {
  padding: 1rem;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.v-card) {
  width: 100%;
  flex-grow: 1;
}

:deep(.v-card-text) {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.pdf-viewer) {
  flex-grow: 1;
  height: auto !important;
  min-height: 90vh !important;
}

:deep(.pdf-object) {
  width: 100%;
  height: 90vh !important;
  min-height: 90vh !important;
}

.v-card.mb-6 {
  margin-bottom: 1rem !important;
}

.v-card.mb-6:first-child {
  margin-bottom: 1rem !important;
}

.v-card:not(:first-child) {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

:deep(.vue-pdf-embed) {
  max-width: 100%;
  height: auto !important;
  min-height: 90vh !important;
}
</style> 