<h1>🚀 PrimeTradeAI: Full-Stack Employee Management System</h1>
    
  <p><strong>PrimeTradeAI</strong> is a robust, full-stack application for secure employee management. It features an API built with <strong>Node.js/Express</strong> and MongoDB, secured with JWT, and a dynamic user interface developed using <strong>React</strong>.</p>

  <hr>

  <h2>✨ Key Features</h2>
    <ul>
        <li><strong>Secure Authentication:</strong> Admin registration and login are secured using <strong>JWT (JSON Web Tokens)</strong> for session management and <strong><code>bcrypt</code></strong> for password hashing.</li>
        <li><strong>Complete CRUD:</strong> Full Create, Read, Update, and Delete capabilities for employee records.</li>
        <li><strong>Centralized Database:</strong> Connects to a reliable <strong>MongoDB Atlas</strong> cluster for data persistence.</li>
        <li><strong>Environment Safety:</strong> Critical credentials (<code>MONGO_URI</code>, <code>JWT_SECRET</code>) are managed securely using <strong><code>.env</code></strong> and the <code>dotenv</code> package.</li>
    </ul>

  <hr>
    <h2>🛠️ Tech Stack</h2>
    <table>
        <thead>
            <tr>
                <th>Component</th>
                <th>Technology</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Backend</strong></td>
                <td>Node.js, Express</td>
                <td>API layer and server-side logic.</td>
            </tr>
            <tr>
                <td><strong>Frontend</strong></td>
                <td>React</td>
                <td>Dynamic and responsive user interface.</td>
            </tr>
            <tr>
                <td><strong>Database</strong></td>
                <td>MongoDB (Atlas)</td>
                <td>Cloud-hosted NoSQL data storage.</td>
            </tr>
            <tr>
                <td><strong>Dependencies</strong></td>
                <td>Mongoose, bcrypt, JWT</td>
                <td>ODM, hashing, and token-based authentication.</td>
            </tr>
        </tbody>
    </table>

  <hr>

  <h2>⚙️ Setup and Installation</h2>

  <p>Follow these steps to set up and run the project locally.</p>

  <h3>1. Prerequisites</h3>
    <p>You must have <strong>Node.js</strong> and <strong>npm</strong> installed.</p>

  <h3>2. Clone the Repository</h3>
    <pre><code>git clone https://github.com/m-panda-f/PrimeTradeAI.git
    cd PrimeTradeAI</code></pre>

  <h3>3. Configure Environment Variables</h3>
    <p>Create a file named <strong><code>.env</code></strong> in the <strong>root directory</strong> of the project and add your credentials.</p>
    <pre><code># .env (in the main PrimeTradeAI folder)

Server Port (used by the backend/server.js)
PORT=5000 

Your secret key for signing JWTs - use a long, complex string in production
JWT_SECRET=qwer1234tyuiop 

 Your MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://Panda:<db_password>@panda.j5ygc.mongodb.net/?appName=Panda</code></pre>

  <h3>4. Install Dependencies</h3>
    <p>You need to install dependencies in both the root/backend and frontend directories.</p>
    <pre><code># 1. Install Backend Dependencies
npm install

2. Install Frontend Dependencies
cd frontend
npm install
cd .. # Go back to the root directory</code></pre>



  <hr>

  <h2>▶️ Running the Application</h2>

  <h3> Start Separately</h3>

  <h4>1. Start Backend API (in one terminal)</h4>
    <pre><code>cd backend
npm start</code></pre>
<p><em>The Backend runs on <code>http://localhost:5000</code></em></p>

  <h4>2. Start Frontend App (in a second terminal)</h4>
    <pre><code>cd frontend
npm start</code></pre>
<p><em>The Frontend usually opens at <code>http://localhost:3000</code>.</em></p>

