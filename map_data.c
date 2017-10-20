/**
  ******************************************************************************
  * File Name          : map_data.c
  * Description        : map manipulation functions
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


extern uint8_t done;
extern TIM_HandleTypeDef htim3;
extern TIM_HandleTypeDef htim6;
uint32_t colors [100];					//keeps track of led colors



void setColor(uint32_t R, uint32_t G, uint32_t B, uint8_t index)
{
	if (R > 15)
	{
		R = 15;
	}
	if (G > 15)
	{
		G = 15;
	}
	if (B > 15)
	{
		B = 15;
	}
	colors[index] = (R << 16) | (G << 8) | (B);
}
void recenter()
{
	map.focusX ++;
	if(map.focusX > map.mapSizeX-10)
	{
		map.focusY++;
		map.focusX = 0;
	}
	if(map.focusY > map.mapSizeY-10)
	{
		map.focusY = 0;
	}
}

void LEDinit()
{
	uint8_t i = 0;
	map.mapSizeX = 11;
	map.mapSizeY = 11;
	map.focusX = 0;
	map.cList[0].color = 20;
	map.cList[0].posX = 1;
	map.cList[0].posY = 1;
	map.iList[0].posX = 2;
	map.iList[0].posY = 1;
	map.iList[0].valid = 1;
	map.focusY = 0;
	for(i = 0; i<121; i ++)
	{
		if(i<11 || i >= 109 || i%11 == 0 || i %11 == 10)
		{
			map.map[i%11][i/11] = 84;
		}
		else if(i%2)
		{
			map.map[i%11][i/11] = 128;
		}
		else map.map[i%11][i/11] = 0;
	}
}

uint32_t colorConverter(uint32_t color)
{
	if(color >= 3)
	{
		color = 15;
	}
	else if(color == 2)
	{
		color = 7;
	}
	else if(color == 1)
	{
		color = 3;
	}
	else{color = 0;}
	return color;
}

void drawMap()
{
	done = 0;
	int i;
	int j;
	uint32_t R;
	uint32_t G;
	uint32_t B;
	for(i = 0; i<10; i++)
	{
		for(j = 0; j < 10; j ++)
		{
			R = colorConverter((map.map[j+map.focusX][i+map.focusY]&192)>>6);
			G = colorConverter((map.map[j+map.focusX][i+map.focusY]&48)>>4);
			B = colorConverter((map.map[j+map.focusX][i+map.focusY]&12)>>2);
			setColor(R,G,B,i*10 + j);
		}
	}
	uint8_t xCord;
	uint8_t yCord;
	for(i = 0; i < 64; i++)
	{
		if(map.iList[i].valid)
		{
			xCord = map.iList[i].posX;
			yCord = map.iList[i].posY;
			if(xCord >= map.focusX && xCord < 10 + map.focusX)
			{
				if(yCord >= map.focusY && yCord < 10 + map.focusY)
				{
					setColor(15,15,0,(yCord-map.focusY)*10 + (xCord-map.focusX));	//set cell to gold if item is there
				}
			}
		}
	}
	for(i = 0; i < 64; i++)
	{
		if(map.cList[i].color !=0)
		{
			xCord = map.cList[i].posX;
			yCord = map.cList[i].posY;
			if(xCord >= map.focusX && xCord < 10 + map.focusX)
			{
				if(yCord >= map.focusY && yCord < 10 + map.focusY)
				{
					R = colorConverter((map.cList[i].color&192)>>6);
					G = colorConverter((map.cList[i].color&48)>>4);
					B = colorConverter((map.cList[i].color&12)>>2);
					setColor(R,G,B,(yCord-map.focusY)*10 + (xCord-map.focusX));		//set cell to char color if char is there
				}
			}
		}
	}
	HAL_TIM_Base_Stop_IT(&htim6);
	//TIM_ClearITPendingBit( TIM3,  );

	//HAL_TIM_Base_Start(&htim3);
	HAL_TIM_Base_Start_IT(&htim3);
}
