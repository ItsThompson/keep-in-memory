<div align="center">
<pre>
  _    _                 _                     _                                                   
 | |  (_)            _  | |                   (_)                                                  
 | | ___ _ __ ___   (_) | | _____  ___ _ __    _ _ __    _ __ ___   ___ _ __ ___   ___  _ __ _   _ 
 | |/ / | '_ ` _ \      | |/ / _ \/ _ \ '_ \  | | '_ \  | '_ ` _ \ / _ \ '_ ` _ \ / _ \| '__| | | |
 |   <| | | | | | |  _  |   <  __/  __/ |_) | | | | | | | | | | | |  __/ | | | | | (_) | |  | |_| |
 |_|\_\_|_| |_| |_| (_) |_|\_\___|\___| .__/  |_|_| |_| |_| |_| |_|\___|_| |_| |_|\___/|_|   \__, |
                                      | |                                                     __/ |
                                      |_|                                                    |___/ 


----------------------------------------------------------------------------------------------------

Full-stack web app for memory training and cognitive enhancement.

</pre>

![GitHub top language](https://img.shields.io/github/languages/top/ItsThompson/keep-in-memory)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/ItsThompson/keep-in-memory/main)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ItsThompson/keep-in-memory)

</div>

> 🧠 Try the app here: [https://keep-in-memory.vercel.app/](https://keep-in-memory.vercel.app/)

## Introduction
This project is a full-stack web app where users can challenge their short-term memory by trying to remember as many items as possible from a displayed board. With a focus on minimalism and intuitive UX, the app has a clean interface for users to engage in. The main objectives for this project was to get used to the AWS ecosystem and serverless architecture, as well as to improve my React skills and hosting a live web app.

## Detailed Gameplay Mechanics

The core gameplay loop is designed to provide a comprehensive memory challenge:
1.  **Memorization Phase:** The user is presented with a canvas filled with various icons (number of icons is customized by the user). The primary goal during this phase is to carefully observe and memorize these icons.
2.  **Lockdown Phase:** After the memorization phase, the game locks for a duration set by the user. During this time, the icons are hidden, and the user cannot interact with the game.
3.  **Recall Phase:** Once the game unlocks, the user is prompted to recall the names of the icons they previously saw.
4.  **Results and Statistics:** After the recall phase, the game displays the results, showing the user's accuracy. User statistics, including total games played, average accuracy, precision, and recall, are tracked and stored.

## Technology Stack
* **Frontend:** The user interface is built with **React** using the **Next.js** framework, providing a fast and dynamic experience. The frontend is hosted on **Vercel**, ensuring reliable and efficient deployment.
* **Backend:** The backend infrastructure is built entirely on **Amazon Web Services (AWS)**, utilizing a serverless architecture for scalability and cost-effectiveness.
    * **AWS Lambda:** For executing server-side logic and API endpoints without managing servers.
    * **Amazon S3 (Simple Storage Service):** Used for static asset hosting (i.e. icons).
    * **Amazon DynamoDB:** A fast and flexible NoSQL database service used for securely storing game data, user data and statistics.
    * **Amazon API Gateway:** For managing and securing API requests between the frontend and the Lambda functions.

## User Authentication
The project "kim: keep in memory" utilizes Google OAuth for user authentication, providing a secure and convenient way for users to sign in. Once a user authenticates via Google OAuth, the backend issues its own custom JWT access tokens and refresh tokens to manage subsequent user sessions and secure API access.
### Token Management
- Access Token (JWT): This is a short-lived JSON Web Token (JWT) containing the user ID and an expiration time. It is used to authorize access to protected routes on the backend. The frontend sends this token in the Authorization: Bearer <token> header for restricted requests.
- Refresh Token: This is a long, random, and unguessable string (a UUID). It is saved by the frontend as an HttpOnly, Secure, SameSite cookie and stored securely in the backend's DynamoDB database, associated with the user's player_id. Its purpose is to obtain new access tokens once the current one expires, without requiring the user to re-authenticate with Google OAuth.

### Environment Handling (CORS)
The project manages Cross-Origin Resource Sharing (CORS) differently for development and production environments:
- Development (localhost): During development, http://localhost:3000 uses a proxy (via Next.js rewrites) to route API requests to /api/*. This ensures that cookie operations occur within the same origin, eliminating cross-site issues and the need for HTTPS in the development environment. The development API stage is configured to allow localhost:3000 as the origin.
- Production: In the production environment, the frontend directly uses the actual backend API URL. API Gateway stages (dev and prod) have a stage variable originUrl set to their respective frontend URLs to manage Access-Control-Allow-Origin headers, ensuring proper secure communication and cookie acceptance for cross-origin requests by also setting Access-Control-Allow-Credentials: true.
