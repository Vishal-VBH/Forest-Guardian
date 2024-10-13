const express = require('express');
const mysql = require('mysql');

const app = express();
const cors = require('cors');
// Database configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'value'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

app.use(cors());

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to handle incoming data and store it in the database
app.get('/data', (req, res) => {
  const { s1, s2, s3 } = req.query;

  const data = {
    flame: s1,
    animal_detected: s2,
    soil_moisture: s3
  };

  const sql = 'INSERT INTO sensor_data SET ?';

  db.query(sql, data, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Data inserted into database');
    res.send('Data inserted into database');
  });
});

const cssStyles = `
/* Navbar */
.navbar {
  background-color: #7fd653;
  color: #fff;
  padding: 0px 0;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar ul {
  list-style-type: none;
}

.navbar ul li {
  display: inline;
  margin-right: 20px;
}

.navbar ul li a {
  text-decoration: none;
  color: #fff;
}

.navbar ul li a:hover {
  color: #ffcc00;
}

/* Main Content */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0px;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

table th,
table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #333333;
  color: #fff;
}

table tr:nth-child(even) {
  background-color: #f2f2f2;
}

table tr:hover {
  background-color: #ddd;
}

/* Footer */
.footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 20px 0;
}

.footer p {
  margin: 0;
}
`;

// Route to serve CSS
app.get('/styles.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.send(cssStyles);
});

// Route to serve HTML with embedded CSS
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM sensor_data';

  db.query(sql, (err, results) => {
    if (err) {
      res.json({ message: 'an error occurred' });
    }
    const dataHtml = results.map(result => `
      <tr>
        <td>${result.id}</td>
        <td>${new Date(result.timestamp).toLocaleTimeString()}</td>
        <td>${result.flame}</td>
        <td>${result.animal_detected}</td>
        <td>${result.soil_moisture}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/styles.css"> <!-- Link to dynamically served CSS -->
        <title>Sensor Data</title>
      </head>
      <body>
        <nav class="navbar">
          <div class="container">
            <h1>IOT BASED FOREST GUARDIAN</h1>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </nav>
        <img src="/groupp.jpg" height="100%" width="100%" />
        <main class="container">
          <table>
            <tr>
              <th>id</th>
              <th>timestamp</th>
              <th>flame</th>
              <th>animal_detected</th>
              <th>soil_moisture</th>
            </tr>
            ${dataHtml}
          </table>
        </main>
        <img src="/Grouppp.jpg" height="100%" width="100%" />
        <footer class="footer">
          <div class="container">
            <p>&copy; 2024 IOT BASED FOREST GUARDIAN.</p>
          </div>
        </footer>
      </body>
      </html>
    `;

    res.send(html);
  });
});

// Route to handle deletion of all data
app.post('/delete', (req, res) => {
  const sql = 'DELETE FROM sensor_data';

  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('All data deleted successfully');
    // Redirect back to the home page after deletion
    res.redirect('/');
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server for storing data running on port ${PORT}`);
});
