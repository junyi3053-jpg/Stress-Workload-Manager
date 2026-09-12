# Stress & Workload Manager

**By Team AlAddict**
**Members:** Yee Jia hao, Mooi Yang Jing, Mok Yuan Cong, Teoh Jun Yi

**Reference Document:** Please refer to the supplementary file **CodeNection.pdf** for additional project details.

**Links:**
* **Video Presentation:** [Unlisted Youtube Link]
* **Presentation Slides:** [Public Link]
* **UI Prototype:** [Public Link]

---

## 1. Project Overview

### The Problem
University students frequently face consistent, severe burnout that heavily impacts both their academic progress and personal lives. This situation happens primarily because students struggle to accurately estimate task duration and map cognitive energy against fixed daily time limits. Instead of recognizing how stress and work impact our lives, students often view 'rest' as a luxury rather than a necessity, failing to schedule active recovery until they reach complete exhaustion and overstress.

Key stakeholders include university students managing complex daily schedules, as well as peer groups and educators impacted by student burnout, mental impacts, and academic drops.

Existing solutions (such as traditional to-do list apps, standalone calendar apps, and paper planners) fall short because they focus exclusively on task output, deadlines, and manual scheduling. They completely ignore personal energy depletion as a stress factor, lack integration across fragmented life domains (mental, physical, social, errands), and fail to offer proactive recovery interventions. Furthermore, taking a break in traditional systems often increases student anxiety because the total workload and remaining deadline pressure remain unchanged while time ticks away.

### Our Solution
Our solution is a smart mobile and smartwatch integration that visualizes a student's total load across five distinct areas (mental, time, physical, social, errands) and actively intervenes to prevent burnout. Instead of tracking deadlines, the system automates task breakdown and dynamic schedule rebalancing, pushing students toward structured recovery without adding time anxiety. It turns passive task management into a proactive energy and workload balancing ecosystem.

### Feature-Set
1. **5-Dimension Workload Meter (Cortisol Meter)**
   Visualizes real-time capacity across Mental, Time, Physical, Social, and Errand dimensions. Values dynamically recalculate upon task creation, completion, or rescheduling, giving students a clear visual threshold of their cognitive and physiological load.
2. **AI-Based Task Breakdown**
   Converts complex tasks into a sequence of micro-tasks. Accepts unstructured inputs, including raw text, synced calendar/to-do list, and uploaded assignment PDFs/images, then assigns estimated duration and load weights to every generated micro-task.
3. **Daily Task Rescheduling & Survey (Google Health API)**
   Executes an automated morning calibration by fetching wearable biometrics (e.g., sleep duration, sleep quality, deep/REM ratios, resting heart rate, and daily HRV) alongside a quick morning mood survey. The system re-evaluates daily capacity, adjusts load weights, and auto-builds an optimized daily to-do task list that includes dedicated Recovery Task Sessions.
4. **Algorithmic One-Tap Rebalancing & Proactive Nudges**
   * Employs PERT Slack Time Analysis to identify non-critical tasks and reschedule them in under a minute when workload exceeds capacity.
   * Integrates proactive nudge alerts that suggest guided recovery actions (breathing exercises, hydration, light movement) before burnout hits critical levels.

---

## 2. Ideation & Process

### 2.1 Ideas We Considered

