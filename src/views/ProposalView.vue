<template>
  <div class="proposal">
    <v-card>
      <v-card-title class="text-h4 mb-4">Project Proposal</v-card-title>
      
      <v-card-text>
        <div class="text-h5 mb-3">CSC466 – Benjamin Osalira – Feb 7, 2025</div>
        <div class="text-h6 mb-4">Resilient Overlay Network for DDoS Mitigation</div>

        <div class="section mb-6">
          <div class="text-h6 mb-2">Introduction</div>
          <p class="text-body-1">
            DDoS attacks have become increasingly prevalent and sophisticated, posing a significant
            threat to network availability and reliability. Traditional mitigation techniques often
            rely on centralized defenses, which can become single points of failure. This project
            proposes an overlay network that enhances resilience against DDoS attacks through
            decentralized decision-making, dynamic routing, and intelligent load balancing.
          </p>
        </div>

        <div class="section mb-6">
          <div class="text-h6 mb-2">Key Features</div>
          <v-list>
            <v-list-item>
              <v-list-item-title class="font-weight-bold">
                Dynamic Routing Algorithms
              </v-list-item-title>
              <v-list-item-subtitle>
                Continuously monitor and adjust routing to bypass congested or attacked nodes.
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="font-weight-bold">
                Load Balancing
              </v-list-item-title>
              <v-list-item-subtitle>
                Evenly distribute traffic to prevent bottlenecks.
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="font-weight-bold">
                Authentication & Filtering
              </v-list-item-title>
              <v-list-item-subtitle>
                Ensure traffic originates from verified nodes, with robust filtering to block malicious behavior.
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="font-weight-bold">
                Decentralized Decision-Making
              </v-list-item-title>
              <v-list-item-subtitle>
                Empower each overlay node to make independent routing decisions, reducing reliance on a central controller.
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>

        <div class="section">
          <div class="text-h6 mb-2">Project Timetable</div>
          <p class="text-body-1">
            The project is structured in weekly tasks from February 1 to April 11, focusing on:
          </p>
          <v-timeline density="compact" align="start">
            <v-timeline-item
              v-for="(task, index) in projectTasks"
              :key="index"
              :dot-color="task.color"
              size="small"
            >
              <template v-slot:opposite>
                {{ task.period }}
              </template>
              <div class="text-subtitle-1">{{ task.title }}</div>
              <div class="text-body-2">{{ task.description }}</div>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const projectTasks = [
  {
    period: 'Week 1-2',
    title: 'Planning Phase',
    description: 'Project setup, requirements analysis, and architecture design',
    color: 'primary'
  },
  {
    period: 'Week 3-4',
    title: 'Simulation Setup',
    description: 'Setting up the network simulation environment and basic infrastructure',
    color: 'info'
  },
  {
    period: 'Week 5-6',
    title: 'Algorithm Development',
    description: 'Implementing core routing and load balancing algorithms',
    color: 'success'
  },
  {
    period: 'Week 7-8',
    title: 'Testing Phase',
    description: 'Testing under simulated DDoS conditions and performance analysis',
    color: 'warning'
  },
  {
    period: 'Week 9-10',
    title: 'Data Analysis',
    description: 'Analyzing test results and optimizing system performance',
    color: 'error'
  },
  {
    period: 'Week 11',
    title: 'Documentation',
    description: 'Preparing final documentation and project presentation',
    color: 'secondary'
  }
]
</script>

<style scoped>
.proposal {
  max-width: 1200px;
  margin: 0 auto;
}

.section {
  margin-bottom: 2rem;
}

.v-timeline {
  margin-top: 2rem;
}
</style> 