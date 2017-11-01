/**
  ******************************************************************************
  * File Name          : pathfinding.c
  * Description        : pathfinding code
  ******************************************************************************
  ** This notice applies to any and all portions of this file
  * that are not between comment pairs USER CODE BEGIN and
  * USER CODE END. Other portions of this file, whether 
  * inserted by the user or by software development tools
  * are owned by their respective copyright owners.
  *
  * COPYRIGHT(c) 2017 STMicroelectronics
  *
  * Redistribution and use in source and binary forms, with or without modification,
  * are permitted provided that the following conditions are met:
  *   1. Redistributions of source code must retain the above copyright notice,
  *      this list of conditions and the following disclaimer.
  *   2. Redistributions in binary form must reproduce the above copyright notice,
  *      this list of conditions and the following disclaimer in the documentation
  *      and/or other materials provided with the distribution.
  *   3. Neither the name of STMicroelectronics nor the names of its contributors
  *      may be used to endorse or promote products derived from this software
  *      without specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *
  ******************************************************************************
  */

#include "../Inc/main.h"

#define COLTOT 10
#define ROWTOT 10

void pathFindingRecursion(uint8_t x, uint8_t y, uint8_t remMovement);

void pathFinding()
{

	for(uint8_t i = 0; i < 10; i++)
	{
		for(uint8_t j = 0; j < 10; j++)
		{
			map.movement[i][j] = 255;
		}
	}
	for (uint8_t i = 0; i < 255; i ++)
	{
		uint8_t enemy = ((map.cList[i].color & 3) == 2);
		if (enemy)
		{
			map.movement[map.cList[i].posX][map.cList[i].posY] = 254;
		}
	}
//	map.movement[map.cList[map.turn].posX][map.cList[map.turn].posX] = map.cList[map.turn].moveRem;
	pathFindingRecursion(map.cList[map.turn].posX,map.cList[map.turn].posY, map.cList[map.turn].moveRem);
//	pathFindingRecursion(map.cList[map.turn].posX,map.cList[map.turn].posY, 5);
	map.pathFlag = 1;
	for (uint8_t i = 0; i < 255; i ++)
	{
		uint8_t human = ((map.cList[i].color & 3) == 1);
		if (human)
		{
			map.movement[map.cList[i].posX][map.cList[i].posY] = 255;
		}
	}

	drawMap();
}


void pathFindingRecursion(uint8_t x, uint8_t y, uint8_t remMovement)
{
	uint8_t cost = map.map[x][y]&3;
	if(cost == 3 || cost == 0)
	{
		return;
	}
	if(map.movement[x][y] != 255 && map.movement[x][y] >= remMovement)	//anything > 200 should work for obstacles
	{
		return;
	}
	map.movement[x][y] = remMovement;
	//left
	if ((x > map.focusX) && (remMovement >= (map.map[x-1][y] & 3)))
	{
		pathFindingRecursion(x - 1, y, remMovement - (map.map[x-1][y] & 3));
	}
	//up
	if ((y > map.focusY) && (remMovement >= (map.map[x][y-1] & 3)))
	{
		pathFindingRecursion(x, y - 1, remMovement - (map.map[x][y-1] & 3));
	}
	//right
	if ((x < map.focusX + COLTOT - 1) && (remMovement >= (map.map[x+1][y] & 3)))
	{
		pathFindingRecursion(x + 1, y, remMovement - (map.map[x+1][y] & 3));
	}
	//down
	if ((y < map.focusY + ROWTOT - 1) && (remMovement >= (map.map[x][y + 1] & 3)))
	{
		pathFindingRecursion(x, y + 1, remMovement - (map.map[x][y+1] & 3));
	}
	return;
}
