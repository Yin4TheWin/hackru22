export default function getData(URL)
{
    const axios = require("axios");
    const options = {
      method: 'GET',
      url: 'https://api.spoonacular.com/food/images/analyze?',
      params: {apiKey: 'cd65c6a5839742d7947bfface7ac62ad', imageUrl: /*Replace with URL*/'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'},
    };
    axios.request(options).then(function (response) {
        console.log(response.data);
        return response.data
    }).catch(function (error) {
        console.error(error);
        return null
    });
};
