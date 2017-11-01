/**
  ******************************************************************************
  * File Name          : uart_receive.c
  * Description        : uart receive functions
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
//#include "main.c"
//#include "stm32f7xx_hal.h"


//extern Map map;
extern UART_HandleTypeDef huart5;
uint8_t RXData[256] ={};

uint8_t mapReceive()
{
	uint8_t x = 0;
	uint8_t y = 0;

	if(HAL_UART_Receive(&huart5, RXData, 2, 100) == 0)
	{
		x = RXData[0];
		map.mapSizeX = x;
		y = RXData[1];
		map.mapSizeY = y;
		map.focusX = 0;
		map.focusY = 0;
	}
	else return 1;
	for(uint8_t i = 0; i < y; i++){
		if(HAL_UART_Receive(&huart5, RXData, x, x * 8 / 5) == 0)
		{
			for(uint8_t j = 0; j < x; j++)
			{
				map.map[j][i] = RXData[j];
			}
		}
		else
		{
			return 1;
		}
	}
	drawMap();
	return 0;
}


uint8_t characterReceive()
{
	if(HAL_UART_Receive(&huart5, RXData, 5, 100) == 0)
	{
		map.cList[RXData[0]].posX = RXData[1];
		map.cList[RXData[0]].posY = RXData[2];
		map.cList[RXData[0]].Speed = RXData[4];
		map.cList[RXData[0]].color	= RXData[3];
		//put in room if possible
	}
	else
	{
		return 2;
	}
	drawMap();
	return 0;
}


uint8_t itemReceive()
{
	if(HAL_UART_Receive(&huart5, RXData, 3, 10) == 0)
	{
		map.iList[RXData[0]].posX = RXData[1];
		map.iList[RXData[0]].posY = RXData[2];
		map.iList[RXData[0]].valid = 1;
		//put in room if possible??
	}
	else
	{
		return 3;
	}
	drawMap();
	return 0;
}

uint8_t roomReceive()
{
	if(HAL_UART_Receive(&huart5, RXData, 5, 100) == 0)
	{
		map.rList[RXData[0]].posX1 = RXData[1];
		map.rList[RXData[0]].posY1 = RXData[2];
		map.rList[RXData[0]].posX2 = RXData[3];
		map.rList[RXData[0]].posY2 = RXData[4];
	}
	else
	{
		return 4;
	}
	drawMap();
	return 0;
}

uint8_t characterRemove()
{
	if(HAL_UART_Receive(&huart5, RXData, 1, 100) == 0)
	{
		if(RXData[0] == 255)
		{
			for(uint8_t i = 0; i < 255; i++)
			{
				map.cList[i].Speed = 0;
				map.cList[i].posX = 0;
				map.cList[i].posY = 0;
				map.cList[i].color = 0;
				map.cList[i].room = 0;
			}
		}
		else if(RXData[0] < 255)
		{
			map.cList[RXData[0]].Speed = 0;
			map.cList[RXData[0]].posX = 0;
			map.cList[RXData[0]].posY = 0;
			map.cList[RXData[0]].color = 0;
			map.cList[RXData[0]].room = 0;
		}
	}
	else
	{
		return 17;
	}
	drawMap();
	return 0;
}

uint8_t itemRemove()
{
	if(HAL_UART_Receive(&huart5, RXData, 1, 100) == 0)
	{
		if(RXData[0] == 255)
		{
			for(uint8_t i = 0; i < 255; i++)
			{
				map.iList[i].posX = 0;
				map.iList[i].posY = 0;
				map.iList[i].valid = 0;
			}
		}
		else if(RXData[0] < 255)
		{
			map.iList[RXData[0]].posX = 0;
			map.iList[RXData[0]].posY = 0;
			map.iList[RXData[0]].valid = 0;
		}
	}
	else
	{
		return 18;
	}
	drawMap();
	return 0;
}

uint8_t roomRemove()
{
	if(HAL_UART_Receive(&huart5, RXData, 1, 100) == 0)
	{
		if(RXData[0] == 255)
		{
			for(uint8_t i = 0; i < 255; i++)
			{
				map.rList[i].posX1 = 0;
				map.rList[i].posY1 = 0;
				map.rList[i].posX2 = 0;
				map.rList[i].posY2 = 0;
			}
		}
		else if(RXData[0] < 255)
		{
			map.rList[RXData[0]].posX1 = 0;
			map.rList[RXData[0]].posY1 = 0;
			map.rList[RXData[0]].posX2 = 0;
			map.rList[RXData[0]].posY2 = 0;
		}
	}
	else
	{
		return 19;
	}
	drawMap();
	return 0;
}

uint8_t nextPlayer()
{
	if(HAL_UART_Receive(&huart5, RXData, 1, 100) == 0)
	{
		if(RXData[0] > 254)
		{
			map.turn = 255;
			return 0;
		}
		else
		{
			map.turn = RXData[0];
			map.cList[map.turn].moveRem = map.cList[map.turn].Speed;
			recenter(map.cList[map.turn].posX-4,map.cList[map.turn].posY-4); //CHANGE THIS IF PLAYER NEEDS MOVED
			return 0;
		}
	}
	else
	{
		return 33;
	}
}

uint8_t centerMap()
{
	if(HAL_UART_Receive(&huart5, RXData, 2, 100) == 0)
	{
		recenter(RXData[0], RXData[1]);
		return 0;
	}
	else
	{
		return 34;
	}
}

uint8_t scrollMap()
{
	if(HAL_UART_Receive(&huart5, RXData, 1, 100) == 0)
	{
		scroll(RXData[0]);
		return 0;
	}
	else
	{
		return 35;
	}
}

uint8_t loadImage()
{
	for(uint8_t i = 0; i < 10; i++){
		if(HAL_UART_Receive(&huart5, RXData, 30, 100) == 0)
		{
			for(uint8_t j = 0; j < 30; j++)
			{
				image[i*10 + j/3][1] = RXData[j];
				image[i*10 + j/3][2] = RXData[j];
				image[i*10 + j/3][3] = RXData[j];
			}
		}
		else
		{
			return 49;
		}
	}
//	drawImage(); wait to draw until draw image command
	return 0;
}


uint8_t uartReceive()
{
	if(HAL_UART_Receive(&huart5, RXData, 1, 100) == 0)
	{
		if(RXData[0] == 1)								//00000001 is map Receive
		{
			return mapReceive();
		}
		if(RXData[0] == 2)								//00000010 is character receive
		{
			return characterReceive();
		}
		if(RXData[0] == 3)								//00000011 is item receive
		{
			return itemReceive();
		}
		if(RXData[0] == 4)								//00000100 is item receive
		{
			return roomReceive();
		}
		if(RXData[0] == 17)								//00010001 is character remove
		{
			return characterRemove();
		}
		if(RXData[0] == 18)								//00010010 is item remove
		{
			return itemRemove();
		}
		if(RXData[0] == 19)
		{
			return roomRemove();
		}
		if(RXData[0] == 33)								//00100001 is next player assignment
		{
			return nextPlayer();
		}
		if(RXData[0] == 34)								//00100010is recenter map
		{
			return centerMap();
		}
		if(RXData[0] == 35)								//00100011 is scroll map
		{
			return scrollMap();
		}
		if(RXData[0] == 49)								//00110001 is load an image
		{
			return loadImage();
		}
		if(RXData[0] == 50)								//00110010 is draw the image
		{
			drawImage();
			return 0;
		}
		return 255;
	}
	return 254;		//Timed out
}

