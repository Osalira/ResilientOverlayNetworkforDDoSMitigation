<template>
  <div class="logbook">
    <v-card class="mb-6">
      <v-card-title class="text-h4">Project Logbook</v-card-title>
      <v-card-subtitle>Weekly Progress and Tasks</v-card-subtitle>
    </v-card>

    <v-timeline side="end">
      <v-timeline-item
        v-for="(week, index) in weeks"
        :key="index"
        :dot-color="getStatusColor(week.status)"
        size="small"
        :icon="getStatusIcon(week.status)"
      >
        <template v-slot:opposite>
          <div class="text-h6">Week {{ week.number }}</div>
          <div class="text-subtitle-2">{{ week.dates }}</div>
        </template>

        <v-card>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                v-for="(task, taskIndex) in week.tasks"
                :key="taskIndex"
                :title="task"
                :prepend-icon="'mdi-checkbox-marked-circle'"
                class="task-item"
              >
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script setup lang="ts">
interface Week {
  number: number
  dates: string
  tasks: string[]
  status: 'completed' | 'in-progress' | 'upcoming'
}

const getCurrentWeekStatus = (weekNumber: number): 'completed' | 'in-progress' | 'upcoming' => {
  const currentDate = new Date()
  const weekStartDate = new Date(2024, 1, 1 + (weekNumber - 1) * 7) // Feb 1, 2024 is the start date
  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekEndDate.getDate() + 7)

  if (currentDate > weekEndDate) return 'completed'
  if (currentDate >= weekStartDate && currentDate <= weekEndDate) return 'in-progress'
  return 'upcoming'
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'in-progress':
      return 'primary'
    default:
      return 'grey'
  }
}

const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'mdi-check-circle'
    case 'in-progress':
      return 'mdi-progress-clock'
    default:
      return 'mdi-calendar-blank'
  }
}

const weeks: Week[] = [
  {
    number: 1,
    dates: 'Feb. 1 – Feb. 7',
    tasks: [
      'Initiate project planning and define objectives.',
      'Conduct an extensive literature review on resilient overlay networks and DDoS mitigation techniques.'
    ],
    status: getCurrentWeekStatus(1)
  },
  {
    number: 2,
    dates: 'Feb. 8 – Feb. 14',
    tasks: [
      'Finalize the project proposal.',
      'Select simulation tools and gather necessary resources and software.'
    ],
    status: getCurrentWeekStatus(2)
  },
  {
    number: 3,
    dates: 'Feb. 15 – Feb. 21',
    tasks: [
      'Design the overlay network topology.',
      'Outline dynamic routing strategies and decentralized decision-making protocols.'
    ],
    status: getCurrentWeekStatus(3)
  },
  {
    number: 4,
    dates: 'Feb. 22 – Feb. 28',
    tasks: [
      'Set up the simulation environment.',
      'Begin initial implementation of the overlay network nodes and basic connectivity tests.'
    ],
    status: getCurrentWeekStatus(4)
  },
  {
    number: 5,
    dates: 'Mar. 1 – Mar. 7',
    tasks: [
      'Develop and implement dynamic routing algorithms.',
      'Integrate load balancing techniques to distribute traffic across peers.'
    ],
    status: getCurrentWeekStatus(5)
  },
  {
    number: 6,
    dates: 'Mar. 8 – Mar. 14',
    tasks: [
      'Incorporate authentication and filtering mechanisms.',
      'Start integrating these security features with the routing protocols.'
    ],
    status: getCurrentWeekStatus(6)
  },
  {
    number: 7,
    dates: 'Mar. 15 – Mar. 21',
    tasks: [
      'Test the system under normal (non-attack) conditions to establish a performance baseline.',
      'Debug and refine simulation parameters.'
    ],
    status: getCurrentWeekStatus(7)
  },
  {
    number: 8,
    dates: 'Mar. 22 – Mar. 28',
    tasks: [
      'Simulate DDoS attack scenarios using the developed overlay network.',
      'Collect data on network performance (latency, throughput, and packet loss).'
    ],
    status: getCurrentWeekStatus(8)
  },
  {
    number: 9,
    dates: 'Mar. 29 – Apr. 4',
    tasks: [
      'Analyze simulation data.',
      'Refine dynamic routing and security algorithms based on performance feedback and identified vulnerabilities.'
    ],
    status: getCurrentWeekStatus(9)
  },
  {
    number: 10,
    dates: 'Apr. 5 – Apr. 11',
    tasks: [
      'Finalize experiments and compile results.',
      'Prepare comprehensive project documentation and presentation materials for submission.'
    ],
    status: getCurrentWeekStatus(10)
  }
]
</script>

<style scoped>
.logbook {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 2rem;
}

.task-item {
  padding-left: 1rem;
}

.v-timeline-item__body {
  margin-bottom: 1.5rem;
}

.v-card {
  margin-bottom: 1rem;
}

.v-list-item {
  min-height: 40px;
}

.v-timeline-item__opposite {
  margin-bottom: 0.5rem;
}
</style> 