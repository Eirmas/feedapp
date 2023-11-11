import curses


def run_input(stdscr, title):
    stdscr.clear()

    stdscr.addstr(0, 0, title)
    y = 2

    stdscr.addstr(y, 0, "> ")
    curses.echo()
    curses.curs_set(1)

    stdscr.move(y, 2)

    user_input = stdscr.getstr().decode().strip()

    curses.noecho()
    curses.curs_set(0)
    stdscr.refresh()

    return user_input
