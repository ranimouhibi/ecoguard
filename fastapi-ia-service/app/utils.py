temperature_history = []
noise_history = []

def add_data(temp, noise):
    temperature_history.append(temp)
    noise_history.append(noise)

    if len(temperature_history) > 100:
        temperature_history.pop(0)
    if len(noise_history) > 100:
        noise_history.pop(0)

    return temperature_history, noise_history