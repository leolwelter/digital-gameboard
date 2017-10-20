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

	if(HAL_UART_Receive(&huart5, RXData, 2, 1000) == 0)
	{
		x = RXData[0];
		map.mapSizeX = x;
		y = RXData[1];
		map.mapSizeY = y;
		map.focusX = 0;
		map.focusY = 0;
	}
	else return 0;
	for(uint8_t i = 0; i < y; i++){
		if(HAL_UART_Receive(&huart5, RXData, x, 1000) == 0)
		{
			for(uint8_t j = 0; j < x; j++)
			{
				map.map[i][j] = RXData[i];
			}
		}
		else
		{
			return 1;
		}
	}
	drawMap();
	return 1;
}


uint8_t characterReceive()
{
	if(HAL_UART_Receive(&huart5, RXData, 5, 1000) == 0)
	{
		map.cList[RXData[0]].posX = RXData[1];
		map.cList[RXData[0]].posY = RXData[2];
		map.cList[RXData[0]].Speed = RXData[4];
		map.cList[RXData[0]].color	= RXData[3];
	}
	else
	{
		return 0;
	}
	drawMap();
	return 1;
}


uint8_t itemReceive()
{
	if(HAL_UART_Receive(&huart5, RXData, 3, 1000) == 0)
	{
		map.iList[RXData[0]].posX = RXData[1];
		map.iList[RXData[0]].posY = RXData[2];
	}
	else
	{
		return 0;
	}
	drawMap();
	return 1;
}

uint8_t characterRemove()
{
	if(HAL_UART_Receive(&huart5, RXData, 1, 1000) == 0)
	{
		if(RXData[0] == 255)
		{
			for(uint8_t i = 0; i < 64; i++)
			{
				map.cList[i].Speed = 0;
				map.cList[i].posX = 0;
				map.cList[i].posY = 0;
				map.cList[i].color = 0;
//				memset(map.chars, 0, sizeof(map.chars));
			}
		}
		else if(RXData[0] < 64)
		{
//			map.chars[map.cList[RXData[0]].posX][map.cList[RXData[0]].posY] = 0;
			map.cList[RXData[0]].Speed = 0;
			map.cList[RXData[0]].posX = 0;
			map.cList[RXData[0]].posY = 0;
			map.cList[RXData[0]].color = 0;

		}
	}
	else
	{
		return 0;
	}
	drawMap();
	return 1;
}

uint8_t itemRemove()
{
	if(HAL_UART_Receive(&huart5, RXData, 1, 1000) == 0)
	{
		if(RXData[0] == 255)
		{
			for(uint8_t i = 0; i < 64; i++)
			{
				map.iList[i].posX = 0;
				map.iList[i].posY = 0;
			}
		}
		else if(RXData[0] < 64)
		{
			//map.items[map.iList[RXData[0]].posX][map.iList[RXData[0]].posY] = 0;
			map.iList[RXData[0]].posX = 0;
			map.iList[RXData[0]].posY = 0;
		}
	}
	else
	{
		return 0;
	}
	drawMap();
	return 1;
}


uint8_t uartReceive()
{
	if(HAL_UART_Receive(&huart5, RXData, 1, 1000) == 0)
	{
		if(RXData[0] == 1)								//00000001 is map Receive
		{
			if(!mapReceive())
			{
				return 0;
			}
			return 1;
		}
		if(RXData[0] == 2)								//00000010 is character receive
		{
			if(!characterReceive())
			{
				return 0;
			}
			return 1;
		}
		if(RXData[0] == 3)								//00000011 is item receive
		{
			if(!itemReceive())
			{
				return 0;
			}
			return 1;
		}
		if(RXData[0] == 17)								//00010001 is character remove
		{
			if(!characterRemove())
			{
				return 0;
			}
			return 1;
		}
		if(RXData[0] == 18)								//00010010 is item remove
		{
			if(!itemRemove())
			{
				return 0;
			}
			return 1;
		}
		return 0;
	}
	return 1;
}

