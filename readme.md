BLOG + SCHEDULE + CHATBOT FOR HEALTHCARE
============

A web application and chatbot backend built using **Vite** for the frontend and backend and **FastAPI** for the chatbot backend.

* * * * *

Table of Contents
-----------------

-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Installation](#installation)
-   [Setting Up Environment Variables](#setting-up-environment-variables)
-   [Running the Project](#running-the-project)
    -   [Frontend](#frontend)
    -   [Backend](#backend)
-   [Build and Deployment](#build-and-deployment)
-   [Contributing](#contributing)
-   [License](#license)

* * * * *

Features
--------

-   **Frontend**: Interactive web interface built with the Vite framework.
-   **Backend**: REST API for chatbot powered by Express, FastAPI.
-   **Environment Management**: `.env`, `api_key.yaml` for secure key management.
-   **Scalable**: Modular structure to add more features as needed.

* * * * *

Tech Stack
----------

-   **Frontend**: Vite, React
-   **Backend**: Express, FastAPI, Python 3.11
-   **Package Manager**: npm (for frontend and backedn dependencies), pip (for chatbot backend dependencies)
-   **Database**: MongoDB

* * * * *

Installation
------------

### Prerequisites

-   **Node.js** (v16 or newer)
-   **Python 3.11**
-   **pip** for Python dependency management

### Steps

1.  Clone the repository:

    bash

    CopyEdit

    `git clone https://github.com/dngan0365/HealthcareBlogChat
    cd HealthcareBlogChat`

2.  Install dependencies:

    -   **Frontend**:

        bash

        CopyEdit

        `cd client
        npm install`

    -   **Backend**:

        bash

        CopyEdit

        `cd backend
        npm install`

    -   **Chatbot Backend**:

        bash

        CopyEdit

        `cd chatbot-backend
        pip install -r requirements.txt`

* * * * *

Setting Up Environment Variables
--------------------------------

1.  **Frontend**:

    -   Create a `.env` file in the `frontend` directory.
    -   Add your environment variables:

        env

        CopyEdit

        `VITE_API_URL=http://localhost:3000`
        `VITE_IK_URL_ENDPOINT` 
        `VITE_IK_PUBLIC_KEY` 
        `VITE_IK_SECRET_KEY` 
        `VITE_CLERK_PUBLISHABLE_KEY`
        `VITE_API_URL`
        `VITE_GEMINI_PUBLIC_KEY`
        `LICENSE_KEY_SYNCFUSION`
    - For IK (support images): https://imagekit.io/docs/api-overview 
    - For Syncfusion (support schedule): https://www.syncfusion.com/downloads
2.  **Backend**:

    -   Create a `.env` file in the `backend` directory.
    -   Add your environment variables:

        env

        CopyEdit

        `MONGO=your-mongo-url`
        `CLIENT_URL="http://localhost:5173"`
        `CLERK_WEBHOOK_SECRET=your-webhook-secret`
        `CLERK_PUBLISHABLE_KEY=your-publishable-key`
        `CLERK_SECRET_KEY=your-clerk-secret-key`
        `IK_URL_ENDPOINT=your-ik-url-endpoint`
        `IK_PUBLIC_KEY=your-ik-public-key`
        `IK_PRIVATE_KEY=your-ik-private-key`
    - Mongo for database: https://www.mongodb.com/?msockid=0047e0678f906e71157cf5648ef66f2d
    - Clerk for Authentication: https://clerk.com/
    - IK fro images: https://imagekit.io/docs/api-overview 

3.  **Chatbot Backend**:

    -   Create a `api_keys.yaml` file in configs folder in the `chatbot-backend` directory.
    -   Add your environment variables:

        api_keys.yaml

        CopyEdit

        `openai:`
            `api_key: your-key`
        `weaviate:`
        `    url: your-weaviate-url`
        `    api_key: your-weaviate-api-key`
        `mongodb:`
        `    url: your-mongo-url`

4.  Ensure the `api_keys.yaml` files are listed in `.gitignore` to prevent them from being pushed to the repository.

* * * * *

Running the Project
-------------------

### Frontend

1.  Start the development server:

    bash

    CopyEdit

    `cd client`
    `npm run dev`

2.  Open your browser and visit: http://localhost:5173

### Backend

1.  Start the FastAPI server:

    bash

    CopyEdit

    `cd backend`
    `npm start`

2.  Open your browser and visit: http://localhost:3000

### Chatbot Backend

1.  Start the FastAPI server:

    bash

    CopyEdit

    `cd backend`
    `cd src`
    `python -m uvicorn backend.main:app --reload`

2.  API documentation will be available at:

    -   Swagger UI
    -   ReDoc

* * * * *

Build and Deployment
--------------------

### Frontend

1.  Build for production:

    bash

    CopyEdit

    `cd frontend`
    `npm run build`

2.  The production-ready files will be in the `dist` folder.

### Backend

1.  Use a production-grade server like `gunicorn` or `uvicorn` with multiple workers:

    bash

    CopyEdit

    `python -m uvicorn main:app --host 0.0.0.0 --port 8000`