// import axios from 'axios';
// import { useSearchParams } from 'react-router-dom';

// const baseURL = process.env.REACT_APP_BE_URL;
// // const [searchParams, setSearchParams] = useSearchParams();
// //     const chatId = searchParams.get('chatId');
// //     var options = {
// //         headers: {
// //             'chatId': chatId,
// //         }
// //     };
// // const axiosClient = axios.create({
// //     baseURL,
// //     headers: {
// //         'chatId': '6385bd4ea084983826979dbe'
// //     }
// // });

import axios from 'axios';

const baseURL = process.env.REACT_APP_BE_URL;
const USER_ID = 123;

const axiosClient = axios.create({
  baseURL,
  headers: {
    'x-user-id': USER_ID,
  },
});

export default axiosClient;