| Idea | Why it was dropped / kept |
| :--- | :--- |
| **5-Dimension Workload & Cortisol Meters** (Chosen) | Serves as an effective visual framework for tracking real-time student load capacity across Mental, Physical, Social, and Errand against Time (Daily), providing an intuitive baseline for personal stress awareness and preventing burnout early. |
| **AI-Based Task Breakdown** (Chosen) | Helps students in task planning by leveraging multimodal AI to decompose complex tasks and assignments into a structured Directed Acyclic Graph (DAG) of actionable micro-tasks. |
| **Daily Task Rescheduling & Survey, One-Tap Algorithmic Rebalancing & Proactive Nudges** (Chosen) | Executes an automated morning calibration by ingesting wearable telemetry (sleep quality/duration, HRV, resting HR via Google Health Connect) and a quick mood survey to auto-build an optimized daily schedule with Recovery Tasks. Delivers primary low-friction recovery task intervention. Uses PERT Slack Time Analysis to reschedule non-critical tasks in under a minute and delivers proactive nudges (breathing, hydration) before burnout hits critical levels. |
| **Notes Task Reflection** (Dropped, with consideration) | Adding manual journaling/reflection steps creates unnecessary user friction and cognitive load for already overstressed students, conflicting with the app's zero-friction philosophy. |
| **Parent & Teacher Evaluation Dashboard** (Dropped, with consideration) | Introducing external monitoring by parents and/or tutors increases student anxiety being monitored and undermines autonomy, counteracting the stress-reduction objective. Therefore, execution of this idea requires more reviews. |
| **"I'm Stuck" Peer Escalation Feature** (Dropped) | A feature enabling students to progress tasks with peer/lecturer help during rest/recovery sessions. Removed from the main implementation scope to streamline system architecture and focus fully on automated, single-user AI schedule management. Utility relies heavily on a critical mass of active users, so it is deferred to future development phases. |
| **Small Student Discussion Forums / Threads** (Dropped) | Out of scope. Community moderation and forum infrastructure add non-essential complexity and infrastructure cost without directly contributing to individual workload rebalancing. Can instead collaborate with forums like Chegg, Reddit, Quora, etc. |
| **Fun Tarot Reading Sessions** (Dropped) | Lacks scientific grounding and conflicts with the application's core algorithmic, health-backed approach to biometric and task management. Only used as entertainment for stress reduction. |
| **U-Tube Water/Oil Visualizer Widget** (Dropped) | While visually novel, complex custom UI animations introduce performance overhead and battery drain without offering additional valuable insight beyond the standard 5-dimension workload meter visualizers. |

