import { Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import Post, { PostData } from "./components/Post"
import { api } from "./services/api"
import { useEffect, useState } from "react"

function App() {
  const [data, setData] = useState<PostData[]>([])
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostBody, setNewPostBody] = useState('')

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
        title: newPostTitle,
        body: newPostBody
      }

      const response = await api.post('/posts', requestBody)
  
      setData(prevData => {
        const newData = [...prevData, response.data]

        return newData.sort((a, b) => a.title.localeCompare(b.title))
      })
  
      setNewPostTitle('')
      setNewPostBody('')
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
    <>
      <Flex justifyContent='center' height='100vh' h='100%' w='100%' bgColor='rgb(39, 151, 186)' flexDir='row'>
        <Button mt='20px' mr='20px' onClick={onOpen}>
          + Nova postagem
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Nova postagem</ModalHeader>
            <ModalCloseButton />
            <ModalBody >
              <Input placeholder="title" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} mb='10px' />
              <Input placeholder="body" value={newPostBody} onChange={(e) => setNewPostBody(e.target.value)} />
            </ModalBody>
            <ModalFooter>
              <Button variant='ghost' onClick={newPost}>Adicionar postagem</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Flex flexDir='column'>
          {data.map((post, index) => (
            <Post key={index} data={post} onDelete={() => handleDelete(post.id)}/>
          ))}
        </Flex>
      </Flex>
    </>
  )
}

export default App
