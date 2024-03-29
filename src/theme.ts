import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        margin: '0',
        fontFamily: 'Roboto, sans-serif',
      },
    },
  },
});

export default theme;
