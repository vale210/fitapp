import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    heading: '"Montserrat", sans-serif',
    body: '"Inter", sans-serif',
  },
  colors: {
    brand: {
      900: '#0A0A0A',
      800: '#1A1A1A',
      700: '#2D2D2D',
      600: '#404040',
      500: '#525252',
      400: '#666666',
      300: '#808080',
      200: '#999999',
      100: '#B3B3B3',
      50: '#E6E6E6',
    },
    accent: {
      500: '#FF3366',
      600: '#E62D5C',
      700: '#CC2852',
      800: '#B32347',
    }
  },
  styles: {
    global: {
      'html, body': {
        backgroundColor: 'brand.900',
        color: 'white',
        minHeight: '100vh',
      },
      '*::placeholder': {
        color: 'gray.500',
      },
      '*, *::before, &::after': {
        borderColor: 'whiteAlpha.200',
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'lg',
      },
      variants: {
        solid: {
          bg: 'accent.500',
          color: 'white',
          _hover: {
            bg: 'accent.600',
            _disabled: {
              bg: 'accent.500',
            },
          },
          _active: { bg: 'accent.700' },
        },
        ghost: {
          color: 'white',
          _hover: {
            bg: 'whiteAlpha.200',
          }
        },
        outline: {
          color: 'white',
          borderColor: 'accent.500',
          _hover: {
            bg: 'accent.500',
          }
        }
      },
      defaultProps: {
        variant: 'solid',
      }
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'brand.800',
          borderRadius: 'xl',
          overflow: 'hidden',
          boxShadow: 'xl',
          transition: 'all 0.3s ease',
          _hover: {
            transform: 'translateY(-5px)',
            boxShadow: '2xl',
            bg: 'brand.700',
          },
        }
      }
    },
    Container: {
      baseStyle: {
        maxW: '7xl'
      }
    },
    Heading: {
      baseStyle: {
        color: 'white',
        fontWeight: 'bold',
      }
    },
    Text: {
      baseStyle: {
        color: 'gray.300',
      }
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'whiteAlpha.50',
            borderColor: 'whiteAlpha.200',
            color: 'white',
            _hover: {
              borderColor: 'accent.500',
            },
            _focus: {
              borderColor: 'accent.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-accent-500)',
            }
          }
        }
      }
    },
    FormLabel: {
      baseStyle: {
        color: 'gray.300',
      }
    }
  },
}) 