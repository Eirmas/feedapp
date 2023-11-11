import curses

import input
import menu
import service

jwt_key = None
device = None


def info():
    global jwt_key

    menu_options = {
        "back": "Go back",
    }

    message = f"""Your device token is:\n{jwt_key}"""
    selected_option = curses.wrapper(menu.run_menu, menu_options, message, 5)

    if selected_option == "back":
        return home()


def poll(error=None):
    global jwt_key
    global device

    if device.get("poll") is None:
        if jwt_key is None:
            return index("Unauthorized")
        elif device is None:
            response, error = curses.wrapper(service.get_device, jwt_key)

            if error is not None:
                return index(error)

            device = response
            poll()
        else:
            return home("You are not connected to a poll")

    votes, vote_error = curses.wrapper(service.get_votes, jwt_key)

    if vote_error is not None:
        return home(vote_error)

    menu_options = {
        "voteYes": f'Yes ({votes.get("yes")})',
        "voteNo": f'No ({votes.get("no")})',
        "back": "Go back",
    }

    message = f"""Title: {device.get('poll').get('title')}\nQuestion: {device.get('poll').get('question')}\nOwner: {device.get('poll').get('ownerName')}\n\nVote:"""
    selected_option = curses.wrapper(menu.run_menu, menu_options, message, 5, error)

    if selected_option == "voteYes":
        response, error = curses.wrapper(service.vote, jwt_key, True)

        if error is not None:
            return poll(error)

        return poll()

    if selected_option == "voteNo":
        response, error = curses.wrapper(service.vote, jwt_key, False)

        if error is not None:
            return poll(error)

        return poll()

    if selected_option == "back":
        return home()


def home(error=None):
    global jwt_key
    global device

    if device is None:
        if jwt_key is None:
            return index("Unauthorized")
        else:
            response, error = curses.wrapper(service.get_device, jwt_key)

            if error is not None:
                return index(error)

    menu_options = (
        {
            "go": "Go to connected poll",
            "reconnect": "Connect to new poll",
            "info": "See device token",
            "disconnect": "Disconnect",
        }
        if device.get("poll") is not None
        else {
            "reconnect": "Connect to poll",
            "info": "See device token",
            "disconnect": "Disconnect",
        }
    )

    message = f"""Device ID: {device.get('id')}\nDevice email: {device.get('id')}@feedapp.no\nPoll: { device.get('poll').get('id') if device.get('poll') is not None else "-" }"""
    selected_option = curses.wrapper(menu.run_menu, menu_options, message, 4, error)

    if selected_option == "go":
        return poll()

    if selected_option == "reconnect":
        poll_id = curses.wrapper(input.run_input, "Please provide the poll ID")
        response, error = curses.wrapper(service.connect, jwt_key, poll_id)

        if error is not None:
            return home(error)

        response, error = curses.wrapper(service.get_device, jwt_key)

        if error is not None:
            return home(error)

        device = response
        return home()

    if selected_option == "info":
        return info()

    if selected_option == "disconnect":
        jwt_key = None
        device = None
        return index()


def index(error=None):
    global jwt_key
    global device

    menu_options = {
        "create": "Create new device",
        "insert": "Use existing",
        "exit": "Exit",
    }
    message = """Welcome to FeedApp IoT Device simulation.\nPlease select an option to continue:"""
    selected_option = curses.wrapper(menu.run_menu, menu_options, message, 3, error)

    if selected_option == "create":
        response, error = curses.wrapper(service.create)

        if error is not None:
            return index(error)

        jwt_key = response

        response, error = curses.wrapper(service.get_device, jwt_key)

        if error is not None:
            return index(error)

        device = response
        return home()

    if selected_option == "insert":
        jwt_key = curses.wrapper(input.run_input, "Please type a valid JWT token")

        response, error = curses.wrapper(service.get_device, jwt_key)

        if error is not None:
            return index(error)

        device = response

        return home()

    if selected_option == "exit":
        return exit()


def main():
    index()


if __name__ == "__main__":
    main()
