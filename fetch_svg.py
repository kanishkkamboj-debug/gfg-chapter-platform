import urllib.request

url = "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/geeksforgeeks.svg"
try:
    with urllib.request.urlopen(url) as response:
        svg = response.read().decode('utf-8')
        print(svg)
except Exception as e:
    print("Error:", e)
