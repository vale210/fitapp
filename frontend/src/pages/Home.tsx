import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { 
  FaDumbbell, 
  FaHeartbeat, 
  FaUsers, 
  FaCheckCircle, 
  FaFire, 
  FaClock,
  FaRunning,
  FaAppleAlt,
  FaChartLine,
  FaTrophy,
  FaBolt,
  FaMedal,
} from 'react-icons/fa'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const Feature = ({ icon, title, text }: { icon: any; title: string; text: string }) => {
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Stack
        bg="#1E1E1E"
        p={8}
        rounded="xl"
        spacing={4}
        height="full"
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
          mb={2}
        >
          <Icon as={icon} w={8} h={8} color="white" />
        </Flex>
        <Text fontSize="xl" fontWeight="bold" color="white">
          {title}
        </Text>
        <Text color="#B3B3B3" fontSize="md">
          {text}
        </Text>
      </Stack>
    </MotionBox>
  )
}

const Program = ({ icon, title, description, price }: { icon: any; title: string; description: string; price: string }) => {
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Stack
        bg="#1E1E1E"
        p={8}
        rounded="xl"
        spacing={4}
        height="full"
        borderWidth={1}
        borderColor="rgba(255,255,255,0.1)"
        position="relative"
        overflow="hidden"
        _hover={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        }}
      >
        <Box
          position="absolute"
          top={0}
          right={0}
          bg="#FF3366"
          color="white"
          py={2}
          px={4}
          borderBottomLeftRadius="xl"
        >
          {price}
        </Box>
        <Flex
          w={16}
          h={16}
          align="center"
          justify="center"
          rounded="full"
          bg="#FF3366"
          mb={2}
        >
          <Icon as={icon} w={8} h={8} color="white" />
        </Flex>
        <Text fontSize="xl" fontWeight="bold" color="white">
          {title}
        </Text>
        <Text color="#B3B3B3" fontSize="md">
          {description}
        </Text>
        <Button
          mt={4}
          bg="#FF3366"
          color="white"
          _hover={{
            bg: '#E62D5C',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 20px rgba(255,51,102,0.3)',
          }}
          transition="all 0.3s ease"
        >
          Comenzar Ahora
        </Button>
      </Stack>
    </MotionBox>
  )
}

const StatBox = ({ icon, number, text }: { icon: any; number: string; text: string }) => {
  return (
    <VStack
      bg="#1E1E1E"
      p={8}
      rounded="xl"
      spacing={4}
      align="center"
      borderWidth={1}
      borderColor="rgba(255,255,255,0.1)"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      }}
      transition="all 0.3s ease"
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
      <Text fontSize="4xl" fontWeight="bold" color="white">
        {number}
      </Text>
      <Text color="#B3B3B3" fontSize="lg" textAlign="center">
        {text}
      </Text>
    </VStack>
  )
}

