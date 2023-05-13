import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import renderWithRouter from './helpers/renderWithRouter';
import Meals from '../pages/Meals';
import SearchBarProvider from '../context/SearchBarProvider';
import soupMeals from '../../cypress/mocks/soupMeals';
import App from '../App';
import RecipeDetailsProvider from '../context/RecipeDetailsProvider';
import RecipeInProgressProvider from '../context/RecipeInProgressProvider';
import dessertMeals from '../../cypress/mocks/dessertMeals';
import meals from '../../cypress/mocks/meals';
import oneMeal from '../../cypress/mocks/oneMeal';

// beforeEach(() => {
//   (
//     global.fetch = jest.fn(async () => ({
//       json: async () => soupMeals,
//     }))
//   );
// });

const mealCategories = {
  meals: [
    { strCategory: 's' },
    { strCategory: 'sd' },
    { strCategory: 'd2' },
    { strCategory: 'Beef' },
    { strCategory: 'das' },
    { strCategory: '12j' },
    { strCategory: 'dsai' },
    { strCategory: 'dsadi' },
    { strCategory: 'das' },
    { strCategory: 'Beef' },
    { strCategory: 'Beef' },
    { strCategory: 'Beef' },
    { strCategory: 'Beef' },
    { strCategory: 'dsad' },
  ],
};

const setupFetchStub = (data) => () => new Promise((resolve) => {
  resolve({
    json: () => Promise.resolve({
      ...data,
    }),
  });
});

