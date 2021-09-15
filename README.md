# API - Marvel

![Alt text](https://res.cloudinary.com/lereacteur-apollo/image/upload/v1582097342/react-new-exercices/Marvel/langfr-1920px-MarvelLogo.svg_uw9pi8.png?raw=true "Marvel logo")

## Comics

### /comics (GET)

Get a list of comics

| Query    | Info                        | Required |
| -------- | --------------------------- | -------- |
| `apiKey` | API key received            | Yes      |
| `limit`  | between 1 and 100           | No       |
| `skip `  | number of results to ignore | No       |

<br>
<br>

### /comics/:characterId (GET)

Get a list of comics containing a specific character

| Params        | Info                  | Required |
| ------------- | --------------------- | -------- |
| `characterId` | characters mongoDB id | Yes      |

| Query    | Info             | Required |
| -------- | ---------------- | -------- |
| `apiKey` | API key received | Yes      |

<br>

## Characters

### /characters (GET)

Get a list of characters

| Query    | Info                        | Required |
| -------- | --------------------------- | -------- |
| `apiKey` | API key received            | Yes      |
| `limit`  | between 1 and 100           | No       |
| `skip `  | number of results to ignore | No       |