export default function Home() {
  return (
    <Box as="main" bg="#121212">
      {/* Hero Section */}
      <Box
        position="relative"
        height="100vh"
        width="full"
        overflow="hidden"
      >
        {/* Background image */}
        <Image
          alt="Hero Image"
          fit="cover"
          align="center"
          w="100%"
          h="100%"
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
          position="absolute"
          top={0}
          left={0}
          loading="eager"
        />

        {/* Overlay */}
        <Box
          position="absolute"
          width="100%"
          height="100%"
          bg="blackAlpha.700"
          backdropFilter="blur(2px)"
        />

        {/* Hero content */}
        <Container maxW="7xl" h="100%" position="relative">
          <Flex
            direction="column"
            align="center"
            justify="center"
            h="100%"
            textAlign="center"
            px={4}
          >
            <Heading
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              color="white"
              lineHeight="1.2"
              fontWeight="bold"
              textShadow="2px 2px 4px rgba(0,0,0,0.4)"
              mb={6}
            >
              TRANSFORMA TU CUERPO
              <Text as="span" display="block" color="#FF3366">
                TRANSFORMA TU VIDA
              </Text>
            </Heading>
            <Text
              fontSize={{ base: 'lg', lg: 'xl' }}
              color="gray.100"
              maxW="2xl"
              mb={8}
            >
              En Tena Fit, te ayudamos a alcanzar tus objetivos fitness con entrenadores expertos, 
              equipamiento de última generación y una comunidad que te apoya en cada paso.
            </Text>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              spacing={4}
              w={{ base: 'full', sm: 'auto' }}
            >
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                px={8}
                fontSize="lg"
                height="14"
                bg="#FF3366"
                color="white"
                fontWeight="bold"
                _hover={{
                  bg: '#E62D5C',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 20px rgba(255,51,102,0.3)',
                }}
                transition="all 0.3s ease"
              >
                Empieza Ahora
              </Button>
              <Button
                as={RouterLink}
                to="/services"
                variant="outline"
                size="lg"
                px={8}
                fontSize="lg"
                height="14"
                color="white"
                borderColor="white"
                _hover={{
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.3s ease"
              >
                Nuestros Servicios
              </Button>
            </Stack>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW="7xl">
          <VStack spacing={4} align="center" mb={16}>
            <Text
              color="#FF3366"
              fontWeight="bold"
              fontSize="lg"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Nuestros Servicios
            </Text>
            <Heading
              color="white"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              textAlign="center"
              maxW="800px"
            >
              Todo lo que necesitas para alcanzar tus metas
            </Heading>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            <Feature
              icon={FaDumbbell}
              title="Entrenamiento Personalizado"
              text="Programas diseñados específicamente para tus objetivos y nivel de experiencia."
            />
            <Feature
              icon={FaHeartbeat}
              title="Evaluación Física"
              text="Seguimiento detallado de tu progreso con métricas precisas y ajustes continuos."
            />
            <Feature
              icon={FaUsers}
              title="Clases Grupales"
              text="Variedad de clases dinámicas dirigidas por instructores certificados."
            />
            <Feature
              icon={FaAppleAlt}
              title="Asesoría Nutricional"
              text="Planes de alimentación personalizados para optimizar tus resultados."
            />
            <Feature
              icon={FaBolt}
              title="HIIT y Cardio"
              text="Sesiones de alta intensidad para maximizar la quema de calorías."
            />
            <Feature
              icon={FaMedal}
              title="Preparación Deportiva"
              text="Entrenamiento especializado para deportistas y competidores."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Programs Section */}
      <Box py={20} bg="#1A1A1A">
        <Container maxW="7xl">
          <VStack spacing={4} align="center" mb={16}>
            <Text
              color="#FF3366"
              fontWeight="bold"
              fontSize="lg"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Nuestros Programas
            </Text>
            <Heading
              color="white"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              textAlign="center"
              maxW="800px"
            >
              Elige el plan que mejor se adapte a ti
            </Heading>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Program
              icon={FaRunning}
              title="Plan Básico"
              description="Acceso a instalaciones y clases grupales básicas. Ideal para principiantes."
              price="$30/mes"
            />
            <Program
              icon={FaDumbbell}
              title="Plan Premium"
              description="Incluye entrenador personal, nutricionista y acceso ilimitado a clases."
              price="$50/mes"
            />
            <Program
              icon={FaTrophy}
              title="Plan Elite"
              description="Todo incluido más sesiones personalizadas y seguimiento premium."
              price="$80/mes"
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={20}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            <StatBox icon={FaUsers} number="500+" text="Miembros Activos" />
            <StatBox icon={FaDumbbell} number="50+" text="Equipos Premium" />
            <StatBox icon={FaFire} number="30+" text="Clases Semanales" />
            <StatBox icon={FaClock} number="24/7" text="Acceso al Gimnasio" />
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20}>
        <Container maxW="7xl">
          <Box
            bg="#1E1E1E"
            rounded="2xl"
            p={{ base: 8, md: 16 }}
            position="relative"
            overflow="hidden"
            borderWidth={1}
            borderColor="rgba(255,255,255,0.1)"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="linear-gradient(135deg, #FF3366 0%, rgba(255,51,102,0.2) 100%)"
              opacity={0.1}
            />

            <VStack spacing={8} position="relative" align="center" textAlign="center">
              <Heading
                color="white"
                fontSize={{ base: "3xl", md: "4xl" }}
                lineHeight="shorter"
                fontWeight="bold"
              >
                ¿Listo para transformar tu vida?
              </Heading>
              <Text color="#B3B3B3" fontSize="xl" maxW="2xl">
                Únete ahora y obtén 7 días de prueba gratis. Sin compromisos, cancela cuando quieras.
              </Text>
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                height="16"
                px="12"
                fontSize="xl"
                bg="#FF3366"
                color="white"
                _hover={{
                  bg: '#E62D5C',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 20px rgba(255,51,102,0.3)',
                }}
                transition="all 0.3s ease"
              >
                Comienza Tu Prueba Gratis
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
} 