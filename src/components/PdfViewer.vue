<template>
  <div class="pdf-viewer" :class="{ 'full-width': fullWidth }">
    <div v-if="loading && !error" class="loading-overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <span class="ml-2">Loading PDF...</span>
    </div>
    
    <!-- Native PDF Viewer -->
    <div v-if="!error" class="pdf-container" ref="container">
      <!-- Controls for both viewers -->
      <div class="pdf-controls mb-2" v-show="showControls && !loading">
        <v-btn-group>
          <v-btn
            icon="mdi-minus"
            @click="zoomOut"
            :disabled="scale <= minScale"
          ></v-btn>
          <v-btn
            icon="mdi-plus"
            @click="zoomIn"
            :disabled="scale >= maxScale"
          ></v-btn>
          <v-btn
            icon="mdi-refresh"
            @click="resetZoom"
          ></v-btn>
        </v-btn-group>
        
        <v-btn-group class="ml-2" v-if="!useNativeViewer">
          <v-btn
            icon="mdi-chevron-left"
            @click="prevPage"
            :disabled="currentPage <= 1"
          ></v-btn>
          <v-btn-group>
            <span class="px-4 d-flex align-center">
              {{ currentPage }} / {{ totalPages }}
            </span>
          </v-btn-group>
          <v-btn
            icon="mdi-chevron-right"
            @click="nextPage"
            :disabled="currentPage >= totalPages"
          ></v-btn>
        </v-btn-group>
      </div>

      <object
        v-if="useNativeViewer"
        :data="source"
        type="application/pdf"
        class="pdf-object"
        :style="{ transform: `scale(${scale})` }"
        @load="onNativeLoad"
        @error="fallbackToPdfJs"
      >
        <div class="pdf-fallback">
          <p>It appears you don't have a PDF plugin for this browser.</p>
          <v-btn
            color="primary"
            :href="source"
            target="_blank"
            prepend-icon="mdi-download"
          >
            Download PDF
          </v-btn>
        </div>
      </object>

      <!-- PDF.js Fallback -->
      <vue-pdf-embed
        v-else-if="!useNativeViewer && !error"
        :source="source"
        :page="currentPage"
        :style="{ transform: `scale(${scale})`, opacity: loading ? 0 : 1 }"
       
        @loading="onLoading"
        @loaded="onLoaded"
        @error="onError"
      />
    </div>

    <div v-if="error" class="error-container">
      <v-alert type="warning" class="mb-4">
        <template v-slot:title>
          Unable to display PDF
        </template>
        <p class="mb-4">We couldn't display the PDF in your browser. You can:</p>
        <div class="d-flex flex-column gap-2">
          <v-btn
            color="primary"
            :href="source"
            target="_blank"
            prepend-icon="mdi-download"
          >
            Download PDF
          </v-btn>
          <v-btn
            variant="text"
            @click="retryLoading"
            prepend-icon="mdi-refresh"
          >
            Try viewing again
          </v-btn>
        </div>
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'


const props = defineProps<{
  source: string
  showControls?: boolean
  fullWidth?: boolean
}>()

const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)
const scale = ref(1)
const minScale = 0.5
const maxScale = 2
const container = ref<HTMLElement | null>(null)
const useNativeViewer = ref(true)

const zoomIn = () => {
  if (scale.value < maxScale) {
    scale.value += 0.1
  }
}

const zoomOut = () => {
  if (scale.value > minScale) {
    scale.value -= 0.1
  }
}

const resetZoom = () => {
  scale.value = 1
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}


const onLoading = () => {
  loading.value = true
  error.value = null
}

const onLoaded = () => {
  loading.value = false
}

const onError = (err: Error) => {
  loading.value = false
  error.value = 'Failed to load PDF. Please try again.'
  console.error('PDF loading error:', err)
}

const retryLoading = () => {
  loading.value = true
  error.value = null
  // Force re-render of the PDF component
  currentPage.value = 1
  scale.value = 1
}

const onNativeLoad = () => {
  loading.value = false
  error.value = null
}

const fallbackToPdfJs = () => {
  useNativeViewer.value = false
  loading.value = true
}

// Reset page when source changes
watch(() => props.source, () => {
  currentPage.value = 1
  scale.value = 1
  loading.value = true
  error.value = null
})

onMounted(() => {
  // Initialize container reference
  container.value = document.querySelector('.pdf-container')
})
</script>

<style scoped>
.pdf-viewer {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}

.pdf-viewer.full-width {
  min-height: 1000px; /* Increased from 800px */
}

.pdf-object {
  width: 100%;
  height: 1000px; /* Increased from 800px */
  border: none;
  transform-origin: top center;
  transition: transform 0.2s ease;
}

.pdf-fallback {
  padding: 2rem;
  text-align: center;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1;
}

.pdf-controls {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 8px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.pdf-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 1000px; /* Increased from 800px */
  overflow-y: auto;
}

.error-container {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

:deep(.vue-pdf-embed) {
  transition: transform 0.2s ease, opacity 0.3s ease;
  transform-origin: top center;
}

:deep(.v-alert) {
  max-width: 400px;
}
</style> 