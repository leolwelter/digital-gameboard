
class Item:
	MAX_ITEM_ID = 63
	
	_itemID = 0
	
	__init__(name,x=0,y=0):
		self.itemID = Item._itemID
		if Item._itemID < Item.MAX_ITEM_ID:
			Item._itemID += 1
		else:
			Item._itemID = 0
		self.x = x
		self.y = y
