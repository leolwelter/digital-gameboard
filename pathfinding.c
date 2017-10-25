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

#define coltot 19
#define rowtot 19


void pathFinding()
{
	if((map.mapSizeX < 19) || (map.cList[map.turn].posX < 9))//adjust x (may need this to change)
	{
		map.movementOffX = 0;
	}
	else if(map.cList[map.turn].posX + 9 > map.mapSizeX)
	{
		map.movementOffX = map.mapSizeX - 19;
	}
	else
	{
		map.movementOffX = map.cList[map.turn].posX - 9;
	}

	if((map.mapSizeY < 19) || (map.cList[map.turn].posY < 9))//adjust y
	{
		map.movementOffY = 0;
	}
	else if(map.cList[map.turn].posY + 9 > map.mapSizeY)
	{
		map.movementOffY = map.mapSizeY - 19;
	}
	else
	{
		map.movementOffY = map.cList[map.turn].posY - 9;
	}
	for(uint8_t i = 0; i < 19; i++)
	{
		for(uint8_t j = 0; j < 19; j++)
		{
			map.movement[i][j] = 3;
		}
	}


	pathFindingRecursion(map.cList[map.turn].posX,map.cList[map.turn].posY,1);
}

uint8_t min(uint8_t a, uint8_t b)
{
	return ((a < b) ? a : b);
}

void pathFindingRecursion(uint8_t x, uint8_t y, uint8_t start)
{
	int framecost = map.map[x][y]&3;
	if (!start) { 																// first position must have XXXXXX11 for character position
		if (map.map[x][y] == 3) return;
		if (map.cList[map.turn].moveRem == 0 || map.cList[map.turn].moveRem - (map.map[x][y] & 3) < 0) return;

		map.cList[map.turn].moveRem -= map.map[x][y] & 3;
		map.cList[map.turn].moveSpent += map.map[x][y] & 3;
		map.map[x][y] = 255;

		map.movement[x-map.movementOffX][y-map.movementOffY] = min(map.movement[x][y], map.cList[map.turn].moveSpent);
	}
	//left
	if (x > map.movementOffX)
	{
		pathFindingRecursion(x - 1, y, 0);
	}
	//up
	if (y > map.movementOffY)
	{
		pathFindingRecursion(x , y - 1, 0);
	}
	//right
	if (x < map.movementOffX + coltot - 1)
	{
		pathFindingRecursion(x + 1, y, 0);
	}
	//down
	if (y < map.movementOffY + rowtot - 1)
	{
		pathFindingRecursion(x, y + 1, 0);
	}
	if (!start)
	{
		map.map[x][y] = map.map[x][y] & framecost;
		map.cList[map.turn].moveSpent -= framecost;
		map.cList[map.turn].moveRem += framecost;
	}
	return;
}
