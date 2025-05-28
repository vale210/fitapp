import {
  Box,
  Flex,
  Button,
  Stack,
  useColorModeValue,
  Image,
  Container,
  IconButton,
  useDisclosure,
  Collapse,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useColorMode,
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import Logo from './Logo'
import { getCurrentUser, logout } from '../services/auth'

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()

  const bgColor = useColorModeValue('white', 'brand.900')
  const textColor = useColorModeValue('gray.800', 'white')
  const menuBgColor = useColorModeValue('white', '#1E1E1E')
  const menuHoverBgColor = useColorModeValue('gray.100', '#252525')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200')

  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.user) {
      setIsAuthenticated(true)
      setUserRole(user.user.rol)
      setUserName(user.user.nombre)
    } else {
      setIsAuthenticated(false)
      setUserRole('')
      setUserName('')
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsAuthenticated(false)
    setUserRole('')
    setUserName('')
    navigate('/')
  }

  return (
    <Box 
      position="fixed" 
      w="100%" 
      zIndex={1000} 
      bg={bgColor} 
      backdropFilter="blur(10px)" 
      borderBottom="1px" 
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Container maxW="7xl">
        <Flex
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          align={'center'}
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}>
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
              color={textColor}
              _hover={{ bg: useColorModeValue('gray.100', 'whiteAlpha.200') }}
            />
          </Flex>

          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <RouterLink to="/">
              <Logo />
            </RouterLink>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <Stack direction={'row'} spacing={8}>
                <Button
                  as={RouterLink}
                  to="/"
                  fontSize={'sm'}
                  fontWeight={500}
                  variant={'link'}
                  color={textColor}
                  _hover={{
                    color: 'accent.500',
                    textDecoration: 'none'
                  }}
                >
                  Inicio
                </Button>

                <Button
                  as={RouterLink}
                  to="/services"
                  fontSize={'sm'}
                  fontWeight={500}
                  variant={'link'}
                  color={textColor}
                  _hover={{
                    color: 'accent.500',
                    textDecoration: 'none'
                  }}
                >
                  Servicios
                </Button>

                <Button
                  as={RouterLink}
                  to="/about"
                  fontSize={'sm'}
                  fontWeight={500}
                  variant={'link'}
                  color={textColor}
                  _hover={{
                    color: 'accent.500',
                    textDecoration: 'none'
                  }}
                >
                  Nosotros
                </Button>

                <Button
                  as={RouterLink}
                  to="/contact"
                  fontSize={'sm'}
                  fontWeight={500}
                  variant={'link'}
                  color={textColor}
                  _hover={{
                    color: 'accent.500',
                    textDecoration: 'none'
                  }}
                >
                  Contacto
                </Button>

                {userRole === 'admin' && (
                  <Button
                    as={RouterLink}
                    to="/admin"
                    fontSize={'sm'}
                    fontWeight={500}
                    variant={'link'}
                    color={textColor}
                    _hover={{
                      color: 'accent.500',
                      textDecoration: 'none'
                    }}
                  >
                    Dashboard
                  </Button>
                )}
              </Stack>
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
            align="center"
          >
            <IconButton
              aria-label="Cambiar tema"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              color={textColor}
              _hover={{ bg: menuHoverBgColor }}
            />
            
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar
                    size={'sm'}
                    name={userName}
                    bg="#FF3366"
                    color="white"
                  />
                </MenuButton>
                <MenuList bg={menuBgColor} borderColor={borderColor}>
                  {userRole === 'admin' && (
                    <MenuItem
                      as={RouterLink}
                      to="/admin"
                      bg={menuBgColor}
                      color={textColor}
                      _hover={{ bg: menuHoverBgColor }}
                    >
                      Dashboard
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={handleLogout}
                    bg={menuBgColor}
                    color={textColor}
                    _hover={{ bg: menuHoverBgColor }}
                  >
                    Cerrar Sesión
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  to="/login"
                  fontSize={'sm'}
                  fontWeight={600}
                  variant={'ghost'}
                  color={textColor}
                  borderWidth={1}
                  borderColor={'accent.500'}
                  _hover={{
                    bg: 'accent.500',
                    color: 'white'
                  }}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'accent.500'}
                  _hover={{
                    bg: 'accent.600',
                  }}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <Stack
            bg={menuBgColor}
            p={4}
            display={{ md: 'none' }}
            spacing={4}
            borderRadius="md"
            mt={2}
          >
            <Button
              as={RouterLink}
              to="/"
              w="full"
              variant="ghost"
              color={textColor}
              justifyContent="flex-start"
              _hover={{ bg: menuHoverBgColor }}
            >
              Inicio
            </Button>
            <Button
              as={RouterLink}
              to="/services"
              w="full"
              variant="ghost"
              color={textColor}
              justifyContent="flex-start"
              _hover={{ bg: menuHoverBgColor }}
            >
              Servicios
            </Button>
            <Button
              as={RouterLink}
              to="/about"
              w="full"
              variant="ghost"
              color={textColor}
              justifyContent="flex-start"
              _hover={{ bg: menuHoverBgColor }}
            >
              Nosotros
            </Button>
            <Button
              as={RouterLink}
              to="/contact"
              w="full"
              variant="ghost"
              color={textColor}
              justifyContent="flex-start"
              _hover={{ bg: menuHoverBgColor }}
            >
              Contacto
            </Button>
            {userRole === 'admin' && (
              <Button
                as={RouterLink}
                to="/admin"
                w="full"
                variant="ghost"
                color={textColor}
                justifyContent="flex-start"
                _hover={{ bg: menuHoverBgColor }}
              >
                Dashboard
              </Button>
            )}
          </Stack>
        </Collapse>
      </Container>
    </Box>
  )
} 