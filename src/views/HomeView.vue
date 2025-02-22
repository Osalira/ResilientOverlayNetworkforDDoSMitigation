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
          <v-list-item v-for="post in latestPosts" :key="post.id" :to="post.link">
            <v-list-item-title>{{ post.title }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ formatDate(post.date) }}
            </v-list-item-subtitle>
            <v-list-item-text>
              <div v-if="post.type === 'text'" class="text-truncate">
                {{ post.content }}
              </div>
              <div v-else class="text-caption">
                {{ post.type === 'pdf' ? 'PDF Document' : 'Video Presentation' }}
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
import { ref, onMounted } from 'vue'
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/firebaseConfig'

interface Post {
  id: string
  title: string
  date: Date
  type: 'text' | 'pdf' | 'video'
  content?: string
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

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchLatestPosts = async () => {
  try {
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, orderBy('date', 'desc'), limit(5))
    const querySnapshot = await getDocs(q)
    
    latestPosts.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    })) as Post[]
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
      timestamp: new Date()
    })
    
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

onMounted(() => {
  fetchLatestPosts()
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.text-truncate {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 