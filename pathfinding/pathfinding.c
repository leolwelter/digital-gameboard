#include <stdlib.h>
#include <limits.h>
#include <stdio.h>

#define coltot 20
#define rowtot 10

struct inputStruct {

	char movemap[rowtot][coltot];
	char costmap[rowtot][coltot];
	char flagmap[rowtot][coltot];
};

struct inputStruct *inputStruct_new()
{
	inputStruct *x = (inputStruct *)malloc(sizeof(*x));
	for (char i = 0; i < rowtot; i++)
	{
		for (char j = 0; j < coltot; j++)
		{
			x->costmap[i][j] = CHAR_MAX;
			x->flagmap[i][j] = 0;
		}
	}
	return x;
}

void inputStruct_new(struct inputStruct *p)
{
	free(p);
}

struct characterStruct {
	int movep;
	int movespent;
	char character_x;
	char character_y;
};

struct characterStruct *characterStruct_new(int movepts, int movespnt, char xpos, char ypos)
{
	characterStruct *y = (characterStruct *)malloc(sizeof(*y));
	y->movep = movepts;
	y->movespent = movespnt;
	y->character_x = xpos;
	y->character_y = ypos;
	return y;
}

void characterStruct_new(struct characterStruct *q)
{
	free(q);
}

void pathFindingRecursion(inputStruct *, characterStruct *, int, int, char);
int min(int, int);

int main()
{
	inputStruct *input = inputStruct_new();
	characterStruct *character = characterStruct_new(6, 0, 15, 9); // character has 6 movement points to start

	/* Populate movement cost map */
	for (char i = 0; i < 20; i++)
	{
		input->movemap[0][i] = -1;
		input->movemap[7][i] = -1;
		input->movemap[8][i] = -1;
		input->movemap[9][i] = -1;
	}
	for (char i = 2; i < 18; i++)
	{
		input->movemap[1][i] = 1;
		input->movemap[2][i] = 1;
		input->movemap[3][i] = 1;
		input->movemap[4][i] = 1;
		input->movemap[5][i] = 1;
		input->movemap[6][i] = 1;
	}
	for (char i = 1; i < 7; i++)
	{
		input->movemap[i][0] = -1;
		input->movemap[i][1] = -1;
		input->movemap[i][18] = -1;
		input->movemap[i][19] = -1;
	}
	input->movemap[2][14] = -1;
	input->movemap[6][7] = -1;
	for (char i = 10; i < 13; i++)
	{
		input->movemap[3][i] = 2;
		input->movemap[4][i] = 2;
	}
	for (char i = 14; i < 17; i++)
	{
		input->movemap[6][i] = 2;
	}
	input->movemap[7][15] = 1;
	for (char i = 13; i < 18; i++)
	{
		input->movemap[8][i] = 1;
		input->movemap[9][i] = 1;
	}
	input->movemap[9][15] = -1;


	pathFindingRecursion(input, character, character->character_y, character->character_x, 1);

	for (char i = 0; i < rowtot; i++)
	{
		for (char j = 0; j < coltot; j++)
		{
			printf("%i ", input->movemap[i][j]);
		}
		printf("\n");
	}
	printf("\n\n\n");
	for (char i = 0; i < rowtot; i++)
	{
		for (char j = 0; j < coltot; j++)
		{
			printf("%i ", input->costmap[i][j]);
		}
		printf("\n");
	}
	printf("\n\n\n");
	for (char i = 0; i < rowtot; i++)
	{
		for (char j = 0; j < coltot; j++)
		{
			printf("%i ", input->flagmap[i][j]);
		}
		printf("\n");
	}
		
	inputStruct_new(input);
	characterStruct_new(character);

    return 0;
}

int min(int a, int b)
{
	return ((a < b) ? a : b);
}

void pathFindingRecursion(inputStruct *input, characterStruct *character, int row, int col, char start)
{
	//printf("row: %i, col: %i\n", row, col);
	int framecost = input->movemap[row][col];
	if (!start) { // first position must have -1 for character position
		if (input->movemap[row][col] == -1) return;
		if (character->movep == 0 || character->movep - input->movemap[row][col] < 0) return;

		character->movep -= input->movemap[row][col];
		character->movespent += input->movemap[row][col];
		input->movemap[row][col] = -1;
		
		input->costmap[row][col] = min(input->costmap[row][col], character->movespent);
	}
	//left
	if (col > 0)
	{
		pathFindingRecursion(input, character, row, col - 1, 0);
	}
	//up
	if (row > 0)
	{
		pathFindingRecursion(input, character, row - 1, col, 0);
	}
	//right
	if (col < coltot - 1)
	{
		pathFindingRecursion(input, character, row, col + 1, 0);
	}
	//down
	if (row < rowtot - 1)
	{
		pathFindingRecursion(input, character, row + 1, col, 0);
	}
	if (!start)
	{
		input->movemap[row][col] = framecost;
		character->movespent -= framecost;
		character->movep += framecost;
	}
	else {
		input->costmap[row][col] = 0;
		for (char i = 0; i < rowtot; i++)
		{
			for (char j = 0; j < coltot; j++)
			{
				if (input->costmap[i][j] == CHAR_MAX)
				{
					input->costmap[i][j] = -1;
				}
				else {
					input->flagmap[i][j] = 1;
				}
			}
		}
	}

	return;
}
