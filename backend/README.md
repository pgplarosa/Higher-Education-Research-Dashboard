# HERD Backend

HERD backend is scaffolded with a locally-run Django application.

---

## Setup

1. Make sure to have a local installation of `Python3` and `pip`.
1. Create a virtual environment named `environment`.
1. Activate the virtual environment.
1. Install all the required packages in the `requirements.txt`.
1. Copy the models to `herd_backend\core\models`.
1. Copy the data to `herd_backend\data`.
1. Run the command: `python manage.py collectstatic`. Confirm all copies.

You are then set to start the server.

---

## Starting the Server

1. Go to `herd_backend` folder.
1. Run the command below. This will start a local backend server. To check if the server is up, go to `localhost:8080` in your browser.

```
        python manage.py runserver 8080
```

## Updating the Images Served

For endpoints serving the images (charts, visualizations, etc.), make sure to put them on the right directories.

Run this command every time there is an update to the images:

1. Go to `herd_backend` folder.

```
        python manage.py collectstatic
```
