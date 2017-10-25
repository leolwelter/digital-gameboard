
class Color:
	MAX_COLOR_VAL  = 3
	def __init__(self, red = 0, green = 0, blue = 0):
		if (red > Color.MAX_COLOR_VAL):
			red = 0
		if (green > Color.MAX_COLOR_VAL):
			green = 0
		if (blue > Color.MAX_COLOR_VAL):
			blue = 0
		self.red = red
		self.green = green
		self.blue = blue
		
	def getRed(self):
		return self.red
	def getGreen(self):
		return self.green
	def getBlue(self):
		return self.blue
