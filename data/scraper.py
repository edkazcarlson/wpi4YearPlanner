import requests
import time
import csv
from bs4 import BeautifulSoup
import datetime
import courseGraph
import re
import os
import json

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
	for course in courses:
		courseh3 = course.find("h3").text
		print(courseh3)
		courseID = re.findall('[a-zA-Z]{2,4}\s*[0-9]{3}[X]|[a-zA-Z]{2,4}\s*[0-9]{4}|[a-zA-Z]{2,4}\s*[0-9]{3}|[a-zA-Z]{2,4}\s*[0-9]{2}[X]', courseh3)
		courseID = courseID[0]
		courseTitle = courseh3[len(courseID)+2:]
		courseDesc = course.find("div", {"class": "field-content"}).text
		courseLevel = courseID.split(" ")[1]
		deptAbbrev =  courseID.split(" ")[0]
		c = courseGraph.courseNode(courseTitle, courseLevel, deptAbbrev, courseDesc)
		c.toJson()
fileList = os.listdir('courseData')
masterDict = {}
for file in fileList:
	with open ('courseData' + '/' + file) as jsonFile:
		masterDict[file] = json.loads(json.load(jsonFile))
with open('allCourses.json', 'w') as outfile:
	json.dump(masterDict, outfile)
