# **Stress & Workload Manager By AlAddict**

**Team:** Yee Jia Hao, Mooi Yang Jing, Mok Yuan Cong, Teoh Jun Yi

**Problem Statement:** Stress & Workload Manager

**Video Presentation:** [Unlisted Youtube Link] 

**Presentation Slides:** [Public Link] 

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

| **Idea** | **Why it was dropped / kept** |
| :--- | :--- |
| **5-Dimension Workload & Cortisol Meters** (Chosen) | Serves as an effective visual framework for tracking real-time student load capacity across Mental, Physical, Social, and Errand against Time (Daily), providing an intuitive baseline for personal stress awareness and preventing burnout early. |
| **AI based Task Breakdown** (Chosen) | Help students in task planning by leveraging multimodal AI to decompose complex tasks and assignments into a structured Directed Acyclic Graph (DAG) of actionable micro-tasks. |
| **Daily Task Rescheduling & Survey** (Chosen) | Executes an automated morning calibration by ingesting wearable telemetry (sleep quality/duration, HRV, resting HR via Google Health Connect) and a quick mood survey to auto-build an optimized daily schedule with Recovery Tasks. |
| **Algorithmic One-Tap Rebalancing & Proactive Nudges** (Chosen) | Delivers primary low-friction recovery task intervention. Uses PERT Slack Time Analysis to reschedule non-critical tasks in under a minute and delivers proactive nudges (breathing, hydration) before burnout hits critical levels. |
| **Task Reflection Notes** (Dropped, with consideration) | A reflection step after completing daily task to evaluate and help with future work breakdown planning to better fit student habits and ability.<br><br>Adding manual journaling creates unnecessary user friction and cognitive load for already overstressed students, conflicting with the app's zero-friction philosophy. |
| **Parent & Teacher Evaluation Dashboard** (Dropped, with consideration) | A feature that allows parents and/or tutors to monitor student’s workload to take proactive steps to prevent burnouts.<br><br>Introducing external monitoring by parents or tutors increases student anxiety being monitored and undermines autonomy, counteracting the stress-reduction objective. Therefore, execution of this idea requires more reviews. |
| **"I'm Stuck" Peer Escalation Feature** (Dropped, with consideration) | A feature enables students to progress tasks with peer/lecturer help during rest/recovery sessions.<br><br>Removed from the main implementation scope to streamline system architecture and focus fully on automated, single-user AI schedule management. Additionally, because its utility relies heavily on a critical mass of active users, it is planned for future development phases. |
| **Small Student Discussion Forums / Threads** (Dropped) | Out of scope. Community moderation and forum infrastructure add non-essential complexity and infrastructure cost without directly contributing to individual workload rebalancing.<br><br>Can instead collaborate with forums like Chegg, Reddit, Quora, etc. |
| **Fun Tarot Reading Sessions** (Dropped) | Lacks scientific grounding and conflicts with the application's core algorithmic, health-backed approach to biometric and task management.<br><br>Only suitable used as entertainment for stress reduction. |
| **U-Tube Water/Oil Visualizer Widget** (Dropped) | While visually novel, complex custom UI animations introduce performance overhead and battery drain without offering additional valuable insight beyond the standard 5-dimension workload meter visualizers. |

