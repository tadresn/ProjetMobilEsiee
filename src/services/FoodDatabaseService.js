import axios from 'axios';

import { appId, appKey } from '../../env';

export const searchFoodByName = (name) => {
  const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appKey}&ingr=${name}`;

  return axios.get(url);
};
