<template>
  <div class="posts">
    <v-card class="mb-6">
      <v-card-title class="text-h4">All Posts</v-card-title>
    </v-card>

    <!-- Admin Controls -->
    <v-card v-if="postStore.isAdmin" class="mb-6">
      <v-card-title class="text-h5">Create New Post</v-card-title>
      <v-card-text>
        <v-tabs v-model="activeTab">
          <v-tab value="text">Text Post</v-tab>
          <v-tab value="pdf">PDF Upload</v-tab>
          <v-tab value="video">Video Link</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Text Post Form -->
          <v-window-item value="text">
            <v-form @submit.prevent="submitTextPost">
              <v-text-field
                v-model="textPost.title"
                label="Title"
                required
              ></v-text-field>
              <v-textarea
                v-model="textPost.content"
                label="Content"
                required
                rows="5"
              ></v-textarea>
              <v-btn
                type="submit"
                color="primary"
                :loading="isSubmitting"
                :disabled="isSubmitting"
              >
                Post
              </v-btn>
            </v-form>
          </v-window-item>

          <!-- PDF Upload Form -->
          <v-window-item value="pdf">
            <v-form @submit.prevent="submitPdfPost">
              <v-text-field
                v-model="pdfPost.title"
                label="Title"
                required
              ></v-text-field>
              <v-file-input
                v-model="pdfPost.file"
                label="PDF File"
                accept=".pdf"
                required
              ></v-file-input>
              <v-btn
                type="submit"
                color="primary"
                :loading="isSubmitting"
                :disabled="isSubmitting"
              >
                Upload
              </v-btn>
            </v-form>
          </v-window-item>

          <!-- Video Link Form -->
          <v-window-item value="video">
            <v-form @submit.prevent="submitVideoPost">
              <v-text-field
                v-model="videoPost.title"
                label="Title"
                required
              ></v-text-field>
              <v-text-field
                v-model="videoPost.url"
                label="YouTube Video URL"
                required
              ></v-text-field>
              <v-btn
                type="submit"
                color="primary"
                :loading="isSubmitting"
                :disabled="isSubmitting"
              >
                Add Video
              </v-btn>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <!-- Posts List -->
    <v-card v-if="postStore.isLoading" class="mb-6">
      <v-card-text>
        <v-progress-circular indeterminate></v-progress-circular>
        Loading posts...
      </v-card-text>
    </v-card>

    <template v-else>
      <v-card v-for="post in postStore.posts" :key="post.id" class="mb-6">
        <v-card-title class="text-h5">{{ post.title }}</v-card-title>
        <v-card-subtitle>{{ formatDate(post.date) }}</v-card-subtitle>
        
        <v-card-text>
          <!-- Text Post -->
          <div v-if="post.type === 'text'" class="text-body-1">
            {{ post.content }}
          </div>

          <!-- PDF Post -->
          <div v-else-if="post.type === 'pdf'" class="pdf-section">
            <pdf-viewer
              v-if="post.pdfUrl"
              :source="post.pdfUrl"
              :show-controls="true"
              :full-width="true"
              class="mb-4"
            />
            
            <div class="pdf-actions">
              <v-btn
                v-if="post.pdfUrl"
                :href="post.pdfUrl"
                target="_blank"
                color="primary"
                prepend-icon="mdi-download"
                class="mr-2"
              >
                Download PDF
              </v-btn>
              <v-btn
                v-if="post.pdfUrl"
                :href="post.pdfUrl"
                target="_blank"
                variant="text"
                prepend-icon="mdi-open-in-new"
              >
                Open in new tab
              </v-btn>
            </div>
          </div>

          <!-- Video Post -->
          <div v-else-if="post.type === 'video'" class="video-container">
            <iframe
              v-if="post.videoUrl"
              :src="getEmbedUrl(post.videoUrl)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePostStore } from '@/stores/posts'
import PdfViewer from '@/components/PdfViewer.vue'

const postStore = usePostStore()
const activeTab = ref('text')
const isSubmitting = ref(false)

const textPost = ref({
  title: '',
  content: ''
})

const pdfPost = ref({
  title: '',
  file: null as File | null
})

const videoPost = ref({
  title: '',
  url: ''
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getEmbedUrl = (url: string) => {
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1]
  return videoId ? 'https://www.youtube.com/embed/' + videoId : ''
}

const submitTextPost = async () => {
  if (!textPost.value.title || !textPost.value.content) return
  
  isSubmitting.value = true
  try {
    await postStore.addTextPost(textPost.value.title, textPost.value.content)
    textPost.value = { title: '', content: '' }
    activeTab.value = 'text'
  } catch (error) {
    console.error('Error submitting text post:', error)
  } finally {
    isSubmitting.value = false
  }
}

const submitPdfPost = async () => {
  if (!pdfPost.value.title || !pdfPost.value.file) return
  
  isSubmitting.value = true
  try {
    await postStore.addPdfPost(pdfPost.value.title, pdfPost.value.file)
    pdfPost.value = { title: '', file: null }
    activeTab.value = 'pdf'
  } catch (error) {
    console.error('Error submitting PDF post:', error)
  } finally {
    isSubmitting.value = false
  }
}

const submitVideoPost = async () => {
  if (!videoPost.value.title || !videoPost.value.url) return
  
  isSubmitting.value = true
  try {
    await postStore.addVideoPost(videoPost.value.title, videoPost.value.url)
    videoPost.value = { title: '', url: '' }
    activeTab.value = 'video'
  } catch (error) {
    console.error('Error submitting video post:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Fetch posts when component is mounted
postStore.fetchPosts()
</script>

<style scoped>
.posts {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
}

@media (min-width: 1264px) {
  .posts {
    max-width: 1200px;
  }
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  margin-bottom: 1rem;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.pdf-section {
  background: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.pdf-actions {
  padding: 1rem;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.v-card-text) {
  padding: 0;
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