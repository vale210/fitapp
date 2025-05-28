import {
  Box,
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  Icon,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaDumbbell, FaUsers, FaMedal, FaHeart } from 'react-icons/fa'

const MotionBox = motion(Box)

interface StatProps {
  label: string
  value: string
}

const Stat = ({ label, value }: StatProps) => {
  return (
    <VStack
      bg="#1E1E1E"
      p={8}
      rounded="xl"
      spacing={2}
      align="center"
      borderWidth={1}
      borderColor="rgba(255,255,255,0.1)"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      }}
      transition="all 0.3s ease"
    >
      <Text fontSize="4xl" fontWeight="bold" color="#FF3366">
        {value}
      </Text>
      <Text fontSize="lg" color="#B3B3B3">
        {label}
      </Text>
    </VStack>
  )
}

interface FeatureProps {
  title: string
  text: string
  icon: any
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack
      bg="#1E1E1E"
      p={6}
      rounded="xl"
      spacing={4}
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
  )
}

export default function About() {
  return (
    <Box bg="#121212" minH="100vh" pt={{ base: "80px", md: "100px" }} pb="100px">
      {/* Hero Section */}
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20}>
          <Stack spacing={6}>
            <Text
              color="#FF3366"
              fontWeight="bold"
              fontSize="lg"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              Nuestra Historia
            </Text>
            <Heading
              color="white"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              lineHeight="shorter"
              fontWeight="bold"
              letterSpacing="tight"
            >
              Transformando vidas desde 2020
            </Heading>
            <Text color="#B3B3B3" fontSize="lg" lineHeight="tall">
              En Tena Fit, nos dedicamos a ayudar a las personas a alcanzar sus objetivos fitness
              y transformar sus vidas. Nuestro compromiso con la excelencia y la atención
              personalizada nos ha convertido en el gimnasio líder de la región.
            </Text>
            <Button
              bg="#FF3366"
              color="white"
              size="lg"
              height="14"
              px="8"
              fontSize="md"
              _hover={{
                bg: '#E62D5C',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 20px rgba(255,51,102,0.3)',
              }}
              transition="all 0.3s ease"
            >
              Conoce Más
            </Button>
          </Stack>
          <Box position="relative">
            <Image
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
              alt="Gimnasio"
              rounded="2xl"
              objectFit="cover"
              w="full"
              h="500px"
              boxShadow="2xl"
            />
            <Box
              position="absolute"
              top={0}
              left={0}
              w="full"
              h="full"
              bg="linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)"
              rounded="2xl"
            />
          </Box>
        </SimpleGrid>

        {/* Stats Section */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mt={20}>
          <Stat label="Miembros Activos" value="500+" />
          <Stat label="Entrenadores" value="20+" />
          <Stat label="Metros Cuadrados" value="1000" />
          <Stat label="Años de Experiencia" value="4+" />
        </SimpleGrid>

        {/* Features Section */}
        <Box mt={20}>
          <VStack spacing={4} align="center" mb={12}>
            <Text
              color="#FF3366"
              fontWeight="bold"
              fontSize="lg"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              ¿Por qué elegirnos?
            </Text>
            <Heading
              color="white"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              textAlign="center"
              maxW="800px"
            >
              Comprometidos con tu éxito fitness
            </Heading>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Feature
              icon={FaDumbbell}
              title="Equipamiento de Primera"
              text="Contamos con máquinas y equipos de última generación para garantizar un entrenamiento efectivo y seguro."
            />
            <Feature
              icon={FaUsers}
              title="Entrenadores Expertos"
              text="Nuestro equipo de profesionales certificados te guiará en cada paso de tu journey fitness."
            />
            <Feature
              icon={FaMedal}
              title="Programas Personalizados"
              text="Desarrollamos planes de entrenamiento adaptados a tus objetivos y nivel de experiencia."
            />
            <Feature
              icon={FaHeart}
              title="Comunidad Comprometida"
              text="Forma parte de una comunidad que te motiva y apoya en tu transformación."
            />
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  )
} 