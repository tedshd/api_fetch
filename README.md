## Intro

handle fetch

## Usage

```javascript

try {
  const res = await apiFetch({
    method: '', // GET, POST, PUT, DELETE...
    url: '',
    body: {},
    queryString: {},
    header: {}
  })
} catch (e) {
  console.log(e)
}
```

## Use case

### raw

```javascript
{
  method: '',
  url: '',
  body: JSON.stringify({}),
  queryString: {},
  header: {}
}
```

### application/x-www-form-urlencoded

```javascript
{
  method: '',
  url: '',
  body: new URLSearchParams({}),
  queryString: {},
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}
```

### FormData

```javascript
const formData = new FormData();
formData.append('key1', 'value1');

{
  method: '',
  url: '',
  body: formData,
  queryString: {},
  header: {}
}
```

### upload file

```javascript
const fileInput = document.getElementById('fileInput');
const formData = new FormData();
formData.append('file', fileInput.files[0]);

{
  method: '',
  url: '',
  body: formData,
  queryString: {},
  header: {}
}
```