import os
import json
fileList = os.listdir('courseData')
masterJS = 'export function courseData() { return ['
first = True
for file in fileList:
    with open ('courseData' + '/' + file) as jsonFile:
        thisDict = json.load(jsonFile)
        if first:
            first = False
        else:
            masterJS += ","
        masterJS += "{" +"\"courseTitle\":\"{}{} {}\"".format(thisDict['abbreviation'],thisDict['level'],thisDict['title'])
        masterJS += ", \"coureAbbreviation\":\"{}\"".format(thisDict['abbreviation'])
        masterJS += "}"
masterJS += "]}"


with open('reactGetCourses.js', 'w') as outfile:
    outfile.write(masterJS) 
