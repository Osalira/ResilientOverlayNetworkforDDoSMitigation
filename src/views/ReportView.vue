<template>
  <div class="report">
    <v-card class="mb-6">
      <v-card-title class="text-h4">Project Report</v-card-title>
      <v-card-subtitle>Final Project Documentation</v-card-subtitle>
    </v-card>

    <!-- Admin Upload Section -->
    <v-card v-if="postStore.isAdmin" class="mb-6">
      <v-card-title class="text-h6">Upload Project Report</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleUpload">
          <v-text-field
            v-model="uploadForm.title"
            label="Report Title"
            required
            :rules="[(v: any) => !!v || 'Title is required']"
          ></v-text-field>

          <v-file-input
            v-model="uploadForm.file"
            label="Report PDF"
            accept=".pdf"
            required
            :rules="[(v: any) => !!v || 'PDF file is required']"
            prepend-icon="mdi-file-pdf-box"
            show-size
          ></v-file-input>

          <v-textarea
            v-model="uploadForm.abstract"
            label="Abstract/Summary"
            rows="4"
            hint="Provide a brief summary of the report"
            persistent-hint
          ></v-textarea>

          <v-btn
            type="submit"
            color="primary"
            :loading="isUploading"
            :disabled="isUploading"
            class="mt-2"
          >
            Upload Report
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Report Content -->
    <v-card v-if="isLoading" class="mb-6">
      <v-card-text class="text-center">
        <v-progress-circular indeterminate></v-progress-circular>
        Loading report...
      </v-card-text>
    </v-card>

    <template v-else-if="currentReport">
      <v-card class="mb-6">
        <v-card-title class="text-h5">{{ currentReport.title }}</v-card-title>
        <v-card-subtitle>{{ formatDate(currentReport.date) }}</v-card-subtitle>

        <v-card-text>
          <p v-if="currentReport.abstract" class="text-body-1 mb-4">
            {{ currentReport.abstract }}
          </p>

          <pdf-viewer
            v-if="currentReport.pdfUrl"
            :source="currentReport.pdfUrl"
            :show-controls="true"
            :full-width="true"
            class="mb-4"
          />

          <v-btn
            v-if="currentReport.pdfUrl"
            :href="currentReport.pdfUrl"
            target="_blank"
            color="primary"
            prepend-icon="mdi-download"
          >
            Download Report
          </v-btn>
        </v-card-text>

        <v-card-actions v-if="postStore.isAdmin">
          <v-btn
            color="error"
            variant="text"
            @click="handleDelete"
            :loading="isDeleting"
          >
            Delete Report
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>

    <v-card v-else class="text-center pa-4">
      <v-card-text class="text-h6">
        No project report uploaded yet.
      </v-card-text>
    </v-card>
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
  limit,
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
const isDeleting = ref(false)
const currentReport = ref<any>(null)

const uploadForm = ref({
  title: '',
  file: null as File | null,
  abstract: ''
})

const formatDate = (date: any) => {
  return new Date(date.toDate()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchReport = async () => {
  isLoading.value = true
  try {
    const reportsRef = collection(db, 'project_report')
    const q = query(reportsRef, orderBy('date', 'desc'), limit(1))
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      currentReport.value = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      }
    } else {
      currentReport.value = null
    }
  } catch (error) {
    console.error('Error fetching report:', error)
  } finally {
    isLoading.value = false
  }
}

const handleUpload = async () => {
  if (!uploadForm.value.title || !uploadForm.value.file) return

  isUploading.value = true
  try {
    const file = uploadForm.value.file
    const fileName = Date.now() + '_' + file.name
    const fileRef = storageRef(storage, 'project_report/' + fileName)
    
    await uploadBytes(fileRef, file)
    const pdfUrl = await getDownloadURL(fileRef)

    // Delete previous report if exists
    if (currentReport.value) {
      await handleDelete()
    }

    await addDoc(collection(db, 'project_report'), {
      title: uploadForm.value.title,
      abstract: uploadForm.value.abstract,
      pdfUrl,
      fileName,
      date: Timestamp.now()
    })

    // Reset form
    uploadForm.value = {
      title: '',
      file: null,
      abstract: ''
    }

    await fetchReport()
  } catch (error) {
    console.error('Error uploading report:', error)
  } finally {
    isUploading.value = false
  }
}

const handleDelete = async () => {
  if (!currentReport.value || !confirm('Are you sure you want to delete this report?')) return
  
  isDeleting.value = true
  try {
    if (currentReport.value.fileName) {
      const fileRef = storageRef(storage, 'project_report/' + currentReport.value.fileName)
      await deleteObject(fileRef)
    }
    
    await deleteDoc(doc(db, 'project_report', currentReport.value.id))
    currentReport.value = null
  } catch (error) {
    console.error('Error deleting report:', error)
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchReport()
})
</script>

<style scoped>
.report {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  min-height: 90vh;
  min-width: 80vw;
  display: flex;
  flex-direction: column;
}

@media (min-width: 1264px) {
  .report {
    min-width: 80vw;
    max-width: 90vw;
  }
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
</style> 