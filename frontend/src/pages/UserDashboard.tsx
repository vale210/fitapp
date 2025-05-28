import {
  Box,
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Stack,
  Heading,
  Text,
  Button,
  useToast,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Spinner,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Image,
  Badge,
  Icon,
  CircularProgress,
  CircularProgressLabel,
  Textarea,
  Select,
  Divider,
  Tooltip,
  useColorModeValue,
  Alert,
  AlertIcon,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { 
  FaWeight, 
  FaRunning, 
  FaCalendarCheck, 
  FaTrophy,
  FaFire,
  FaCheckCircle,
  FaClock,
  FaMedal,
  FaChartLine,
  FaRuler,
  FaBullseye,
  FaDumbbell
} from 'react-icons/fa'
import axios from 'axios'
import { getCurrentUser } from '../services/auth'
import { API_URL, PUBLIC_URL } from '../config/config'

interface ProgresoPersonal {
  pesoInicial: number
  pesoActual: number
  cambio: number
  asistenciaPorcentaje: number
  ejerciciosRealizados: Record<string, number>
  progresoDetallado: any[]
}

interface Rutina {
  id: string
  nombre: string
  descripcion: string
  nivel: string
  duracion: string
  dias_semana: string[]
  ejercicios: Array<{
    ejercicio_id: string
    series: number
    repeticiones: number
    descanso: string
    notas?: string
    detalles: {
      nombre: string
      categoria: string
      descripcion: string
      imagen: string
      musculos: string[]
    }
  }>
}

interface Objetivo {
  id: string
  descripcion: string
  fecha_limite: string
  categoria: string
  cumplido: boolean
  fecha_cumplimiento?: string
}

interface Medidas {
  pecho: number;
  cintura: number;
  cadera: number;
  brazos: number;
  piernas: number;
  fecha?: string;
}

interface Logro {
  id: string
  nombre: string
  descripcion: string
  cumplido: boolean
  progreso: number
}

interface EjercicioAsignado {
  id: string;
  fecha: string;
  ejercicio_id: string;
  series: number;
  repeticiones: number;
  notas?: string;
  completado: boolean;
  fecha_completado?: string;
  detalles: {
    nombre: string;
    categoria: string;
    descripcion: string;
    imagen: string;
    musculos: string[];
  };
}

export default function UserDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [peso, setPeso] = useState('');
  const [medidas, setMedidas] = useState<Medidas>({
    pecho: 0,
    cintura: 0,
    cadera: 0,
    brazos: 0,
    piernas: 0
  });
  const [objetivo, setObjetivo] = useState({
    descripcion: '',
    fecha_limite: '',
    categoria: 'peso'
  });
  const [progresoPersonal, setProgresoPersonal] = useState<ProgresoPersonal | null>(null);
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [logros, setLogros] = useState<Logro[]>([]);
  const [ejerciciosAsignados, setEjerciciosAsignados] = useState<EjercicioAsignado[]>([]);
  const [medidasHistorial, setMedidasHistorial] = useState<Medidas[]>([]);
  const [currentUser] = useState(getCurrentUser());
  const toast = useToast();

  const { 
    isOpen: isPesoOpen, 
    onOpen: onPesoOpen, 
    onClose: onPesoClose 
  } = useDisclosure()
  
  const { 
    isOpen: isMedidasOpen, 
    onOpen: onMedidasOpen, 
    onClose: onMedidasClose 
  } = useDisclosure()
  
  const { 
    isOpen: isObjetivoOpen, 
    onOpen: onObjetivoOpen, 
    onClose: onObjetivoClose 
  } = useDisclosure()

  // Colores para modo claro/oscuro
  const bgCard = useColorModeValue('white', 'brand.800')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200')
  const textColor = useColorModeValue('gray.800', 'white')
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400')

  useEffect(() => {
    if (currentUser?.user?.id) {
      fetchData();
      fetchEjerciciosAsignados();
    }
  }, []);

  const fetchData = async () => {
    if (!currentUser?.user?.id) return;

    setIsLoading(true);
    try {
      const [progresoRes, rutinaRes, objetivosRes, medidasRes, logrosRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/users/${currentUser.user.id}/progreso-personal`),
        axios.get(`http://localhost:3000/api/users/${currentUser.user.id}/rutina-actual`),
        axios.get(`http://localhost:3000/api/users/${currentUser.user.id}/objetivos`),
        axios.get(`http://localhost:3000/api/users/${currentUser.user.id}/medidas`),
        axios.get(`http://localhost:3000/api/users/${currentUser.user.id}/logros`)
      ]);

      setProgresoPersonal(progresoRes.data);
      setRutina(rutinaRes.data);
      setObjetivos(objetivosRes.data);
      setMedidasHistorial(medidasRes.data);
      setLogros(logrosRes.data);
    } catch (error) {
      toast({
        title: 'Error al cargar datos',
        description: 'No se pudieron cargar tus datos. Por favor, intenta más tarde.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEjerciciosAsignados = async () => {
    if (!currentUser?.user?.id) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${currentUser.user.id}/ejercicios-asignados`
      );
      setEjerciciosAsignados(response.data);
    } catch (error) {
      console.error('Error al obtener ejercicios asignados:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los ejercicios asignados',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const registrarPeso = async () => {
    if (!currentUser?.user?.id || !peso) return

    try {
      await axios.post(`http://localhost:3000/api/users/${currentUser.user.id}/registrar-progreso`, {
        tipo: 'peso',
        valor: parseFloat(peso)
      })

      toast({
        title: 'Peso registrado',
        description: 'Tu nuevo peso ha sido registrado exitosamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onPesoClose()
      fetchData()
    } catch (error) {
      toast({
        title: 'Error al registrar peso',
        description: 'No se pudo registrar el peso. Por favor, intenta de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const registrarMedidas = async () => {
    if (!currentUser?.user?.id) return;

    try {
      await axios.post(`${API_URL}/users/${currentUser.user.id}/medidas`, {
        pecho: Number(medidas.pecho),
        cintura: Number(medidas.cintura),
        cadera: Number(medidas.cadera),
        brazos: Number(medidas.brazos),
        piernas: Number(medidas.piernas)
      });

      toast({
        title: 'Medidas registradas',
        description: 'Tus medidas han sido registradas exitosamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onMedidasClose();
      fetchData();
      // Limpiar el formulario
      setMedidas({
        pecho: 0,
        cintura: 0,
        cadera: 0,
        brazos: 0,
        piernas: 0
      });
    } catch (error) {
      console.error('Error al registrar medidas:', error);
      toast({
        title: 'Error al registrar medidas',
        description: 'No se pudieron registrar las medidas. Por favor, intenta de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const crearObjetivo = async () => {
    if (!currentUser?.user?.id) return

    try {
      await axios.post(`http://localhost:3000/api/users/${currentUser.user.id}/objetivos`, objetivo)

      toast({
        title: 'Objetivo creado',
        description: 'Tu nuevo objetivo ha sido creado exitosamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onObjetivoClose()
      fetchData()
    } catch (error) {
      toast({
        title: 'Error al crear objetivo',
        description: 'No se pudo crear el objetivo. Por favor, intenta de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const marcarObjetivoCumplido = async (objetivoId: string) => {
    if (!currentUser?.user?.id) return

    try {
      await axios.patch(`http://localhost:3000/api/users/${currentUser.user.id}/objetivos/${objetivoId}`)
      fetchData()
    } catch (error) {
      toast({
        title: 'Error al actualizar objetivo',
        description: 'No se pudo actualizar el objetivo. Por favor, intenta de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const marcarEjercicioCompletado = async (ejercicioId: string) => {
    try {
      if (!currentUser) return;
      
      await axios.patch(
        `http://localhost:3000/api/users/${currentUser.user.id}/ejercicios-asignados/${ejercicioId}`
      );
      
      toast({
        title: '¡Ejercicio completado!',
        description: 'Has completado el ejercicio exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      fetchEjerciciosAsignados();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo marcar el ejercicio como completado.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh" pt="80px">
        <Container maxW="7xl" py={8}>
          <VStack spacing={4}>
            <Spinner size="xl" color="accent.500" />
            <Text>Cargando tu información...</Text>
          </VStack>
        </Container>
      </Box>
    )
  }

  return (
    <Box minH="100vh" pt="80px">
      <Container maxW="7xl" py={8}>
        <Stack spacing={8}>
          {/* Header con Bienvenida y Acciones Rápidas */}
          <HStack justify="space-between" align="center" wrap="wrap" spacing={4}>
            <VStack align="start" spacing={1}>
              <Heading size="lg" color={textColor}>¡Bienvenido, {currentUser?.user?.nombre}!</Heading>
              <Text color={textColorSecondary}>Continúa con tu progreso fitness</Text>
            </VStack>
            <HStack spacing={4}>
              <Button
                leftIcon={<FaWeight />}
                colorScheme="pink"
                onClick={onPesoOpen}
                size="sm"
              >
                Registrar Peso
              </Button>
              <Button
                leftIcon={<FaRuler />}
                colorScheme="purple"
                onClick={onMedidasOpen}
                size="sm"
              >
                Registrar Medidas
              </Button>
              <Button
                leftIcon={<FaBullseye />}
                colorScheme="blue"
                onClick={onObjetivoOpen}
                size="sm"
              >
                Nuevo Objetivo
              </Button>
            </HStack>
          </HStack>

          {/* Estadísticas Principales */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Stat
              px={6}
              py={4}
              bg={bgCard}
              rounded="xl"
              borderWidth={1}
              borderColor={borderColor}
              shadow="md"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
            >
              <StatLabel color={textColorSecondary}>
                <HStack spacing={2}>
                  <Icon as={FaWeight} />
                  <Text>Peso Actual</Text>
                </HStack>
              </StatLabel>
              <StatNumber color={textColor} fontSize="2xl">
                {progresoPersonal?.pesoActual ? `${progresoPersonal.pesoActual.toFixed(1)} kg` : 'No registrado'}
              </StatNumber>
              {progresoPersonal?.cambio && (
                <StatHelpText color={progresoPersonal.cambio < 0 ? 'green.400' : 'red.400'}>
                  <StatArrow type={progresoPersonal.cambio < 0 ? 'decrease' : 'increase'} />
                  {Math.abs(progresoPersonal.cambio).toFixed(1)} kg
                </StatHelpText>
              )}
            </Stat>

            <Stat
              px={6}
              py={4}
              bg={bgCard}
              rounded="xl"
              borderWidth={1}
              borderColor={borderColor}
              shadow="md"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
            >
              <StatLabel color={textColorSecondary}>
                <HStack spacing={2}>
                  <Icon as={FaRunning} />
                  <Text>Asistencia Semanal</Text>
                </HStack>
              </StatLabel>
              <StatNumber color={textColor} fontSize="2xl">
                {progresoPersonal?.asistenciaPorcentaje ? `${progresoPersonal.asistenciaPorcentaje.toFixed(0)}%` : '0%'}
              </StatNumber>
              <Progress 
                value={progresoPersonal?.asistenciaPorcentaje || 0} 
                size="sm" 
                colorScheme="pink" 
                mt={2}
                rounded="full"
              />
            </Stat>

            <Stat
              px={6}
              py={4}
              bg={bgCard}
              rounded="xl"
              borderWidth={1}
              borderColor={borderColor}
              shadow="md"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
            >
              <StatLabel color={textColorSecondary}>
                <HStack spacing={2}>
                  <Icon as={FaFire} />
                  <Text>Ejercicios Completados</Text>
                </HStack>
              </StatLabel>
              <StatNumber color={textColor} fontSize="2xl">
                {Object.values(progresoPersonal?.ejerciciosRealizados || {}).reduce((a, b) => a + b, 0)}
              </StatNumber>
              <Text color={textColorSecondary} fontSize="sm">Esta semana</Text>
            </Stat>

            <Stat
              px={6}
              py={4}
              bg={bgCard}
              rounded="xl"
              borderWidth={1}
              borderColor={borderColor}
              shadow="md"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
            >
              <StatLabel color={textColorSecondary}>
                <HStack spacing={2}>
                  <Icon as={FaTrophy} />
                  <Text>Objetivos Cumplidos</Text>
                </HStack>
              </StatLabel>
              <StatNumber color={textColor} fontSize="2xl">
                {objetivos.filter(o => o.cumplido).length}
              </StatNumber>
              <Text color={textColorSecondary} fontSize="sm">
                de {objetivos.length} objetivos
              </Text>
            </Stat>
          </SimpleGrid>

          {/* Contenido Principal */}
          <Tabs variant="soft-rounded" colorScheme="pink">
            <TabList>
              <Tab>
                <HStack spacing={2}>
                  <Icon as={FaDumbbell} />
                  <Text>Rutina Actual</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <Icon as={FaChartLine} />
                  <Text>Mi Progreso</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <Icon as={FaBullseye} />
                  <Text>Objetivos</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <Icon as={FaMedal} />
                  <Text>Logros</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <Icon as={FaDumbbell} />
                  <Text>Ejercicios Asignados</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* Panel de Rutina Actual */}
              <TabPanel>
                <Box p={4} borderRadius="lg" bg={useColorModeValue('white', 'gray.700')} shadow="base">
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">{rutina?.nombre}</Heading>
                    <Text>{rutina?.descripcion}</Text>
                    <HStack>
                      <Badge colorScheme="blue">{rutina?.nivel}</Badge>
                      <Badge colorScheme="green">{rutina?.duracion}</Badge>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                      {rutina?.ejercicios.map((ejercicio, index) => (
                        <Card key={index} overflow="hidden">
                          <CardBody>
                            <Image
                              src={`http://localhost:3000/public/ejercicios/${ejercicio.detalles.imagen}`}
                              alt={ejercicio.detalles.nombre}
                              borderRadius="lg"
                              fallbackSrc="https://via.placeholder.com/300x200?text=Imagen+no+disponible"
                              objectFit="cover"
                              width="100%"
                              height="200px"
                            />
                            <VStack mt={4} align="start" spacing={2}>
                              <Heading size="md">{ejercicio.detalles.nombre}</Heading>
                              <Text>{ejercicio.detalles.descripcion}</Text>
                              <HStack>
                                <Text fontWeight="bold">Series:</Text>
                                <Text>{ejercicio.series}</Text>
                                <Text fontWeight="bold">Reps:</Text>
                                <Text>{ejercicio.repeticiones}</Text>
                                <Text fontWeight="bold">Descanso:</Text>
                                <Text>{ejercicio.descanso}</Text>
                              </HStack>
                              {ejercicio.notas && (
                                <Alert status="info" variant="left-accent">
                                  <AlertIcon />
                                  <Text fontSize="sm">{ejercicio.notas}</Text>
                                </Alert>
                              )}
                              <Wrap spacing={2}>
                                {ejercicio.detalles.musculos.map((musculo, idx) => (
                                  <WrapItem key={idx}>
                                    <Badge colorScheme="purple" variant="subtle">
                                      {musculo}
                                    </Badge>
                                  </WrapItem>
                                ))}
                              </Wrap>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </Box>
              </TabPanel>

              {/* Panel de Progreso */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {/* Gráfico de Peso */}
                  <Card bg={bgCard} borderWidth={1} borderColor={borderColor}>
                    <CardBody>
                      <VStack spacing={4} align="start">
                        <Heading size="md" color={textColor}>Progreso de Peso</Heading>
                        <CircularProgress
                          value={progresoPersonal?.asistenciaPorcentaje || 0}
                          size="200px"
                          thickness="8px"
                          color="pink.400"
                        >
                          <CircularProgressLabel color={textColor}>
                            {progresoPersonal?.pesoActual?.toFixed(1) || 0}kg
                          </CircularProgressLabel>
                        </CircularProgress>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Medidas Corporales */}
                  <Card bg={bgCard} borderWidth={1} borderColor={borderColor}>
                    <CardBody>
                      <VStack spacing={4} align="start">
                        <Heading size="md" color={textColor}>Últimas Medidas</Heading>
                        {medidasHistorial.length > 0 ? (
                          <SimpleGrid columns={2} spacing={4} w="full">
                            <Stat>
                              <StatLabel>Pecho</StatLabel>
                              <StatNumber>{medidasHistorial[0].pecho} cm</StatNumber>
                            </Stat>
                            <Stat>
                              <StatLabel>Cintura</StatLabel>
                              <StatNumber>{medidasHistorial[0].cintura} cm</StatNumber>
                            </Stat>
                            <Stat>
                              <StatLabel>Cadera</StatLabel>
                              <StatNumber>{medidasHistorial[0].cadera} cm</StatNumber>
                            </Stat>
                            <Stat>
                              <StatLabel>Brazos</StatLabel>
                              <StatNumber>{medidasHistorial[0].brazos} cm</StatNumber>
                            </Stat>
                          </SimpleGrid>
                        ) : (
                          <Text color={textColorSecondary}>No hay medidas registradas</Text>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>

              {/* Panel de Objetivos */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {objetivos.map((objetivo, index) => (
                    <Card
                      key={index}
                      bg={bgCard}
                      borderWidth={1}
                      borderColor={borderColor}
                      shadow="md"
                    >
                      <CardBody>
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={2}>
                            <Badge colorScheme="blue">{objetivo.categoria}</Badge>
                            <Text color={textColor} fontSize="lg">{objetivo.descripcion}</Text>
                            <Text color={textColorSecondary} fontSize="sm">
                              Fecha límite: {new Date(objetivo.fecha_limite).toLocaleDateString()}
                            </Text>
                          </VStack>
                          {objetivo.cumplido ? (
                            <Icon as={FaCheckCircle} color="green.400" w={6} h={6} />
                          ) : (
                            <Button
                              size="sm"
                              colorScheme="green"
                              onClick={() => marcarObjetivoCumplido(objetivo.id)}
                            >
                              Completar
                            </Button>
                          )}
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </TabPanel>

              {/* Panel de Logros */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  {logros.map((logro, index) => (
                    <Card
                      key={index}
                      bg={bgCard}
                      borderWidth={1}
                      borderColor={borderColor}
                      shadow="md"
                    >
                      <CardBody>
                        <VStack spacing={4} align="center">
                          <CircularProgress
                            value={logro.progreso}
                            size="120px"
                            thickness="8px"
                            color={logro.cumplido ? "green.400" : "pink.400"}
                          >
                            <CircularProgressLabel>
                              <Icon
                                as={logro.cumplido ? FaMedal : FaClock}
                                color={logro.cumplido ? "green.400" : "pink.400"}
                                w={6}
                                h={6}
                              />
                            </CircularProgressLabel>
                          </CircularProgress>
                          <VStack spacing={1} textAlign="center">
                            <Text color={textColor} fontWeight="bold">{logro.nombre}</Text>
                            <Text color={textColorSecondary} fontSize="sm">{logro.descripcion}</Text>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </TabPanel>

              {/* Panel de Ejercicios Asignados */}
              <TabPanel>
                <Box p={4} borderRadius="lg" bg={useColorModeValue('white', 'gray.700')} shadow="base">
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">Ejercicios Asignados por tu Entrenador</Heading>
                    
                    {ejerciciosAsignados.length === 0 ? (
                      <Text color="gray.500">
                        No tienes ejercicios asignados actualmente.
                      </Text>
                    ) : (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {ejerciciosAsignados.map((ejercicio) => (
                          <Card key={ejercicio.id} overflow="hidden">
                            <CardBody>
                              <Image
                                src={`${PUBLIC_URL}/ejercicios/${ejercicio.detalles.imagen}`}
                                alt={ejercicio.detalles.nombre}
                                borderRadius="lg"
                                fallbackSrc="/placeholder-exercise.jpg"
                                objectFit="cover"
                                width="100%"
                                height="200px"
                              />
                              <VStack mt={4} align="start" spacing={2}>
                                <Heading size="md">{ejercicio.detalles.nombre}</Heading>
                                <Text>{ejercicio.detalles.descripcion}</Text>
                                <HStack>
                                  <Text fontWeight="bold">Series:</Text>
                                  <Text>{ejercicio.series}</Text>
                                  <Text fontWeight="bold">Reps:</Text>
                                  <Text>{ejercicio.repeticiones}</Text>
                                </HStack>
                                {ejercicio.notas && (
                                  <Alert status="info" variant="left-accent">
                                    <AlertIcon />
                                    <Text fontSize="sm">{ejercicio.notas}</Text>
                                  </Alert>
                                )}
                                <Wrap spacing={2}>
                                  {ejercicio.detalles.musculos.map((musculo, idx) => (
                                    <WrapItem key={idx}>
                                      <Badge colorScheme="purple" variant="subtle">
                                        {musculo}
                                      </Badge>
                                    </WrapItem>
                                  ))}
                                </Wrap>
                                {!ejercicio.completado ? (
                                  <Button
                                    colorScheme="green"
                                    leftIcon={<Icon as={FaCheckCircle} />}
                                    onClick={() => marcarEjercicioCompletado(ejercicio.id)}
                                    w="full"
                                  >
                                    Marcar como Completado
                                  </Button>
                                ) : (
                                  <Alert status="success" variant="subtle">
                                    <AlertIcon />
                                    <Text fontSize="sm">
                                      Completado el{' '}
                                      {new Date(ejercicio.fecha_completado!).toLocaleDateString()}
                                    </Text>
                                  </Alert>
                                )}
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    )}
                  </VStack>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>

        {/* Modal para registrar peso */}
        <Modal isOpen={isPesoOpen} onClose={onPesoClose}>
          <ModalOverlay 
            bg='blackAlpha.300'
            backdropFilter='blur(10px)'
          />
          <ModalContent bg={bgCard}>
            <ModalHeader color={textColor}>Registrar Nuevo Peso</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel color={textColorSecondary}>Peso (kg)</FormLabel>
                <Input
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  type="number"
                  placeholder="Ingresa tu peso"
                  bg={useColorModeValue('white', 'brand.700')}
                  borderColor={borderColor}
                />
              </FormControl>
              <Button
                colorScheme="pink"
                mr={3}
                mt={4}
                onClick={registrarPeso}
                w="full"
              >
                Guardar
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Modal para registrar medidas */}
        <Modal isOpen={isMedidasOpen} onClose={onMedidasClose}>
          <ModalOverlay 
            bg='blackAlpha.300'
            backdropFilter='blur(10px)'
          />
          <ModalContent bg={bgCard}>
            <ModalHeader color={textColor}>Registrar Medidas Corporales</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel color={textColorSecondary}>Pecho (cm)</FormLabel>
                  <Input
                    type="number"
                    value={medidas.pecho}
                    onChange={(e) => setMedidas({...medidas, pecho: Number(e.target.value)})}
                    bg={useColorModeValue('white', 'brand.700')}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={textColorSecondary}>Cintura (cm)</FormLabel>
                  <Input
                    type="number"
                    value={medidas.cintura}
                    onChange={(e) => setMedidas({...medidas, cintura: Number(e.target.value)})}
                    bg={useColorModeValue('white', 'brand.700')}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={textColorSecondary}>Cadera (cm)</FormLabel>
                  <Input
                    type="number"
                    value={medidas.cadera}
                    onChange={(e) => setMedidas({...medidas, cadera: Number(e.target.value)})}
                    bg={useColorModeValue('white', 'brand.700')}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={textColorSecondary}>Brazos (cm)</FormLabel>
                  <Input
                    type="number"
                    value={medidas.brazos}
                    onChange={(e) => setMedidas({...medidas, brazos: Number(e.target.value)})}
                    bg={useColorModeValue('white', 'brand.700')}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={textColorSecondary}>Piernas (cm)</FormLabel>
                  <Input
                    type="number"
                    value={medidas.piernas}
                    onChange={(e) => setMedidas({...medidas, piernas: Number(e.target.value)})}
                    bg={useColorModeValue('white', 'brand.700')}
                    borderColor={borderColor}
                  />
                </FormControl>
              </SimpleGrid>
              <Button
                colorScheme="purple"
                mt={6}
                w="full"
                onClick={registrarMedidas}
              >
                Guardar Medidas
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Modal para nuevo objetivo */}
        <Modal isOpen={isObjetivoOpen} onClose={onObjetivoClose}>
          <ModalOverlay 
            bg='blackAlpha.300'
            backdropFilter='blur(10px)'
          />
          <ModalContent bg={bgCard}>
            <ModalHeader color={textColor}>Crear Nuevo Objetivo</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel color={textColorSecondary}>Descripción</FormLabel>
                  <Textarea
                    value={objetivo.descripcion}
                    onChange={(e) => setObjetivo({...objetivo, descripcion: e.target.value})}
                    placeholder="Describe tu objetivo"
                    bg={useColorModeValue('white', 'brand.700')}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={textColorSecondary}>Categoría</FormLabel>
                  <Select
                    value={objetivo.categoria}
                    onChange={(e) => setObjetivo({...objetivo, categoria: e.target.value})}
                    bg={useColorModeValue('white', 'brand.700')}
                    borderColor={borderColor}
                  >
                    <option value="peso">Peso</option>
                    <option value="medidas">Medidas</option>
                    <option value="fuerza">Fuerza</option>
                    <option value="resistencia">Resistencia</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel color={textColorSecondary}>Fecha Límite</FormLabel>
                  <Input
                    type="date"
                    value={objetivo.fecha_limite}
                    onChange={(e) => setObjetivo({...objetivo, fecha_limite: e.target.value})}
                    bg={useColorModeValue('white', 'brand.700')}
                    borderColor={borderColor}
                  />
                </FormControl>
                <Button
                  colorScheme="blue"
                  w="full"
                  onClick={crearObjetivo}
                >
                  Crear Objetivo
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  )
} 