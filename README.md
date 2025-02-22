# Resilient Overlay Network for DDoS Mitigation - Project Website

This is the project website for CSC466 course project on implementing a resilient overlay network for DDoS mitigation. The website serves as a central hub for project documentation, updates, and demonstrations.

🌐 **Live Site**: [https://csc466project.web.app](https://csc466project.web.app)

## Features

- 📱 Responsive design with Vuetify 3
- 🔒 Secure authentication with Firebase
- 📄 PDF viewing capabilities
- 🎥 YouTube video embedding
- 🔄 Real-time updates
- 🌓 Dark/Light theme support

## Project Sections

- **Home**: Project overview and latest updates
- **Project Proposal**: Detailed project proposal with timeline
- **BiWeekly Updates**: Regular progress reports
- **Logbook**: Weekly tasks and progress tracking
- **Project Demo**: Demonstration videos and presentation materials
- **Project Report**: Final project documentation
- **All Posts**: Aggregated view of all project content

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vuetify 3
- Firebase (Authentication, Firestore, Storage)
- Vite
- Vue Router
- Pinia for state management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Google account for admin access (osalirab@gmail.com)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd p2p-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyDTm2_oGVebt-ZP3IsSNjzajRU7i9UORw0
   VITE_FIREBASE_AUTH_DOMAIN=csc466project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=csc466project
   VITE_FIREBASE_STORAGE_BUCKET=csc466project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=400374049158
   VITE_FIREBASE_APP_ID=1:400374049158:web:f7c72b5a80ac6598032407
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Firebase Configuration

The project uses the following Firebase services:
- **Authentication**: Google Sign-In for admin access
- **Firestore**: Database for storing posts, comments, and updates
- **Storage**: For storing PDF files and other documents
- **Hosting**: Deployment platform (csc466project.web.app)

## Security

- Firebase Authentication is used for admin access (osalirab@gmail.com)
- Firestore security rules restrict write access to admin users
- Storage rules protect uploaded files
- Environment variables protect sensitive configuration

## Project Structure

```
src/
├── components/         # Reusable components
├── views/             # Page components
├── stores/            # Pinia stores
├── router/            # Vue Router configuration
├── firebaseConfig.ts  # Firebase initialization
└── main.ts           # Application entry point
```

## Contributing

This project is part of a course assignment. While it's not open for direct contributions, feedback and suggestions are welcome.

## License

This project is created for educational purposes as part of the CSC466 course at the University of Victoria.

## Author

Benjamin Osalira
