import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Link,
  Container,
  VStack,
  Image,
  Flex,
  Icon,
  useToast,
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import { login } from '../services/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await login({ email, password })
      toast({
        title: '¡Bienvenido!',
        description: `Hola ${response.user.nombre}, has iniciado sesión correctamente.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      // Redirigir según el rol
      if (response.user.rol === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error: any) {
      toast({
        title: 'Error al iniciar sesión',
        description: error.response?.data?.message || 'Credenciales incorrectas',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box 
      minH="100vh" 
      bg="#121212" 
      py={{ base: "80px", md: "100px" }}
      position="relative"
      overflow="hidden"
    >
      {/* Círculos decorativos */}
      <Box
        position="absolute"
        width="600px"
        height="600px"
        borderRadius="full"
        bg="#FF3366"
        filter="blur(80px)"
        opacity="0.1"
        top="-200px"
        left="-200px"
      />
      <Box
        position="absolute"
        width="600px"
        height="600px"
        borderRadius="full"
        bg="#FF3366"
        filter="blur(80px)"
        opacity="0.1"
        bottom="-200px"
        right="-200px"
      />

      <Container maxW="7xl" position="relative" px={{ base: 4, md: 8 }}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={16} align="center">
          {/* Imagen decorativa */}
          <Box 
            flex={1} 
            display={{ base: 'none', md: 'block' }}
            position="relative"
          >
            <Image
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
              alt="Fitness"
              objectFit="cover"
              borderRadius="2xl"
              boxShadow="2xl"
              height="600px"
              width="100%"
            />
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)"
              borderRadius="2xl"
            />
          </Box>

          {/* Formulario */}
          <Box 
            flex={1} 
            bg="#1E1E1E"
            p={{ base: 8, md: 16 }}
            borderRadius="2xl"
            borderWidth={1}
            borderColor="rgba(255,255,255,0.1)"
            boxShadow="2xl"
            w="100%"
            maxW="600px"
            mx="auto"
          >
            <VStack spacing={8} align="stretch" as="form" onSubmit={handleSubmit}>
              <VStack spacing={3} align="center">
                <Heading 
                  fontSize={{ base: "3xl", md: "4xl" }}
                  color="white"
                  fontWeight="bold"
                >
                  Bienvenido de nuevo
                </Heading>
                <Text fontSize="lg" color="#B3B3B3" textAlign="center">
                  Continúa tu journey fitness con nosotros
                </Text>
              </VStack>

              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel color="#B3B3B3">Email</FormLabel>
                  <Box position="relative">
                    <Input
                      pl={10}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      bg="#252525"
                      border="1px solid"
                      borderColor="rgba(255,255,255,0.1)"
                      _hover={{ borderColor: '#FF3366' }}
                      _focus={{ borderColor: '#FF3366', boxShadow: 'none' }}
                      color="white"
                      size="lg"
                    />
                    <Icon
                      as={FaEnvelope}
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="#FF3366"
                    />
                  </Box>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="#B3B3B3">Contraseña</FormLabel>
                  <Box position="relative">
                    <Input
                      pl={10}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      bg="#252525"
                      border="1px solid"
                      borderColor="rgba(255,255,255,0.1)"
                      _hover={{ borderColor: '#FF3366' }}
                      _focus={{ borderColor: '#FF3366', boxShadow: 'none' }}
                      color="white"
                      size="lg"
                    />
                    <Icon
                      as={FaLock}
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="#FF3366"
                    />
                  </Box>
                </FormControl>
              </VStack>

              <Link 
                alignSelf="flex-end" 
                color="#FF3366"
                _hover={{ color: '#E62D5C', textDecoration: 'none' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>

              <Button
                type="submit"
                bg="#FF3366"
                color="white"
                size="lg"
                height="60px"
                fontSize="lg"
                _hover={{
                  bg: '#E62D5C',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 20px rgba(255,51,102,0.3)',
                }}
                transition="all 0.3s ease"
                isLoading={isLoading}
                loadingText="Iniciando sesión..."
              >
                Iniciar Sesión
              </Button>

              <Text color="#B3B3B3" textAlign="center">
                ¿No tienes una cuenta?{' '}
                <Link 
                  as={RouterLink} 
                  to="/register" 
                  color="#FF3366"
                  _hover={{ color: '#E62D5C', textDecoration: 'none' }}
                >
                  Regístrate aquí
                </Link>
              </Text>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
} 