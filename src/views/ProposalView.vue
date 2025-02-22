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
            DDoS attacks have become increasingly prevalent and sophisticated, posing a significant threat to network availability and reliability. Traditional mitigation techniques often rely on centralized defenses, which themselves can become single points of failure. This project proposes the development of an overlay network that enhances resilience against DDoS attacks through decentralized decision-making, dynamic routing, and intelligent load balancing. By rerouting or absorbing traffic surges in real time and incorporating robust authentication and filtering mechanisms, the proposed system aims to maintain service continuity even during high-volume attacks.
          </p>
        </div>

        <div class="section mb-6">
          <div class="text-h6 mb-2">Related Work and Limitations</div>
          <p class="text-body-1 mb-4">
            Several studies have explored the use of overlay networks to improve network resilience. Early research, such as the concept of Resilient Overlay Networks (RON), demonstrated that overlay nodes could effectively bypass congested or compromised paths by dynamically rerouting traffic. More recent work has investigated dynamic routing algorithms and load balancing techniques in the context of mitigating DDoS attacks.
          </p>
          <div class="text-subtitle-1 mb-2">Limitations:</div>
          <v-list>
            <v-list-item prepend-icon="mdi-alert-circle-outline">
              <v-list-item-title>Scalability</v-list-item-title>
              <v-list-item-subtitle>
                As overlay networks grow, maintaining updated routing tables and managing control overhead becomes challenging.
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item prepend-icon="mdi-alert-circle-outline">
              <v-list-item-title>Latency</v-list-item-title>
              <v-list-item-subtitle>
                Additional routing hops can increase end-to-end delay, impacting time-sensitive applications.
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item prepend-icon="mdi-alert-circle-outline">
              <v-list-item-title>Detection Accuracy</v-list-item-title>
              <v-list-item-subtitle>
                While many systems use anomaly detection, distinguishing between legitimate traffic surges and malicious behavior remains difficult, often leading to false positives.
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item prepend-icon="mdi-alert-circle-outline">
              <v-list-item-title>Deployment Complexity</v-list-item-title>
              <v-list-item-subtitle>
                Implementing decentralized decision-making and robust authentication across diverse network nodes can complicate real-world deployment.
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>

        <div class="section mb-6">
          <div class="text-h6 mb-2">Proposed Approach</div>
          <p class="text-body-1 mb-4">
            The project will develop a simulation-based model (with potential for later prototype development) of a resilient overlay network with the following key components:
          </p>
          <v-list>
            <v-list-item>
              <v-list-item-title class="font-weight-bold">
                1. Dynamic Routing Algorithms
              </v-list-item-title>
              <v-list-item-subtitle>
                The network will implement routing strategies that continuously monitor real-time traffic conditions. By adjusting the routing paths dynamically, the system can avoid congested or attacked nodes, ensuring that traffic is redirected efficiently when anomalies are detected.
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="font-weight-bold">
                2. Load Balancing
              </v-list-item-title>
              <v-list-item-subtitle>
                To prevent any single node from becoming a bottleneck, the system will evenly distribute traffic among peers. This balancing mechanism will work in tandem with dynamic routing to improve overall network performance and reduce latency.
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="font-weight-bold">
                3. Authentication & Filtering
              </v-list-item-title>
              <v-list-item-subtitle>
                Security measures will be integrated to ensure that traffic originates from verified nodes. Filtering techniques will be employed to identify and block traffic that matches the characteristics of a DDoS attack, thereby reducing the incidence of false positives and protecting the network from malicious traffic.
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="font-weight-bold">
                4. Decentralized Decision-Making
              </v-list-item-title>
              <v-list-item-subtitle>
                Each overlay node will be capable of making independent routing decisions based on local network conditions. This decentralized approach minimizes reliance on a central controller, enhancing resilience by eliminating single points of failure.
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="font-weight-bold">
                5. Simulation Environment
              </v-list-item-title>
              <v-list-item-subtitle>
                The complete system will be validated using a simulation platform such as NS-3 or Mininet. Performance metrics, including latency, throughput, and recovery time under simulated DDoS conditions, will be collected to evaluate the effectiveness of the proposed approach.
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>

        <div class="section mb-6">
          <div class="text-h6 mb-2">Project Timeline</div>
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

        <div class="section">
          <div class="text-h6 mb-2">References</div>
          <v-list>
            <v-list-item>
              <v-list-item-text>
                Mitrokotsa, A., and Douligeris, C., Denial-of-Service Attacks. Network Security: Current Status and Future Directions, Wiley Online Library, Chapter 8, 117-134 (2006).
              </v-list-item-text>
            </v-list-item>
            <v-list-item>
              <v-list-item-text>
                Zhang, L., Yu, S., Wu, D., and Watters, P., A Survey on Latest Botnet Attack and Defense, Proceedings of IEEE 10th International Conference on Trust, Security and Privacy in Computing and Communications (TrustCom), 53-60 (2011).
              </v-list-item-text>
            </v-list-item>
            <v-list-item>
              <v-list-item-text>
                Mishra, A., Gupta, B. B., and Joshi, R. C., A Comparative Study of Distributed Denial of Service Attacks, Intrusion Tolerance and Mitigation Techniques, Proceedings of IEEE European Intelligence and Security Informatics Conference (EISIC), 286-289 (2011).
              </v-list-item-text>
            </v-list-item>
          </v-list>
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
  padding-bottom: 2rem;
}

.section {
  margin-bottom: 2rem;
}

.v-timeline {
  margin-top: 2rem;
}

.v-list-item-subtitle {
  white-space: normal !important;
}
</style> 