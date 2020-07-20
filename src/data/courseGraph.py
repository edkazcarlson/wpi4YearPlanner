import re
import json
import os
class courseNode:
	fileRoot = 'courseData/'
	#returns a list of required classes in the tuple (department, level), cat is returned as a boolean, true being cat1
	@staticmethod
	def parseDesc(description):
		splitDesc = re.findall(r"Recommended background:.*\.", description)
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
		catRE = re.findall('Cat.*\s*[I]+\s', description)
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
# 'Cat. I This course provides an introduction to differentiation and its applications. Topics covered include: functions and their graphs, limits, continuity, differentiation, linear approximation, chain rule, min/max problems, and applications of derivatives. Recommended background: Algebra, trigonometry and analytic geometry. Although the course will make use of computers, no programming experience is assumed. Students may not receive credit for both MA 1021 and MA 1020.')
# c.toJson()