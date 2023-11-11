import time

keep_spinning = False


def show_spinner(stdscr, message):
    stdscr.clear()
    h, w = stdscr.getmaxyx()
    x = w // 2
    y = h // 2

    spinner = ["|", "/", "-", "\\"]
    stdscr.addstr(y - 1, x - len(message) // 2, message)

    while keep_spinning is True:
        for symbol in spinner:
            stdscr.addstr(y, x, symbol)
            stdscr.refresh()
            time.sleep(0.25)
            if keep_spinning is False:
                break
