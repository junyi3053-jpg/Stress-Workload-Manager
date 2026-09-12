# Stress & Workload Manager

**Team:** AlAddict (Yee Jia Hao, Mooi Yang Jing, Mok Yuan Cong, Teoh Jun Yi)

## 📖 Project Overview

### The Problem
University students frequently face consistent, severe burnout that heavily impacts both their academic progress and personal lives. Students often struggle to accurately estimate task duration and map cognitive energy against fixed daily time limits. Instead of recognizing how stress impacts their lives, they often view 'rest' as a luxury rather than a necessity, leading to complete exhaustion.

Existing solutions (traditional to-do lists, calendar apps, paper planners) fall short because they:
* Focus exclusively on task output, deadlines, and manual scheduling.
* Ignore personal energy depletion as a stress factor.
* Lack integration across fragmented life domains: mental, physical, social, and errands.
* Fail to offer proactive recovery interventions. 

Furthermore, taking a break in traditional systems often *increases* student anxiety because the total workload and remaining deadline pressure remain unchanged while time ticks away.

### Our Solution
Our solution is a smart mobile and smartwatch integration that visualizes a student's total load across five distinct areas (mental, time, physical, social, errands) and actively intervenes to prevent burnout. Instead of just tracking deadlines, the system automates task breakdown and dynamic schedule rebalancing, pushing students toward structured recovery without adding time anxiety. It turns passive task management into a proactive energy and workload balancing ecosystem.

---

## ✨ Key Features

1. **5-Dimension Workload Meter (Cortisol Meter)**
   * Visualizes real-time capacity across Mental, Time, Physical, Social, and Errand dimensions. 
   * Values dynamically recalculate upon task creation, completion, or rescheduling, giving students a clear visual threshold of their cognitive and physiological load.

2. **AI-Based Task Breakdown**
   * Converts complex tasks into a sequence of micro-tasks. 
   * Accepts unstructured inputs, including raw text, synced calendar/to-do lists, and uploaded assignment PDFs/images. 
   * Automatically assigns estimated duration and load weights to every generated micro-task.

3. **Daily Task Rescheduling & Survey**
   * Executes an automated morning calibration by fetching wearable biometric data (e.g., sleep duration, sleep quality, deep/REM ratios, resting heart rate, and daily HRV) via the Google Health API.
   * Couples health data with a quick morning mood survey to re-evaluate daily capacity, adjust load weights, and auto-build an optimized daily task list that includes dedicated Recovery Task Sessions.

4. **Algorithmic One-Tap Rebalancing & Proactive Nudges**
   * Employs PERT Slack Time Analysis to identify non-critical tasks and reschedule them in under a minute when workload exceeds capacity.
   * Integrates proactive nudge alerts that suggest guided recovery actions (breathing exercises, hydration, light movement) before burnout hits critical levels.

---

## 🚀 What Makes It Different

* **Energy-Aware Monitoring & Scheduling:** Traditional calendar tools assume the effort of 1 hour of study equals 1 hour of gaming. Our app factors in cognitive and physical drain across 5 distinct life areas.
* **Active Anxiety Recovery:** Instead of leaving tasks pending while a student rests, the AI automatically analyzes and reschedules the timetable post-break.
* **Low-Friction Automation:** Designed for stressed users by minimizing button clicks, automating input via wearable sensors, and offering quick accept/reject schedule updates.
* **Student-Centric Privacy:** Rejects external monitoring (e.g., parent/teacher dashboards) to create a safe, non-judgmental personal space for self-regulation.

---

## 💻 Tech Stack & Architecture

* **Frontend Framework:** Flutter (Dart)
  * *Why:* Supports cross-platform development for iOS, Android, and wearable integration with a single codebase. Allows high-performance rendering for visual meters and interactive schedules.
* **AI & Intelligence Engine:** Gemini Multimodal API
  * *Why:* Enables natural language parsing and intelligent task decomposition into micro-tasks, automatically assigning priority and energy impact scores based on unstructured inputs.
* **Health Data Services:** Google Health Connect API
  * *Why:* Integrates vital stress predictors like raw Heart Rate Variability (HRV) and sleep data directly from wearables with minimal user setup.
* **Backend & Database:** Firebase (Firestore & Authentication)
  * *Why:* Optimal for supporting real-time sync for calendar tasks, instant user preference updates, and zero-maintenance authentication.
* **Hosting & Deployment:** Firebase Hosting & Google Cloud Functions
  * *Why:* Scalable and serverless triggers for running stress-level evaluations and schedule rebalancing routines without maintaining dedicated server infrastructure.

### Expected Technical Constraints
1. **Wearable Sensor Standardization:** Diversity of hardware specs across smartwatches may require normalization filters for Heart Rate and sleep metrics before feeding them into stress models.
2. **API Rate & Latency Limits:** Calling LLMs for task breakdowns must be optimized (e.g., prompt caching or lightweight client-side task templates) to keep schedule recalculations under 1 minute.

---

## 🛠️ Build Plan & Scope

**Phase 1: Core Engine & UI**
* Implement the 5-area workload visualization dashboard (Cortisol Meters) in Flutter.
* Build basic task input and calendar integration (Google Calendar).

**Phase 2: AI Integration & Recovery Logic**
* Integrate Gemini API for automated micro-task breakdown.
* Implement the "One-Tap Rebalance" algorithm for rapid timetable shifting.

**Phase 3: Wearable & Health Signals**
* Connect Google Health Connect API for physical stress and sleep inputs.
* Trigger proactive recovery notifications based on threshold metrics.

*Note: Real-time peer tutoring networks, native smartwatch standalone UI, and complex visualizers are out of scope for the initial build to ensure feasibility and focus.*