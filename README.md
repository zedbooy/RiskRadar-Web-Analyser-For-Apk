# RiskRadar : Dependency Risk Radar & AI-Powered Security Scanner

RiskRadar is a specialized DevSecOps platform designed to perform static security analysis (SAST) on Android applications (APK). It acts as a "Dependency Risk Radar," automatically extracting the Software Bill of Materials (SBOM) and leveraging Artificial Intelligence to provide prioritized, actionable remediation plans.

##  Purpose of the Application

The primary goal of RiskRadar is to secure the mobile supply chain. Modern applications rely heavily on third-party libraries, which often introduce transitive vulnerabilities, outdated code, or abusive trackers. 

RiskRadar is built to:
1. **Generate an SBOM**: Dissect compiled Dalvik bytecode (`.dex`) to map all embedded libraries and frameworks (e.g., React Native, Flutter, Firebase, OkHttp).
2. **Detect Vulnerabilities**: Identify known CVEs, obsolete libraries, insecure storage configurations, and weak cryptographic implementations.
3. **Expose Secrets**: Locate hardcoded API keys, passwords, and sensitive URLs buried within the code.
4. **AI-Driven Remediation**: Translate raw JSON findings into a human-readable **Update Plan** using a Large Language Model (Llama 3 via Groq/Nvidia API), strictly adhering to the **OWASP MASVS** (Mobile Application Security Verification Standard) guidelines.

##  How It Works (The Architecture)

1. **Upload Phase (React + Vite)**: The user uploads an Android `.apk` file through a sleek, glassmorphism-styled dashboard.
2. **Analysis Phase (Python + Androguard)**: A Python engine runs asynchronously to decompile the APK, parse the `AndroidManifest.xml`, extract permissions, and heuristically scan the bytecode for dependencies and secrets.
3. **Scoring Phase (Laravel + MySQL)**: The backend calculates a global security score (0-100) based on the severity of the findings (Critical, High, Medium, Low).
4. **AI Consulting Phase (Llama 3)**: The structured data is sent to the AI, which generates an executive summary and a prioritized remediation plan.

## 🎥 Demonstration

Watch the full RiskRadar security analysis workflow in action:

<div align="center">
  <video src="https://github.com/zedbooy/RiskRadar-Web-Analyser-For-Apk/raw/main/rapport/RiskRadarAnalyserDim.mp4" width="100%" controls controlsList="nodownload" oncontextmenu="return false;">
  </video>
</div>

---

## 🚀 How to Use the App


### 1. Start the Environment
To run the platform locally, you must start three parallel services:

*   **Start the Backend API (Laravel)**:
    ```bash
    cd backend
    php artisan serve
    ```
*   **Start the Background Worker (For Python Analysis & AI Jobs)**:
    ```bash
    cd backend
    php artisan queue:work
    ```
*   **Start the Frontend Interface (React/Vite)**:
    ```bash
    cd frontend
    npm run dev
    ```

### 2. Perform a Scan
1. Open your browser and navigate to `http://localhost:5173/`.
2. Drag and drop your `.apk` file (e.g., `UnCrackable-Level1.apk` or any production app) into the upload zone.
3. Click **"Lancer l'Analyse"**.

### 3. Review the Results
Once the background processing is complete, the dashboard will display:
*   **The Global Security Score** and Risk Classification.
*   The **AI Action Plan** (Executive Summary & Priority Updates).
*   Detailed Tabs for **Vulnerabilities**, **Secrets**, **Permissions**, and the **SBOM**.

### 4. Export
Click the "Télécharger PDF" button to generate a professional, management-ready security audit report in PDF format.
