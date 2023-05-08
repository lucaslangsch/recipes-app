import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBarContext from './SearchBarContext';

function SearchBarProvider({ children }) {
  const { pathname } = useLocation();
  const [recipesData, setRecipesData] = useState([]);
  const limitSearch = 12;

  const fetchApi = useCallback(async (url) => {
    const response = await fetch(url);
    const dataApi = await response.json();
    if (dataApi[Object.keys(dataApi)].length <= 1) {
      let id = 'idDrink';
      if (pathname === '/meals') {
        id = 'idMeal';
      }
      window.location.href = `${pathname}/${(dataApi[Object.keys(dataApi)])[0][id]}`;
    }
    console.log((dataApi[Object.keys(dataApi)]).slice(0, limitSearch));
    return setRecipesData((dataApi[Object.keys(dataApi)]).slice(0, limitSearch));
  }, [pathname]);

  const searchBtn = useCallback((inputValue, radioValue) => {
    let URL = 'thecocktaildb';
    if (pathname === '/meals') {
      URL = 'themealdb';
    }

    switch (radioValue) {
    case 'Ingredient':

      fetchApi(`https://www.${URL}.com/api/json/v1/1/filter.php?i=${inputValue}`);
      break;

    case 'Name':
      fetchApi(`https://www.${URL}.com/api/json/v1/1/search.php?s=${inputValue}`);
      break;

    default:
      if (inputValue.length > 1) {
        global.alert('Your search must have only 1 (one) character');
      }
      fetchApi(`https://www.${URL}.com/api/json/v1/1/search.php?f=${inputValue}`);
      break;
    }
  }, [fetchApi, pathname]);

  const values = useMemo(() => ({
    searchBtn,
    recipesData,
  }), [searchBtn, recipesData]);
  return (
    <SearchBarContext.Provider value={ values }>
      {children}
    </SearchBarContext.Provider>
  );
}

SearchBarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SearchBarProvider;
