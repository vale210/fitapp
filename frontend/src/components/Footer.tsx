import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  SimpleGrid,
  Icon,
  Input,
  Button,
  VStack,
  HStack,
  Divider,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'

const SocialButton = ({ icon, label, href }: { icon: any, label: string, href: string }) => {
  return (
    <Link
      href={href}
      isExternal
      _hover={{ transform: 'translateY(-2px)' }}
      transition="all 0.3s"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      w={10}
      h={10}
      rounded="full"
      bg="#FF3366"
      color="white"
    >
      <Icon as={icon} w={5} h={5} />
    </Link>
  )
}

export default function Footer() {
  return (
    <Box
      bg="#1E1E1E"
      color="white"
      borderTop="1px solid"
      borderColor="rgba(255,255,255,0.1)"
    >
      <Container maxW="7xl" py={12}>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={8}
          mb={8}
        >
          {/* Columna 1: Información de contacto */}
          <VStack align="flex-start" spacing={4}>
            <Text
              fontSize="lg"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wide"
              mb={2}
            >
              Contacto
            </Text>
            <HStack spacing={3}>
              <Icon as={FaMapMarkerAlt} color="#FF3366" w={5} h={5} />
              <Text color="#B3B3B3">Tena, Ecuador</Text>
            </HStack>
            <HStack spacing={3}>
              <Icon as={FaPhone} color="#FF3366" w={5} h={5} />
              <Text color="#B3B3B3">+593 123 456 789</Text>
            </HStack>
            <HStack spacing={3}>
              <Icon as={FaEnvelope} color="#FF3366" w={5} h={5} />
              <Text color="#B3B3B3">info@tenafit.com</Text>
            </HStack>
          </VStack>

          {/* Columna 2: Enlaces rápidos */}
          <VStack align="flex-start" spacing={4}>
            <Text
              fontSize="lg"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wide"
              mb={2}
            >
              Enlaces Rápidos
            </Text>
            <Link
              as={RouterLink}
              to="/services"
              color="#B3B3B3"
              _hover={{ color: '#FF3366', textDecoration: 'none' }}
            >
              Servicios
            </Link>
            <Link
              as={RouterLink}
              to="/about"
              color="#B3B3B3"
              _hover={{ color: '#FF3366', textDecoration: 'none' }}
            >
              Nosotros
            </Link>
            <Link
              as={RouterLink}
              to="/contact"
              color="#B3B3B3"
              _hover={{ color: '#FF3366', textDecoration: 'none' }}
            >
              Contacto
            </Link>
          </VStack>

          {/* Columna 3: Horarios */}
          <VStack align="flex-start" spacing={4}>
            <Text
              fontSize="lg"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wide"
              mb={2}
            >
              Horarios
            </Text>
            <VStack align="flex-start" spacing={2} color="#B3B3B3">
              <Text>Lunes - Viernes: 6:00 - 22:00</Text>
              <Text>Sábados: 8:00 - 20:00</Text>
              <Text>Domingos: 8:00 - 14:00</Text>
            </VStack>
          </VStack>

          {/* Columna 4: Newsletter */}
          <VStack align="flex-start" spacing={4}>
            <Text
              fontSize="lg"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wide"
              mb={2}
            >
              Newsletter
            </Text>
            <Text color="#B3B3B3">
              Suscríbete para recibir noticias y promociones
            </Text>
            <Stack direction="row" w="100%">
              <Input
                placeholder="Tu email"
                bg="#252525"
                border="1px solid"
                borderColor="rgba(255,255,255,0.1)"
                _placeholder={{ color: '#666666' }}
                _hover={{ borderColor: '#FF3366' }}
                _focus={{ borderColor: '#FF3366', boxShadow: 'none' }}
              />
              <Button
                bg="#FF3366"
                color="white"
                _hover={{ bg: '#E62D5C' }}
                px={8}
              >
                Enviar
              </Button>
            </Stack>
          </VStack>
        </SimpleGrid>

        <Divider borderColor="rgba(255,255,255,0.1)" my={8} />

        {/* Footer inferior */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          spacing={4}
        >
          <Text color="#B3B3B3">
            © 2024 Tena Fit. Todos los derechos reservados
          </Text>
          <HStack spacing={4}>
            <SocialButton icon={FaFacebook} label="Facebook" href="#" />
            <SocialButton icon={FaTwitter} label="Twitter" href="#" />
            <SocialButton icon={FaInstagram} label="Instagram" href="#" />
          </HStack>
        </Stack>
      </Container>
    </Box>
  )
} 