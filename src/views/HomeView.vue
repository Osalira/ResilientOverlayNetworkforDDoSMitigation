<template>
  <div class="home">
    <v-card class="mb-6">
      <v-card-title class="text-h4">
        Welcome to Resilient Overlay Network for DDoS Mitigation
      </v-card-title>
      <v-card-text>
        <p class="text-body-1">
          This project explores innovative approaches to DDoS mitigation through the implementation
          of a resilient overlay network. Our solution leverages decentralized decision-making,
          dynamic routing, and intelligent load balancing to enhance network resilience against
          distributed denial-of-service attacks.
        </p>
      </v-card-text>
    </v-card>

    <v-card class="mb-6">
      <v-card-title class="text-h5">Latest Updates</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="post in latestPosts"
            :key="post.id"
            :to="post.link"
            class="mb-4"
          >
            <template v-slot:prepend>
              <v-icon :icon="post.type === 'pdf' ? 'mdi-file-pdf-box' : post.type === 'video' ? 'mdi-video' : 'mdi-text'"></v-icon>
            </template>

            <v-list-item-title class="text-h6 mb-1">{{ post.title }}</v-list-item-title>
            <v-list-item-subtitle class="mb-2">{{ formatDate(post.date) }}</v-list-item-subtitle>
            
            <v-list-item-text>
              <!-- Text preview -->
              <div v-if="post.type === 'text' && post.content" class="text-truncate">
                {{ post.content }}
              </div>
              
              <!-- PDF preview -->
              <div v-if="post.type === 'pdf'" class="pdf-info">
                <v-icon icon="mdi-file-pdf-box" color="error" class="mr-2"></v-icon>
                <span class="text-caption">Click to view PDF</span>
              </div>
              
              <!-- Video preview -->
              <div v-if="post.type === 'video' && post.videoUrl" class="video-preview">
                <img
                  :src="`https://img.youtube.com/vi/${post.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1]}/mqdefault.jpg`"
                  alt="Video thumbnail"
                />
              </div>
            </v-list-item-text>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="text-h5">Leave a Comment</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitComment">
          <v-text-field
            v-model="commentForm.name"
            label="Name"
            required
          ></v-text-field>
          <v-textarea
            v-model="commentForm.message"
            label="Message"
            required
            rows="3"
          ></v-textarea>
          <v-btn
            type="submit"
            color="primary"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >
            Submit Comment
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import PdfViewer from '@/components/PdfViewer.vue'

interface Post {
  id: string
  title: string
  date: Date
  type: 'text' | 'pdf' | 'video'
  content?: string
  pdfUrl?: string
  videoUrl?: string
  collection: string
  link: string
}

interface CommentForm {
  name: string
  message: string
}

const latestPosts = ref<Post[]>([])
const isSubmitting = ref(false)
const commentForm = ref<CommentForm>({
  name: '',
  message: ''
})

const refreshInterval = ref<number | null>(null)

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getPostType = (data: any): Post['type'] => {
  if (data.pdfUrl) return 'pdf'
  if (data.videoUrl) return 'video'
  return 'text'
}

// Map collection names to routes
const collectionRoutes: { [key: string]: string } = {
  'posts': '/posts',
  'biweekly_updates': '/updates',
  'presentations': '/demo',
  'project_report': '/report'
}

const getPostLink = (post: Post) => {
  return collectionRoutes[post.collection] || '/'
}

const fetchLatestPosts = async () => {
  try {
    // Fetch from multiple collections
    const collections = ['posts', 'biweekly_updates', 'project_report', 'presentations']
    const allPosts: Post[] = []

    for (const collectionName of collections) {
      const postsRef = collection(db, collectionName)
      const q = query(postsRef, orderBy('date', 'desc'), limit(5))
      const querySnapshot = await getDocs(q)
      
      const posts = querySnapshot.docs.map(doc => {
        const data = doc.data()
        const type = getPostType(data)
        return {
          id: doc.id,
          title: data.title,
          date: data.date.toDate(),
          type,
          content: data.content || data.abstract || data.description,
          pdfUrl: data.pdfUrl,
          videoUrl: data.videoUrl,
          collection: collectionName,
          link: collectionRoutes[collectionName] || '/'
        }
      })
      
      allPosts.push(...posts)
    }

    // Sort all posts by date and take the latest 5
    latestPosts.value = allPosts
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
}

const submitComment = async () => {
  if (!commentForm.value.name || !commentForm.value.message) return
  
  isSubmitting.value = true
  try {
    await addDoc(collection(db, 'comments'), {
      name: commentForm.value.name,
      message: commentForm.value.message,
      date: Timestamp.now()
    })
    
    // Reset form
    commentForm.value = {
      name: '',
      message: ''
    }
  } catch (error) {
    console.error('Error submitting comment:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Set up automatic refresh
onMounted(() => {
  fetchLatestPosts()
  // Refresh every 5 minutes
  refreshInterval.value = window.setInterval(fetchLatestPosts, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<style scoped>
.home {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

@media (min-width: 1264px) {
  .home {
    max-width: 1200px;
  }
}

.pdf-preview {
  max-height: 200px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.video-preview {
  width: 100%;
  max-width: 320px;
  margin: 0.5rem 0;
}

.video-preview img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.pdf-info {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.6);
}

.dark .pdf-info {
  color: rgba(255, 255, 255, 0.7);
}
</style> 