describe('', () => {
  afterEach(() => {
    global.fetch.mockRestore();
    jest.spyOn(global, 'alert');
  });
  const SEARCH = 'search-btn';
  test('teste 1', async () => {
    (
      global.fetch = jest.fn(async () => ({
        json: () => Promise.resolve({ meals: soupMeals }),
      }))
    );
    renderWithRouter(<SearchBarProvider><Meals /></SearchBarProvider>);
    const btnSearch = screen.getByTestId(SEARCH);
    userEvent.click(btnSearch);
    const InputValue = screen.getByTestId('search-input');
    userEvent.type(InputValue, 'soup');
    const nameInput = screen.getByTestId('name-search-radio');
    userEvent.click(nameInput);
    const button = screen.getByTestId('exec-search-btn');
    userEvent.click(button);
    await waitFor(() => {
      const nameCard = screen.getByTestId('8-card-name');
      expect(nameCard).toBeInTheDocument();
    });
  });

  test('teste 2', async () => {
    jest.spyOn(global, 'alert');

    (
      global.fetch = jest.fn(async () => ({
        json: () => Promise.resolve({ meals: soupMeals }),
      }))
    );
    renderWithRouter(<SearchBarProvider><Meals /></SearchBarProvider>);
    const btnSearch = screen.getByTestId(SEARCH);
    userEvent.click(btnSearch);
    const IngredientInput = screen.getByTestId('ingredient-search-radio');
    userEvent.click(IngredientInput);
  });

  test('teste 3', async () => {
    jest.spyOn(global, 'alert');

    (
      global.fetch = jest.fn(async () => ({
        json: () => Promise.resolve({ meals: soupMeals }),
      }))
    );
    renderWithRouter(<SearchBarProvider><Meals /></SearchBarProvider>);
    const btnSearch = screen.getByTestId(SEARCH);
    userEvent.click(btnSearch);
    const FirstLetterInput = screen.getByTestId('first-letter-search-radio');
    userEvent.click(FirstLetterInput);
  });

  test('teste 4', async () => {
    jest.spyOn(global, 'alert');

    (
      global.fetch = jest.fn(async () => ({
        json: () => Promise.resolve({ meals: oneMeal.meals }),
      }))
    );
    renderWithRouter(<SearchBarProvider><Meals /></SearchBarProvider>);
    const btnSearch = screen.getByTestId(SEARCH);
    userEvent.click(btnSearch);
    const SearchInput = screen.getByTestId('search-input');
    const execButton = screen.getByTestId('exec-search-btn');
    const IngredientInput = screen.getByTestId('first-letter-search-radio');

    userEvent.type(SearchInput, 'cj');
    userEvent.click(IngredientInput);
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    userEvent.click(execButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Your search must have only 1 (one) character');
    });

    alertSpy.mockRestore();

    userEvent.clear(SearchInput);

    userEvent.type(SearchInput, 'c');
    userEvent.click(IngredientInput);

    userEvent.click(execButton);
  });

  test('teste 5', async () => {
    jest.spyOn(global, 'alert');
    (
      global.fetch = jest.fn(async () => ({
        json: () => Promise.resolve({ meals: null }),
      }))
    );
    renderWithRouter(<SearchBarProvider><Meals /></SearchBarProvider>);
    const btnSearch = screen.getByTestId(SEARCH);
    userEvent.click(btnSearch);
    const SearchInput = screen.getByTestId('search-input');
    const execButton = screen.getByTestId('exec-search-btn');
    const IngredientInput = screen.getByTestId('name-search-radio');

    userEvent.type(SearchInput, 'xabalu');
    userEvent.click(IngredientInput);

    userEvent.click(execButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Sorry, we haven\'t found any recipes for these filters.');
    });
  });

  test('teste 6', async () => {
    jest.spyOn(global, 'alert');

    (
      global.fetch = jest.fn(async () => ({
        json: () => Promise.resolve({ meals: oneMeal.meals }),
      }))
    );
    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(setupFetchStub(mealCategories));
    const { history } = renderWithRouter(
      <SearchBarProvider>
        <RecipeDetailsProvider>
          <RecipeInProgressProvider>
            <App />
          </RecipeInProgressProvider>
        </RecipeDetailsProvider>
      </SearchBarProvider>,
    );

    act(() => {
      history.push('/meals');
    });

    const btnSearch = screen.getByTestId(SEARCH);
    userEvent.click(btnSearch);
    const SearchInput = screen.getByTestId('search-input');
    const execButton = screen.getByTestId('exec-search-btn');
    const IngredientInput = screen.getByTestId('ingredient-search-radio');

    userEvent.type(SearchInput, 'Spicy Arrabiata Penne');
    userEvent.click(IngredientInput);
    userEvent.click(execButton);

    await waitFor(async () => {
      const nameRecipe = await screen.findByTestId('recipe-title');
      expect(nameRecipe).toBeInTheDocument();
      expect(history.location.pathname).toBe('/meals/52771');
    });
  });

  test('teste 7', async () => {
    jest.spyOn(global, 'alert');

    (
      global.fetch = jest.fn(async () => ({
        json: () => Promise.resolve({ meals: meals.meals }),
      }))
    );
    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(setupFetchStub(mealCategories));

    const { history } = renderWithRouter(
      <SearchBarProvider>
        <RecipeDetailsProvider>
          <RecipeInProgressProvider>
            <App />
          </RecipeInProgressProvider>
        </RecipeDetailsProvider>
      </SearchBarProvider>,
    );

    act(() => {
      history.push('/meals');
    });

    const buttonDessert = await screen.findAllByTestId('Side-category-filter');
    act(() => {
      userEvent.click(buttonDessert[0]);
    });
  });

  test('teste 8', async () => {
    jest.spyOn(global, 'alert');

    (
      global.fetch = jest.fn(async () => ({
        json: () => Promise.resolve({ meals: meals.meals }),
      }))
    );
    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(setupFetchStub(mealCategories));

    const { history } = renderWithRouter(
      <SearchBarProvider>
        <RecipeDetailsProvider>
          <RecipeInProgressProvider>
            <App />
          </RecipeInProgressProvider>
        </RecipeDetailsProvider>
      </SearchBarProvider>,
    );

    act(() => {
      history.push('/drinks');
    });

    const buttonDessert = await screen.findAllByTestId('Side-category-filter');
    act(() => {
      userEvent.click(buttonDessert[0]);
    });
  });
});
