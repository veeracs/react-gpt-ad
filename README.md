
A lazily instantiated [React](https://github.com/facebook/react) component for [Google Publisher Tags](https://developers.google.com/doubleclick-gpt/).

Th React Component asynchronously loads GPT Ad library, queues all GPT actions or GPT API calls and executes them when the API is available.

## Requirements

 * React 0.14+

## Browser Requirements

 * IE10+

## Features

 * Single request mode
 * Asynchronous rendering mode
 * Synchronous rendering mode
 * Responsive ads
 * Interstitial ads

## Installation

```
$ npm install --save react-gpt-ad
```

The component dependency graph is clean i.e. React GPT Ads component is not dependent on any other library.

## Usage

Import React GPT and pass props to the component.

```js
import GPTAd from "react-gpt-ad";

class Application extends React.Component {
    render() {
        return (
          <GPTAd
            path="/23389245/sitename/home"
            placement="rectangle"
            size={[300, 600]}
            targeting={{
              pos: 'fn_rectangle1',
              pid: 'front'
            }}
          />
        );
    }
}
```

`path` and `placement` are only required properties for the component to initialize.
