/**
  ******************************************************************************
  * @file    stm32f7xx_it.c
  * @brief   Interrupt Service Routines.
  ******************************************************************************
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
/* Includes ------------------------------------------------------------------*/
#include "stm32f7xx_hal.h"
#include "stm32f7xx.h"
#include "stm32f7xx_it.h"

/* USER CODE BEGIN 0 */

extern uint8_t NUM_LEDS;
//extern void randomLEDS(void);

uint8_t start = 0;
uint32_t bitPos = 0x800000;
uint8_t column = 0;
uint8_t row = 0;
uint8_t write = 1;
uint8_t led_index = 0;
GPIO_TypeDef * writePortArray[10] = {GPIOC, GPIOB, GPIOB, GPIOA, GPIOC, GPIOB, GPIOA, GPIOB, GPIOB, GPIOC};
uint16_t writePinArray[10] = {GPIO_PIN_6, GPIO_PIN_15, GPIO_PIN_12, GPIO_PIN_15, GPIO_PIN_7, GPIO_PIN_5, GPIO_PIN_4, GPIO_PIN_4, GPIO_PIN_1, GPIO_PIN_2};
GPIO_TypeDef * readPortArray[10] = {GPIOB, GPIOA, GPIOD, GPIOD, GPIOF, GPIOF, GPIOE, GPIOE, GPIOF, GPIOE};
uint16_t readPinArray[10] = {GPIO_PIN_8, GPIO_PIN_5, GPIO_PIN_14, GPIO_PIN_15, GPIO_PIN_12, GPIO_PIN_13, GPIO_PIN_9, GPIO_PIN_11, GPIO_PIN_14, GPIO_PIN_0};
extern uint32_t colors[100];
extern uint8_t button_flag;
//extern uint16_t lastButtons[10];
extern uint16_t buttonMatrix[10];
extern uint8_t zero;
extern uint8_t drawLock;
extern uint8_t pwmLock;
/* USER CODE END 0 */

/* External variables --------------------------------------------------------*/
extern TIM_HandleTypeDef htim2;
extern TIM_HandleTypeDef htim3;
extern TIM_HandleTypeDef htim6;

/******************************************************************************/
/*            Cortex-M7 Processor Interruption and Exception Handlers         */ 
/******************************************************************************/

/**
* @brief This function handles System tick timer.
*/
void SysTick_Handler(void)
{
  /* USER CODE BEGIN SysTick_IRQn 0 */

  /* USER CODE END SysTick_IRQn 0 */
  HAL_IncTick();
  HAL_SYSTICK_IRQHandler();
  /* USER CODE BEGIN SysTick_IRQn 1 */

  /* USER CODE END SysTick_IRQn 1 */
}

/******************************************************************************/
/* STM32F7xx Peripheral Interrupt Handlers                                    */
/* Add here the Interrupt Handlers for the used peripherals.                  */
/* For the available peripheral interrupt handler names,                      */
/* please refer to the startup file (startup_stm32f7xx.s).                    */
/******************************************************************************/

/**
* @brief This function handles TIM2 global interrupt.
*/
void TIM2_IRQHandler(void)
{
  /* USER CODE BEGIN TIM2_IRQn 0 */
	HAL_TIM_Base_Stop_IT(&htim6);
	HAL_TIM_Base_Start_IT(&htim3);
  /* USER CODE END TIM2_IRQn 0 */
  HAL_TIM_IRQHandler(&htim2);
  /* USER CODE BEGIN TIM2_IRQn 1 */

  /* USER CODE END TIM2_IRQn 1 */
}

/**
* @brief This function handles TIM3 global interrupt.
*/
void TIM3_IRQHandler(void)
{
  /* USER CODE BEGIN TIM3_IRQn 0 */
	if(!drawLock)
	{
		return;
	}
	pwmLock = 0;
	HAL_TIM_Base_Stop_IT(&htim6);
	if(zero)
	{
		if (led_index < 20)
		{
			TIM3 -> CCR1 = 0;
			led_index++;
		}
		else
		{
			led_index = 0;
			zero = 0;
		}
	}
	else
	{
		if(start == 1)
		{
			start = 0;
		}
		else
		{
			if (led_index < NUM_LEDS)
			{
				if (colors[led_index] & bitPos)
				{
					TIM3 -> CCR1 = 300;
				}
				else
				{
					TIM3 -> CCR1 = 20;
				}
				bitPos = bitPos >> 1;
			}
			else
			{
				TIM3 -> CCR1 = 0;
				led_index  = 0;
				HAL_TIM_Base_Stop_IT(&htim3);					//stops the timer, not the interrupt
				HAL_TIM_Base_Start_IT(&htim6);
				bitPos = 0x800000;
				start = 1;
				pwmLock = 1;

			}
			if (bitPos == 0)
			{
				led_index ++;
				bitPos = 0x800000;
			}
		}
	}

  /* USER CODE END TIM3_IRQn 0 */
  HAL_TIM_IRQHandler(&htim3);
  /* USER CODE BEGIN TIM3_IRQn 1 */

	//HAL_TIM_Base_Start_IT(&htim3);



  /* USER CODE END TIM3_IRQn 1 */
}

/**
* @brief This function handles TIM6 global interrupt, DAC1 and DAC2 underrun error interrupts.
*/
void TIM6_DAC_IRQHandler(void)
{
  /* USER CODE BEGIN TIM6_DAC_IRQn 0 */
	//randomLEDS();
	if (write)
	{
		if (column == 0)
		{
			HAL_GPIO_WritePin(writePortArray[9], writePinArray[9], GPIO_PIN_RESET);
		}
		else
		{
			HAL_GPIO_WritePin(writePortArray[column - 1], writePinArray[column - 1], GPIO_PIN_RESET);
		}
		HAL_GPIO_WritePin(writePortArray[column], writePinArray[column], GPIO_PIN_SET);
		write = 0;
	}
	else
	{
		//buttonPressed = 100;
		buttonMatrix[column] = 0x0;
		uint16_t i = 0x1;
		for (row = 0; row < 10; row++)
		{
			//uint16_t i = 0x1;
			if (HAL_GPIO_ReadPin(readPortArray[row], readPinArray[row]))
			{
				buttonMatrix[column] = buttonMatrix[column] | i;
				//buttonPressed = 3 * column + row;
				//break;
			}
			i = i<< 1;
		}
		column++;
		if ( column == 10)
		{
			button_flag = 1;
			column = 0;
		}
		write = 1;
	}
  /* USER CODE END TIM6_DAC_IRQn 0 */
  HAL_TIM_IRQHandler(&htim6);
  /* USER CODE BEGIN TIM6_DAC_IRQn 1 */

  /* USER CODE END TIM6_DAC_IRQn 1 */
}

/* USER CODE BEGIN 1 */

/* USER CODE END 1 */
/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/
