# Blueprint: Stress & Workload Manager

## 1. Product Vision & Problem Statement
**Target Audience:** University Students
**Core Problem:** Students frequently experience severe burnout because they lack visibility over how their daily tasks deplete their energy reserves across different life areas. They view rest as a luxury, leading to exhaustion.
**Objective:** Visualize workload across four distinct areas (Mental, Physical, Social, Errands) and proactively intervene with recovery suggestions before stress hits a critical level.

## 2. System Architecture & Portability
The application is currently designed as a mobile-first web application (constrained to a 390x844 viewport) with strict architectural boundaries to allow easy porting to native platforms (Dart/Flutter, Swift/iOS, Kotlin/Android).

*   **UI Layer:** React (Components like `DashboardScreen`, `NewTaskScreen`, `TaskDetailScreen`).
*   **Domain/Logic Layer:** `EnergyEngine` (Calculations, capacity caps) and `aiBreakdown` (LLM-based heuristics).
*   **Data/Persistence Layer:** `TaskRepository` (Currently LocalStorage, designed to migrate to SQLite, Room, CoreData, or Cloud).

## 3. Data Storage Strategy
Based on the system design requirements:
*   **Structure:** Directed Acyclic Graph (DAG) inspired.
*   **Implementation:** Hierarchical Parent-Child relation.
    *   `main_tasks` (1) -> `micro_tasks` (*).
    *   Each task contains a detailed `CategoryImpact` payload.
*   **Flexibility:** Allows easy swapping, editing, and reprioritization of micro-tasks without recalculating entire timelines.

## 4. Core User Flows

### A. First-Time Onboarding (Planned)
1. **Forms Screen:** Collect baseline data (height, weight, baseline mood, perceived stress, lifestyle factors).
2. **Health Sync:** Prompt integration with Google Health API / Apple Health / Strava / WHOOP.
3. **Completion:** Route to Dashboard.

### B. Task Creation & AI Breakdown (Implemented)
1. **Input:** User inputs a task manually (Future: Sync via Calendar or To-Do apps).
2. **AI Evaluation (`aiBreakdown.ts`):** 
   - LLM/Heuristics evaluate the task.
   - Task is broken down into micro-tasks (`SubTasks`).
   - Cortisol/Energy impact is assigned (Mental, Physical, Social, Errands).
3. **Reprioritization:** System reprioritizes the backlog and inserts necessary "Recovery Tasks".
4. **Confirmation (`BreakdownConfirmScreen`):** User reviews, edits, and confirms the breakdown.
5. **Update Backlog:** Task is added to the DAG/Repository.

### C. Daily Loop & Burnout Prevention (Future Background Process)
1. **Daily Trigger (Morning):**
   - Poll **Daily Predictor** (Sleep duration/quality, HRV, resting HR from Health API, or manual mood survey).
   - Update daily task list.
2. **Active Monitoring:**
   - Real-time tracking of task duration. If a task exceeds estimated time (e.g., >45m), trigger a **Burnout Detection** intervention.
3. **Intervention / Recovery Suggestion:**
   - Ask user if they need recovery.
   - If user has slack time (> 5 mins), suggest a micro-activity (meditation, short walk, water).
   - If accepted: Add activity, re-evaluate load, push subsequent tasks down.
   - If rejected: Continue tracking but adjust risk weight.

## 5. The "4 Cortisol Meters" (EnergyEngine)
The core visualization of the app.
*   **Mental:** Cognitive load (exams, coding, studying). Cap: ~65 pts.
*   **Physical:** Physical strain (gym, sports, walking). Cap: ~50 pts.
*   **Social:** Social battery (meetings, dates, parties). Cap: ~45 pts.
*   **Errands:** Administrative friction (groceries, laundry). Cap: ~50 pts.
*   **Logic:** As micro-tasks are completed, the respective load is drained, shifting the user towards a balanced "recharged" state.

## 6. Future Integration Endpoints
*   **Google Health Connect API:** For raw HRV, resting heart rate, sleep stages (Deep, REM), and daily step counts.
*   **Calendar API (Google/Apple):** To fetch upcoming tasks and social activities automatically.
*   **Real-time AI Pipeline:** Upgrading the current heuristic `aiBreakdown.ts` to a live multimodal LLM endpoint for dynamic task ingestion.
