import requests

def get_exchange_rate():
    url = "https://api.frankfurter.app/latest?from=USD&to=JPY"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        rate = data['rates']['JPY']
        print(f"USD/JPY Exchange Rate: {rate}")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching exchange rate: {e}")

if __name__ == "__main__":
    get_exchange_rate()
