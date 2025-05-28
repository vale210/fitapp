import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Stack,
  Icon,
  Image,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaDumbbell, FaRunning, FaHeartbeat, FaAppleAlt, FaChartLine, FaUsers } from 'react-icons/fa'
import type { IconType } from 'react-icons'

const MotionBox = motion(Box)

interface Feature {
  id: number
  title: string
  description: string
  icon: IconType
  image: string
}

interface ServiceCardProps {
  title: string
  description: string
  icon: IconType
  image: string
}

const features: Feature[] = [
  {
    id: 1,
    title: 'Entrenamiento Personal',
    description: 'Sesiones personalizadas con entrenadores certificados para alcanzar tus objetivos de forma eficiente y segura.',
    icon: FaDumbbell,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
  },
  {
    id: 2,
    title: 'Clases Grupales',
    description: 'Desde yoga hasta HIIT, nuestras clases grupales te mantendrán motivado mientras alcanzas tus metas fitness.',
    icon: FaUsers,
    image: 'https://images.unsplash.com/photo-1571388208497-dc68a27775ef',
  },
  {
    id: 3,
    title: 'Área de Peso Libre',
    description: 'Zona equipada con pesas, barras y máquinas de última generación para tu entrenamiento de fuerza.',
    icon: FaDumbbell,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
  },
  {
    id: 4,
    title: 'Cardio y Resistencia',
    description: 'Equipamiento moderno para mejorar tu resistencia cardiovascular y quemar calorías de manera efectiva.',
    icon: FaRunning,
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c',
  },
  {
    id: 5,
    title: 'Nutrición Deportiva',
    description: 'Asesoramiento nutricional personalizado para optimizar tus resultados y mejorar tu rendimiento.',
    icon: FaAppleAlt,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
  },
  {
    id: 6,
    title: 'Seguimiento de Progreso',
    description: 'Evaluaciones periódicas y seguimiento detallado de tu evolución con métricas precisas.',
    icon: FaChartLine,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
  },
]

const ServiceCard = ({ title, description, icon, image }: ServiceCardProps) => {
  return (
    <MotionBox
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        maxW="100%"
        bg="#1E1E1E"
        rounded="xl"
        overflow="hidden"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        position="relative"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
          bg: '#252525'
        }}
        transition="all 0.3s ease"
      >
        <Box 
          h="200px" 
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)"
            zIndex="1"
          />
          <Image
            src={image}
            alt={title}
            w="100%"
            h="100%"
            objectFit="cover"
            transition="0.3s ease"
            _hover={{
              transform: 'scale(1.1)',
            }}
          />
        </Box>
        <Box p={6} position="relative">
          <Stack spacing={4}>
            <HStack spacing={3}>
              <Box
                bg="#FF3366"
                p={2}
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon 
                  as={icon} 
                  w={5} 
                  h={5} 
                  color="white"
                />
              </Box>
              <Heading
                color="white"
                fontSize="xl"
                fontWeight="bold"
                letterSpacing="tight"
              >
                {title}
              </Heading>
            </HStack>
            <Text 
              color="#B3B3B3"
              fontSize="md"
              lineHeight="1.7"
            >
              {description}
            </Text>
          </Stack>
        </Box>
      </Box>
    </MotionBox>
  )
}

export default function Services() {
  return (
    <Box 
      minH="100vh" 
      bg="#121212" 
      pt={{ base: "80px", md: "100px" }} 
      pb="100px"
    >
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={8} textAlign="center" mb={16}>
          <Heading
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            color="white"
            fontWeight="800"
            letterSpacing="tight"
            lineHeight="1.2"
          >
            Nuestros Servicios
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="#B3B3B3"
            maxW="2xl"
            lineHeight="1.8"
          >
            En Tena Fit ofrecemos todo lo que necesitas para transformar tu cuerpo y alcanzar tus metas fitness
          </Text>
        </VStack>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: 6, md: 8, lg: 10 }}
          mt={8}
        >
          {features.map((feature) => (
            <ServiceCard key={feature.id} {...feature} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
} 