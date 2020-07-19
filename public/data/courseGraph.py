import re
import json
import os
class courseNode:
	fileRoot = 'courseData/'
	#returns a list of required classes in the tuple (department, level), cat is returned as a boolean, true being cat1
	@staticmethod
	def parseDesc(description):
		splitDesc = re.findall(r"Recommended background:.*\.", description)
		print(splitDesc)
		reqToReturn = []
		cat = True
		startYear = -1
		if len(splitDesc) > 0: 
			if splitDesc[0].find("none") != 0 and splitDesc[0].find("none") != 1: #are pre-reqs
				preReqs = re.findall('[A-Z]{2,4}\s*[0-9]{3}[X][^-]|[A-Z]{2,4}\s*[0-9]{4}[^-]|[A-Z]{2,4}\s*[0-9]{3}[^-]|[A-Z]{2,4}\s*[0-9]{2}[X][^-]',
					splitDesc[0])
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
	
c = courseNode('INTRODUCTION TO PROGRAM DESIGN', 1101, 'CS', 
'Cat. II This course provides an introduction to Knowledge Discovery in Databases (KDD) and Data Mining. KDD deals with data integration techniques and with the discovery, interpretation and visualization of patterns in large collections of data. Topics covered in this course include data warehousing and mediation techniques; data mining methods such as rule-based learning, decision trees, association rules and sequence mining; and data visualization. The work discussed originates in the fields of artificial intelligence, machine learning, statistical data analysis, data visualization, databases, and information retrieval. Several scientific and industrial applications of KDD will be studied. Recommended background: MA 2611, CS 2223, and CS 3431, or CS 3733. This course will be offered in 2016-17, and in alternating years thereafter.')
c.toJson()