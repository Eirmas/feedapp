def log_message(message, log_file="iot-device/debug.log"):
    with open(log_file, "a") as file:
        file.write(str(message) + "\n")