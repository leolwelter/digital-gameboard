
from color import Color

class Creature:
	MAX_CREATURE_ID = 255
	MAX_MOVEMENT = 255
	
	_creatureID = 0
	
	def __init__(self, name, movement = MAX_MOVEMENT, color = Color(3,0,0), x=0, y=0, **kwargs):
		self.creatureID = Creature._creatureID
		if (Creature._creatureID == Creature.MAX_CREATURE_ID):
			Creature._creatureID = 0
		else:
			Creature._creatureID += 1
		self.name = name
		if movement > Creature.MAX_MOVEMENT:
			movement = 0
		self.movement = movement
		self.color = color
		self.x = x
		self.y = y
		#~ for (prop, default) in defaults.items():
			#~ setattr(self, prop, kwargs.get(prop, default))
		
	def colorVal(self):
		byteVal = self.color.getRed() * 64
		byteVal += self.color.getGreen() * 16
		byteVal += self.color.getBlue() * 4
		if byteVal == 0:
			byteVal = 3
		return byteVal
		
	def printCreature(self):
		print(self.name, self.movement, self.colorVal())
