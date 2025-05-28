import { chakra } from '@chakra-ui/react'

const Logo = () => {
  return (
    <chakra.svg
      height="40px"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Círculo base */}
      <path
        d="M20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.95431 8.95431 0 20 0Z"
        fill="#FF3366"
      />
      
      {/* Símbolo de mancuerna estilizada */}
      <path
        d="M30 16h-2v-2c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v2h-4v-2c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v2h-2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h4v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2z"
        fill="white"
      />
    </chakra.svg>
  )
}

export default Logo