### 2.2 Ideation Boards
**Detailed Ideation Board:** [[Link](https://www.figma.com/board/QidxqFD5LRiBmcFs83Ra8x/Stress---Workload-Manager?node-id=0-1&t=oYhmZGSDEGB32Lji-1)]

<img width="3078" height="1088" alt="5 whys" src="https://github.com/user-attachments/assets/0ef71625-a9b7-44ab-a744-04c3ad860234" />
*Figure 2.1: 5 Whys Problem Tree breaking down the root causes of student burnout and mapping direct AI-driven recovery suggestions.*

<img width="2982" height="1588" alt="Planning" src="https://github.com/user-attachments/assets/33d99841-d691-49b2-b0ce-7ae6bcf4c4ca" />
*Figure 2.2: System Mindmap outlining the Detection, Prevention, and Mitigation logic along with WearOS and API integration points.*

<img width="1522" height="943" alt="Experience Analysis" src="https://github.com/user-attachments/assets/d88c75d9-13e6-471d-b620-e7032d8f2c6b" />
*Figure 2.3: Experience Analysis board capturing team pain points regarding rest anxiety, task automation, and peer-assistance concepts.*

<img width="2982" height="1588" alt="Planning" src="https://github.com/user-attachments/assets/25529016-03e3-45ce-9680-7e8ac7bce8ce" />
*Figure 2.4: Feature evaluation board detailing benefits, drawbacks, and reasons for accepting or rejecting candidate ideas.*

### 2.3 Mentor Consultation

| Date | Mentor | Feedback Received | What Was Changed |
| :--- | :--- | :--- | :--- |
| September 10, 2026 | Ms. Iris Yan Ning | - Through the ideation process, many ideas have now been generated. Focus on the three most innovative and impactful features that can best capture the judges' attention.<br>- The work breakdown structure is a distinctive feature of the project. It shows how tasks and micro-tasks are organized, making the implementation plan easy to understand.<br>- The user flow diagram is clean, well-structured, and easy to follow project idea.<br>- Consider creating a character or mascot to represent the app, similar to Duolingo owl. This could build the app's identity and enhance user engagement and interaction.<br>- Overall, the project has identified the problem statement, and the proposed solution demonstrates a strong effort to address the identified needs effectively. | - Planned and confirmed on the 3 main features and future prospect.<br>- Created 6 mascots: Time, Mental, Physical, Social, Errand, and Stress.<br>- Planned improved presentations in terms of charisma and professionalism. |

---

## 3. Design & Prototype

* **UI Prototype:** [[Public Link](https://www.figma.com/board/QidxqFD5LRiBmcFs83Ra8x/Stress---Workload-Manager?node-id=0-1&t=oYhmZGSDEGB32Lji-1)]

*(Note: See the UI Prototype link above for key screens and interactions showcasing the application's flow.)*

---

## 4. What Makes It Different

* **Energy-Aware Monitoring & Scheduling (Not Just Time-Aware):** Traditional calendar tools assume efforts of an hour of study equal the rewards of 1 hour of gaming. Our app factors in cognitive and physical drain across 5 distinct life areas, ensuring wide coverage among various life structures.
* **Active Anxiety Recovery:** Instead of leaving tasks pending or stuck while a student rests, the implemented AI will automatically analyze and reschedule the timetable post-break. Additionally, the system provides an "I'm Stuck" option to enable students to request assistance from peers and progress work via peer collaboration.
* **Low-Friction Automation:** Designed specifically for stressed users by minimizing button clicks, automating input via wearable sensors, and offering quick accept/reject schedule updates.
* **Student-Centric Privacy:** Rejects external monitoring (e.g., parent/teacher dashboards) to create a safe, non-judgmental personal space for self-regulation.

---

## 5. Technical Architecture & Feasibility

### Tech Stack

* **Frontend Framework: Flutter (Dart)**
  * *Why:* Flutter supports cross-platform development efficiency for iOS, Android, and wearable integration with a single codebase. It allows high-performance rendering of graphic ideas such as visual meters and interactive schedules.
* **AI & Intelligence Engine: Gemini Multimodal API**
  * *Why:* Gemini Multimodal API creates advantages in supporting robust analysis, as it enables natural language parsing and intelligent task decomposition into micro-tasks, automatically assigning priority and energy impact scores.
* **Health Data Services: Google Health Connect API**
  * *Why:* Google Health Connect API is widely recognized for its collaboration with the healthcare monitoring domain. It assists in integrating vital stress predictors like raw Heart Rate Variability (HRV) and sleep data with minimal user setup to connect directly to the developed system.
* **Backend & Database: Firebase / BaaS (Firestore & Authentication)**
  * *Why:* Firebase is an optimal option for supporting app features like real-time sync for calendar tasks, instant user preference updates, and zero-maintenance authentication.
* **Hosting & Deployment: Firebase Hosting & Google Cloud Functions**
  * *Why:* Scalable and serverless triggers for running stress-level evaluations and schedule rebalancing routines without maintaining dedicated server infrastructure.

### Expected Technical Constraints
1. **Wearable Sensor Standardization:** Diversity of hardware specs across smartwatches, while mean Heart Rate and sleep metrics might require normalization filters before being fed into stress calculation models.
2. **API Rate & Latency Limits:** Calling LLMs for task breakdowns must be optimized using prompt caching or lightweight client-side task templates to keep schedule recalculations under 1 minute to prevent customer frustration.

### Build Plan & Scope

**Phase 1 (Core Engine & UI):**
* Implement the 5-area workload visualization dashboard (Cortisol Meters) in Flutter.
* Build basic task input and calendar integration (Google Calendar).

**Phase 2 (AI Integration & Recovery Logic):**
* Integrate Gemini API for automated micro-task breakdown.
* Implement the "One-Tap Rebalance" algorithm for rapid timetable shifting.

**Phase 3 (Wearable & Health Signals):**
* Connect Google Health Connect API for physical stress and sleep inputs.
* Trigger proactive recovery notifications based on threshold metrics.

**Out of Scope for Initial Build:**
Real-time peer tutoring networks, native smartwatch standalone UI (relying on background sync), and complex Tarot/Widget visualizers.
