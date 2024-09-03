const apiHost = '';
let accessToken = '';
const ERRORCODE = {
  'OFFLINE': 900,
  'NETWORKERROR': 901
}
const d4Options = {
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${accessToken}`,
  },
  mode: 'cors', // no-cors, cors, *same-origin
  // credentials: 'include', // include, same-origin, *omit
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // *client, no-referrer
};

class FetchError extends Error {
  constructor(response, data) {
    super(data.message);
    this.name = 'FetchError';
    this.status = response.status || '';
    this.data = data;
    this.code = response.status || data.code;
  }
}

const initUrlencoded = (obj) => {
  const urlencoded = new URLSearchParams();
  for (const key in obj) {
    urlencoded.append(key, obj[key]);
  }
  return urlencoded;
}

const apiFetch = async (arg) => {
  const option = {
    method: arg.method,
    url: arg.url || '',
    body: arg.body || '',
    queryString: initUrlencoded(arg.queryString) || '',
    header: arg.method || {}
  }
  if (!option.method) {
    console.error('apiFetch:', 'no set method');
    return;
  }
  d4Options.headers = {
    ...d4Options.headers,
    ...option.header
  };
  if (option.method !== 'GET') {
    d4Options.body = option.body
  }
  const apiURL = (option.method === 'GET') ? `${apiHost}/${option.url}?${option.queryString.toString()}` : `${apiHost}/${option.url}`
  try {
    const response = await fetch(apiURL, {
      ...d4Options,
      method: option.method
    });
    console.log('response', response)
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new FetchError(response, {message: 'Bad Request' });
        case 401:
          throw new FetchError(response, { message: 'Unauthorized' });
        case 403:
          throw new FetchError(response, { message: 'Forbidden' });
        case 404:
          throw new FetchError(response, { message: 'Not Found' });
        case 500:
          throw new FetchError(response, { message: 'Internal Server Error' });
        default:
          throw new FetchError(response, { message: 'Unknown Error' });
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof FetchError) {
      throw error;
    } else {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        // Using navigator.onLine as an additional check
        if (!navigator.onLine) {
          console.error('Network error: You appear to be offline.');
          throw new FetchError('Network error', {
            message: 'offline',
            code: ERRORCODE.OFFLINE
          })
        } else {
          console.error('Network error: Connection was reset.');
          throw new FetchError('Network error', {
            message: 'network error',
            code: ERRORCODE.NETWORKERROR
          })
        }
      } else {
        console.error('Unexpected error:', error);
      }
      console.log(error instanceof TypeError); // true
      console.log(error.message); // "null has no properties"
      console.log(error.name); // "TypeError"
      console.log(error.stack); // Stack of the error
      console.error('Unexpected error:', error);
    }
  }

}

// const apiTest = async () => {
//   try {
//     const response = await fetch(`${apiHost}/`, {
//       ...d4Header,
//       method: 'GET',
//     });
//     console.log('response', response)
//     if (!response.ok) {
//       switch (response.status) {
//         case 400:
//           throw new FetchError(response, {message: 'Bad Request' });
//         case 401:
//           throw new FetchError(response, { message: 'Unauthorized' });
//         case 403:
//           throw new FetchError(response, { message: 'Forbidden' });
//         case 404:
//           throw new FetchError(response, { message: 'Not Found' });
//         case 500:
//           throw new FetchError(response, { message: 'Internal Server Error' });
//         default:
//           throw new FetchError(response, { message: 'Unknown Error' });
//       }
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     if (error instanceof FetchError) {
//       throw error;
//     } else {
//       if (error instanceof TypeError && error.message === 'Failed to fetch') {
//         // Using navigator.onLine as an additional check
//         if (!navigator.onLine) {
//           console.error('Network error: You appear to be offline.');
//           throw new FetchError('Network error', {
//             message: 'offline',
//             code: ERRORCODE.OFFLINE
//           })
//         } else {
//           console.error('Network error: Connection was reset.');
//           throw new FetchError('Network error', {
//             message: 'network error',
//             code: ERRORCODE.NETWORKERROR
//           })
//         }
//       } else {
//         console.error('Unexpected error:', error);
//       }
//       console.log(error instanceof TypeError); // true
//       console.log(error.message); // "null has no properties"
//       console.log(error.name); // "TypeError"
//       console.log(error.stack); // Stack of the error
//       console.error('Unexpected error:', error);
//     }
//   }
// }