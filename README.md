# EccoHub Browser Client

This is the React Front-End for the Ecco-System.  

The Back-End can be found [here](https://github.com/Dorkat0/ecco/tree/release_1.0).  

## Technical Details  
React + Typescript  
[Bootstrap 5](https://www.npmjs.com/package/react-bootstrap)  
[Bootstrap Icons](https://icons.getbootstrap.com/)  
[Axios (HTTP-Client)](https://www.npmjs.com/package/react-axios)  


## How to get started

Download and install [Node.js](https://nodejs.org/en/download/).   

Open the project in an IDE (i.e. VS Code).\
Open a terminal and install dependencies:

### `npm ci`

## Available Scripts

In the project directory run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

Create the API key and Client ID and add them in the code for the commits(src/components/Subpages/Commits/Commits.MakeCommitModal.tsx):
https://console.cloud.google.com/

In this page: https://developers.google.com/oauthplayground/
1. Authorize the Drive API v3:
    - https://www.googleapis.com/auth/drive
    - https://www.googleapis.com/auth/drive.file
2. Create the token and add it in the code for checking out the variant (src/components/Subpages/Variants/Variant.tsx)

Upon variant checkout, the folder is saved both locally and on the drive.

When generating the credentials(API key and Client ID), grant access to the Google Drive the localhost:port. Subsequently, the project must be accessed through that port in order to retain access.
