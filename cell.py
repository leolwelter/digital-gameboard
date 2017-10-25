
from color import Color
from creature import Creature

class Cell:
	MAX_MOVEMENT_COST = 2
	
	def __init__(self, cost, color, **kwargs):
		defaults = {
			"creature": None,
			"items": None
			}
		if (cost > Cell.MAX_MOVEMENT_COST):
			cost = 0
		self.color = color
		self.cost = cost
		for (prop, default) in defaults.items():
			setattr(self, prop, kwargs.get(prop, default))
			
	def printCell(self):
		print(self.cost, self.color.getRed(), self.color.getGreen(), self.color.getBlue())

	def toByteStruct(self):
		byteVal = self.color.getRed() * 64
		byteVal += self.color.getGreen() * 16
		byteVal += self.color.getBlue() * 4
		byteVal += self.cost
		return byteVal
