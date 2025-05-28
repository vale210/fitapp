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
  SimpleGrid,
  HStack,
  useToast,
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaDumbbell, FaHeart, FaBolt } from 'react-icons/fa'
import { register } from '../services/auth'

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({
        title: 'Error de validación',
        description: 'Las contraseñas no coinciden',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await register({ nombre, email, password })
      toast({
        title: '¡Registro exitoso!',
        description: `Bienvenido ${response.user.nombre} a la familia TenaFit`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      navigate('/')
    } catch (error: any) {
      toast({
        title: 'Error al registrarse',
        description: error.response?.data?.message || 'El email ya está registrado',
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
        right="-200px"
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
        left="-200px"
      />

      <Container maxW="7xl" position="relative" px={{ base: 4, md: 8 }}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={16} align="center">
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
            order={{ base: 2, md: 1 }}
          >
            <VStack spacing={8} align="stretch" as="form" onSubmit={handleSubmit}>
              <VStack spacing={3} align="center">
                <Heading 
                  fontSize={{ base: "3xl", md: "4xl" }}
                  color="white"
                  fontWeight="bold"
                >
                  Únete a la familia
                </Heading>
                <Text fontSize="lg" color="#B3B3B3" textAlign="center">
                  Comienza tu transformación fitness hoy mismo
                </Text>
              </VStack>

              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel color="#B3B3B3">Nombre</FormLabel>
                  <Box position="relative">
                    <Input
                      pl={10}
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      bg="#252525"
                      border="1px solid"
                      borderColor="rgba(255,255,255,0.1)"
                      _hover={{ borderColor: '#FF3366' }}
                      _focus={{ borderColor: '#FF3366', boxShadow: 'none' }}
                      color="white"
                      size="lg"
                    />
                    <Icon
                      as={FaUser}
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="#FF3366"
                    />
                  </Box>
                </FormControl>

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

                <FormControl isRequired>
                  <FormLabel color="#B3B3B3">Confirmar Contraseña</FormLabel>
                  <Box position="relative">
                    <Input
                      pl={10}
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      bg="#252525"
                      border="1px solid"
                      borderColor="rgba(255,255,255,0.1)"
                      _hover={{ borderColor: '#FF3366' }}
                      _focus={{ borderColor: '#FF3366', boxShadow: 'none' }}
                      color="white"
                      size="lg"
                    />
                    <Icon
                      as={FaCheckCircle}
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="#FF3366"
                    />
                  </Box>
                </FormControl>
              </VStack>

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
                loadingText="Creando cuenta..."
              >
                Crear Cuenta
              </Button>

              <Text color="#B3B3B3" textAlign="center">
                ¿Ya tienes una cuenta?{' '}
                <Link 
                  as={RouterLink} 
                  to="/login" 
                  color="#FF3366"
                  _hover={{ color: '#E62D5C', textDecoration: 'none' }}
                >
                  Inicia sesión aquí
                </Link>
              </Text>
            </VStack>
          </Box>

          {/* Beneficios */}
          <VStack 
            flex={1} 
            spacing={8} 
            align="stretch"
            display={{ base: 'none', md: 'flex' }}
            order={{ base: 1, md: 2 }}
          >
            <Heading
              color="white"
              fontSize="2xl"
              fontWeight="bold"
            >
              Beneficios de unirte
            </Heading>

            <SimpleGrid columns={1} spacing={6}>
              <HStack 
                bg="#1E1E1E"
                p={6}
                borderRadius="xl"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.1)"
                spacing={4}
                _hover={{
                  transform: 'translateX(10px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                }}
                transition="all 0.3s ease"
              >
                <Flex
                  bg="#FF3366"
                  w={12}
                  h={12}
                  rounded="xl"
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Icon as={FaDumbbell} w={6} h={6} color="white" />
                </Flex>
                <VStack align="start" spacing={1}>
                  <Text color="white" fontWeight="bold">Entrenamiento Personalizado</Text>
                  <Text color="#B3B3B3">Programas adaptados a tus objetivos y nivel</Text>
                </VStack>
              </HStack>

              <HStack 
                bg="#1E1E1E"
                p={6}
                borderRadius="xl"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.1)"
                spacing={4}
                _hover={{
                  transform: 'translateX(10px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                }}
                transition="all 0.3s ease"
              >
                <Flex
                  bg="#FF3366"
                  w={12}
                  h={12}
                  rounded="xl"
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Icon as={FaHeart} w={6} h={6} color="white" />
                </Flex>
                <VStack align="start" spacing={1}>
                  <Text color="white" fontWeight="bold">Comunidad Motivada</Text>
                  <Text color="#B3B3B3">Únete a una familia fitness que te apoya</Text>
                </VStack>
              </HStack>

              <HStack 
                bg="#1E1E1E"
                p={6}
                borderRadius="xl"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.1)"
                spacing={4}
                _hover={{
                  transform: 'translateX(10px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                }}
                transition="all 0.3s ease"
              >
                <Flex
                  bg="#FF3366"
                  w={12}
                  h={12}
                  rounded="xl"
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Icon as={FaBolt} w={6} h={6} color="white" />
                </Flex>
                <VStack align="start" spacing={1}>
                  <Text color="white" fontWeight="bold">Resultados Garantizados</Text>
                  <Text color="#B3B3B3">Seguimiento y ajustes continuos de tu progreso</Text>
                </VStack>
              </HStack>
            </SimpleGrid>
          </VStack>
        </Flex>
      </Container>
    </Box>
  )
} 