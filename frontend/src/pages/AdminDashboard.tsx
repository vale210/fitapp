import {
  Box,
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Heading,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  HStack,
  VStack,
  Icon,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Tooltip,
  CircularProgress,
  CircularProgressLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  FaUserPlus,
  FaUserMinus,
  FaUsers,
  FaSearch,
  FaDownload,
  FaSync,
  FaEdit,
  FaTrash,
  FaChartLine,
  FaCheckCircle,
  FaUserCheck,
  FaCalendarCheck,
  FaPercent,
  FaMars,
  FaVenus,
  FaDumbbell,
  FaBan,
  FaCheck,
  FaPlus,
} from 'react-icons/fa'
import { SearchIcon, DownloadIcon, RepeatIcon } from '@chakra-ui/icons'
import { API_URL } from '../config/config'

interface User {
  id: string
  nombre: string
  email: string
  rol: string
  estado: string
  fechaRegistro: string
  ultimoAcceso: string
}

interface EditUserData {
  id: string
  nombre: string
  email: string
  password: string
}

interface Estadisticas {
  totalUsuarios: number
  usuariosActivos: number
  usuariosNuevos: number
  usuariosInactivos: number
  progresoPromedio: number
  asistenciaSemanal: number
  objetivosCumplidos: number
}

interface Ejercicio {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  imagen: string;
  musculos: string[];
  nivel: string;
}

