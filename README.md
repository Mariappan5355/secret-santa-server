Secret Santa Assignment App
===========================

Overview
--------

This project is a backend service built using Node.js, Express, and TypeScript to facilitate the assignment of Secret Santa gift exchanges. It processes Excel files containing employee details, generates random assignments, and exports the results as a CSV file.

Features
--------

*   Uploads current and previous year employee details via Excel files.
    
*   Parses and processes Excel data.
    
*   Generates Secret Santa assignments while avoiding repeat pairings from the previous year.
    
*   Exports assignments as a downloadable CSV file.
    

Tech Stack
----------

*   **Backend:** Node.js, Express, TypeScript
    
*   **Database:** MongoDB (via Mongoose)
    
*   **File Handling:** Multer, XLSX, json2csv
    
*   **Others:** Jest (for testing), Nodemon (for development)
    

Installation
------------

### Prerequisites

*   Node.js (v16 or later)
    
*   MongoDB instance
    

### Steps

1.  git clone https://github.com/Mariappan5355/secret-santa-server.git
    
2.  npm install
    
3.  Create a .env file for environment variables (if needed).
    
4.  npm run build
    
5.  npm start
    

API Endpoints
-------------

### Upload Employee Files

**POST** /upload

*   **Request:** Multipart form-data with two Excel files:
    
    *   currentYear: Current year employee details
        
    *   previousYear: (Optional) Previous year assignments
        
*   **Response:** CSV file download containing Secret Santa pairings.
    

Project Structure
-----------------
```
server/
├── src/
│   ├── controllers/
│   │   ├── SecretSantaController.ts
│   ├── services/
│   │   ├── SecretSantaService.ts
│   ├── models/
│   │   ├── Assignment.ts
│   ├── routes/
│   │   ├── secretSantaRoutes.ts
│   ├── app.ts
│   ├── server.ts
├── dist/ (Compiled output)
├── package.json
├── tsconfig.json
└── README.md`

```

Development
-----------

*   Use npm run build to compile TypeScript files.
    
*   Use npm run start to run the server.
    
*   Use npm run test to execute test cases.
    

License
-------

This project is licensed under the MIT License.