import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, auth } from '@/firebaseConfig'

export interface Post {
  id: string
  title: string
  content?: string
  pdfUrl?: string
  videoUrl?: string
  date: Date
  type: 'text' | 'pdf' | 'video'
}

export const usePostStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  const isLoading = ref(false)

  const isAdmin = computed(() => {
    return auth.currentUser?.email === 'osalirab@gmail.com'
  })

  const fetchPosts = async () => {
    isLoading.value = true
    try {
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, orderBy('date', 'desc'))
      const querySnapshot = await getDocs(q)
      
      posts.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      })) as Post[]
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addTextPost = async (title: string, content: string) => {
    if (!isAdmin.value) return

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        type: 'text',
        date: Timestamp.now()
      })
      await fetchPosts()
    } catch (error) {
      console.error('Error adding text post:', error)
      throw error
    }
  }

  const addPdfPost = async (title: string, file: File) => {
    if (!isAdmin.value) return

    try {
      const fileRef = storageRef(storage, `pdfs/${file.name}`)
      await uploadBytes(fileRef, file)
      const pdfUrl = await getDownloadURL(fileRef)

      await addDoc(collection(db, 'posts'), {
        title,
        pdfUrl,
        type: 'pdf',
        date: Timestamp.now()
      })
      await fetchPosts()
    } catch (error) {
      console.error('Error adding PDF post:', error)
      throw error
    }
  }

  const addVideoPost = async (title: string, videoUrl: string) => {
    if (!isAdmin.value) return

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        videoUrl,
        type: 'video',
        date: Timestamp.now()
      })
      await fetchPosts()
    } catch (error) {
      console.error('Error adding video post:', error)
      throw error
    }
  }

  return {
    posts,
    isLoading,
    isAdmin,
    fetchPosts,
    addTextPost,
    addPdfPost,
    addVideoPost
  }
}) 