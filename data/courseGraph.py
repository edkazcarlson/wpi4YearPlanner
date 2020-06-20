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
		if len(splitDesc) > 1: 
			if splitDesc[1].find("none") != 0 and splitDesc[1].find("none") != 1: #are pre-reqs
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
		toJsonDict = {'title': self.courseTitle,
					'level': self.courseLevel,
					'abbreviation': self.deptAbbrev,
					'description': self.description,
					'req': self.requirements,
					'cat1Status': self.isCatOne,
					'startYear': self.startYear}
		with open('courseData/' + str(self.deptAbbrev) + str(self.courseLevel) + '.json', 'w') as outfile:
			json.dump(toJsonDict, outfile)
	
# c = courseNode('INTRODUCTION TO PROGRAM DESIGN', 1101, 'CS', 
# 'This course introduces principles of computation and programming with an emphasis on program design. Topics include the design, implementation and testing of programs that use a variety of data structures (such as structures, lists, and trees), functions, conditionals, recursion and higher-­‐order functions. Students will be expected to design simple data models, and implement and debug programs in a functional programming language. Recommended background: none. Either CS 1101 or CS 1102 provides sufficient background for further courses in the CS department. Undergraduate credit may not be earned for both this course and CS 1102.')
# c.toJson()