interface AsignarEjercicioData {
  ejercicio_id: string;
  series: number;
  repeticiones: number;
  notas?: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState<EditUserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([])
  const [isAsignarOpen, setIsAsignarOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [asignarData, setAsignarData] = useState<AsignarEjercicioData>({
    ejercicio_id: '',
    series: 3,
    repeticiones: 12,
    notas: ''
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const bgColor = useColorModeValue('white', '#1E1E1E')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100')
  const textColor = useColorModeValue('gray.800', 'white')
  const statBgColor = useColorModeValue('white', '#252525')

  const [nuevoEjercicio, setNuevoEjercicio] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    musculos: [] as string[],
    nivel: '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isCrearEjercicioOpen, setIsCrearEjercicioOpen] = useState(false);

  useEffect(() => {
    fetchUsers()
    fetchEstadisticas()
    fetchEjercicios()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('http://localhost:3000/api/users')
      setUsers(response.data)
      toast({
        title: 'Usuarios cargados',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error al cargar usuarios',
        description: 'No se pudieron cargar los usuarios',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEstadisticas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users/estadisticas')
      setEstadisticas(response.data)
    } catch (error) {
      toast({
        title: 'Error al cargar estadísticas',
        description: 'No se pudieron cargar las estadísticas',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const fetchEjercicios = async () => {
    try {
      const response = await axios.get(`${API_URL}/ejercicios`);
      setEjercicios(response.data);
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los ejercicios',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      password: '',
    })
    onOpen()
  }

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`)
      setUsers(users.filter(user => user.id !== userId))
      toast({
        title: 'Usuario eliminado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      fetchEstadisticas()
    } catch (error: any) {
      toast({
        title: 'Error al eliminar usuario',
        description: error.response?.data?.message || 'No se pudo eliminar el usuario',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleUpdate = async () => {
    if (!editingUser) return

    try {
      const response = await axios.put(`http://localhost:3000/api/users/${editingUser.id}`, editingUser)
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...response.data.user } : user
      ))
      onClose()
      toast({
        title: 'Usuario actualizado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      fetchEstadisticas()
    } catch (error: any) {
      toast({
        title: 'Error al actualizar usuario',
        description: error.response?.data?.message || 'No se pudo actualizar el usuario',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'activo' ? 'inactivo' : 'activo'
      const response = await axios.patch(`http://localhost:3000/api/users/${userId}/estado`, {
        estado: newStatus
      })
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, estado: newStatus } : user
      ))
      
      toast({
        title: 'Estado actualizado',
        description: `Usuario ${newStatus}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      fetchEstadisticas()
    } catch (error: any) {
      toast({
        title: 'Error al cambiar estado',
        description: error.response?.data?.message || 'No se pudo actualizar el estado',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const exportarUsuarios = () => {
    const dataStr = JSON.stringify(users, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'usuarios.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleAsignarEjercicio = async () => {
    if (!selectedUser || !asignarData.ejercicio_id) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un usuario y un ejercicio',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/api/users/${selectedUser}/asignar-ejercicio`,
        asignarData
      );
      
      toast({
        title: 'Éxito',
        description: 'Ejercicio asignado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setIsAsignarOpen(false);
      setAsignarData({
        ejercicio_id: '',
        series: 3,
        repeticiones: 12,
        notas: ''
      });
    } catch (error) {
      console.error('Error al asignar ejercicio:', error);
      toast({
        title: 'Error',
        description: 'No se pudo asignar el ejercicio',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setSelectedImage(e.target.files[0]);
    }
  };

  const handleCrearEjercicio = async () => {
    if (!selectedImage) {
        toast({
            title: 'Error',
            description: 'Por favor selecciona una imagen',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nuevoEjercicio.nombre);
    formData.append('categoria', nuevoEjercicio.categoria);
    formData.append('descripcion', nuevoEjercicio.descripcion);
    formData.append('musculos', JSON.stringify(nuevoEjercicio.musculos));
    formData.append('nivel', nuevoEjercicio.nivel);
    formData.append('imagen', selectedImage);

    try {
        await axios.post(`${API_URL}/ejercicios`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        toast({
            title: 'Ejercicio creado',
            description: 'El ejercicio ha sido creado exitosamente',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });

        setIsCrearEjercicioOpen(false);
        setNuevoEjercicio({
            nombre: '',
            categoria: '',
            descripcion: '',
            musculos: [],
            nivel: '',
        });
        setSelectedImage(null);
        fetchEjercicios();
    } catch (error) {
        toast({
            title: 'Error',
            description: 'No se pudo crear el ejercicio',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
  };

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box minH="100vh" pt="80px" pb={8}>
      <Container maxW="7xl">
        {/* Header */}
        <Stack spacing={4} mb={8}>
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="lg" mb={2} color={textColor}>
                Dashboard Administrativo
              </Heading>
              <Text color="gray.500">
                Gestiona usuarios y monitorea el rendimiento del gimnasio
              </Text>
            </Box>
            <HStack>
              <IconButton
                aria-label="Modo oscuro"
                icon={<RepeatIcon />}
                onClick={() => {
                  fetchUsers()
                  fetchEstadisticas()
                }}
                colorScheme="pink"
                variant="ghost"
              />
              <IconButton
                aria-label="Exportar usuarios"
                icon={<DownloadIcon />}
                onClick={exportarUsuarios}
                colorScheme="pink"
                variant="ghost"
              />
            </HStack>
          </Flex>
        </Stack>

        {/* Estadísticas */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Stat
            px={6}
            py={4}
            bg={statBgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              right={0}
              bottom={0}
              width="30%"
              bg="pink.500"
              opacity={0.1}
              transform="skew(-15deg)"
              transformOrigin="top"
            />
            <StatLabel color="gray.500" fontSize="sm">Total Usuarios</StatLabel>
            <StatNumber color={textColor} fontSize="3xl" fontWeight="bold">
              {estadisticas?.totalUsuarios || 0}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {estadisticas?.usuariosNuevos || 0} nuevos este mes
            </StatHelpText>
            <Icon as={FaUsers} position="absolute" right={4} top={4} boxSize={6} color="pink.500" opacity={0.3} />
          </Stat>

          <Stat
            px={6}
            py={4}
            bg={statBgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              right={0}
              bottom={0}
              width="30%"
              bg="green.500"
              opacity={0.1}
              transform="skew(-15deg)"
              transformOrigin="top"
            />
            <StatLabel color="gray.500" fontSize="sm">Usuarios Activos</StatLabel>
            <StatNumber color={textColor} fontSize="3xl" fontWeight="bold">
              {estadisticas?.usuariosActivos || 0}
            </StatNumber>
            <StatHelpText>
              <Progress 
                value={(estadisticas?.usuariosActivos || 0) / (estadisticas?.totalUsuarios || 1) * 100} 
                size="xs" 
                colorScheme="green"
                borderRadius="full"
              />
            </StatHelpText>
            <Icon as={FaUserCheck} position="absolute" right={4} top={4} boxSize={6} color="green.500" opacity={0.3} />
          </Stat>

          <Stat
            px={6}
            py={4}
            bg={statBgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              right={0}
              bottom={0}
              width="30%"
              bg="blue.500"
              opacity={0.1}
              transform="skew(-15deg)"
              transformOrigin="top"
            />
            <StatLabel color="gray.500" fontSize="sm">Asistencia Semanal</StatLabel>
            <StatNumber color={textColor} fontSize="3xl" fontWeight="bold">
              {estadisticas?.asistenciaSemanal || 0}
            </StatNumber>
            <StatHelpText>
              <Progress 
                value={Math.min((estadisticas?.asistenciaSemanal || 0) / (estadisticas?.totalUsuarios || 1) * 100, 100)} 
                size="xs" 
                colorScheme="blue"
                borderRadius="full"
              />
            </StatHelpText>
            <Icon as={FaCalendarCheck} position="absolute" right={4} top={4} boxSize={6} color="blue.500" opacity={0.3} />
          </Stat>

          <Stat
            px={6}
            py={4}
            bg={statBgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              right={0}
              bottom={0}
              width="30%"
              bg="purple.500"
              opacity={0.1}
              transform="skew(-15deg)"
              transformOrigin="top"
            />
            <StatLabel color="gray.500" fontSize="sm">Objetivos Cumplidos</StatLabel>
            <StatNumber color={textColor} fontSize="3xl" fontWeight="bold">
              {estadisticas?.objetivosCumplidos.toFixed(1) || 0}%
            </StatNumber>
            <StatHelpText>
              <Progress 
                value={estadisticas?.objetivosCumplidos || 0} 
                size="xs" 
                colorScheme="purple"
                borderRadius="full"
              />
            </StatHelpText>
            <Icon as={FaCheckCircle} position="absolute" right={4} top={4} boxSize={6} color="purple.500" opacity={0.3} />
          </Stat>
        </SimpleGrid>

        {/* Tabs */}
        <Tabs variant="enclosed" bg={bgColor} borderRadius="lg" p={4} borderWidth="1px" borderColor={borderColor}>
          <TabList mb={4}>
            <Tab _selected={{ color: 'pink.500', borderColor: 'pink.500' }}>Usuarios</Tab>
            <Tab _selected={{ color: 'pink.500', borderColor: 'pink.500' }}>Rendimiento</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              {/* Buscador y tabla de usuarios */}
              <InputGroup mb={4}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.500" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg={useColorModeValue('white', '#252525')}
                  borderColor={borderColor}
                />
              </InputGroup>

              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Nombre</Th>
                      <Th>Email</Th>
                      <Th>Estado</Th>
                      <Th>Fecha Registro</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredUsers.map(user => (
                      <Tr key={user.id}>
                        <Td>{user.nombre}</Td>
                        <Td>{user.email}</Td>
                        <Td>
                          <Badge
                            colorScheme={user.estado === 'activo' ? 'green' : 'red'}
                            cursor="pointer"
                            onClick={() => handleToggleStatus(user.id, user.estado)}
                          >
                            {user.estado}
                          </Badge>
                        </Td>
                        <Td>{new Date(user.fechaRegistro).toLocaleDateString()}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="Editar usuario"
                              icon={<FaEdit />}
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleEdit(user)}
                            />
                            <IconButton
                              aria-label="Eliminar usuario"
                              icon={<FaTrash />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => handleDelete(user.id)}
                            />
                            <IconButton
                              aria-label="Cambiar estado"
                              icon={<Icon as={user.estado === 'activo' ? FaBan : FaCheck} />}
                              size="sm"
                              colorScheme={user.estado === 'activo' ? 'red' : 'green'}
                              onClick={() => handleToggleStatus(user.id, user.estado)}
                            />
                            <IconButton
                              aria-label="Asignar ejercicio"
                              icon={<Icon as={FaDumbbell} />}
                              size="sm"
                              colorScheme="purple"
                              onClick={() => {
                                setSelectedUser(user.id);
                                setIsAsignarOpen(true);
                              }}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            <TabPanel p={0}>
              {/* Estadísticas de rendimiento */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {/* Progreso Promedio */}
                <Box
                  bg={statBgColor}
                  p={6}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <VStack spacing={4} align="start">
                    <Heading size="md" color={textColor}>Progreso Promedio</Heading>
                    <CircularProgress
                      value={estadisticas?.progresoPromedio || 0}
                      size="120px"
                      thickness="8px"
                      color="pink.500"
                    >
                      <CircularProgressLabel color={textColor}>
                        {estadisticas?.progresoPromedio.toFixed(1) || 0}%
                      </CircularProgressLabel>
                    </CircularProgress>
                  </VStack>
                </Box>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Modal de edición */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader color={textColor}>Editar Usuario</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel color={textColor}>Nombre</FormLabel>
                  <Input
                    value={editingUser?.nombre || ''}
                    onChange={(e) => setEditingUser(prev => prev ? {...prev, nombre: e.target.value} : null)}
                    bg={useColorModeValue('white', '#252525')}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={textColor}>Email</FormLabel>
                  <Input
                    value={editingUser?.email || ''}
                    onChange={(e) => setEditingUser(prev => prev ? {...prev, email: e.target.value} : null)}
                    bg={useColorModeValue('white', '#252525')}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={textColor}>Nueva Contraseña</FormLabel>
                  <Input
                    type="password"
                    value={editingUser?.password || ''}
                    onChange={(e) => setEditingUser(prev => prev ? {...prev, password: e.target.value} : null)}
                    placeholder="Dejar en blanco para mantener la actual"
                    bg={useColorModeValue('white', '#252525')}
                    borderColor={borderColor}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="pink" onClick={handleUpdate}>
                Guardar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal para asignar ejercicio */}
        <Modal isOpen={isAsignarOpen} onClose={() => setIsAsignarOpen(false)}>
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader color={textColor}>Asignar Ejercicio</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Ejercicio</FormLabel>
                  <Select
                    value={asignarData.ejercicio_id}
                    onChange={(e) => setAsignarData({...asignarData, ejercicio_id: e.target.value})}
                    bg={useColorModeValue('white', '#252525')}
                    borderColor={borderColor}
                    color={textColor}
                  >
                    <option value="">Selecciona un ejercicio</option>
                    {ejercicios.map(ejercicio => (
                      <option key={ejercicio.id} value={ejercicio.id}>
                        {ejercicio.nombre}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Series</FormLabel>
                  <NumberInput
                    value={asignarData.series}
                    onChange={(_, value) => setAsignarData({...asignarData, series: value})}
                    min={1}
                    max={10}
                    defaultValue={3}
                  >
                    <NumberInputField
                      bg={useColorModeValue('white', '#252525')}
                      borderColor={borderColor}
                      color={textColor}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Repeticiones</FormLabel>
                  <NumberInput
                    value={asignarData.repeticiones}
                    onChange={(_, value) => setAsignarData({...asignarData, repeticiones: value})}
                    min={1}
                    max={30}
                    defaultValue={12}
                  >
                    <NumberInputField
                      bg={useColorModeValue('white', '#252525')}
                      borderColor={borderColor}
                      color={textColor}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Notas</FormLabel>
                  <Textarea
                    value={asignarData.notas}
                    onChange={(e) => setAsignarData({...asignarData, notas: e.target.value})}
                    bg={useColorModeValue('white', '#252525')}
                    borderColor={borderColor}
                    color={textColor}
                    placeholder="Instrucciones especiales o notas para el ejercicio"
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={() => setIsAsignarOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="pink" onClick={handleAsignarEjercicio}>
                Asignar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Agregar botón para abrir modal de crear ejercicio */}
        <Button
          leftIcon={<Icon as={FaPlus} />}
          colorScheme="green"
          onClick={() => setIsCrearEjercicioOpen(true)}
          size="sm"
        >
          Crear Ejercicio
        </Button>

        {/* Modal para crear ejercicio */}
        <Modal isOpen={isCrearEjercicioOpen} onClose={() => setIsCrearEjercicioOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Crear Nuevo Ejercicio</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    value={nuevoEjercicio.nombre}
                    onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, nombre: e.target.value})}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    value={nuevoEjercicio.categoria}
                    onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, categoria: e.target.value})}
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="pecho">Pecho</option>
                    <option value="espalda">Espalda</option>
                    <option value="piernas">Piernas</option>
                    <option value="brazos">Brazos</option>
                    <option value="hombros">Hombros</option>
                    <option value="abdominales">Abdominales</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Descripción</FormLabel>
                  <Textarea
                    value={nuevoEjercicio.descripcion}
                    onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, descripcion: e.target.value})}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Músculos trabajados</FormLabel>
                  <Select
                    multiple
                    value={nuevoEjercicio.musculos}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setNuevoEjercicio({...nuevoEjercicio, musculos: values});
                    }}
                    height="100px"
                  >
                    <option value="pectorales">Pectorales</option>
                    <option value="dorsales">Dorsales</option>
                    <option value="cuadriceps">Cuádriceps</option>
                    <option value="biceps">Bíceps</option>
                    <option value="triceps">Tríceps</option>
                    <option value="deltoides">Deltoides</option>
                    <option value="abdominales">Abdominales</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Nivel</FormLabel>
                  <Select
                    value={nuevoEjercicio.nivel}
                    onChange={(e) => setNuevoEjercicio({...nuevoEjercicio, nivel: e.target.value})}
                  >
                    <option value="">Selecciona un nivel</option>
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Imagen</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleCrearEjercicio}>
                Crear
              </Button>
              <Button onClick={() => setIsCrearEjercicioOpen(false)}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  )
} 