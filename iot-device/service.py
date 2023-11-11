import threading
import requests
import loading

base_url = "https://api.feedapp.no/v1"  # "http://localhost:3000/v1"


def get_device(stdscr, jwt_key):
    global base_url

    loading.keep_spinning = True
    spinner_thread = threading.Thread(
        target=loading.show_spinner,
        args=(
            stdscr,
            "Fetching device...",
        ),
    )
    spinner_thread.start()

    try:
        response = requests.get(
            f"{base_url}/devices", headers={"Authorization": f"Bearer {jwt_key}"}
        )
    except requests.RequestException as e:
        loading.keep_spinning = False
        return None, str(e)

    loading.keep_spinning = False
    spinner_thread.join()

    if response.status_code == 200:
        return response.json(), None
    else:
        return None, response.json().get("message")


def create(stdscr):
    global base_url

    loading.keep_spinning = True
    spinner_thread = threading.Thread(
        target=loading.show_spinner,
        args=(
            stdscr,
            "Creating device...",
        ),
    )
    spinner_thread.start()

    try:
        response = requests.post(f"{base_url}/devices/create")
    except requests.RequestException as e:
        loading.keep_spinning = False
        return None, str(e)

    loading.keep_spinning = False
    spinner_thread.join()

    if response.status_code == 201:
        return response.text, None
    else:
        return None, response.json().get("message")


def connect(stdscr, jwt_key, poll_id):
    global base_url

    loading.keep_spinning = True
    spinner_thread = threading.Thread(
        target=loading.show_spinner,
        args=(
            stdscr,
            "Connecting to poll...",
        ),
    )
    spinner_thread.start()

    try:
        response = requests.put(
            f"{base_url}/devices/connect/{poll_id}",
            headers={"Authorization": f"Bearer {jwt_key}"},
        )
    except requests.RequestException as e:
        loading.keep_spinning = False
        return None, str(e)

    loading.keep_spinning = False
    spinner_thread.join()

    if response.status_code == 204:
        return None, None
    else:
        return None, response.json().get("message")


def get_votes(stdscr, jwt_key):
    global base_url

    loading.keep_spinning = True
    spinner_thread = threading.Thread(
        target=loading.show_spinner,
        args=(
            stdscr,
            "Fetching poll...",
        ),
    )
    spinner_thread.start()

    try:
        response = requests.get(
            f"{base_url}/devices/votes",
            headers={"Authorization": f"Bearer {jwt_key}"},
        )
    except requests.RequestException as e:
        loading.keep_spinning = False
        return None, str(e)

    loading.keep_spinning = False
    spinner_thread.join()

    if response.status_code == 200:
        return response.json(), None
    else:
        return None, response.json().get("message")


def vote(stdscr, jwt_key, answer):
    global base_url

    loading.keep_spinning = True
    spinner_thread = threading.Thread(
        target=loading.show_spinner,
        args=(
            stdscr,
            "Voting...",
        ),
    )
    spinner_thread.start()

    data = {"answer": answer}

    try:
        response = requests.post(
            f"{base_url}/devices/vote",
            json=data,
            headers={"Authorization": f"Bearer {jwt_key}"},
        )
    except requests.RequestException as e:
        loading.keep_spinning = False
        return None, str(e)

    loading.keep_spinning = False
    spinner_thread.join()

    if response.status_code == 201:
        return None, None
    else:
        return None, response.json().get("message")
