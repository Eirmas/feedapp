import curses


def print_menu(stdscr, selected_row_idx, menu_options, menu_title, y, error):
    stdscr.clear()

    if menu_title:
        stdscr.addstr(0, 0, menu_title)

    for idx, key in enumerate(menu_options):
        if idx == selected_row_idx:
            stdscr.attron(curses.color_pair(1))
            stdscr.addstr(y, 0, "[x] " + menu_options[key])
            stdscr.attroff(curses.color_pair(1))
        else:
            stdscr.addstr(y, 0, "[ ] " + menu_options[key])
        y += 1
    if error:
        y += 1
        stdscr.addstr(
            y, 0, f"Error(s): {', '.join(error) if isinstance(error, list) else error}"
        )

    stdscr.refresh()


def run_menu(stdscr, menu_options, menu_title=None, y=0, error=None):
    curses.curs_set(0)
    curses.init_pair(1, curses.COLOR_BLACK, curses.COLOR_WHITE)
    current_row = 0

    print_menu(stdscr, current_row, menu_options, menu_title, y, error)

    while True:
        key = stdscr.getch()

        if key == curses.KEY_UP:
            current_row = (current_row - 1) % len(menu_options)
        elif key == curses.KEY_DOWN:
            current_row = (current_row + 1) % len(menu_options)
        elif key == curses.KEY_ENTER or key in [10, 13]:
            stdscr.clear()
            return list(menu_options.keys())[current_row]

        print_menu(stdscr, current_row, menu_options, menu_title, y, error)
