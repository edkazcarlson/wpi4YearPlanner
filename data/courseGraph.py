import re
class courseNode:
	#returns a list of required classes in the tuple (department, level), cat is returned as a boolean, true being cat1
	@staticmethod
	def parseDes(description):
		splitDesc = re.split("Recommended background:", description)
		preReqs = re.findall('[a-zA-Z]{2,4}\s*[0-9]{3}[X]|[a-zA-Z]{2,4}\s*[0-9]{4}',splitDesc[1])
		reqToReturn = []
		for req in preReqs:
			dept = re.findall('[a-zA-Z]{2,4}', req)
			level = re.findall('[0-9]{3}[X]|[0-9]{4}', req)
			reqToReturn.append((dept,level))
		
		cat = re.findall('Cat.*\s*[I]+', splitDesc[0])
		cat =  len(re.findall('I',cat[0])) == 1
		return reqToReturn, cat
	def __init__(self, courseTitle, courseLevel, deptAbbrev, description):
		self.courseTitle, self.courseLevel, self.deptAbbrev,  self.description = courseTitle, courseLevel, deptAbbrev,description
		self.requirements, self.isCatOne = self.parseDes(description)
		print(self.requirements)
		print(self.isCatOne)
	
c = courseNode(1,1,1,'Cat I This course introduces the ambient atmospheric and space environments encountered by aerospace vehicles. Topics include: the sun and solar activity; the solar wind; planetary magnetospheres; planetary atmospheres; radiation environments; galactic cosmic rays; meteoroids; and space debris. Recommended background: mechanics (PH1110 / 1111 or equivalent), electromagnetism (PH 1120 / 1121 or equivalent), and ordinary differential equations (MA 2051 or equivalent).')
