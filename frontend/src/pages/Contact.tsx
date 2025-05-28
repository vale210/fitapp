import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  IconButton,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const ContactInfo = ({ icon, title, text, link }: { icon: any; title: string; text: string; link?: string }) => {
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <VStack
        bg="#1E1E1E"
        p={8}
        rounded="xl"
        spacing={4}
        align="flex-start"
        borderWidth={1}
        borderColor="rgba(255,255,255,0.1)"
        _hover={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        }}
      >
        <Flex
          w={16}
          h={16}
          align="center"
          justify="center"
          rounded="full"
          bg="#FF3366"
        >
          <Icon as={icon} w={8} h={8} color="white" />
        </Flex>
        <VStack align="flex-start" spacing={2}>
          <Text fontSize="xl" fontWeight="bold" color="white">
            {title}
          </Text>
          <Text color="#B3B3B3" fontSize="md">
            {text}
          </Text>
          {link && (
            <Button
              variant="link"
              color="#FF3366"
              _hover={{ color: '#E62D5C' }}
              p={0}
            >
              {link}
            </Button>
          )}
        </VStack>
      </VStack>
    </MotionBox>
  )
}

const SocialButton = ({ icon, label }: { icon: any; label: string }) => {
  return (
    <IconButton
      aria-label={label}
      variant="ghost"
      size="lg"
      isRound={true}
      _hover={{
        bg: '#FF3366',
        transform: 'translateY(-2px)',
      }}
      icon={<Icon as={icon} w={6} h={6} />}
      transition="all 0.3s ease"
      color="white"
    />
  )
}

export default function Contact() {
  return (
    <Box bg="#121212" minH="100vh" pt={{ base: "80px", md: "100px" }} pb="100px">
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        {/* Header Section */}
        <VStack spacing={4} align="center" mb={16}>
          <Text
            color="#FF3366"
            fontWeight="bold"
            fontSize="lg"
            letterSpacing="wide"
            textTransform="uppercase"
          >
            Contáctanos
          </Text>
          <Heading
            color="white"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            textAlign="center"
            maxW="800px"
            lineHeight="shorter"
          >
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte
          </Heading>
          <Text
            color="#B3B3B3"
            fontSize="lg"
            textAlign="center"
            maxW="2xl"
          >
            Nuestro equipo está disponible para responder todas tus dudas y ayudarte a comenzar tu journey fitness
          </Text>
        </VStack>

        {/* Contact Info Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={16}>
          <ContactInfo
            icon={FaMapMarkerAlt}
            title="Ubicación"
            text="Av. 15 de Noviembre, Tena, Ecuador"
            link="Ver en Google Maps"
          />
          <ContactInfo
            icon={FaPhone}
            title="Teléfono"
            text="+593 123 456 789"
            link="Llamar ahora"
          />
          <ContactInfo
            icon={FaEnvelope}
            title="Email"
            text="info@tenafit.com"
            link="Enviar email"
          />
        </SimpleGrid>

        {/* Contact Form */}
        <Box
          bg="#1E1E1E"
          rounded="2xl"
          p={{ base: 8, md: 16 }}
          borderWidth={1}
          borderColor="rgba(255,255,255,0.1)"
          boxShadow="2xl"
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={16}>
            <VStack spacing={8} align="flex-start">
              <VStack align="flex-start" spacing={4}>
                <Heading color="white" fontSize="2xl">
                  Envíanos un mensaje
                </Heading>
                <Text color="#B3B3B3">
                  Completa el formulario y te responderemos lo antes posible
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <FormControl>
                  <FormLabel color="#B3B3B3">Nombre</FormLabel>
                  <Input
                    bg="#252525"
                    border="1px solid"
                    borderColor="rgba(255,255,255,0.1)"
                    _hover={{ borderColor: '#FF3366' }}
                    _focus={{ borderColor: '#FF3366', boxShadow: 'none' }}
                    color="white"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="#B3B3B3">Email</FormLabel>
                  <Input
                    bg="#252525"
                    border="1px solid"
                    borderColor="rgba(255,255,255,0.1)"
                    _hover={{ borderColor: '#FF3366' }}
                    _focus={{ borderColor: '#FF3366', boxShadow: 'none' }}
                    color="white"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel color="#B3B3B3">Mensaje</FormLabel>
                <Textarea
                  bg="#252525"
                  border="1px solid"
                  borderColor="rgba(255,255,255,0.1)"
                  _hover={{ borderColor: '#FF3366' }}
                  _focus={{ borderColor: '#FF3366', boxShadow: 'none' }}
                  h="200px"
                  color="white"
                />
              </FormControl>

              <Button
                bg="#FF3366"
                color="white"
                size="lg"
                w="full"
                _hover={{
                  bg: '#E62D5C',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 20px rgba(255,51,102,0.3)',
                }}
                transition="all 0.3s ease"
              >
                Enviar Mensaje
              </Button>
            </VStack>

            <VStack spacing={8} align="flex-start">
              <VStack align="flex-start" spacing={4}>
                <Heading color="white" fontSize="2xl">
                  Síguenos en redes sociales
                </Heading>
                <Text color="#B3B3B3">
                  Mantente al día con nuestras últimas novedades y promociones
                </Text>
              </VStack>

              <HStack spacing={4}>
                <SocialButton icon={FaFacebook} label="Facebook" />
                <SocialButton icon={FaTwitter} label="Twitter" />
                <SocialButton icon={FaInstagram} label="Instagram" />
                <SocialButton icon={FaWhatsapp} label="WhatsApp" />
              </HStack>

              <Box
                bg="#252525"
                p={8}
                rounded="xl"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.1)"
                w="full"
              >
                <VStack align="flex-start" spacing={4}>
                  <Heading color="white" fontSize="xl">
                    Horario de Atención
                  </Heading>
                  <VStack align="flex-start" spacing={2} color="#B3B3B3">
                    <Text>Lunes - Viernes: 6:00 - 22:00</Text>
                    <Text>Sábados: 8:00 - 20:00</Text>
                    <Text>Domingos: 8:00 - 14:00</Text>
                  </VStack>
                </VStack>
              </Box>
            </VStack>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  )
} 