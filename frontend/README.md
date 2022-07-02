# HERD APP

The HERD app is made with React and Material React UI.

---

## Setup

1. Install Node and NPM.
1. Install the necessary packages in the `package.json` found in the root directory.

    ```
    npm install
    ```

---

## Development

To start the local version of the app (non-electron), follow the steps below. Run the command:

```
npm run start
```

---

## QA Deployment

The application is deployed and tested in an S3 environment.

1. Setup your AWS CLI.
1. Login to your AWS CLI (or just have profiles setup)
1. Build the project. This will create static files that will be uploaded to the s3 bucket.
    ```
    npm run build
    ```
1. Deploy the static files.
    ```
    npm run deploy
    ```

---

## Testing and Running the Whole Application Locally

### Backend

1. Setup the backend.
1. Start the backend service.

### Frontend

1. Start the front-end application.
    ```
    npm run start
    ```
1. In your browser, go to `http://localhost:3000`.
