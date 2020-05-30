import requests
import time
import csv
from bs4 import BeautifulSoup
import datetime
import courseGraph

courseHome = 'https://www.wpi.edu/academics/calendar-courses/course-descriptions'
wpiURL = 'https://www.wpi.edu'
response = requests.get(courseHome, timeout = 5)
response.encoding = 'utf-8'
soup = BeautifulSoup(response.text, "html.parser")
departmentButtons = soup.findAll("a", {"class": "button"})
departmentLinks = []
for button in departmentButtons:
	departmentLinks.append(wpiURL + str(button['href']))
	#departmentLinks.append(button.findAll("href"))
courseSet = set()
for link in departmentLinks:
	response = requests.get(link, timeout = 5)
	response.encoding = 'utf-8'
	soup = BeautifulSoup(response.text, "html.parser")
	courses = soup.findAll("div", {"class": "item-list"})
	print(courses)
	for course in courses:
		print()
	break