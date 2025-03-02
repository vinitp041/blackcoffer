BlackCoffer Project
This project consists of three main components:

----------------------------------------------------------------------------------------------------------------------------

app.py: The main application file.
insert_data.py: A script to insert data into the system.
blackcoffer-dashboard: A dashboard built to visualize and interact with the data.
Follow the steps below to run the project successfully.

----------------------------------------------------------------------------------------------------------------------------

Prerequisites

Before running the project, ensure you have the following installed:

Python 3.x
Node.js (for the dashboard)
Required Python libraries (install using pip install -r requirements.txt)
Required Node.js dependencies (install using npm install inside the blackcoffer-dashboard folder)

----------------------------------------------------------------------------------------------------------------------------

Steps to Run the Project

Step 1: Run app.py
   1. Open a terminal.
   2. Navigate to the project directory:
                  cd /path/to/BlackCoffer
   3. Run the app.py file:
                  python app.py
   4. Do not close this terminal. Keep it running.
      
Step 2: Run insert_data.py
    1. Open another terminal.
    2. Navigate to the project directory:
                  cd /path/to/BlackCoffer
    3. Run the insert_data.py script:
                  python insert_data.py
    4. Wait for the data to be inserted successfully.

Step 3: Run the BlackCoffer Dashboard
    1. Open a new terminal.
    2. Navigate to the blackcoffer-dashboard folder:
                  cd /path/to/BlackCoffer/blackcoffer-dashboard
    3. Install Node.js dependencies (if not already installed):
                  npm install
    4. Start the dashboard:
                  npm start
    5. The dashboard will open in your default browser. If it doesn't, navigate to http://localhost:3000.
    
----------------------------------------------------------------------------------------------------------------------------

Project Structure
      BlackCoffer/
      ├── app.py                   # Main application file
      ├── insert_data.py           # Script to insert data
      ├── blackcoffer-dashboard/   # Dashboard frontend
      │   ├── public/              # Static assets
      │   ├── src/                 # React components
      │   ├── package.json         # Node.js dependencies
      │   └── ...                  # Other dashboard files
      ├── jsondata.json            # Data file
      ├── requirements.txt         # Python dependencies
      └── README.md                # Project documentation

----------------------------------------------------------------------------------------------------------------------------

Troubleshooting

1. app.py not running: Ensure all required Python libraries are installed (pip install -r requirements.txt).
2. Dashboard not starting: Ensure Node.js is installed and dependencies are installed (npm install).
3. Data not inserting: Check the jsondata.json file and ensure it is in the correct format.

    

                  
