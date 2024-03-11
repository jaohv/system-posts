import { Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"

import { api } from "./services/api"
import Post, { PostData } from "./components/Post"

function App() {
  const [data, setData] = useState<PostData[]>([])
  const newPostTitleRef = useRef<HTMLInputElement>(null)
  const newPostBodyRef = useRef<HTMLInputElement>(null)

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await api.get('/posts')

        const responseData = response.data as PostData[]

        const sortedData = responseData.sort((a, b) => a.title.localeCompare(b.title))

        setData(sortedData)

      } catch (error) {
        console.log('Erro ao carregar as postagens:', error)
      }
    }

    loadPosts()
  }, [])

  async function newPost() {
    try {
      const requestBody = {
        userId: 1,
        title: newPostTitleRef.current?.value || '',
        body: newPostBodyRef.current?.value || ''
      }

      const response = await api.post('/posts', requestBody)

      setData(prevData => {
        const newData = [...prevData, response.data]

        return newData.sort((a, b) => a.title.localeCompare(b.title))
      })

      newPostTitleRef.current!.value = ''
      newPostBodyRef.current!.value = ''
      onClose()
    } catch (error) {
      console.log('Erro ao criar uma postagem:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/posts/${id}`)

      setData(prevData => prevData.filter(post => post.id !== id))
    } catch (error) {
      console.log('Erro ao deletar:', error)
    }
  }

  return (
    <Flex minH='100vh' h= '100%' w='100%' bgColor='rgb(39, 151, 186)' justify='center' flexDir='row'>
      <Button mt='50px' mr='20px' onClick={onOpen}>
        + Nova postagem
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nova postagem</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <Input placeholder='Título' ref={newPostTitleRef} mb='10px' />
            <Input placeholder='Conteúdo' ref={newPostBodyRef} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={newPost}>Adicionar postagem</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex flexDir='column'>
        {data.map((post, index) => (
          <Post key={index} data={post} onDelete={() => handleDelete(post.id)} />
        ))}
      </Flex>
    </Flex>
  )
}

export default App