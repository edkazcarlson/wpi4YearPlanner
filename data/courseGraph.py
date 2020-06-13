import re
import json
import os
class courseNode:
	fileRoot = 'courseData/'
	#returns a list of required classes in the tuple (department, level), cat is returned as a boolean, true being cat1
	@staticmethod
	def parseDesc(description):
		splitDesc = re.split("Recommended background:", description)
		reqToReturn = []
		cat = True
		startYear = -1
		if len(splitDesc) > 1: #are pre-reqs
			preReqs = re.findall('[A-Z]{2,4}\s*[0-9]{3}[X][^-]|[A-Z]{2,4}\s*[0-9]{4}[^-]|[A-Z]{2,4}\s*[0-9]{3}[^-]|[A-Z]{2,4}\s*[0-9]{2}[X][^-]',splitDesc[1])
			for req in preReqs:
				dept = re.findall('[a-zA-Z]{2,4}', req)
				level = re.findall('[0-9]{3}[X]|[0-9]{4}', req)
				reqToReturn.append((dept,level))
		catRE = re.findall('Cat.*\s*[I]+\s', splitDesc[0])
		if len(catRE) > 0: #if cat is specified
			cat =  len(re.findall('I',catRE[0])) == 1
			print('cat: ', cat)
			if not	cat: #if its cat II
				startYearSection = re.findall("offered in 20[0-2][0-9]", description)
				if len(startYearSection) > 0:
					startYear = re.findall('20[0-2][0-9]', startYearSection[0])
					startYear = startYear[0].split('-')[0]
		return reqToReturn, cat, startYear
	def __init__(self, courseTitle, courseLevel, deptAbbrev, description):
		self.courseTitle, self.courseLevel, self.deptAbbrev,  self.description = courseTitle, courseLevel, deptAbbrev, description
		self.requirements, self.isCatOne, self.startYear = self.parseDesc(description)
	def toJson(self):
		toJsonDict = {"title": self.courseTitle,
					"level": self.courseLevel,
					"abbreviation": self.deptAbbrev,
					"description": self.description,
					"req": self.requirements,
					"cat1Status": self.isCatOne,
					"startYear": self.startYear}
		print(toJsonDict)
		jsonForm = json.dumps(toJsonDict)
		with open('courseData/' + str(self.deptAbbrev) + str(self.courseLevel) + '.json', 'w') as outfile:
			json.dump(jsonForm, outfile)
	
#c = courseNode(1, 1, 1, 'Cat. II Algorithms and programming techniques from artificial intelligence (AI) are key contributors to the experience of modern computer games and interactive media, either by directly controlling a non-player character (NPC) or through more subtle manipulation of the environment. This course will focus on the practical AI programming techniques currently used in computer games for NPC navigation and decision-making, along with the design issues that arise when AI is applied in computer games, such as believability and real-time performance. The course will also briefly discuss future directions in applying AI to games and media. Students will be expected to complete significant software development projects using the studied techniques. Recommended background: object-oriented design concepts (CS 2102), algorithms (CS 2223), and knowledge of technical game development (IMGD 3000). This course will be offered in 2016-17, and in alternating years thereafter.')