### 2.2 Ideation Boards
**Detailed Ideation Board:** [[Link](https://www.figma.com/board/QidxqFD5LRiBmcFs83Ra8x/Stress---Workload-Manager?node-id=0-1&t=oYhmZGSDEGB32Lji-1)]

<img width="3078" height="1088" alt="5 whys" src="https://github.com/user-attachments/assets/0ef71625-a9b7-44ab-a744-04c3ad860234" />
*Figure 2.1: 5 WHYs Problem Tree breaking down the root causes of student burnout and mapping recovery suggestions.*

<img width="2982" height="1588" alt="Planning" src="https://github.com/user-attachments/assets/33d99841-d691-49b2-b0ce-7ae6bcf4c4ca" />
*Figure 2.2: System Mindmap outlining the Detection, Prevention, and Mitigation logic along with WearOS and API integration points.*

<img width="1522" height="943" alt="Experience Analysis" src="https://github.com/user-attachments/assets/d88c75d9-13e6-471d-b620-e7032d8f2c6b" />
*Figure 2.3: Experience Analysis board capturing team pain points regarding rest anxiety, task automation, and peer-assistance concepts.*

<img width="2982" height="1588" alt="Planning" src="https://github.com/user-attachments/assets/25529016-03e3-45ce-9680-7e8ac7bce8ce" />
*Figure 2.4: Feature evaluation board detailing benefits, drawbacks, and reasons for accepting or rejecting candidate ideas.*

### 2.3 Mentor Consultation

| Date | Mentor | Feedback Received | What Was Changed |
| :--- | :--- | :--- | :--- |
| 10 September 2026 | Ms Iris Yan Ning | - Through the ideation process, many ideas have been generated. For now, focus on the three most innovative and impactful features that can best capture the judges' attention.<br><br>- The work breakdown structure is a distinctive feature of the project. It shows how tasks and micro-tasks are organized, making the implementation plan easy to understand.<br><br>- The user flow diagram is clean, well-structured, and easy to follow project idea.<br><br>- Consider creating a character or mascot to represent the app, simillar to Duolingo owl. This could build the app's identity and enhance user engagement and interaction.<br><br>- Overall, the project has identified the problem statement, and the proposed solution demonstrates a strong effort to address the identified needs effectively. | - Planned and confirmed on the 3 main features and future prospect.<br><br>- Created 1 mascot to represent the app. (May change during build phase)<br><br>- Planned and improved presentations in terms of charisma and professionalism. |

---

## 3. Design & Prototype

* **UI Prototype:** [[Public Link](https://www.figma.com/board/QidxqFD5LRiBmcFs83Ra8x/Stress---Workload-Manager?node-id=0-1&t=oYhmZGSDEGB32Lji-1)]

<div align="center">
  <img src="https://github.com/user-attachments/assets/0ab8678b-054b-4111-86f3-e16016e3df91" width="800" alt="Daily Check-in Screen" />
  <p><em>Figure 3.1: A daily check-in screen that synchronizes user smartwatch data (skip, if not applicable) and conducts a quick readiness survey. This readiness score is used to dynamically adjust the student's daily workload and prevent burnout.</em></p>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/c0f2c357-a88f-4330-9daf-05ca5a72371e" width="260" alt="Main Dashboard Interface" />
  <p><em>Figure 3.2: The main dashboard interface featuring the 5-dimension workload meter, daily morning check-in evaluation, daily task listings, and a quick-action button to add new tasks for breakdown.</em></p>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/5babca66-4362-4588-8f65-91a4aceb7077" width="260" alt="Create New Task Screen" />
  <p><em>Figure 3.3: The Create New Task screen for entering the task title, description, importance rating, and due date. Users can also attach contextual files to optimize task breakdown generation.</em></p>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/a88f0e5a-992c-40e3-8625-beb48733ac2b" width="260" alt="Task Breakdown View" />
  <p><em>Figure 3.4: The task breakdown view displaying micro-tasks along with their calculated dimensional weights (Mental, Physical, Social, and Errands). Users can add, edit, delete, or reorder tasks to customize the execution sequence.</em></p>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/733340db-f464-4f08-b644-a491839c857a" width="260" alt="Updated Dashboard Interface" />
  <p><em>Figure 3.5: The updated dashboard interface showing newly added items, automatically prioritizing high-importance tasks due on the current day.</em></p>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/5f7eee6e-5cd5-41a2-80c4-e1fde946cc16" width="800" alt="Proactive Burnout Detection Alert" />
  <p><em>Figure 3.6: Proactive burnout detection alerts triggered at continuous intervals (e.g., 30, 60, or 90 minutes) during long tasks to prevent exhaustion. The system prompts students to complete a short recovery activity before continuing work on the same task.</em></p>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/b869791f-8a9c-40ff-a1e4-422a16d9123a" width="260" alt="Task Duration Exceeded Alert" />
  <p><em>Figure 3.7: An alert notification displayed when a task exceeds its allocated duration. It prompts the student to mark the task as complete, extend the time limit, or postpone it to another day.</em></p>
</div>

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
  * *Why:* Flutter supports cross-platform development efficiency for iOS, Android, and wearable integration with a single codebase. It allows high-performance rendering of graphics ideas such as concepts of visual meters and interactive schedules.
* **AI & Intelligence Engine: Gemini Multimodal API**
  * *Why:* Gemini Multimodal API could create advantages in support robust analysis, as it enables natural language parsing and intelligent task decomposition into micro-tasks, automatically assigning priority and energy impact scores.
* **Health Data Services: Google Health Connect API**
  * *Why:* Google Health Connect API is widely recognised for its collaboration with the healthcare monitoring domain, and it assists in integrating vital stress predictors like raw Heart Rate Variability (HRV) and sleep data with minimal user setup to connect directly to the developed system.
* **Backend & Database: Firebase / BaaS (Firestore & Authentication) and SQLite**
  * *Why:* Firebase is an optimal option for supporting app features like real-time sync for calendar tasks, instant user preference updates, and zero-maintenance authentication. Additionally, SQLite will be used as the local persistent database for the app to work offline after daily task breakdown.
* **Hosting & Deployment: Firebase Hosting & Google Cloud Functions**
  * *Why:* Scalable and serverless triggers for running stress-level evaluations and schedule rebalancing routines without maintaining dedicated server infrastructure.

### Expected Technical Constraints

1. **Wearable Sensor Standardization:** Diversity of hardware specs across smartwatches, while mean Heart Rate and sleep metrics also might require normalization filters before fed into stress calculation models.
2. **API Rate & Latency Limits:** Calling LLMs for task breakdowns must be optimized using prompt caching or lightweight client-side task templates to keep schedule recalculations under 1 minute to prevent customer frustrations.

### Build Plan & Scope

**Week 1 (Core Architecture & Baseline Dashboard):**
* **System Design:** Finalize comprehensive use case descriptions, data schema (e.g., 1:N micro-task relations & M:N DAG prerequisites), and system architecture diagrams.
* **Core Mobile Client Development:** Implement local database storage, task creation forms, and base calendar/to-do list integrations in Flutter.
* **5-Dimension Workload UI:** Build the visual 5-Dimension Cortisol Workload Meter (Mental, Physical, Social, Errand against Time) to display real-time capacity on the primary Dashboard.

**Week 2 (AI Processing & Biometric Inputs):**
* **Multimodal AI Integration (Gemini API):** Implement automated micro-task breakdown into Directed Acyclic Graphs (DAG), enabling parsing of text, calendar payload, and document/image (PDF assignment guidelines) for AI context.
* **Google Health Connect API:** Integrate biometric telemetry (sleep quality/duration, HRV, resting HR) for optimized daily schedule initialization and baseline capacity scoring.
* **Prompt Engineering & Token Optimization:** Structure Gemini API prompts for predictable JSON output and implement token-saving strategies for real-time task generation.

**Week 3 (Other Features and UI/UX Improvement):**
* Implement proactive burnout detection and recovery notifications based on threshold metrics.
* Improve UI/UX against prototype design and refactor.

**Future Scope / Backlog:**
* Task Reflection Notes
* Parent & Teacher Evaluation Dashboard
* "I'm Stuck" Peer Escalation feature
